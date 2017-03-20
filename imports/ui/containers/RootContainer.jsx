import React, { Component, PropTypes } from 'react';

export class RootContainer extends Component {
  constructor(props){
    super(props);
    this.state = this.getMeteorData();
    this.logout = this.logout.bind(this);
  }

  getMeteorData(){
    return { isAuthenticated: Meteor.userId() !== null };
  }

  componentWillMount(){
    if (!this.state.isAuthenticated) {
      browserHistory.push('/login');
    }
  }

  componentDidUpdate(prevProps, prevState){
    if (!this.state.isAuthenticated) {
      browserHistory.push('/login');
    }
  }

  logout(e){
    e.preventDefault();
    Meteor.logout();
    browserHistory.push('/login');
  }

  render(){
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}


import Productiontasks from '../../api/productiontasks.js';
import Productiontask_notes from '../../api/productiontask_notes.js';
import { createContainer } from 'meteor/react-meteor-data';

export default RootContainer = createContainer(() => {
    Meteor.subscribe('productiontasks');
    Meteor.subscribe('productiontask_notes');
    
    return {
    };
    
  }, RootContainer);
