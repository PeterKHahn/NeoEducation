import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea'



class CardSet extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            cards : [<CardContent key="a"/>], // TODO do something about these keys
            title : ""
        }
        this.addCard = this.addCard.bind(this)
        this.updateTitle = this.updateTitle.bind(this)
       
       
    }
    updateTitle(updatedTitle) {

        this.setState((prevState) => {
            return {
                cards: prevState.cards, 
                title : updatedTitle
            }
        })
    }

    addCard() {
        console.log("adding card...")
        this.setState((prevState) => {
            let alpha = <CardContent/>
            
            return {
                cards: prevState.cards.concat(alpha), 
                title: ""
            }
        })
    }


    render(){
        let ls = this.state.cards;
        let res = ls.map((currElement, index) => {
            return <Card 
                    index={index} 
                    key="b"
                    content={currElement}
                    />
        })


        return  <div className='card-set'>
                    <CardSetInfoBox
                        titleFunction={this.updateTitle}/>
                    <div >
                        {res}
                    </div>
                </div>
    }
}

class CardSetInfo extends Component {
    constructor(props){
        super(props)
        this.onChange = this.onChange.bind(this)
    }
    onChange(event) {
        this.props.titleFunction(event.target.value)
    }
    render() {
        return(
            <div className='cardset-info'>

                <TextareaAutosize 
                    className='text-area card-set-title' 
                    tabIndex={5} 
                    placeholder='Title your Flash Set'
                    onChange={this.onChange}/>
                <TextareaAutosize className='text-area' tabIndex={5} placeholder='Subject...'/>

            </div>
        )
    }
}

class Card extends Component {

    render() {
        return(
            <div className="card" >
                <CardCounter index={this.props.index}/>
                {this.props.content}
            </div>
        )
    }
}

class CardContent extends React.Component {


     
    render(){
        this.ref = React.createRef();
        return(
            <div className="card-content">
                <Term ref={this.ref}/>
                <Definition/>
            </div>
        )   
    }
}

class CardCounter extends React.Component {

    render() {
        return(
            <div className="card-counter">{this.props.index}</div>
        )
    }
}

class Definition extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            definition : "",
        }
        this.handleChange = this.handleChange.bind(this)
        this.textRef = React.createRef();


        
    }

    handleChange(event) {

        this.setState({
            definition : event.target.value, 
        })


    }

    
    render() {
        return(
            <div className='definition'>
                <TextareaAutosize
                    className='text-area' 
                    placeholder='Definition...'
                    tabIndex={5}/>
            </div>
        )
    }
}
class Term extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            term : ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.textRef = React.createRef();


        this.childText = null; 
        this.testRef = element => {
          
            this.childText = element

            this.childText.focus()
            
        }


    }


    handleChange(event) {
        
        this.setState({term : event.target.value})
    }



    render() {
        return(
            <div className='term'>
                <TextareaAutosize 
                    className='text-area' 
                    innerRef = {this.testRef} 
                    placeholder='Term...'
                    tabIndex={5}/>

                
            </div>
        )
    }

}


class CardSetInfoBox extends React.Component{
    render() {
        return (
            <div 
                className='card-set-info-box'>
                <CardSetInfo
                    titleFunction={this.props.titleFunction}/>
            </div>
        )
    }
}



export default CardSet; 