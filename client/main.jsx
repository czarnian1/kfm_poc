import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/ui/startup/accounts-config.js';
import {renderRoutes} from '../imports/ui/startup/routes.jsx'

import PanelNavbar from '../imports/ui/components/PanelNavbar.jsx';

Meteor.startup(() => {
   //initAccount();
    //load gauge javascript libraries
    //$.getScript('d3/d3.js', false);
    $.getScript('d3simple_gauge.js'); 
    render(<PanelNavbar />, document.getElementById('render-Nav-Bar'));
    render(renderRoutes(), document.getElementById('react-root-render-container'));
});


function initAccount(){
    Accounts.ui.config({
    });
}

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
