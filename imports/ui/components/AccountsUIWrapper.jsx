import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

export default class AccountsUIWrapper extends Component {
    componentDidMount() {
        // Use Meteor Blaze to render login buttons
        // console.log(Template);
        // Template helper loginButtons is called Template._loginButtons in accounts-ui-bootstrap package and Template.loginButtons in accounts-aui base package
        //this.view = Blaze.render(Template.loginButtons,
        this.view = Blaze.render(Template._loginButtons,ReactDOM.findDOMNode(this.refs.container_for_login));
    }
    
    componentWillUnmount() {
        // Clean up Blaze view
        Blaze.remove(this.view);
    }
    
    render() {
        // Just render a placeholder container that will be filled in
        return <span ref="container_for_login" />;
    }
}
