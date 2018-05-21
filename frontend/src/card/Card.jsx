import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea'


class StandardCardSet extends Component {
    
    constructor(props){
        super(props)

        this.cards = [{
            term: "", 
            definition: ""
        }]

        this.state = {
            cards : this.cards,
            title : "",
            subject: ""
        }

        this.addCard = this.addCard.bind(this)

        this.updateTitle = this.updateTitle.bind(this)
        this.updateSubject = this.updateSubject.bind(this)

        this.updateTerm = this.updateTerm.bind(this)
        this.updateDefinition = this.updateDefinition.bind(this)
       
    }
    updateTitle(updatedTitle) {

        this.setState((prevState) => {
            return {
                cards: prevState.cards, 
                title : updatedTitle, 
                subject : prevState.subject
            }
        })
    }
    updateSubject(updatedSubject) {
        this.setState((prevState) => {
            return {
                cards: prevState.cards, 
                title: prevState.title, 
                subject: updatedSubject
            }
        })
    }

    updateTerm(id, term) {
        this.cards[id].term = term
    }

    updateDefinition(id, definition) {
        this.cards[id].definition = definition
    }

    addCard() {
        let alpha = {
            term: "", 
            definition: ""
        }

        this.cards.push(alpha)

        console.log("adding card...")
        this.setState((prevState) => {
            
            return {
                cards: prevState.cards, 
                title: prevState.title, 
                subject: prevState.subject
            }
        })
    }

    render() {
        let ls = this.state.cards;
        let res = ls.map((currElement, index) => {
            return <Card
                    key={index} 
                    id={index}
                    index={index} 
                    updateTerm={this.updateTerm}
                    updateDefinition={this.updateDefinition}/>
        })


        return  <div className='card-set'>
                    <CardSetInfoBox
                        titleFunction={this.updateTitle}
                        subjectFunction={this.updateSubject}/>
                    <div >
                        {res}
                    </div>
                </div>
    }
}

class CardSetInfo extends Component {
    constructor(props){
        super(props)
        this.onTitleChange = this.onTitleChange.bind(this)
        this.onSubjectChange = this.onSubjectChange.bind(this)

    }
    onTitleChange(event) {
        this.props.titleFunction(event.target.value)
    }
    onSubjectChange(event) {
        this.props.subjectFunction(event.target.value)
    }
    render() {
        return(
            <div className='cardset-info'>

                <TextareaAutosize 
                    className='text-area card-set-title' 
                    tabIndex={5} 
                    placeholder='Title your Flash Set'
                    onChange={this.onTitleChange}/>
                <TextareaAutosize 
                    className='text-area' 
                    tabIndex={5} 
                    placeholder='Subject...'
                    onChange={this.onSubjectChange}/>

            </div>
        )
    }
}

class Card extends Component {

    render() {
        return(
            <div className="card" >
                <CardCounter index={this.props.index}/>
                <CardContent 
                    id={this.props.id}
                    updateTerm={this.props.updateTerm}
                    updateDefinition={this.props.updateDefinition}/>
            </div>
        )
    }
}

class CardContent extends Component {
    render(){
        return(
            <div className="card-content">
                <Term
                    id={this.props.id}
                    updateTerm={this.props.updateTerm}/>
                <Definition
                    id={this.props.id}
                    updateDefinition={this.props.updateDefinition}/>
            </div>
        )   
    }
}

class CardCounter extends Component {

    render() {
        return(
            <div className="card-counter">{this.props.index}</div>
        )
    }
}

class Definition extends Component {
    constructor(props){
        super(props)

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {

        this.props.updateDefinition(this.props.id, event.target.value)

    }

    render() {
        return(
            <div className='definition'>
                <TextareaAutosize
                    className='text-area' 
                    placeholder='Definition...'
                    tabIndex={5}
                    onChange={this.handleChange}/>
            </div>
        )
    }
}
class Term extends Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)

        this.childText = null; 
        this.testRef = element => {
          
            this.childText = element
            this.childText.focus()
            
        }

    }


    handleChange(event) {
        console.log(this.childText.selectionStart)
        this.props.updateTerm(this.props.id, event.target.value)
    }

    render() {
        return(
            <div className='term'>
                <TextareaAutosize 
                    className='text-area' 
                    innerRef = {this.testRef} 
                    placeholder='Term...'
                    tabIndex={5}
                    onChange={this.handleChange}/>
            </div>
        )
    }

}


class CardSetInfoBox extends Component{
    render() {
        return (
            <div 
                className='card-set-info-box'>
                <CardSetInfo
                    titleFunction={this.props.titleFunction}
                    subjectFunction={this.props.subjectFunction}/>
            </div>
        )
    }
}



export default StandardCardSet; 