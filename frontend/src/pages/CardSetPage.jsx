import CardSetViewer from 'viewer/CardViewer.jsx'
import Header from 'header/Header.jsx';
import CreatePanel from 'workpanel/WorkPanel.jsx';
import StandardCardSet from 'card/Card.jsx';


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
                    <Route path="/cardset/:id/edit" component = {CreatePanel}/>

                </Switch>

            </div>)
    }
}



export default connect()(CardSetPage)