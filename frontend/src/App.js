import React, { Component } from 'react';
import './App.css';
import Login from './utility/Login.jsx'
import CardSetPage from './pages/CardSetPage.jsx'
import CardPage from './pages/CardPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import SetPage from './pages/SetPage.jsx'

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


    render() {
        if(this.props.signedIn) {
            return(<MainContentx/>)
        }else {
            return (
                <FrontPage/>
            );
        }
        
    }
}


const MainContentx = (props) => {
    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/home" component = {CardPage}/>
                <Route exact path="/about" component = {AboutPage}/>
                <Route exact path="/sets" component = {SetPage}/>
                <Route exact path='/cardset/:id' component={CardSetPage}/>
            </Switch>
        </Router>

    );
    
}


const FrontPage  = (props) => {
    return(
        <div>
            <div className="center-panel">
                <div className="welcome">Welcome to NeoEducation</div>
                <Login/>
            </div>

        </div>
    )
    
}





const mapStateToProps = state => ({
    signedIn: state.generalState.loggedIn
})


export default connect(mapStateToProps)(App);
