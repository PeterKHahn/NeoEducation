import React, {Component} from 'react'; 
import {connect} from 'react-redux';


class CardSetViewer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            priorityStart: 1,
            priorityEnd: 4,
        }

    }

   

    render() {
        console.log(this.props)

        let cards = this.props.cards.map((currElement, index) => {

            return(
                <Card
                    cl="flash-card"
                    key={index}
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
            <PriorityBar priority={props.priority}/>
        </div>)
}


class PriorityBar extends Component {

    

    constructor(props) {
        super(props)
        this.state = {
            priority: this.props.priority
        }

        this.onClick = this.onClick.bind(this)


    }

    onClick(newPriority) {
        this.setState({
            priority: newPriority
        })
    }


    render() {
        return(
            <div className="priority-bar">
                Priority: 
                <PriorityButton priority={1} cardPriority={this.state.priority} changePriority={this.onClick}/>
                <PriorityButton priority={2} cardPriority={this.state.priority} changePriority={this.onClick}/>
                <PriorityButton priority={3} cardPriority={this.state.priority} changePriority={this.onClick}/>
                <PriorityButton priority={4} cardPriority={this.state.priority} changePriority={this.onClick}/>


            </div>
        )
    }
}

class PriorityButton extends Component {

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        this.props.changePriority(this.props.priority)

    }

    render() {

        let cl = this.props.priority === this.props.cardPriority ? "selected-priority-button" : "deselected-priority-button"
        
        return(
            <div className={cl} onClick={this.onClick}>{this.props.priority}</div>
        )
    }
}





const mapStateToProps = state => ({
    cards: state.cardSetState.cards
})



export default connect(mapStateToProps)(CardSetViewer); 