import CardSetViewer from 'viewer/CardViewer.jsx'
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
                console.log(this.props)                
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
        return(<CardSetViewer
                title={this.state.title}
                subject={this.state.subject}
                />)
    }
}




export default connect()(CardSetPage)