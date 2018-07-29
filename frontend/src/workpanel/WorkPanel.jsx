import React, { Component } from 'react';
import StandardCardSet from 'card/Card.jsx';



class WorkPanel extends Component {
    constructor(props) {
        super(props)



        this.updateTitle = this.updateTitle.bind(this)
        this.updateSubject = this.updateSubject.bind(this)

        this.updateTerm = this.updateTerm.bind(this)
        this.updateDefinition = this.updateDefinition.bind(this)

        this.addCard = this.addCard.bind(this)



        this.state = {
            title: "",
            subject: "",
            cards: [{term: "", definition: ""}]
        }
        
    }





    updateTitle(updatedTitle) {
        this.setState((prevState) => {
            return {
                cards: prevState.cards, 
                title : updatedTitle, 
                subject : prevState.subject
            }
        })
    }

    updateSubject(updatedSubject) {
        this.setState((prevState) => {
            return {
                cards: prevState.cards, 
                title: prevState.title, 
                subject: updatedSubject
            }
        })
    }

    updateTerm(id, term) {
        this.state.cards[id].term = term
    }

    updateDefinition(id, definition) {
        this.state.cards[id].definition = definition
        
    }
    addCard() {
        let alpha = {
            term: "", 
            definition: ""
        }

        this.state.cards.push(alpha)

        this.setState((prevState) => {
            
            return {
                cards: prevState.cards, 
                title: prevState.title, 
                subject: prevState.subject
            }
        })
    }
    

    render() {
        return  <div className='main-panel'>
                    <StandardCardSet 
                        {...this.state}
                        updateTitle={this.updateTitle}
                        updateSubject={this.updateSubject}
                        updateTerm={this.updateTerm}
                        updateDefinition={this.updateDefinition}
                    />
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


class CreatePanel extends WorkPanel {

    constructor(props) {
        super(props)
        this.onFinish = this.onFinish.bind(this)
    }
    onFinish() {
        let cardset = this.state.cards

        let title = this.state.title
        let subject = this.state.subject


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
                this.props.history.push('/cardset/'+id +'/view')

            }else {
                console.log("Authentication Failed")
                return -1
            }
        })

        
    }
}

export default CreatePanel