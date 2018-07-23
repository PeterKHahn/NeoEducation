import React, {Component} from 'react'; 
import CardView from 'viewer/CardView.jsx';

import 'rc-slider/assets/index.css';

class FlashViewer extends Component {

    
    constructor(props) {
        super(props)
        this.state = {
            index: 0
        }

        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    handleKeyPress(event) {
        let k = event.key
        if(k === 'ArrowRight') {
            this.setState((prevState, props) => ({
                index : Math.min(prevState.index + 1, this.props.cards.length - 1)
            }))
        }else if (k === 'ArrowLeft') {

            this.setState((prevState, props) => ({
                index : Math.max((prevState.index - 1), 0)
            }))

            
        }

      }

    

    // https://stackoverflow.com/questions/41693715/react-redux-what-is-the-canonical-way-to-bind-a-keypress-action-to-kick-off-a-r

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
     }
   
     componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
     }


    render() {

        let cardE = <div></div>

        let index = this.state.index 
        let card = this.props.cards[index];


        if(card) {
            cardE = (
                <CardView
                    cl="flash-card"
                    term={card.term}
                    index={card.absIndex}

                    definition = {card.definition}
                    priority = {card.priority}
                />
            )
        }
         


        return (<div>
            <h1>{this.props.title}</h1>
            <h2>{this.props.subject}</h2>
            <div className="work-panel">

                <div className="flash-cards-panel-container">
                    {cardE}

                </div>



            </div>

        </div>)
    }
}

export default FlashViewer; 