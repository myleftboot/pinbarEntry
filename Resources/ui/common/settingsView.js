//Settings view
function SettingsView() {
  //create vertical layout for the tableview
	var vertLayout = Ti.UI.createView({layout:'vertical'});
        
	function getKeyboardToolbar() {
		if (!(Ti.Platform.name == 'iPhone OS')) return null;
		
		var done = Titanium.UI.createButton({
		    title: 'Done',
		    style: Titanium.UI.iPhone.SystemButtonStyle.DONE,
		});
        done.addEventListener('click', function(e) {iAccountSize.blur(); iPercentageRisk.blur();});
		var toolbar = Titanium.UI.iOS.createToolbar({
		    items:[done],
		    top:0,
		    borderTop:false,
		    borderBottom:true
		}); 

		return toolbar;
	};
	
    var cc = require('/currencycommon');
    
	var iAccountSize     = Ti.UI.createTextField({value: cc.getAccountSize(), keyboardType : Ti.UI.KEYBOARD_NUMBER_PAD, keyboardToolbar: getKeyboardToolbar(), right:10, width:'25%', textAlign:Ti.UI.TEXT_ALIGNMENT_RIGHT});
	var iPercentageRisk  = Ti.UI.createTextField({value: cc.getPercentageRisk(), keyboardType : Ti.UI.KEYBOARD_NUMBER_PAD, keyboardToolbar: getKeyboardToolbar(), right:10, width:'25%', textAlign:Ti.UI.TEXT_ALIGNMENT_RIGHT});
    var iRiskReward  = Ti.UI.createSlider({
                                      top: 50,
                                      min: 1,
                                      max: 6,
                                      width: '50%',
                                      value: cc.getRiskReward()
                                  });

    var lRiskReward = Ti.UI.createLabel({
                                      text: iRiskReward.value,
                                      right: 10,
                                      width:'25%',
                                      textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
                                      });
    iAccountSize.addEventListener('return', function(e) {Ti.App.Properties.setDouble('accountSize', e.value)});
    iPercentageRisk.addEventListener('return', function(e) {Ti.App.Properties.setDouble('percentRisk', e.value)});
    iRiskReward.addEventListener('change', function(e) {
    	lRiskReward.text = e.value.toFixed(0);
    	Ti.App.Properties.setInt('riskReward', e.value)
    });

	function createTableRow(_args) {
	  var row = Ti.UI.createTableViewRow({ title: _args.title });
	  if (_args.textField) { row.add(_args.textField)};
	  if (_args.label)     {row.add(_args.label)};
          if (_args.slider)    {row.add(_args.slider)};
          if (_args.check)     {row.hasCheck = true};
      if (_args.button) {row.add(_args.button)};
	  return row
	};
	function androidTweet() {

 		var intent = Ti.Android.createIntent({
	        action: Ti.Android.ACTION_SEND,
	        type: "text/plain"
	    });
	 
	    intent.putExtra(Ti.Android.EXTRA_TEXT, 'Commentary');
	    intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
	    Ti.Android.currentActivity.startActivity(intent);
	}
	
    function tweetScreenshot() {
    	Ti.Media.takeScreenshot(function(e) {
	    	var tmm = require('tmm.tweet');
			tmm.tweet({
			    message:   "Commentary",
			    image:     [e.media],
			    account:   "@CopeDev", // the Twitter account to send the tweet from, can be left blank
			    success:   function(obj) { Ti.API.info('Status Code = '+obj.result); },
			    cancel:    function(obj) { alert('User has cancelled tweet'); },
			    error:     function(obj) { Ti.API.info('Status Code = '+obj.result); },
			    noAccount: function(obj) { alert('User has no twitter accounts on the device'); },
			});
		});
    };
    
    function facebookScreenshot() {
    	Ti.Media.takeScreenshot(function(e) {
	    	var tmm = require('tmm.tweet');
	    	tmm.facebookPost({
	    		appIdKey:   "469401486460863",
	    		visibility: "me",
	    		text:       "my forex app",
	    		image:      [e.media],
	    		success:    function(obj) { Ti.API.info('Status Code = '+JSON.stringify(obj)); },
	    		error:      function(obj) { Ti.API.info('Status Code = '+JSON.stringify(obj)); }
	    		});
		});
    };
	var account = Ti.UI.createTableViewSection({ headerTitle: 'Account' });
	account.add(createTableRow({title: 'Account Balance',        textField : iAccountSize}));
	
	var trade = Ti.UI.createTableViewSection({ headerTitle: 'Trade' });
	trade.add(createTableRow({title: 'Risk Percentage',        textField : iPercentageRisk}));
	trade.add(createTableRow({title: 'Risk:Reward',            slider : iRiskReward, label: lRiskReward}));
	
	var tweet = Ti.UI.createTableViewSection({ headerTitle: 'Tweet' });
	var tweetButton = Ti.UI.createButton({title: 'Tweet Screen', right:0});

	tweetButton.addEventListener('click', function(e) {
		if (Ti.Platform.osname == 'android') {
			androidTweet();
		} else {
			tweetScreenshot();
		}
	});

	tweet.add(createTableRow({ button: tweetButton}));
	
	var facebook = Ti.UI.createTableViewSection({ headerTitle: 'Facebook' });
	var facebookButton = Ti.UI.createButton({title: 'Facebook', right:0});

	facebookButton.addEventListener('click', function(e) {
		facebookScreenshot();
	});

	facebook.add(createTableRow({ button: facebookButton}));
	
	var settings= Ti.UI.createTableView({
	  data: [account, trade, tweet, facebook]
	});
	vertLayout.add(settings);
    
	return vertLayout;
};
module.exports = SettingsView;
