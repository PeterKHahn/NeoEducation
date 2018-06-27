import React, {Component} from 'react'; 

class CardSetViewer extends Component {

    render() {
        let cards = this.props.cards.map((currElement, index) => {
            return(
                <div key={index}>
                    <div >{currElement.term}</div>
                    <div>{currElement.definition}</div>
                </div>
            )
        })
        return(
        <div>
            <h1>{this.props.title}</h1>
            <h2>{this.props.subject}</h2>
            <div>{cards}</div>

        </div>)
    }

}


export default CardSetViewer; 