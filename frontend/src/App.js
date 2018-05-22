import React, { Component } from 'react';
import './App.css';
import Header from './header/Header.jsx'
import StandardCardSet from './card/Card.jsx'

import {Switch, Route} from 'react-router-dom'
import {GoogleLogin} from 'react-google-login';


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            signedIn : false
        }
        console.log(document.cookie)
    }

    render() {
        if(true) {
            return(<MainContent/>)
        }else {
            return (
                <div>
                    <Switch>
                        <Route exact path='/' component={CardPage}/>
                        <Route exact path='/home' component={FrontPage}/>
                    </Switch>
                </div>
            );
        }
        
    }
}

class MainContent extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/home' component={CardPage}/>
                    <Route exact path='/' component={FrontPage}/>
                </Switch>
            </div>
        );
        
    }
}

class CardPage extends Component {
  render() {
    return(
      <div>
        <Header/>
        <WorkPanel/>
      </div>
    )
  }
}

class FrontPage extends Component {
    constructor(props){
        super(props)
        this.onSuccess = this.onSuccess.bind(this)
        this.onFailure = this.onFailure.bind(this)
    }

    onSuccess(response) {
        console.log("Success!")
    }

    onFailure(response) {
        console.log("Failure!")
    }

    render() {
        return(
            <div>
                <p>Welcome to NeoEducation</p>
                <GoogleLogin
                        clientId="904281358251-rhgerstv3o3t53nal0jat706npmmler4.apps.googleusercontent.com"
                        buttonText="Sign in with Google"
                        onSuccess={this.onSuccess}
                        onFailure={this.onFailure}
                        accessType="offline"
                        uxMode="redirect"
                        redirectUri="http://localhost:3000/home"
                />
            </div>
        )
    }
}



/********************* Flash Card Classes **********/

class WorkPanel extends Component {
    constructor(props) {
        super(props)

        this.addCard = this.addCard.bind(this)
        this.onFinish = this.onFinish.bind(this)
        this.cardSetRef = React.createRef();  
        
    }
    addCard() {
        this.cardSetRef.current.addCard()

    }
    onFinish() {
        let cardset = this.cardSetRef.current.cards

        let title = this.cardSetRef.current.state.title
        let subject = this.cardSetRef.current.state.subject

        fetch("/save-card-set", {
            method : 'POST',
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body : JSON.stringify({
                title: title, 
                subject: subject, 
                cards: cardset
            })
        }).then(results => {
            console.log(results)
        })
        
    }
    

    render() {
        return  <div className='main-panel'>
                    <StandardCardSet ref={this.cardSetRef}/>
                    <AddRowButton cardFunction={this.addCard}/>
                    <FinishButton onClick={this.onFinish}/>
                    
                </div>
    }
}


class AddRowButton extends Component {

    
    constructor(props) {
        super(props)
        this.handleSelect = this.handleSelect.bind(this)
        this.myRef = React.createRef();
    }
    handleSelect(event) {
        const node = this.myRef.current
        node.blur()

        this.props.cardFunction()
 
    }

    render() {
        return (
            <div 
                ref={this.myRef}
                className='add-row-button'
                tabIndex='5' 
                onFocus={this.handleSelect}>Click Here to Add a Row
            </div>
        )
    }
}

class FinishButton extends Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)

    }
    handleClick(event) {
        console.log('heyo')
        fetch('/save-card-set')
            .then(results => {
                console.log(results)
            })


        
    }
    render() {
        return(
            <a
              className="finish-button" 
              onClick={this.props.onClick}>
                Done
            </a>
            
        )
    }
}


export default App;
