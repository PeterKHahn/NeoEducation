import React, { Component } from 'react';

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

class HeaderButton extends Component {
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

export default Header;
