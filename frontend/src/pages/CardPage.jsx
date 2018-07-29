import React, { Component } from 'react';
import Header from 'header/Header.jsx';
import CreatePanel from 'workpanel/WorkPanel.jsx';



import {withRouter, Link} from 'react-router-dom'




class CardPage extends Component {

    constructor(props) {
        super(props)
        this.saveAndContinue = this.saveAndContinue.bind(this)
    }

    saveAndContinue() {

    }

    render() {
  
      return(
        <div>
          <Header/>
          <CreatePanel history={this.props.history}/>
        </div>
      )
    }
}
  



export default withRouter(CardPage); 

