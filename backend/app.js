const express = require('express');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
const axios = require('axios');
require('dotenv').config();
const storeOrUpdateUser = require('./utils/storeOrUpdateUser');
const storeOrUpdateRun = require('./utils/storeOrUpdateRun');
const getRunsForUser = require('./utils/getRunsForUser');
const pool = require('./db');
const aiRoutes = require('./routes/ai.js');
const userRoutes = require('./src/chase_runner/routes.js');


const app = express();
app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded( { extended:true }))
app.use(express.static("public"))

  // origin: 'http://localhost:3001'
const config = require('./config');

// const corsOptions = {
//   origin: 'https://chase-runner.vercel.app',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true, 
// };
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            config.corsOrigin,
            'http://localhost:3001'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions))

// const port = process.env.PORT || 3000; //do not change this in PRODUCTION. Just do NOT change!
// const backendUrl = "https://chase-runner-backend.vercel.app"

// app.get('/debug-config', (req, res) => {
//   res.json({
//     nodeEnv: process.env.NODE_ENV,
//     corsOrigin: config.corsOrigin,
//   });
// });

// app.use((req, res, next) => {
//   console.log('\n=== BACKEND INCOMING REQUEST ===');
//   console.log('Method:', req.method);
//   console.log('Path:', req.path);
//   console.log('Headers:', {
//     authorization: req.headers.authorization ? 'Present ✓' : 'Missing ✗',
//     'content-type': req.headers['content-type']
//   });
  
//   if (req.headers.authorization) {
//     console.log('Auth header value:', req.headers.authorization.substring(0, 50) + '...');
//   }
  
//   next();
// });

// Simple in-memory rate limiter
const ipRequestCounts = new Map();

const simpleRateLimit = (req, res, next) => {
  const ip = (req.ip || '').replace(/^::ffff:/, '');
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const max = 20;

  const entry = ipRequestCounts.get(ip) || { count: 0, start: now };

  if (now - entry.start > windowMs) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count++;
  }

  ipRequestCounts.set(ip, entry);

  if (entry.count > max) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' });
  }

  next();
};

app.post('/public-chat', simpleRateLimit, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const { GoogleGenAI } = require('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const systemPrompt = `You are Coach Chase, a friendly running assistant for Chase Runner app.

      Today's date is ${today}.

      You help anyone — logged in or not — with general running questions:
      - Finding upcoming races across the US
      - Explaining race distances (5K, 10K, half marathon, full marathon, ultra)
      - General training advice and tips
      - Information about specific races or locations
      - Running gear and nutrition basics

      Keep responses SHORT and friendly. When suggesting races, always include the month and year.
      You do NOT have access to the user's personal race history — this is a general assistant.
      If someone asks about their personal data or wants a personalized plan, encourage them to sign up for a free account.`;

    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = '\n\nConversation so far:\n';
      conversationHistory.slice(-6).forEach(msg => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}\n`;
      });
    }

    const fullPrompt = `${systemPrompt}${conversationContext}\n\nUser: ${message}\n\nCoach Chase:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    res.json({ success: true, reply: response.text });

  } catch (error) {
    console.error('Public AI error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const verifyJwt = jwt({
  secret:jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri:process.env.AUTH0_JWKS_URI
  }),
  algorithms: ['RS256'],
  audience:process.env.AUTH0_AUDIENCE,
  issuer:process.env.AUTH0_ISSUER,

  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }

}).unless({ path: ['/', '/favicon.ico', '/public-chat'] });
// Apply JWT only to protected routes — manually skip public ones
// app.use((req, res, next) => {
//   const publicPaths = ['/', '/favicon.ico', '/public-chat', '/debug-config', '/health'];
//   if (publicPaths.includes(req.path)) {
//     return next();
//   }
//   return verifyJwt(req, res, next);
// });

app.use(verifyJwt);

app.use((req, res, next) => {
  // console.log(req.auth);
  next();
});

app.use('/api/ai', aiRoutes);
app.use('/', userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the backend!");
});

app.get("/user/id/runs", async (req, res) => {
  console.log("Protected route reached");
  // console.log("JWT payload:", req.auth);
  const userId = req.auth.sub;
  
  if (!userId) {
    return res.status(401).send("User not authenticated");
  }

  const client = await pool.connect();

  try {

    const userCheckQuery = `SELECT sub FROM users WHERE sub = $1`;
    const userResult = await client.query(userCheckQuery, [userId]);

    if (userResult.rowCount === 0) {
      // If user doesn't exist, create a new user
      const insertUserQuery = `INSERT INTO users (sub) VALUES ($1) RETURNING sub`;
      const newUserResult = await client.query(insertUserQuery, [userId]);
      console.log("New user created with ID:", newUserResult.rows[0].sub);
    } else {
      console.log("User already exists with ID:", userResult.rows[0].sub);
    }

    // Await the result of getRunsForUser, since it's async
    const runs = await getRunsForUser(userId);
    console.log(runs, 'runs backend');

    // Send the runs data as a response
    res.json(runs);
  } catch (error) {
    console.error("Error fetching runs:", error);
    res.status(500).send("Error fetching runs");
  } finally {
    client.release();
  }
})

app.post('/runs', async (req, res) => {
  if (!req.auth.sub || !req.auth.sub) {
      return res.status(401).json({ error: "User not authenticated" }); //sending JSON instead of text!
    }
  
  const runData = req.body;
  console.log("body:", runData);
  const userId = req.auth.sub;

  try {
    const completeRunData = {
      ...runData,
      user_id: userId
    };
    
    const result = await storeOrUpdateRun(completeRunData);
    
    //Return JSON instead of plain text!
    res.status(201).json({ 
      message: 'Run added successfully',
      data: result 
    });
  } catch (err) {
    console.error('Error storing run:', err);
    res.status(500).json({ 
      error: 'Error storing run',
      details: err.message 
    });
  }
});

app.get('/protected', (req, res) => {
  console.log("Protected route reached");
  console.log("JWT payload:", req.auth);
    res.send(req.auth);
});

app.delete('/runs/:id', async (req, res) => {
  const placeId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM runs WHERE id = $1 RETURNING *', [placeId]);

    if (result.rows.length === 0) {
      return res.status(406).json({ message: 'Place not found' });
    }

    res.status(200).json({ message: 'Place deleted successfully', deletedPlace: result.rows[0] });
  } catch (error) {
    console.error('Error deleting place:', error);
    res.status(500).json({ message: 'Failed to delete place', error: error.message });
  }
});

app.use((req,res, next)=> {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  res.status(status).send(message);
})

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log("Express is running in port 3000")
    });
}

module.exports = app;
