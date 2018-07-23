import React, {Component} from 'react'; 
import CardView from 'viewer/CardView.jsx';

import 'rc-slider/assets/index.css';

class TwoColumnViewer extends Component {

    


    render() {

        let ar1 = []
        let ar2 = []

        for(let i = 0; i < this.props.cards.length; i++) {
            let card = this.props.cards[i];
            if(i % 2 ===0) {
                ar1.push(
                    <CardView
                    cl="flash-card"
                    key={card.id}
                    index={card.absIndex}
                    term={card.term}
                    definition={card.definition}
                    priority={card.priority}
                />
                )
            } else {
                ar2.push(
                    <CardView
                    cl="flash-card"
                    key={card.id}
                    index={card.absIndex}
                    term={card.term}
                    definition={card.definition}
                    priority={card.priority}
                />
                )
            }
        }



        return (<div>
            <h1>{this.props.title}</h1>
            <h2>{this.props.subject}</h2>
            <div className="work-panel">

                <div className="flash-cards-panel-container">


                </div>
                <div className='flash-cards-column'>{ar1}</div>
                <div className='flash-cards-column'>{ar2}</div>


            </div>

        </div>)
    }
}

export default TwoColumnViewer; 