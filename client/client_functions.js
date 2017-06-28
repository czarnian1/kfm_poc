import {Router, Route, browserHistory, IndexRoute} from 'react-router'

//console.log(BrowserDetect.browser);
console.log(navigator.userAgent);

Tracker.autorun(function(c) {
	var userId = Meteor.userId();
	if (c.firstRun)
		return;
	if (userId) {
		console.log(" redirecting to dashboard");
		//redirect to dashboard
		browserHistory.push('/Main');
	} else
	{
		/* Check if Samsung large format built in browser todo write regex based on userAgent string
 		 * http://developer.samsung.com/technical-doc/view.do?v=T000000203
		 * Samsung Internet User-Agent String Format
		 * [Samsung Internet] Mar 21, 2016
 		 * Samsung Internet User-Agent String Format
 		 * Mozilla/$(MOZILA_VER) ($(DEVICE_TYPE); $(OS); $(PLATFORM) $(PLATFORM_VER);
 		 * SAMSUNG $(MODEL_NAME) Build/$(BUILD_TAG)) AppleWebKit/$(APPLEWEBKIT_VER)
 		 * (KHTML, like Gecko) $(APP_NAME)/$(APP_VER) (Chrome/$(CHROME_VER))
 		 * $(UX RECOMMEND) Safari/$(SAFARI_VER)
 		 * */
		if(BrowserDetect.browser == "SamsungBrowser/Version") {
                        //login a low level RO user here then....
			let username = "samsung";
        		let password = "s1ms5ng";
        		Meteor.loginWithPassword(username, password, (err) => {
            			if(err){
                			this.setState({
                   		 		error: err.reason
                			});
            			} else
				{
                			browserHistory.push('/Screen');
            			}
			});
		} else
		{
			//redirect to login
			console.log(" redirecting to login");
			browserHistory.push('/Login');
		}
	}
	console.log(userId ? "login" : "logout");
});
