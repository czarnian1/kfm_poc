import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router'

export class RootContainer extends Component {
    constructor(props, context) {
//        console.log("RootContainer:constructor");
        super(props, context);
        this.state = this.getMeteorData();
        this.logout = this.logout.bind(this);
//        context.router;
    }

    setLanguage(){
        // Get locale.
        var locale='en';
                
        if(Meteor.user()==undefined || Meteor.user().profile==undefined || Meteor.user().profile.defaultLocale==undefined){
            // Get from local storage if possible.
            switch(localStorage.getItem("meteor.locale")){
            case 'en':
                locale='en';
                break;
            case 'fr':
                locale='fr';
                break;
            case 'ja':
                locale='ja';
                break;
            default:
                locale='en';
            }
        }        
        else{
            // Get from the user's profile.
            switch(Meteor.user().profile.defaultLocale){
            case 'en':
                locale='en';
                break;
            case 'fr':
                locale='fr';
                break;
            case 'ja':
                locale='ja';
                break;
            default:
                locale='en';
            }
        } 
        
        // Set language
        i18n.setLocale(locale);
        accountsUIBootstrap3.setLanguage(locale);
        localStorage.setItem("meteor.locale", locale);
    }
    
    getMeteorData(){
//        console.log("RootContainer:getMeteorData");
        return { isAuthenticated: Meteor.userId() !== null };
    }

    componentWillMount(){
//        console.log("RootContainer:componentWillMount");
        if (!this.state.isAuthenticated) {
            browserHistory.push('/Login');
//            this.context.router.push('/Login')
        }
        else{
            Tracker.autorun(()=>{
                this.setLanguage();
            });
        }
    }
    
    componentDidMount() {
//        console.log("RootContainer:componentDidMount");
        Tracker.autorun(()=>{
            this.setLanguage();
        });
    }

    componentDidUpdate(prevProps, prevState){
//        console.log("RootContainer:componentDidUpdate");
        if (!this.state.isAuthenticated) {
            browserHistory.push('/Login');
        }
    }

    logout(e){
        console.log("RootContainer:logout");
        e.preventDefault();
        Meteor.logout();
        browserHistory.push('/Login');
    }

    render(){
//        console.log("RootContainer:render");
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
import prod_monitor_parts from '../../api/prod_monitor_parts.js';
import pm_dashboard from '../../api/pm_dashboard.js';
import { createContainer } from 'meteor/react-meteor-data';

export default RootContainer = createContainer(() => {
    Meteor.subscribe('prod_monitor');
    Meteor.subscribe('prod_monitor_comment');
    Meteor.subscribe('prod_monitor_parts');
    Meteor.subscribe('pm_dashboard');

    return {
    };
    
}, RootContainer);
