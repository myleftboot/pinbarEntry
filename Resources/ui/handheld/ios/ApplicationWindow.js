function ApplicationWindow() {
	//declare module dependencies
	var CurrencyView = require('ui/common/currencyView'),
	    PinBarView = require('ui/common/pinbarView');
	    CommentaryView = require('ui/common/commentaryView');
	    
	var ad = require("ti.admob");
	
	var adView = ad.createView({
	    publisherId:"a1511137111eee3",
	    testing:true, 
	    bottom: 0, 
	    height: 50,
	    width: Ti.Platform.displayCaps.platformWidth
    }); 
	//create object instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff'
	});

	//construct UI
	var currencyView = new CurrencyView(),
            pinBarView = new PinBarView();
            commentaryView = new CommentaryView();

		
	//create master view container
	var masterContainerWindow = Ti.UI.createWindow({
		title:'Currencies'
	});
	currencyView.top = 0;
	currencyView.bottom = 50;
	
	
	masterContainerWindow.add(currencyView);
	masterContainerWindow.add(adView);

	//create detail view container
	var pinBarWindow = Ti.UI.createWindow({
		title:'Pin Bar Entry'
	});
	pinBarWindow.add(pinBarView);
	
	//create iOS specific NavGroup UI
	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window:masterContainerWindow
	});
	self.add(navGroup);
	
	//add behavior for master view
	currencyView.addEventListener('currencySelected', function(e) {
		pinBarView.fireEvent('currencySelected',e);
		commentaryView.fireEvent('currencySelected', e);
		navGroup.open(pinBarWindow);
	});
	currencyView.addEventListener('currencyRefresh', function(e) {
		currencyView.fireEvent('RefreshCurrenices', e);
	});
	
	var cc = require('currencycommon');
    cc.refreshCurrencies({view: currencyView});

	return self;
};

module.exports = ApplicationWindow;
