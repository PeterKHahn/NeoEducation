import React, { Component } from 'react';
import {GoogleLogin} from 'react-google-login';

class Login extends Component {

    constructor(props) {
        super(props)

        this.onSuccess = this.onSuccess.bind(this)
        this.onFailure = this.onFailure.bind(this)
    }

    onSuccess(response) {
        console.log('success!')
        var profile = response.getBasicProfile()
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Token: '+ response.getAuthResponse().id_token)

        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

        var bodyJson = {
            "authentication" : response.getAuthResponse().id_token
        }
        console.log(bodyJson)
        fetch("/authenticate", {
            method : 'POST',
            credentials: "include",
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'text/html'
            },
          
            body : response.getAuthResponse().id_token
        }).then(results => {
            console.log(results.text())
        })
    }
    onFailure(response) {
        console.log('failure :(')
        console.log(response)
    }

    render() {
        return(
        <div className='header-button'>
            <GoogleLogin
                clientId="904281358251-rhgerstv3o3t53nal0jat706npmmler4.apps.googleusercontent.com"
                buttonText="Sign in with Google"
                onSuccess={this.onSuccess}
                onFailure={this.onFailure}
                //uxMode="redirect"
                //redirectUri="http://localhost:3000/"
                accessType="offline"
            />
        </div>
        )
    }
}

export default Login; 
