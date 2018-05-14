import React, { Component } from 'react';
import './App.css';
import Header from './header/Header.jsx'
import CardSet from './card/Card.jsx'

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
        this.cardSetRef = React.createRef();  
        
    }
    addCard() {
        this.cardSetRef.current.addCard()

    }
    

    render() {
        return  <div className='main-panel'>
                    <CardSet ref={this.cardSetRef}/>
                    <AddRowButton cardFunction={this.addCard}/>
                    <FinishButton/>
                    <TestButton/>
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
        fetch("/testAuth", {
            method: 'post', 
            body: 'hello'
        })
            .then(res => console.log(res))

        
    }
    render() {
        return(
            <a 
              className="finish-button" 
              onClick={this.handleClick} 
              href='/weird'>
                Done
            </a>
        )
    }
}

class TestButton extends Component {

    constructor(props) {
        super(props)
        this.handleClickz = this.handleClickz.bind(this)
    }

    handleClickz(event) {
        console.log("handling the click")
        fetch("/testCookie")
            .then(res => console.log(res))
    }
    render() {
        return(
            <p onClick={this.handleClickz}>Click here to test smthn</p>
        )
    }
}



export default App;
