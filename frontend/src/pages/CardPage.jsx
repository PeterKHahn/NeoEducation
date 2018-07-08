import React, { Component } from 'react';
import Header from 'header/Header.jsx';
import StandardCardSet from 'card/Card.jsx';


import {withRouter, Link} from 'react-router-dom'




class CardPage extends Component {

    constructor(props) {
        super(props)
        this.saveAndContinue = this.saveAndContinue.bind(this)
    }

    saveAndContinue() {

    }

    render() {

      console.log(this.props.history)

  
      return(
        <div>
          <Header/>
          <WorkPanel history={this.props.history}/>
        </div>
      )
    }
  }
  
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


        return fetch("/save-card-set", {
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
            return results.json()
        }).then(j => {
            if(j.authSucc) {
                let id =  j.body.id
                console.log("sending you to a new path...")
                this.props.history.push('/cardset/'+id)

            }else {
                console.log("Authentication Failed")
                return -1
            }
        })

        
    }
    

    render() {
        return  <div className='main-panel'>
                    <StandardCardSet ref={this.cardSetRef}/>
                    <AddRowButton cardFunction={this.addCard}/>
                    <FinishButton saveCards={this.onFinish}/>
                    
                </div>
    }
}


class FinishButton extends Component {
    constructor(props) {
        super(props)
        this.onFinish = this.onFinish.bind(this)
        console.log(this.props)

    }

    onFinish() {
        this.props.saveCards()

    }

    render() {
        return(
            <div>
            <a
              className="finish-button" 
              onClick={this.onFinish}>
                Done
            </a>
            <Link to='/cardset/100'>Holo</Link>
            </div>
        )
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

export default withRouter(CardPage); 

