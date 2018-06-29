import React, { Component } from 'react';
import './App.css';
import Login from './utility/Login.jsx'
import CardSetViewer from './viewer/CardViewer.jsx'
import CardPage from './pages/CardPage.jsx'
import history from './history/History.jsx'


import {Switch, Route, Router, withRouter, Link} from 'react-router-dom'


class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            signedIn: false
        }

        this.loginFunction = this.loginFunction.bind(this)
    }

    loginFunction(toggle) {

        this.setState({
            signedIn: toggle
        })
    }

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
            this.loginFunction(json.body.loggedIn)
        })

    }

    render() {
        
        if(this.state.signedIn) {
            return(<MainContent/>)
        }else {
            return (
                <FrontPage loginFunction={this.loginFunction}/>
            );
        }
        
    }
}


class MainContent extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component = {CardPage}/>
                    <Route exact path='/cardset/:id' component={CardSetPage}/>
                </Switch>
            </Router>

        );
        
    }
}





class CardSetPage extends Component {

    constructor(props) {
        super(props)
        let idToGet = this.props.match.params.id 

        this.state = {
            title: "", 
            subject: "", 
            cards: []
        }

        fetch("/retrieve-card-set", {
            method : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body : JSON.stringify({
                id : idToGet
            })
        }).then(results => {
            return results.json()

            
        }).then(responseJson => {
            let success = responseJson.authSucc
            if(success) {
                let set = responseJson.body.cardSet 
                console.log(set)
                
                this.setState({
                    title: set.title, 
                    subject: set.subject,
                    cards: set.cards
                })
            } else {
                this.setState({
                    title: "NO", 
                    subject: "NOEVER", 
                    cards: []
                })
            }


        })


    }
    render() {
        // this is how you get the id {this.props.match.params.id} 
        return(<CardSetViewer
                title={this.state.title}
                subject={this.state.subject}
                cards={this.state.cards}/>)
    }
}

class FrontPage extends Component {


    render() {
        return(
            <div>
                <p>Welcome to NeoEducation</p>
                <Login loginFunction={this.props.loginFunction}/>
            </div>
        )
    }
}





export default App;
