/*

Active Code : 

*/

import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {Router, Link, browserHistory} from 'react-router';
//import { AppLayout } from '../../ui/layouts/App.jsx';

import Productiontasks from '../../api/productiontasks.js';

import Productiontask from '../../ui/components/Productiontask.jsx';

import { NavbarComponent } from '../../ui/components/NavbarComponent.jsx';

//const handleLogout = () => Meteor.logout(() => browserHistory.push('/login'));


// App component - represents the App Component in the DOM
export class AppComponent extends Component {

  constructor(props) {
    console.log("AppComponent:constructor enter");
    super(props);
    console.log("AppComponent:constructor enter this" + this);
    this.state = { isAuthenticated: Meteor.user() !== null };
    console.log("AppComponent:constructor Meteor.user() "+Meteor.user());
    console.log("AppComponent:constructor this.state " + this.state);
    console.log("AppComponent:constructor this.props.user " + this.props.user);
  };

  componentWillMount() {
    console.log("AppComponent:componentWillMount enter");
    if(!this.state.isAuthenticated) {
      console.log("AppComponent:componentWillMount not auth'ed redirect to sign in");
      //this.contextType.router.transitionTo('/signin');
    }
    else
    {
      console.log("AppComponent:componentWillMount user auth'ed");
    }
  };

  componentDidMount() {
    console.log("AppComponent:componentDidMount enter");
  };

  ComponentDidUpdate(prevProps, prevState) {
    console.log("AppComponent:componentDidUpdate enter");
    if(!this.state.isAuthenticated) {
      console.log("App:componentDidUpdate auth'ed ok");
      this.props.router.transitionTo('/signin');
    }
    else
    {
      console.log("AppComponent:componentDidUpdate no auth'ed");
    }
  };

  componentWillReceiveProps() {
    console.log("AppComponent:componetWillReceiveProps ");
    console.log(this.props);
  };

  render(){
    console.log("AppComponent:render entered");
    //render the pages passed as children from react-router in the props object passed to this component

    //  className="col-md-10" id="app-render"
    return (
        <div className="col-md-12" id="app-render">
            { this.props.children }
        </div>
    );
  }
};

AppComponent.propTypes = {
  //myUser: PropTypes.object.isRequired,
  //productiontasks: PropTypes.array.isRequired,
  //chassiscount: PropTypes.number,
};

export default AppComponent = createContainer(() => {
  console.log("AppComponent::createContainer ");
  
  const handle = Meteor.subscribe(
      'productiontasks', 
      {
          onReady: function(){
              console.log("AppComponent::createContainer: dataready")
              console.log(handle);
    
              console.log("AppComponent::createContainer:handle "+handle.ready());
          }
      }

  );
  
  console.log(Productiontasks);
  return {
      //data: ProductionTasks.find(),
      //productiontasks: Productiontasks.find({"LOCATIONSTATUS": "1"}).fetch(),
      //chassiscount: Productiontasks.find({"LOCATIONSTATUS": "1"}).count(),
  };
  
}, AppComponent);
