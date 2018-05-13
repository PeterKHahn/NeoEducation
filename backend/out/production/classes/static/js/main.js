/***************** Constants ****** */
const rootElement = document.getElementById('root')

const title = "NeoEducation: Flash"
const subtitle = "The End of something Old, the Start of something New"


/****************** Header Classes *************/

class Header extends React.Component {
    render(){
        return  <div className='heading'>
                    <TitleBar/>
                    <HeaderBar/>
                </div>
    }
}

class TitleBar extends React.Component {
    render() {
        return  <div className='title-bar'>
                    <div className='title'>{title}</div>
                    <div className='subtitle'>{subtitle}</div>
                </div>
    }
}

class HeaderBar extends React.Component {
    constructor(props) {
        super(props)
    }
    render(){
        return  <div className='header-bar'>
                    <HeaderButton title="Home"/>
                    <HeaderButton title="About"/>
                    <HeaderButton title="Flash"/>
                    <SearchBar/>
                </div>
    }
}

class HeaderButton extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <div className='header-button'>{this.props.title}</div>
    }
}

class SearchBar extends React.Component {
    render() {
        return <div className='search-bar'>Click here to search</div>
    }
}



/********************* Flash Card Classes **********/

class WorkPanel extends React.Component {
    constructor(props) {
        super(props)


        this.addCard = this.addCard.bind(this)
        this.cardSetRef = React.createRef();

        
        
        
    }
    addCard() {
        this.cardSetRef.current.addCard()



    }
    

    render() {
        return  <div className='main-panel'>
                    <CardSet ref={this.cardSetRef}/>
                    <AddRowButton cardFunction={this.addCard}/>
                    <FinishButton/>
                </div>
    }
}


class CardSet extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            cards : [<Card/>]
        }
        this.addCard = this.addCard.bind(this)

       
    }

    addCard() {
        console.log("adding card...")
        this.setState((prevState) => {
            let alpha = <Card/>
            
            return {
                cards: prevState.cards.concat(alpha)
            }
        })
    }

    render(){
        let ls = this.state.cards;
        let res = ls.map((currElement, index) => {
            return <Card index={index}/>
        })

        console.log(res)

        return  <div className='card-set'>
                    <CardSetInfoBox/>
                    {res}
                </div>
    }
}

class CardSetInfo extends React.Component {
    render() {
        return(
            <div className='cardset-info'>
                <div tabindex='5' 
                    className='text card-set-title' 
                    contenteditable="true"
                    placeholder='Title your Flash Set'>
                </div>
                <div className='text' 
                    contenteditable="true"
                    tabindex='5' 
                    placeholder='Subject...'>
                </div>
            </div>
        )
    }
}

class Card extends React.Component {

    render() {
        return(
            <div className="card" >
                <CardCounter index={this.props.index}/>
                <CardContent/>
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
        }
        this.handleChange = this.handleChange.bind(this)

        
    }

    handleChange(event) {
        this.setState({
            definition : "", 
        })

    }

    
    render() {
        return(
            <div className='definition'>
                <div className='text' 
                    placeholder="Definition..."
                    contenteditable="true"
                    tabindex='5' 
                    rows={this.state.rows}
                    onChange={this.handleChange} 
                    value={this.state.definition}></div>
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
                <div className='text' 
                    ref = {this.textRef}
                    contenteditable="true"
                    tabindex='5' 
                    placeholder="Term..." 
                    autoFocus
                    onChange={this.handleChange} value={this.state.term}></div>
            </div>
        )
    }
}

class AddRowButton extends React.Component {

    
    constructor(props) {
        super(props)
        this.handleSelect = this.handleSelect.bind(this)
        this.myRef = React.createRef();
    }
    handleSelect(event) {
        const node = this.myRef.current
        node.blur()

        this.props.cardFunction()

        

 
    }

    render() {
        return (
            <div 
                ref={this.myRef}
                className='add-row-button'
                tabindex='5' 
                onFocus={this.handleSelect}>Click Here to Add a Row
            </div>
        )
    }
}

class FinishButton extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(event) {
        $.get("/done", (data) => {
            console.log(data)
        })
    }
    render() {
        return(
            <div className="finish-button">
                Click here to finish
            </div>
        )
    }
}

/******8** FOrmatting ********/

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



function App() {
    return(
        <div>
            <Header/>
            <WorkPanel/>
        </div>
    )
}
ReactDOM.render(
    <App/>, 
    rootElement
)