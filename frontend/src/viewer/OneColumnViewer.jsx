import React, {Component} from 'react'; 
import {connect} from 'react-redux';
import { Range } from 'rc-slider';
import CardView from 'viewer/CardView.jsx';

import 'rc-slider/assets/index.css';

class OneColumnViewer extends Component {

    


    render() {

        

        let cards = this.props.cards.map((currElement, index) => {
            
            return(
                <CardView
                    cl="flash-card"
                    key={currElement.id}
                    index={currElement.absIndex}
                    term={currElement.term}
                    definition={currElement.definition}
                    priority={currElement.priority}
                />

            )
        })

        return (<div>
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

export default OneColumnViewer; 