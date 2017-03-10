import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/ui/startup/accounts-config.js';
import {renderRoutes} from '../imports/ui/startup/routes.jsx'

import NavbarComponent from '../imports/ui/components/NavbarComponent.jsx';

Meteor.startup(() => {
    initAccount();

    render(<NavbarComponent />, document.getElementById('render-Nav-Bar'));
    render(renderRoutes(), document.getElementById('react-root-render-container'));
});


function initAccount(){
Accounts.ui.config({
});
}