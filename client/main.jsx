import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/ui/startup/accounts-config.js';
import {renderRoutes} from '../imports/ui/startup/routes.jsx'

import PanelNavbar from '../imports/ui/components/PanelNavbar.jsx';

Meteor.startup(() => {
    initAccount();

    render(<PanelNavbar />, document.getElementById('render-Nav-Bar'));
    render(renderRoutes(), document.getElementById('react-root-render-container'));
});


function initAccount(){
Accounts.ui.config({
});
}