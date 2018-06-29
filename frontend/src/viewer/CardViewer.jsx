import React, {Component} from 'react'; 

class CardSetViewer extends Component {

    render() {
        let cards = this.props.cards.map((currElement, index) => {
            return(
                <div className="flash-card" key={index}>
                    <div className="flash-term">{currElement.term} </div>
                    <div className="flash-definition">{currElement.definition}</div>
                </div>
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
                <div className="side-panel-container">
                </div>


            </div>

        </div>)
    }

}


export default CardSetViewer; 