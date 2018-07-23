
import React, { Component } from 'react';
import './App.css';
import CardSetPage from './pages/CardSetPage.jsx'
import CardPage from './pages/CardPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import SetPage from './pages/SetPage.jsx'
import FrontPage from './pages/FrontPage.jsx'

import history from './history/History.jsx'


import {Switch, Route, Router} from 'react-router-dom'
import {connect} from 'react-redux'

class App extends Component {

    componentWillMount() {

        // https://stackoverflow.com/questions/30929679/react-fetch-data-in-server-before-render

        fetch("/has-credentials", {
            method : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/html'
            },
            credentials: "include",
            body : "Requesting credentials"
        }).then((response) => {
            return response.json()
        }).then((json) => {
            let loggedIn = json.body.loggedIn; 
            if(loggedIn) {
                this.props.dispatch({
                    type: "LOG_IN"
                })
            }else {
                this.props.dispatch({
                    type: "LOG_OUT"
                })
            }
        })

    }

    componentDidMount() {
        window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
                client_id: '904281358251-rhgerstv3o3t53nal0jat706npmmler4.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin' // TODO figure out what this is 
                 // Request scopes in addition to 'profile' and 'email'
                //scope: 'additional_scope'
            })

        })

    }


    render() {
        return <MainContent {...this.props}/>


        
    }
}


const MainContent = (props) => {
    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/" render = {(routeProps) => <FrontPage {...props}/>}/>
                <Route exact path="/create" component = {CardPage}/>
                <Route exact path="/about" component = {AboutPage}/>
                <Route exact path="/sets" component = {SetPage}/>
                <Route exact path='/cardset/:id' component={CardSetPage}/>
            </Switch>
        </Router>

    );
    
}





const mapStateToProps = state => ({
    signedIn: state.generalState.loggedIn
})


export default connect(mapStateToProps)(App);
