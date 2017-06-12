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
        // Set language
        if(Meteor.user()!=undefined){
//            console.log("RootContainer:setLanguage()");

            if(Meteor.user().profile==undefined){
                i18n.setLocale("en");
                accountsUIBootstrap3.setLanguage('en');
            }
            else{
                switch(Meteor.user().profile.defaultLocale){
                case 'ja':
                    i18n.setLocale("ja");
                    accountsUIBootstrap3.setLanguage('ja');
                    break;
                default:
                    i18n.setLocale("en");
                    accountsUIBootstrap3.setLanguage('en');
                }
            }
            
        }
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
import { createContainer } from 'meteor/react-meteor-data';

export default RootContainer = createContainer(() => {
    Meteor.subscribe('prod_monitor');
    Meteor.subscribe('prod_monitor_comment');
    Meteor.subscribe('prod_monitor_parts');

    return {
    };
    
}, RootContainer);
