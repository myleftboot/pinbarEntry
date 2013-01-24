//Currency Table view
function CurrenciesView() {
  //create vertical layout for the tableview
	var vertLayout = Ti.UI.createView({layout:'vertical'});
        
  var currencyCommon = require('common/currencycommon');
	var stockList = Ti.UI.createTableView({data: currencyCommon.populateTableWithPairs()});
	
	//stockList.addEventListener('click', function(e) {showPinBar(e)});
	
	vertLayout.add(stockList);

	//add behavior
	stockList.addEventListener('click', function(e) {
		vertLayout.fireEvent('currencySelected', {
			pair:e.rowData.pair,
			rate:e.rowData.rate
		});
	});

	return vertLayout;
};
module.exports = CurrenciesView;
