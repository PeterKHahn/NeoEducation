/* global gapi */
import React, { Component } from 'react';
import {GoogleLogin} from 'react-google-login';
import {connect} from 'react-redux'



function attachSignin(element) {
    console.log(element);
    console.log("LOOK")
    window.gapi.auth2.attachClickHandler(element, {},
        function(googleUser) {
            console.log("OH BOY")
          document.getElementById('name').innerText = "Signed in: " +
              googleUser.getBasicProfile().getName();
        }, function(error) {
            console.log("OH NO")
          alert(JSON.stringify(error, undefined, 2));
        });
}

class Login extends Component {

    constructor(props) {
        super(props)

        this.onSuccess = this.onSuccess.bind(this)
        this.onFailure = this.onFailure.bind(this)
        this.boop = this.boop.bind(this)
        console.log(window.gapi)
        window.gapi.load('auth2', function() {
            console.log("hidden function")
            gapi.auth2.init({
                client_id: '904281358251-rhgerstv3o3t53nal0jat706npmmler4.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin' // TODO figure out what this is 
                 // Request scopes in addition to 'profile' and 'email'
                //scope: 'additional_scope'
            })
        })
        
    }

    onSuccess(response) {
        console.log('success!')       

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
            this.props.dispatch({
                type: "LOG_IN"
            })

        })
    }
    onFailure(response) {
        console.log('failure :(')
        console.log(response)
        this.props.dispatch({
            type: "LOG_OUT"
        })
    }



    boop() {
        console.log(window.gapi)
        window.gapi.auth2.init({
            client_id: '904281358251-rhgerstv3o3t53nal0jat706npmmler4.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin' // TODO figure out what this is 
             // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
        })

        let inst = window.gapi.auth2.getAuthInstance()
        



        inst.signIn().then(a => {

            console.log("good job")
            console.log(a)
            
        }, err => {
            console.log(err)
            
        })     
    }


    render() {

 

        return(
        <div className='header-button'>
            <GoogleLogin
                className="customBtn"
                clientId="904281358251-rhgerstv3o3t53nal0jat706npmmler4.apps.googleusercontent.com"
                buttonText="Sign in with Google"
                onSuccess={this.onSuccess}
                onFailure={this.onFailure}
                //uxMode="redirect"
                //redirectUri="http://localhost:3000/"
                accessType="offline"
            />
            <div className="g-signin2" data-onsuccess="onSignIn"></div>
            <div id="customBtn" className="customGPlusSignIn" onClick={this.boop}>
                <span className="icon"></span>
                <span className="buttonText">Google boi</span>
             </div>
             <div onClick={this.boop}>booop</div>
        </div>
        )
    }
}

export default connect()(Login); 
