import React, { Component } from 'react';
import StandardCardSet from 'card/Card.jsx';



class EditPanel extends Component {
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


        return fetch("/create-card-set", {
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
                this.props.history.push('/cardset/'+id +'/view')

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

export default EditPanel