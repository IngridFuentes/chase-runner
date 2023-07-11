import React from "react";
import { connect } from 'react-redux';
import { updateLoginForm } from '../actions/loginForm.js'
import { login } from '../actions/currentUser.js'
import { useNavigate } from 'react-router-dom'


const Login = ({loginForm, updateLoginForm, login}) => {

    const navigate = useNavigate();

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
              login(loginForm);
              navigate('/profile');
          }
    }
    return (
        <div className="container">
            <div className="form-popup">
                <form onSubmit={handleSubmit} noValidate >
                    <span className="close">&times;</span>
                    <input className="login-field" placeholder="username" value={loginForm.username} name="username" type="text" onChange={handleOnChange} required />
                    <input className="login-field" placeholder="email" value={loginForm.email} name="email" type="email" onChange={handleOnChange} required />
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