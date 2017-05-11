import { Accounts } from 'meteor/accounts-base';

/*
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL',
});
*/

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL',
	extraSignupFields: [
		{
			fieldName: 'EmailNotification',
			fieldLabel: 'Email notification',
			inputType: 'checkbox',
			visible: true,
			saveToProfile: true
		},
        {
			fieldName: 'FilterStartId',
			fieldLabel: 'Filter: Start ID number',
			inputType: 'text',
			visible: true,
			saveToProfile: true
        },
        {
			fieldName: 'FilterEndId',
			fieldLabel: 'Filter: End ID number',
			inputType: 'text',
			visible: true,
			saveToProfile: true
        }
    ]
});