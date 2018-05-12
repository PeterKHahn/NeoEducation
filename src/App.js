import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './header/Header.jsx'
import CardSet from './card/Card.jsx'

class App extends Component {
  render() {
    return (
      <div>
          <Header/>
          <WorkPanel/>
      </div>
    );
  }
}



/********************* Flash Card Classes **********/

class WorkPanel extends React.Component {
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
                </div>
    }
}


class AddRowButton extends React.Component {

    
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
                tabindex='5' 
                onFocus={this.handleSelect}>Click Here to Add a Row
            </div>
        )
    }
}

class FinishButton extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(event) {
        window.open("/done")
        
    }
    render() {
        return(
            <a className="finish-button" href="/done">
                Click here to finish
            </a>
        )
    }
}

/******8** FOrmatting ********/



export default App;
