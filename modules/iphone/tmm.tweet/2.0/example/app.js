// This is a test harness for sweetTweet.
// It shows how to implement the module.
// Copyright 2012 Cope Consultancy Services
// OK its not going to win any prizes for Javascript style, but come on, its only a test script...

var test = require('tmm.tweet');

var defAcct = null;
var piccy = [];

// open a single window
var win = Ti.UI.createWindow({
	title: 'sweetTweet Functions',
	backgroundColor:'black',
	barColor: 'blue'
});

var view = Ti.UI.createView({layout:'vertical', top:40});
var label = Ti.UI.createTextField({backgroundColor:'white',
                                   hintText:'put the tweet text here.',
                                   color:'#336699',
                                   height:40,
                                   top:0,
                                   width:300});
view.add(label);

if (Titanium.Platform.version < 5.0) {Ti.API.error('This is not going to work....You need iOS5 or above')}

var setDefaultAccount = Ti.UI.createButton({
			title:		'Set Account',
			height:		40,
			width:		150,
		});

setDefaultAccount.addEventListener('click', function(e){

		test.getAccount({success:	function(e){
							Ti.API.info('Account Selected = '+e.selectedAccount);
							defAcct = e.selectedAccount
						},
						dismissed: function(e) {alert('User Cancelled')},
                        noAccount: function(obj) { alert('User has no twitter accounts on the device'); },
						vw: view}
			);
});

var listAccounts = Ti.UI.createButton({
			title:		'Account List',
			height:		40,
			width:		150,
		});

listAccounts.addEventListener('click', function(e){

	var accounts=new Array(); 
    test.getAccountsDict({accounts: function(obj) { accounts=obj.accounts;
                                                    for (var i=0; i<accounts.length; i++) {
                                                    	Ti.API.info(i+accounts[i]); 
                                                    }
                                                    }});
});

var photo = Ti.UI.createButton({
			title:		'Add Photo',
			height:		40,
			width:		150,
		});
		
photo.addEventListener('click', function(e){
	Ti.Media.openPhotoGallery
			({
			    success:								function(event) {Ti.API.info('Setting piccy'); piccy = [event.media];},
				mediaTypes:								[Ti.Media.MEDIA_TYPE_PHOTO],
				allowEditing:							true,
			    autohide:								true,
			    animated:								false
			});
});

var tweet = Ti.UI.createButton({
			title:		'Tweet it',
			height:		40,
			width:		150,
		});
tweet.addEventListener('click', function(e){

		test.tweet({ message: label.value,  /* the message to tweet */
                     account:   defAcct, /* the Twitter account to send the tweet from, can be left blank */
                     urls:      [], /* a url to attach to the tweet, optional */
                     image:     piccy, /* a Ti.blob image to attach to the tweet, optional */
                     success:   function(obj) { alert('Tweet successfully sent'); Ti.API.info('Status Code = '+obj.result); },
                     cancel:    function(obj) { alert('User has cancelled tweet'); },
                     error:     function(obj) { alert('Unable to send tweet'); Ti.API.info('Status Code = '+obj.result); },
                     noAccount: function(obj) { alert('User has no twitter accounts on the device'); },
                     vw:        view /* the current view being shown. Used to show the twitter account selection dialog */});
});

var tweetSheet = Ti.UI.createButton({
			title:		'Tweet with Sheet',
			height:		40,
			width:		150,
		});
tweetSheet.addEventListener('click', function(e){

		test.tweetWithSheet({animate: "yes", 
                             success: function() { alert('Tweet successfully sent'); },
                             cancel: function() { alert('User has cancelled tweet'); }
                             }); 
});


var timeline = Ti.UI.createButton({
			title:		'Home Timeline',
			height:		40,
			width:		150,
		});
timeline.addEventListener('click', function(e) {

function showTimeLine(obj) {
  	  var objs = obj.objects;
 	  var timeline = require('timeline');
 	  var tWin = timeline.showTimeline({data: objs});
 	  win.open(tWin);
  };

test.homeTimeline({accountName:         defAcct,
                   count:               "20",
                   since_id:            "0",
                   max_id:              "0",
                   trim_user:           "false",
                   exclude_replies:     "false",
                   contributor_details: "false",
                   include_entities:    "true",
                   success:             function(returnObj) {showTimeLine(returnObj)},
                   error:               function(returnObj) { alert('Hometimeline failed '+returnObj.result); }});
                   });



var fbpost = Ti.UI.createButton({
			title:		'Facebook post',
			height:		40,
			width:		150,
		});
fbpost.addEventListener('click', function(e) {

test.facebookPost({appIdKey:           "your fb app",
                   visibility:         "friends", // by default posts are visible to just you, other valid values are friends and everyone
                   text:               label.value,
                   image:              piccy,
                   success:            function(e) {alert(JSON.stringify(e));},
                   error:              function(e) {alert(JSON.stringify(e));}
             });
});

var fbSheet = Ti.UI.createButton({
			title:		'Facebook sheet',
			height:		40,
			width:		150,
		});
fbSheet.addEventListener('click', function(e) {

test.facebookWithSheet({animate:           'yes',
                        text:              label.value,
                        image:             piccy,
                        success:           function(e) {alert(JSON.stringify(e));},
                        error:             function(e) {alert('error'+JSON.stringify(e));}
                      });
});	


view.add(setDefaultAccount);
view.add(listAccounts);
view.add(photo);
view.add(tweet);
view.add(tweetSheet);
view.add(timeline);
view.add(fbpost);
view.add(fbSheet);
win.add(view);

win.open();