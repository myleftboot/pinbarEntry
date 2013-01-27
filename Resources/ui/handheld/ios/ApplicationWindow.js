function ApplicationWindow() {
	//declare module dependencies
	var CurrencyView = require('ui/common/currencyView'),
	    PinBarView = require('ui/common/pinbarView');
	    CommentaryView = require('ui/common/commentaryView');
		
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
	masterContainerWindow.add(currencyView);
	
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
