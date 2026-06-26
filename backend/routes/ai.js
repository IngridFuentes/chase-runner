const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  console.log('=== AI Chat Request Started ===');
  console.log('Timestamp:', new Date().toISOString());
  
  if (!req.auth || !req.auth.sub) {
    return res.status(401).json({ 
      success: false,
      error: 'User not authenticated' 
    });
  }

  console.log('User:', req.auth.sub);
  
  try {
    const { message, userRunData, conversationHistory } = req.body;
    console.log('User message:', message);
    console.log('User data received:', userRunData ? 'Yes' : 'No');

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

     // Get current date
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const systemContext = `You are an expert running coach and race planner for the Chase Runner app. 

    IMPORTANT: 
    - Today's date is ${dateString}. Only suggest races that are in the FUTURE from this date
    - When user says "this marathon" or "that race", refer to the most recently mentioned race in the conversation
    - Pay attention to conversation context

    Your capabilities include:
    1. **Training Plans**: Create personalized training schedules
    2. **Race Planning**: Suggest specific marathons and races across the United States (only UPCOMING races)
    3. **Progress Analysis**: Analyze user's running history and provide insights
    4. **Motivation**: Encourage users and celebrate their achievements
    5. **Location-Based Recommendations**: Suggest races in specific regions/states
    6. **Strategic Planning**: Help users plan their running journey to visit all 50 states

    When planning races:
    - Only suggest races that haven't happened yet (after ${dateString})
    - Include specific month/year for upcoming races
    - Consider popular marathons and races in those areas
    - Suggest race types (5K, 10K, Half, Full, Ultra) based on user experience
    - Provide realistic timelines and training preparation needed
    - Consider weather and best seasons for different regions
    - Include both major marathons and smaller local races


    Always provide:
    - Specific race names when possible
    - Month AND year for upcoming races
    - Training timeline before each race
    - Progressive difficulty if planning multiple races

    Keep all responses SHORT and actionable unless user specifically asks for detailed explanation.`;

    let userContext = '';
    
    if (userRunData && userRunData.totalRuns > 0) {
      userContext = `\n\nUser Profile:
      - Name: ${userRunData.userName || 'Runner'}
      - Total Runs Completed: ${userRunData.totalRuns}
      - States Visited: ${userRunData.totalStates} (${userRunData.statesVisited?.join(', ') || 'None yet'})
      - Race Experience: ${JSON.stringify(userRunData.raceTypeBreakdown)}
      ${userRunData.mostRecentRun ? `- Most Recent Achievement: ${userRunData.mostRecentRun.raceType} in ${userRunData.mostRecentRun.state}` : ''}
      - Goal: Visit all 50 US states
      - States Remaining: ${50 - (userRunData.totalStates || 0)}
      - Full Run History: ${JSON.stringify(userRunData.allRuns || userRunData.runs || [])}`;
    } else {
      userContext = `\n\nUser Profile:
      - Name: ${userRunData?.userName || 'Runner'}
      - Status: Beginning their running journey
      - Total Runs: 0
      - Goal: Visit all 50 US states through running
      - Ready to start planning!`;
    }


    // Build conversation context
    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 1) {
      conversationContext = '\n\nRecent Conversation:\n';
      conversationHistory.slice(0, -1).forEach(msg => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}\n`;
      });
    }


    const fullPrompt = `${systemContext}${userContext}${conversationContext}\n\nUser Request: ${message}\n\nYour Detailed Response:`;

    console.log('Prompt length:', fullPrompt.length, 'characters');
    console.log('Sending request to Gemini API...');
    
    const startTime = Date.now();
    
    // FIXED: Call generateContent directly on ai.models
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt
    });
    
    const apiTime = Date.now() - startTime;
    console.log(`Gemini API responded in ${apiTime}ms`);
    
    // Get text directly from response
    const text = response.text;
    
    console.log('Response length:', text.length, 'characters');
    console.log('=== Request Completed Successfully ===\n');

    res.json({ 
      success: true, 
      reply: text 
    });

  } catch (error) {
    console.error('=== ERROR IN AI CHAT ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    console.error('========================\n');
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get AI response',
      message: error.message 
    });
  }
});

// POST /api/ai/race-suggestions
router.post('/race-suggestions', async (req, res) => {
  if (!req.auth || !req.auth.sub) {
    return res.status(401).json({ 
      success: false,
      error: 'User not authenticated' 
    });
  }

  console.log('=== Race Suggestions Request ===');
  
  try {
    const { region, months, raceTypes, userRunData } = req.body;

    const prompt = `You are a running race expert. Suggest specific marathons and running races.

    Region: ${region}
    Time Period: ${months || 'next 6 months'}
    Race Types Interested: ${raceTypes?.join(', ') || '5K, 10K, Half Marathon, Full Marathon'}
    User Experience Level: ${userRunData?.totalRuns > 10 ? 'Experienced' : 'Beginner to Intermediate'}

    Provide a detailed list of:
    1. Specific race names
    2. Location (city, state)
    3. Typical month/date
    4. Race distance options
    5. Brief description of the race

    Format as a clear, organized list.`;

    console.log('Sending race suggestions request to Gemini...');
    
    // FIXED: Same fix here
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    
    const suggestions = response.text;

    console.log('Race suggestions received');

    res.json({ 
      success: true, 
      suggestions 
    });

  } catch (error) {
    console.error('Error getting race suggestions:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get race suggestions',
      message: error.message 
    });
  }
});

module.exports = router;