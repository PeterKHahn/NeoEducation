import React, {Component} from 'react'; 
import {connect} from 'react-redux';

import PriorityBar from 'viewer/PriorityBar.jsx'


class CardSetViewer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            priorityStart: 1,
            priorityEnd: 4,
        }

    }

   

    render() {
        let cards = this.props.cards.map((currElement, index) => {

            return(
                <Card
                    cl="flash-card"
                    key={index}
                    index={index}
                    term={currElement.term}
                    definition={currElement.definition}
                    priority={currElement.priority}
                />

            )
        })

        

        return(
        <div>
            <h1>{this.props.title}</h1>
            <h2>{this.props.subject}</h2>
            
            <div className="work-panel">
                <div className="flash-cards-panel-container">
                    <div className='flash-cards-panel'>{cards}</div>
                </div>


            </div>

        </div>)
    }

}




const Card = (props) => {

    return(
        <div className={props.cl} >
            <div className="flash-term">{props.term}</div>
            <div className="flash-definition">{props.definition}</div>
            <PriorityBar priority={props.priority} cardIndex={props.index}/>
        </div>)
}





const mapStateToProps = state => ({
    cards: state.cardSetState.cards
})



export default connect(mapStateToProps)(CardSetViewer); 