import React from 'react';
import PriorityBar from 'viewer/PriorityBar.jsx';


const CardView = (props) => {
    return(
        <div className={props.cl} >
            <div className="flash-term">{props.term}</div>
            <div className="flash-definition">{props.definition}</div>
            <PriorityBar {...props}/>
        </div>)
}

export default CardView;
