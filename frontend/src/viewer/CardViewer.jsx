import React, {Component} from 'react'; 
import {connect} from 'react-redux';

import TwoColumnViewer from 'viewer/TwoColumnViewer.jsx'
import PriorityControl from 'viewer/PriorityControl.jsx'
import FlashViewer from 'viewer/FlashViewer.jsx';
import 'rc-slider/assets/index.css';




class CardSetViewer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            priorityStart: 1,
            priorityEnd: 4,
        }
        this.updateRange = this.updateRange.bind(this)

    }


    updateRange(range) {
        this.setState({
            priorityStart: range[0],
            priorityEnd: range[1]
        })

    }
    
   

    render() {

        let cards = this.props.cards.filter(currElement => {
            return currElement.priority >= this.state.priorityStart 
            && currElement.priority <= this.state.priorityEnd
        })

        console.log(this.props.cards)


        
        return(
        <div>
            <ControlStation updateRange={this.updateRange}/>
            <FlashViewer {...this.props} cards={cards}/>


        </div>)
    }

}

class ControlStation extends Component {

    render() {
        return (
            <div className="control-station">
                Click here to have control of your life!
                <PriorityControl updateRange={this.props.updateRange}/>
            </div>
        )
    }
}











export default CardSetViewer; 