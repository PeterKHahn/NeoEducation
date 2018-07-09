import CardSetViewer from 'viewer/CardViewer.jsx'
import Header from 'header/Header.jsx';

import React, { Component } from 'react';

import {connect} from 'react-redux';



class CardSetPage extends Component {

    constructor(props) {
        super(props)
        let idToGet = this.props.match.params.id 

        this.state = {
            title: "", 
            subject: "", 
        }

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
                this.setState({
                    title: set.title, 
                    subject: set.subject,
                })
                this.props.dispatch({
                    type: "SET_CARDS",
                    cards: set.cards
                })


            } else {
                this.setState({
                    title: "Invalid", 
                    subject: "Card set is wrong :(", 
                })
            }


        })


    }   


    render() {
        // this is how you get the id {this.props.match.params.id} 
        return(
            <div>
                <Header/>
                <CardSetViewer
                    title={this.state.title}
                    subject={this.state.subject}
                />
            </div>)
    }
}




export default connect()(CardSetPage)