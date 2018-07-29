import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea'


class StandardCardSet extends Component {

    render() {
        let ls = this.props.cards;
        let res = ls.map((currElement, index) => {
            return <Card
                    key={index} 
                    id={index}
                    index={index} 
                    updateTerm={this.props.updateTerm}
                    updateDefinition={this.props.updateDefinition}/>
        })


        return  <div className='card-set'>
                    <CardSetInfoBox
                        titleFunction={this.props.updateTitle}
                        subjectFunction={this.props.updateSubject}/>
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
                <Topic
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
        let newText = event.target.value
        this.props.updateDefinition(this.props.id, newText)

    }

    render() {
        return(
            <div className='notes'>
                <TextareaAutosize
                    className='text-area' 
                    placeholder='Notes...'
                    rows={9}
                    tabIndex={5}
                    onChange={this.handleChange}/>
            </div>
        )
    }
}
class Topic extends Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this)

        this.childText = null; 
        this.testRef = element => {
          
            this.childText = element
            if(element != null) {
                this.childText.focus()

            }
            
        }

    }


    handleChange(event) {
        this.props.updateTerm(this.props.id, event.target.value)
    }

    render() {
        return(
            <div className='topic'>
                <TextareaAutosize 
                    className='text-area topic-text' 
                    innerRef = {this.testRef} 
                    placeholder='Topic...'
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