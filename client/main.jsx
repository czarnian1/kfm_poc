import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/ui/startup/accounts-config.js';
import {renderRoutes} from '../imports/ui/startup/routes.jsx'

import NavbarComponent from '../imports/ui/components/NavbarComponent.jsx';
import Filterpanel from '../imports/ui/components/Filterpanel.jsx';
Meteor.startup(() => {
    initAccount();

    render(<NavbarComponent />, document.getElementById('render-Nav-Bar'));
    render(<Filterpanel />, document.getElementById('render-panel-left-filter'));
    render(renderRoutes(), document.getElementById('react-root-render-main-application'));
});


function initAccount(){
Accounts.ui.config({
});
}