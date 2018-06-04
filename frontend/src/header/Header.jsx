import React, { Component } from 'react';
import Login from 'utility/Login.jsx' 

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
                    <HeaderButton title="Home"/>
                    <HeaderButton title="About"/>
                    <HeaderButton title="Flash"/>
                </div>
    }
}




class HeaderButton extends Component {

    render() {
        return <div className='header-button'>{this.props.title}</div>
    }
}

// TODO implement a search bar for the future
class SearchBar extends Component {
    render() {
        return <div className='search-bar'>Click here to search</div>
    }
}

export default Header;
