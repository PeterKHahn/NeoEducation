import React, {Component} from 'react';
import PriorityBar from 'viewer/PriorityBar.jsx';


const CardView = (props) => {
    return(
        <div className={props.cl} >
            <div className="flash-term">{props.term}</div>
            <div className="flash-definition">{props.definition}</div>
            <PriorityBar priority={props.priority} cardIndex={props.index}/>
        </div>)
}

export default CardView;
