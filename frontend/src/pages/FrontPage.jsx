import React from 'react';
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

                </div>

            </div>

        </div>
    )
    
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