import React from 'react';
import { Link } from 'react-router-dom'

const Home = () => (

            <div> 
                     <div className="home">
                        Track your Marathons
                        <Link to='/login'>
                            <button className="button-signup">Sign up</button>
                        </Link>
                        <Link to='/login'> 
                        <button className="button-login">Login</button>
                        </Link>
                    </div> 
                {/* <div>
                    <p className="text"> Manage your job hunt </p>
                    <img className="pic" src="https://leverageedu.com/blog/wp-content/uploads/2019/07/Resume-in-Computer-Science-01.png" alt="pic"/>
                    <img className="vector" src="./images/vector.jpg" alt="" />
                </div> */}
            </div>
);

export default Home;
