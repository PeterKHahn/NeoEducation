import Header from 'header/Header.jsx';

import React, { Component } from 'react';
import {Link} from 'react-router-dom';


class SetPage extends Component {

    constructor(props) {
        super(props) 

        this.state = {
            cards: []
        }

        
    }

    componentDidMount() {
        fetch('/retrieve-all-cards', {
            method : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/html'
            },
            credentials: "include",
            body : "Requesting all Card Sets"
        }).then((response) => {
            return response.json()
        }).then((json) => {
            if(json.authSucc) {
                this.setState((prevState, props) => ({
                    cards: json.body.cardSets.map((curr, index) => {
                        return <CardSet {...curr} key={index}/>
                    })
                }))
            }

        })


    }

    render() {
        return(
            <div>
                <Header/>
                <h1>Set Page</h1>
                <div>{this.state.cards}</div>
                
            </div>)
    }
}

const CardSet = (props) => {

    return(
        <Link className="link"to={"/cardset/" + props.id + "/view"}>
            <div className="card-set-summary">
                <div>title: {props.title}</div>
                <div>subject: {props.subject}</div>
            </div>
        </Link>
    )

}



export default SetPage