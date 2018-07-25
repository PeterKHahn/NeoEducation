import React, {Component} from 'react';
import Login from 'utility/Login.jsx'
import {Link} from 'react-router-dom'



const FrontPage  = (props) => {

    return(
        <div>
            <div className="center-panel">
                <div className="divider">
                    
                </div>
                <div className="front-page-center">
                    <div className="welcome">Welcome to NeoEducation</div>
                    <Login signedIn={props.signedIn}/>
                    <div>
                        {props.signedIn ? <HomePageButton text="Create a Study Set" link="/create"/> : ""}
                        {props.signedIn ? <HomePageButton text="View your Study Sets" link="/sets"/> : ""}
                    </div>
                    <Tmp/>

                </div>

            </div>

        </div>
    )
    
}

class Tmp extends Component {

    constructor(props) {
        super(props)
        this.click = this.click.bind(this)
    }

    click() {

        var formData = new FormData();

        formData.append('userParamName', 'abc123');
        formData.append('passwordParamName', 'abc123');
        formData.append('challenge', 'abc123');

        fetch("/test-card-set", {
            method : 'POST',
            credentials: "include",

          
            body : formData
        }).then(results => {
            console.log(results.text())


        })
    }

    render() {
        return<div onClick={this.click}>Click me</div>
    }
}

const HomePageButton = (props) => {
    return(
        <div className="home-page-button-container">
            <Link className="link"to={props.link}>
                <div className="home-page-button">{props.text}</div>
            </Link>
        </div>
    )
}



export default FrontPage; 