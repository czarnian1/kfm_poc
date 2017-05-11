import React, { Component, PropTypes } from 'react'
import { Accounts } from 'meteor/accounts-base'
import { browserHistory, Link } from 'react-router'

const T = i18n.createComponent(); // translater component for json lookup universe:i18n

export default class PanelLoginAccount extends Component {
    constructor(props){
        super(props);
        this.state = {
                error: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    
    PanelLoginAccountAutoRun(){
        var u=Meteor.user();
        if(u==undefined)    return;
        
        // Set language
        if(Meteor.user()!=undefined){
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

        // Display values from profile.
        $('#loginUsername').val(u.username);
        if(u.emails!=undefined && u.emails[0]!=undefined){
            if(u.emails[0].address!=undefined) $('#loginEmailAddress').val(u.emails[0].address);
        }

        if(u.profile!=undefined){
            if(u.profile.EmailNotification!=undefined)  $('#loginEmailNotification').prop('checked',u.profile.EmailNotification);
            if(u.profile.FilterStartId!=undefined)      $('#loginFilterStartId').val(u.profile.FilterStartId);
            if(u.profile.FilterEndId!=undefined)        $('#loginFilterEndId').val(u.profile.FilterEndId);
        }
    }
    
    
    handleSubmit(e){
        e.preventDefault();
        if(Meteor.userId() === null)    this.createAccount();
        else                            this.updateAccount();
    }
    
    
    createAccount(){
        let loginUsername           = document.getElementById('loginUsername').value;
        let loginPassword           = document.getElementById('loginPassword').value;
        let loginConfirmPassword    = document.getElementById('loginConfirmPassword').value;
        let loginEmailNotification  = document.getElementById('loginEmailNotification').checked;
        let loginEmailAddress       = document.getElementById('loginEmailAddress').value;
        let loginFilterStartId      = document.getElementById('loginFilterStartId').value;
        let loginFilterEndId        = document.getElementById('loginFilterEndId').value;

        if(loginUsername=="") return;
        if(loginPassword=="") return;
        if(loginConfirmPassword=="") return;
        if(loginPassword != loginConfirmPassword){
            document.getElementById('loginConfirmPassword').value="";
            return;
        }
        if(loginEmailNotification){
            if(loginEmailAddress=="") return;
        }
        
        var argv={};

        argv["username"]=loginUsername;
        argv["password"]=loginPassword;
        if(loginEmailAddress!=""){
            argv["emails"]=[];
            argv["emails"][0]={"address":loginEmailAddress};
        }

        argv["profile"]={};
        argv["profile"]["EmailNotification"]=loginEmailNotification;
        if(loginFilterStartId!="")  argv["profile"]["FilterStartId"]=loginFilterStartId;
        if(loginFilterEndId!="")    argv["profile"]["FilterEndId"]=loginFilterEndId;

        Accounts.createUser(argv);
    }
    
    
    updateAccount(){
        var err=false;
        
        let loginUsername           = document.getElementById('loginUsername').value;
        let loginPassword           = document.getElementById('loginPassword').value;
        let loginConfirmPassword    = document.getElementById('loginConfirmPassword').value;
        let loginEmailNotification  = document.getElementById('loginEmailNotification').checked;
        let loginEmailAddress       = document.getElementById('loginEmailAddress').value;
        let loginFilterStartId      = document.getElementById('loginFilterStartId').value;
        let loginFilterEndId        = document.getElementById('loginFilterEndId').value;

        var argv={};
        
        // _id
        argv["_id"]=Meteor.userId();
        
        // username
        if(loginUsername!="") argv["username"]=loginUsername;
        
        // password
        if(loginPassword!="" && loginConfirmPassword!="" && loginPassword==loginConfirmPassword) argv["password"]=loginPassword;
        
        // emails address
        if(loginEmailAddress!=""){
            argv["emails"]=[];
            argv["emails"][0]={"address":loginEmailAddress};
        }

        argv["profile"]={};
        // profile EmailNotification
        argv["profile"]["EmailNotification"]=loginEmailNotification;
//        if(loginEmailAddress!="" && loginEmailNotification) Email address is required.
            
        // profile FilterStartId
        if(loginFilterStartId!="")  argv["profile"]["FilterStartId"]=loginFilterStartId;
        
        // profile FilterEndId
        if(loginFilterEndId!="")    argv["profile"]["FilterEndId"]=loginFilterEndId;
        
        Meteor.call(
            'updateLoginAccount', 
            argv, 
            (error, result) => {
                err=result;
            }
        );
        
        // Go to /Main URL
        if(!err)    browserHistory.push('/Main');
    }

    
    componentWillMount(){
        Tracker.autorun(()=>{this.PanelLoginAccountAutoRun();});
    }

    
    render(){
        const error = this.state.error;
        
        var auth=false;
        if(Meteor.userId() !== null)    auth=true;

        return (
            <div  className="container">
                <div  className="row">
                    <div className="panel panel-default col-md-6 col-md-offset-3">
                        <h1 className="text-center"><T>ui.login.ManageAccount</T></h1>
            
                        { error.length > 0 ? <div className="alert alert-danger fade in">{error}</div> :''}
                            <form  id="login-form" className="form" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <input type="text" id="loginUsername" className="form-control input-lg" placeholder={i18n.__("ui.login.Username")}/>
                            </div>
                            <div className="form-group">
                                <input type="password" id="loginPassword" className="form-control input-lg" placeholder={i18n.__("ui.login.Password")}/>
                            </div>
                            <div className="form-group">
                                <input type="password" id="loginConfirmPassword" className="form-control input-lg" placeholder={i18n.__("ui.login.ConfirmPassword")}/>
                            </div>
                            <div className="panel panel-default">
                                <h3>
                                    &nbsp;<input type="checkbox" id="loginEmailNotification"/><T>ui.login.EmailNotification</T>
                                </h3>
                                <div className="form-group" style={{"margin":"10px"}}>
                                    <input type="text" id="loginEmailAddress" className="form-control input-lg" placeholder={i18n.__("ui.login.EmailAddress")}/>
                                </div>
                                <div className="form-group" style={{"margin":"10px"}}>
                                    <input type="text" id="loginFilterStartId" className="form-control input-lg" placeholder={i18n.__("ui.login.FilterStartId")}/>
                                </div>
                                <div className="form-group" style={{"margin":"10px"}}>
                                    <input type="text" id="loginFilterEndId" className="form-control input-lg" placeholder={i18n.__("ui.login.FilterEndId")}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <input type="submit" id="login-button" className="btn btn-primary btn-lg btn-block" value={i18n.__("ui.login.Submit")} />
                            </div>
                        </form>
                    </div>
                </div>
                <br />
                <div  className="row">
                    <center>
                        <a href="/Main" ><T>ui.common.BackToMainScreen</T></a>
                    </center>
                    <br />
                </div>
            </div>
        );
    }
  
    componentDidMount() {
        console.log("panelLoginAccount:componentDidMount");
    }

    componentDidUpdate() {
        console.log("panelLoginAccount:componentDidUpdate");
    }

}