import React, { Component } from 'react';
import './App.css';
import Header from './header/Header.jsx'
import StandardCardSet from './card/Card.jsx'
import Login from './utility/Login.jsx'


import {Switch, Route, Redirect} from 'react-router-dom'


// const fetchCredentials = async() => {
//     const response = await fetch("/has-credentials", {
//             method : 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'text/html'
//             },
//             credentials: "include",
//             body : "Requesting credentials"
//     })
//     const json = await response.json()
//     return json
// }

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
            console.log(this.state)
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
            <div>
                <Switch>
                    <Route exact path='/' component={CardPage}/>
                    <Route path='/cardset/:id' component={CardSetPage}/>
                    
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

class CardSetPage extends Component {

    constructor(props) {
        super(props)
        let idToGet = this.props.match.params.id 

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
            console.log(results.json())
        })

    }
    render() {
        return(<h1>hello {this.props.match.params.id}</h1>)
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
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body : JSON.stringify({
                title: title, 
                subject: subject, 
                cards: cardset
            })
        }).then(results => {
            console.log(results.json())
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
