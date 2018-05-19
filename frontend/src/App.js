import React, { Component } from 'react';
import './App.css';
import Header from './header/Header.jsx'
import StandardCardSet from './card/Card.jsx'

import {Switch, Route} from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div>
          <Switch>
            <Route exact path='/' component={FrontPage}/>
            <Route exact path='/weird' component={Header}/>
          </Switch>
      </div>
    );
  }
}

class FrontPage extends Component {
  render() {
    return(
      <div>
        <Header/>
        <WorkPanel/>
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
        fetch('/cardset ')
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

class TempButton extends Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(event) {
        fetch("/retrieve-card-set", {
            method : 'POST',
            headers: {
                'Accept': 'text/html',
                'Content-Type': 'application/json'
            },
            credentials: "include",
          
            body : JSON.stringify({
                "id" : "my id",
                "term" : "my term",
                "definition" : ["definition 1", "definition 2"],
                "obj" : {
                    "id" : "inner id", 
                    "term" : "inner term", 
                    "definition" : "inner def"
                }
            })
        }).then(results => {
            console.log(results)
        })
    }
    render() {
        return(
            <div onClick={this.handleClick}>Temp</div>
        )
    }
}




export default App;
