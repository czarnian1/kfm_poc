import React, { Component, PropTypes } from 'react'
import { browserHistory, Link } from 'react-router'
import { createContainer } from 'meteor/react-meteor-data'

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
        <div className="panel panel-default col-md-6 col-md-offset-3">
            <h1 className="text-center">Login</h1>
            
            { error.length > 0 ? <div className="alert alert-danger fade in">{error}</div> :''}

            <form  id="login-form" className="form" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <input type="text" id="loginUsername" className="form-control input-lg" placeholder="Username"/>
                </div>
                <div className="form-group">
                    <input type="password" id="loginPassword" className="form-control input-lg" placeholder="Password"/>
                </div>
                <div className="form-group">
                    <input type="submit" id="login-button" className="btn btn-primary btn-lg btn-block" value="Login" />
                </div>
            </form>
        </div>
    );
  }
}