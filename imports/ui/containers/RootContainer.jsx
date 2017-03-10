import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router'

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
import Productiontask from '../../ui/components/Productiontask.jsx';
import { createContainer } from 'meteor/react-meteor-data';

export default RootContainer = createContainer(() => {
    const handle = Meteor.subscribe(
        'productiontasks', 
        {
            onReady: function(){
                console.log("RootContainer::createContainer: dataready")
                console.log(handle);
      
                console.log("RootContainer::createContainer:handle "+handle.ready());
            }
        }

    );
    
    console.log(Productiontasks);
    return {
        //data: ProductionTasks.find(),
        //productiontasks: Productiontasks.find({"LOCATIONSTATUS": "1"}).fetch(),
        //chassiscount: Productiontasks.find({"LOCATIONSTATUS": "1"}).count(),
    };
    
  }, RootContainer);
