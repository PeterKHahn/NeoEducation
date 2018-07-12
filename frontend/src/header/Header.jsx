import React, { Component } from 'react';
import {Link} from 'react-router-dom'


const title = "NeoEducation: Flash"
const subtitle = "The End of something Old, the Start of something New"

class Header extends React.Component {
    render(){
        return  <div className='heading'>
                    <TitleBar/>
                    <HeaderBar/>
                </div>
    }
}

class TitleBar extends Component {
    render() {
        return  <div className='title-bar'>
                    <div className='title'>{title}</div>
                    <div className='subtitle'>{subtitle}</div>
                </div>
    }
}



class HeaderBar extends Component {
  
    render(){
        return  <div className='header-bar'>
                    <HeaderButton title="Home" to="/home"/>
                    <HeaderButton title="About" to="/about"/>
                    <HeaderButton title="Sets" to="/sets"/>
                </div>
    }
}




class HeaderButton extends Component {

    render() {
        return <div className='header-button'>
            <Link className="header-link" to={this.props.to}>{this.props.title}</Link>
        </div>
    }
}

// TODO implement a search bar for the future
class SearchBar extends Component {
    render() {
        return <div className='search-bar'>Click here to search</div>
    }
}

export default Header;
