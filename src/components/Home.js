import React from 'react';
import { Link } from 'react-router-dom'

const Home = () => (

            <div> 
                <img className="logo" src="https://d3kqdc25i4tl0t.cloudfront.net/articles/content/_125260_bloghero(1).jpg" alt="" /> 
                    <div className="home">
                        Job Application Tracker
                        <button className="button-signup">Sign up</button>
                        <Link to='/login'> 
                        <button className="button-login">Login</button>
                        </Link>
                </div>
                <div>
                    <p className="text"> Manage your job hunt </p>
                    <img className="pic" src="https://leverageedu.com/blog/wp-content/uploads/2019/07/Resume-in-Computer-Science-01.png" alt="pic"/>
                    <img className="vector" src="./images/vector.jpg" alt="" />
                </div>
            </div>
);

export default Home;
