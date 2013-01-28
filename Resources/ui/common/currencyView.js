//Currency Table view
function CurrenciesView() {
  //create vertical layout for the tableview
	var vertLayout = Ti.UI.createView({layout:'vertical'});
        
  var currencyCommon = require('/currencycommon');
	var stockList = Ti.UI.createTableView({data: currencyCommon.populateTableWithPairs()});
	
	vertLayout.add(stockList);

	//add behavior
	stockList.addEventListener('click', function(e) {

		vertLayout.fireEvent('currencySelected', {
			pair:e.rowData.pair,
			rate:e.rowData.rate
		});
	});
    
    vertLayout.addEventListener('RefreshCurrenices', function(e) {
    	stockList.setData(e.data);
    });
    
	return vertLayout;
};
module.exports = CurrenciesView;
