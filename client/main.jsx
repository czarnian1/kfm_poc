import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/ui/startup/accounts-config.js';
import {renderRoutes} from '../imports/ui/startup/routes.jsx'

import Aboutpanel from '../imports/ui/components/Aboutpanel.jsx';
import Filterpanel from '../imports/ui/components/Filterpanel.jsx';
Meteor.startup(() => {

	//subscribe to productiontasks
	const handle = Meteor.subscribe('productiontasks', {onReady: function(){
		console.log("Meteor startup Productiontasks collection data ready")
		console.log(handle);
		render(renderRoutes(), document.getElementById('react-root-render-main-application'));
		render(<Aboutpanel />, document.getElementById('render-panel-left-about'));
		render(<Filterpanel />, document.getElementById('render-panel-left-filter'));
	}});

	//render(<AppComponentContainer />, document.getElementById('react-root-render-main-application'));
	
});

