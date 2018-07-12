import React, {Component} from 'react'; 
import {connect} from 'react-redux';
import { Range } from 'rc-slider';

import PriorityBar from 'viewer/PriorityBar.jsx'
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
        }).map((currElement, index) => {
            
            return(
                <Card
                    cl="flash-card"
                    key={currElement.id}
                    index={currElement.absIndex}
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
                    <PriorityControl updateRange={this.updateRange}/>

                    <div className='flash-cards-panel'>{cards}</div>
                </div>


            </div>

        </div>)
    }

}


class PriorityControl extends Component {




    render() {
        return(
            <div>
                <Range defaultValue={[0,4]}
                        allowCross={false}
                        min={1}
                        max={4}
                        dots={true}
                        onAfterChange={this.props.updateRange}
                        marks={{
                            1 : "1",
                            2 : "2",
                            3 : "3", 
                            4 : "4"
                        
                        }}/>
            </div>
        )
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