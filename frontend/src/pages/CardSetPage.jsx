import CardSetViewer from 'viewer/CardViewer.jsx'
import Header from 'header/Header.jsx';

import React, { Component } from 'react';

import {connect} from 'react-redux';
import {Switch, Route, Router} from 'react-router-dom'




class CardSetPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            title: "", 
            subject: "", 
            cards: []
        }

        this.updateCard = this.updateCard.bind(this)

        

    } 

    updateCard(index, term, definition, priority) {
        this.setState((prev, props) => {


            

            let card = prev.cards[index]
            let newCard = Object.assign({}, card, {
                definition: definition, 
                term: term, 
                priority: priority
            })





            let newCards = Object.assign([...prev.cards], {[index]: newCard})

            console.log(newCards)


            return {
                title: prev.title, 
                subject: prev.subject, 
                cards: newCards
            }
        })
    }
    
    componentDidMount() {
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
            return results.json()

            
        }).then(responseJson => {
            let success = responseJson.authSucc
            if(success) {
                let set = responseJson.body.cardSet 
                let cards = set.cards.map((item, index) => {
                    return Object.assign({}, item, {
                        absIndex: index
                    })
                })
                this.setState((prev, props) => ({
                    title: set.title, 
                    subject: set.subject,
                    cards: cards
                }))
 


            } else {
                this.setState((prev, props) => ({
                    title: "Invalid", 
                    subject: "Card set is wrong :(", 
                    cards: []
                }))
            }


        })
    }


    render() {
        // this is how you get the id {this.props.match.params.id} 

        return(
            <div>
                <Header/>
                <Switch>
                    <Route path="/cardset/:id/view" render = {(routeProps) => <CardSetViewer {...this.state} updateCard={this.updateCard}/>}/>
                    <Route path="/cardset/:id/edit" component = {Tmp}/>

                </Switch>

            </div>)
    }
}

class Tmp extends Component {
    render() {
        return<div>hey</div>
    }
}



export default connect()(CardSetPage)