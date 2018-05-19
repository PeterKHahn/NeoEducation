import React, { Component } from 'react';
import {GoogleLogin} from 'react-google-login';

const title = "NeoEducation: Flash"
const subtitle = "The End of something Old, the Start of something New"

class Header extends React.Component {
    render(){
        return  <div className='heading'>
                    <TitleBar/>
                    <HeaderBar/>
                </div>
    }
}

class TitleBar extends React.Component {
    render() {
        return  <div className='title-bar'>
                    <div className='title'>{title}</div>
                    <div className='subtitle'>{subtitle}</div>
                </div>
    }
}



class HeaderBar extends Component {
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
    render(){
        return  <div className='header-bar'>
                    <HeaderButton title="Home"/>
                    <HeaderButton title="About"/>
                    <HeaderButton title="Flash"/>
                    <GoogleLogin
                        clientId="904281358251-rhgerstv3o3t53nal0jat706npmmler4.apps.googleusercontent.com"
                        buttonText="Sign in with Google"
                        onSuccess={this.onSuccess}
                        onFailure={this.onFailure}
                        accessType="online"
                    />
                    <SearchBar/>
                </div>
    }
}


class HeaderButton extends Component {

    render() {
        return <div className='header-button'>{this.props.title}</div>
    }
}

class SearchBar extends React.Component {
    render() {
        return <div className='search-bar'>Click here to search</div>
    }
}

export default Header;
