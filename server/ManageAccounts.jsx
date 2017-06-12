import CF from '../imports/ui/classes/CommonFunctions.jsx';
const cf=new CF();

export function deleteLoginAccount(_id){
    // Check the role, it must have the 'Admin' role.
    if( !cf.Role(Meteor.user()).AdminScreen )    return;
    
    // Delete
    Meteor.users.remove({"_id":_id});
}


export function updateLoginAccount(argv){
    // Check the role, it must have the 'Admin' role.
//    if( Meteor.userId()!=argv._id && (!Roles.userIsInRole(Meteor.userId(), 'Admin', Roles.GLOBAL_GROUP)) )    return;
    if( Meteor.userId()!=argv._id && (! cf.Role(Meteor.user()).AdminScreen) )    return;
    
    var ret={};
    
    // _id, username
    if(argv._id==undefined){
        console.log('=================================================');
        console.log('Accounts.createUser(): Pay attention!!! Due to the current specification of Meteor,');
        console.log('Accounts.createUser(): the JavaScript terminates and remaining codes are not run.');
        console.log('Accounts.createUser(): if the specified username exists. If you do not see the');
        console.log('Accounts.createUser(): <<<Succeeded to create the user.>> message later than this');
        console.log('Accounts.createUser(): message, it means the specified username is existing and the');
        console.log('Accounts.createUser(): createUser() function failed and terminated.');
        console.log('=================================================');
        
/*  Error: Accounts.createUser with callback not supported on the server yet.
        if(argv.username!=undefined)  argv._id=Accounts.createUser({username:argv.username},(Err)=>{
            console.log('=================================================');
            console.log('Accounts.createUser(): Failed to create the user.');
            console.log('Accounts.createUser(): '+Err);
            console.log('Accounts.createUser(): Due to the current specification of Meteor,');
            console.log('Accounts.createUser(): the JavaScript terminates and remaining codes are not run.');
            console.log('=================================================');
            
        });
*/        
        
        if(argv.username!=undefined)  argv._id=Accounts.createUser({username:argv.username});
        // if the username exists, the JavaScript terminates and remaining codes are not run.
        
        console.log('Accounts.createUser(): <<<Succeeded to create the user.>>');
    }
    
    // username
    if(argv.username!=undefined)    Accounts.setUsername(argv._id, argv.username);
    if(Meteor.user().username!=argv.username)   ret.username="Error: username: Specified the already used username.";
    
    // password
    if(argv.password!=undefined)    Accounts.setPassword(argv._id, argv.password, {logout:false});
    
    // emails address
    if(argv.emails!=undefined && argv.emails[0]!=undefined && argv.emails[0].address!=undefined){
        // Remove existing email addresses
        var u=Meteor.users.findOne({"_id":argv._id});
        if(u.emails!=undefined){
            u.emails.map(
                (a)=>{
                    Accounts.removeEmail(argv._id, a.address);
                }
            )
        }
        
        // Add email address.
        if(argv._id, argv.emails[0].address.trim()!='') Accounts.addEmail(argv._id, argv.emails[0].address);
    }
    
    // profile
    if(argv.profile!=undefined){
        Meteor.users.update(
            {"_id":argv._id},
            {$set:{"profile":argv.profile}}
        );
    }
    
    // Role
    if(argv.roles!=undefined && argv.roles[Roles.GLOBAL_GROUP]!=undefined && argv.roles[Roles.GLOBAL_GROUP][0]!=undefined){
        Roles.setUserRoles(argv._id, argv.roles[Roles.GLOBAL_GROUP][0], Roles.GLOBAL_GROUP);
    }    
    
    return  ret;
}
