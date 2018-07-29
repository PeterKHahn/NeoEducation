import React, {Component} from 'react'; 
import {connect} from 'react-redux';


class PriorityBar extends Component {

    

    constructor(props) {
        super(props)

        this.onClick = this.onClick.bind(this)

    }

    onClick(newPriority) {
        console.log(this.props)

        this.props.updateCard(this.props.index, this.props.term, this.props.definition, newPriority)
        
    }


    render() {
        return(
            <div className="priority-bar">
                Priority: 
                <PriorityButton priority={1} cardPriority={this.props.priority} changePriority={this.onClick}/>
                <PriorityButton priority={2} cardPriority={this.props.priority} changePriority={this.onClick}/>
                <PriorityButton priority={3} cardPriority={this.props.priority} changePriority={this.onClick}/>
                <PriorityButton priority={4} cardPriority={this.props.priority} changePriority={this.onClick}/>

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


export default connect()(PriorityBar)


