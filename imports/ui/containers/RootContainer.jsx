import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router'

export class RootContainer extends Component {
    constructor(props, context) {
        console.log("RootContainer:constructor");
        super(props, context);
        this.state = this.getMeteorData();
        this.logout = this.logout.bind(this);
//        context.router;
    }

    getMeteorData(){
        console.log("RootContainer:getMeteorData");
        return { isAuthenticated: Meteor.userId() !== null };
    }

    componentWillMount(){
        console.log("RootContainer:componentWillMount");
        if (!this.state.isAuthenticated) {
            browserHistory.push('/login');
//            this.context.router.push('/login')
        }
    }

    componentDidUpdate(prevProps, prevState){
        console.log("RootContainer:componentDidUpdate");
        if (!this.state.isAuthenticated) {
            browserHistory.push('/login');
        }
    }

    logout(e){
        console.log("RootContainer:logout");
        e.preventDefault();
        Meteor.logout();
        browserHistory.push('/login');
    }

    render(){
        console.log("RootContainer:render");
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

/*
RootContainer.contextTypes = {
    router: React.PropTypes.func.isRequired
};
*/


import prod_monitor from '../../api/prod_monitor.js';
import prod_monitor_comment from '../../api/prod_monitor_comment.js';
import { createContainer } from 'meteor/react-meteor-data';

export default RootContainer = createContainer(() => {
    Meteor.subscribe('prod_monitor');
    Meteor.subscribe('prod_monitor_comment');
    
    return {
    };
    
}, RootContainer);
