import React from "react";
import { connect } from 'react-redux';
import { updateLoginForm } from '../actions/loginForm.js'
import { login } from '../actions/currentUser.js'
import { useNavigate } from 'react-router-dom'

// import { useHistory } from 'react-router-dom';


const Login = ({loginForm, updateLoginForm, login}) => {

    const navigate = useNavigate();
    // const history = useHistory();

    const handleOnChange = event => {
        const {name, value} = event.target
        const updateFormInfo = {
            ...loginForm,
            [name]: value
        }
        updateLoginForm(updateFormInfo)
    }

    const handleSubmit = event => {
        event.preventDefault()
        if (!event.target.checkValidity()) {
            return alert("Invalid username or email")
          } else {
             login(loginForm, navigate);
          }
    }
    return (
        <div className="container">
            <div className="form-popup">
            <passage-auth app-id="KV1aMMRznh4v9LjFoWlDfgKy"></passage-auth>
                <form onSubmit={handleSubmit} noValidate >
                    <span className="close">&times;</span>
                    <input className="login-field" placeholder="email" value={loginForm.email} name="email" type="email" onChange={handleOnChange} required />
                    <input className="login-field" placeholder="password" value={loginForm.password} name="password" type="password" onChange={handleOnChange} required />
                    <input type="submit" value="Login" className="btn" />
                </form>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
    //  username: state.loginForm.username,
    //  email: state.loginForm.email
    loginForm: state.loginForm
    }
}

export default connect(mapStateToProps, { updateLoginForm, login })(Login);