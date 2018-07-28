import React, { Component } from 'react';
import {connect} from 'react-redux'


class Login extends Component {

    constructor(props) {
        super(props)

        this.onSuccess = this.onSuccess.bind(this)
        this.onFailure = this.onFailure.bind(this)
        this.loginFunction = this.loginFunction.bind(this)

    }

    onSuccess(response) {
        console.log('success!')       

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



    loginFunction() {
        console.log(window.gapi)

        let inst = window.gapi.auth2.getAuthInstance()
        
        inst.signIn().then(a => {

            console.log("good job")
            this.onSuccess(a)
            
        }, err => {
            console.log(err)
            this.onFailure(err)
            
        })     
    }


    render() {

        if(!this.props.signedIn) {
            return(
                <div className='header-button'>
                    <div id="customBtn" className="customGPlusSignIn" onClick={this.loginFunction}>
                        <span className="icon"></span>
                        <span className="buttonText">Sign in with Google</span>
                    </div>
                </div>
            )
        }else {
            return(
                <div className='header-button'>
                    <div id="customBtn" className="customGPlusSignIn">
                        <span className="icon"></span>
                        <span className="buttonText">Signed in with Google</span>
                    </div>
                </div>
            )
        }


    }
}

export default connect()(Login); 
