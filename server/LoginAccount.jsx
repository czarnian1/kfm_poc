/*
 * 
 */

export function updateLoginAccount(argv){
    console.log("updateLoginAccount updateLoginAccount updateLoginAccount");
    console.log(argv);
    
    var ret={};
    
    // username
    if(argv.username!=undefined)    Accounts.setUsername(argv._id, argv.username);
    if(Meteor.user().username!=argv.username)   ret.username="Error: username: Specified the already used username.";
    
    // password
    if(argv.password!=undefined)    Accounts.setPassword(argv._id, argv.password);

    // emails address
    if(argv.emails!=undefined && argv.emails[0].address!=undefined){
        Meteor.users.findOne({"_id":argv._id}).emails.map(
            (a)=>{
                Accounts.removeEmail(argv._id, a.address);
            }
        );
        Accounts.addEmail(argv._id, argv.emails[0].address);
    }
    if(argv.profile.EmailNotification && argv.emails==undefined)    ret.emails="Email address is required.";

    // profile
    Meteor.users.update(
        {"_id":argv._id},
        {$set:{"profile":argv.profile}}
    );
    
    return  ret;
}
