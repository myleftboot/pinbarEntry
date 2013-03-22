function ApplicationWindow() {
	//declare module dependencies
	var CurrencyView = require('/ui/common/currencyView'),
	    CommentaryView = require('/ui/common/commentaryView');
        
	//create object instance
	var self = Ti.UI.createWindow({
		title:'Currencies',
		exitOnClose:true,
		navBarHidden:false,
		backgroundColor:'#ffffff',
		layout: 'vertical'
	});

	//construct UI
	var currencyView = new CurrencyView();
	    
	self.add(currencyView);

	//add behavior for master view
	currencyView.addEventListener('currencySelected', function(e) {
		//create pinbar view container
		var commentaryView = new CommentaryView();
		var commentaryWindow = Ti.UI.createWindow({
			title:'Add Comments',
			navBarHidden:false,
			backgroundColor:'#ffffff'
		});
		commentaryWindow.add(commentaryView);
		commentaryView.fireEvent('currencySelected',e);
		commentaryWindow.open();
	});
	
	currencyView.addEventListener('currencyRefresh', function(e) {
		currencyView.fireEvent('RefreshCurrenices', e);
	});
	
	var cc = require('currencycommon');
    cc.refreshCurrencies({view: currencyView});
	return self;
};

module.exports = ApplicationWindow;
