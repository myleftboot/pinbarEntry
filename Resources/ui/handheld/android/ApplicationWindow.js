function ApplicationWindow() {
	//declare module dependencies
	var CurrencyView = require('ui/common/currencyView'),
	    PinBarView = require('ui/common/pinbarView'),
	    CommentaryView = require('ui/common/commentaryView'),
        SettingsView = require('ui/common/settingsView');
        
	//create object instance
	var self = Ti.UI.createWindow({
		title:'Currencies',
		exitOnClose:true,
		navBarHidden:false,
		backgroundColor:'#ffffff'
	});
	
	function addMenu(win) {
		var activity = self.activity;
	
		activity.onCreateOptionsMenu = function(e){
	
	 		var firstItem = e.menu.add({ title: 'Settings' });
			firstItem.addEventListener("click", function(e) {self.add(settingsView)});
		};
	};
	//construct UI
	var currencyView = new CurrencyView(),
	    settingsView = new SettingsView();
	    
	self.add(currencyView);
	//self.add(addMenu);

	//add behavior for master view
	currencyView.addEventListener('currencySelected', function(e) {
		//create pinbar view container
		var pinBarView = new PinBarView();
		var pinBarWindow = Ti.UI.createWindow({
			title:'Pin Bar Entry',
			navBarHidden:false,
			backgroundColor:'#ffffff'
		});
		pinBarWindow.add(pinBarView);
		pinBarView.fireEvent('currencySelected',e);
		pinBarWindow.open();
	});
	
	var cc = require('currencycommon');
    cc.refreshCurrencies({view: currencyView});
	return self;
};

module.exports = ApplicationWindow;
