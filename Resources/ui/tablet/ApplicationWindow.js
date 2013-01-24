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

	currencyView.borderColor = '#000';
	currencyView.borderWidth = 1;
	// set the height of the top item on the main panel
	pinBarView.height = '60%';
	
	//create master view container
	var masterContainer = Ti.UI.createView({
		top:0,
		bottom:0,
		left:0,
		width:240
	});
	masterContainer.add(currencyView);
	self.add(masterContainer);

	//create detail view container
	var detailContainer = Ti.UI.createView({
		top:0,
		bottom:0,
		right:0,
		left:240,
		layout: "vertical"
	});
	detailContainer.add(pinBarView);
	detailContainer.add(commentaryView);
	self.add(detailContainer);

	//add behavior for master view
	currencyView.addEventListener('currencySelected', function(e) {
		pinBarView.fireEvent('currencySelected',e);
		commentaryView.fireEvent('currencySelected', e);
	});
	currencyView.addEventListener('currencyRefresh', function(e) {
		currencyView.fireEvent('RefreshCurrenices', e);
	});
	
	var cc = require('currencycommon');
    cc.refreshCurrencies({view: currencyView});
	return self;
};
module.exports = ApplicationWindow;