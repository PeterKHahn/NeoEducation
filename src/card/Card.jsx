import React, { Component } from 'react';

class CardSet extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            cards : [<CardContent/>]
        }
        this.addCard = this.addCard.bind(this)
        this.dragOver.bind(this)
        this.dragStart.bind(this)
        this.dragEnd.bind(this)

       
    }

    addCard() {
        console.log("adding card...")
        this.setState((prevState) => {
            let alpha = <CardContent/>
            
            return {
                cards: prevState.cards.concat(alpha)
            }
        })
    }


    dragStart(event) {
        console.log('dragstart')
        event.dataTransfer.effectAllowed = 'move';

    }

    dragEnd(event) {
        console.log('dragend')
    }

    dragOver(event) {
        event.preventDefault()
        console.log('dragOver')
    }

    render(){
        let ls = this.state.cards;
        let res = ls.map((currElement, index) => {
            return <Card 
                    index={index} 
                    content={currElement}
                    draggable='true'
                    onDragStart={this.dragStart}
                    onDragEnd={this.dragEnd}/>
        })

        console.log(res)

        return  <div className='card-set'>
                    <CardSetInfoBox/>
                    <div onDragOver={this.dragOver}>
                        {res}
                    </div>
                </div>
    }
}

class CardSetInfo extends React.Component {
    render() {
        return(
            <div className='cardset-info'>
                <textarea tabindex='5' 
                    className='text card-set-title' 
                    placeholder='Title your Flash Set'>
                </textarea>
                <textarea className='text' 
                    contenteditable="true"
                    tabindex='5' 
                    placeholder='Subject...'>
                </textarea>
            </div>
        )
    }
}

class Card extends React.Component {

    render() {
        return(
            <div className="card" 
                onDragStart={this.props.onDragStart}
                onDragEnd={this.props.onDragEnd}>
                <CardCounter index={this.props.index}/>
                {this.props.content}
            </div>
        )
    }
}

class CardContent extends React.Component {

    componentDidMount() {
        console.log(this.ref.current)
        this.ref.current.focus()
    }

    
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
            height : 20
        }
        this.handleChange = this.handleChange.bind(this)
        this.textRef = React.createRef();


        
    }

    handleChange(event) {
        this.setState({
            definition : event.target.value, 
            height : 0
        })
        console.log(this.textRef)
        console.log(this.textRef.current.scrollHeight)

        this.setState({
            definition : event.target.value, 
            height : this.textRef.current.scrollHeight
        })


    }

      /*$(".text").on('input', function() {
        console.log('fuck')
        $(this).css('height','auto');
        $(this).height(this.scrollHeight);
    })*/

    
    render() {
        return(
            <div className='definition'>
                <textarea className='text' 
                    placeholder="Definition..."
                    ref={this.textRef}
                    tabindex='5' 
                    rows={this.state.rows}
                    style={{height: this.state.height}}
                    onChange={this.handleChange} 
                    value={this.state.definition}></textarea>
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



    }


    handleChange(event) {
        
        this.setState({term : event.target.value})
    }

    focus() {
        this.textRef.current.focus()
    }

    render() {
        return(
            <div className='term'>
                <textarea className='text' 
                    ref = {this.textRef}
                    tabindex='5' 
                    placeholder="Term..." 
                    autoFocus
                    onChange={this.handleChange} value={this.state.term}></textarea>
            </div>
        )
    }

}


class CardSetInfoBox extends React.Component{
    render() {
        return (
            <div 
                className='card-set-info-box'>
                <CardSetInfo/>
            </div>
        )
    }
}



export default CardSet; 