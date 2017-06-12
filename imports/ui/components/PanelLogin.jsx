import React, { Component, PropTypes } from 'react'
import { browserHistory, Link } from 'react-router'
import { createContainer } from 'meteor/react-meteor-data'

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

export default class PanelLogin extends Component {
    constructor(props){
        super(props);
        this.state = {
                error: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e){
        e.preventDefault();
        let username = document.getElementById('loginUsername').value;
        let password = document.getElementById('loginPassword').value;
        Meteor.loginWithPassword(username, password, (err) => {
            if(err){
                this.setState({
                    error: err.reason
                });
            } else {
                browserHistory.push('/Main');
            }
        });
    }

    render(){
        const error = this.state.error;

        return (
            <div  className="container">
                <div  className="row">
                    <div className="panel panel-default col-md-6 col-md-offset-3">
                        <h1 className="text-center"><T>ui.login.Login</T></h1>
            
                        { error.length > 0 ? <div className="alert alert-danger fade in">{error}</div> :''}
                            <form  id="login-form" className="form" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <T _translateProps={['placeholder']}>
                                    <input type="text" id="loginUsername" className="form-control input-lg" placeholder="ui.login.Username"/>
                                </T>
                            </div>
                            <div className="form-group">
                                <T _translateProps={['placeholder']}>
                                    <input type="password" id="loginPassword" className="form-control input-lg" placeholder="ui.login.Password"/>
                                </T>
                            </div>
                            <div className="form-group">
                                <T _translateProps={['value']}>
                                    <input type="submit" id="login-button" className="btn btn-primary btn-lg btn-block" value="ui.login.Login"/>
                                </T>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

}