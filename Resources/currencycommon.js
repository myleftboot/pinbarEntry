function createRow(_args) {
                var tableRow = Ti.UI.createTableViewRow({
			height: 40,
			className: 'RSSRow',
			hasDetail: true,
			pair: _args.pair,
			rate: _args.rate
		});
		var layout = Ti.UI.createView({});

		var pair = Ti.UI.createLabel({
			text: _args.pair,
			color: '#000',
			height: 50,
			font: {
				fontSize: 16
			},
			left: 20
		});

		var value = Ti.UI.createLabel({
			text:  _args.rate,
			color: 'blue',
			height: 50,
			font: {
				fontSize: 16
			},
			right: 20
		});
		layout.add(pair);
		layout.add(value);

		tableRow.add(layout);
		
		return tableRow;
};


function populateTableWithPairs() {
	var tabRows = [];
	
	var db = require('currencydb');
	var pairs = db.selectPairs()
	for (var dbVal in pairs) {

		tabRows.push(createRow({pair: pairs[dbVal].pair
		                       ,rate: pairs[dbVal].lastRate}));
	}
	return tabRows;
}
exports.populateTableWithPairs = populateTableWithPairs;

function fetchValues(_args) {
	// returns a list of prices from an array of stocks

	if (_args.pairings && _args.pairings.length > 0) {
		var currencies = new String;
		for (i=0; i< _args.pairings.length; i++) {
			(typeof(_args.pairings[i].pair) == "undefined")? null : currencies += ',"'+_args.pairings[i].pair+'"';
		}
		// lose the first character ','
		currencies = currencies.substr(1);
		var theYql = 'SELECT * from yahoo.finance.xchange WHERE pair IN (' + currencies + ')';

		// send the query off to yahoo
		Ti.Yahoo.yql(theYql, function(e) {
			Ti.API.info('Returned from YQL with'+JSON.stringify(e));
			updateCurrencies({JSON: e.data, view: _args.view});
		});
	}
};

function updateCurrencies(_args) {

	// we need to make single objects returned into an array
	if (Ti.Platform.osname == 'iPhone OS') {
		try { var rates = (_args.JSON.rate instanceof Array) ? _args.JSON.rate : [_args.JSON.rate];
		} catch (e) {
			return;
		}
	} else var rates = _args.JSON.rate;
	
	var db = require('/currencydb');
	for (var i in rates) {
		db.updateRate({pair   : rates[i].Name
		              ,rate   : rates[i].Rate});
	}
	_args.view.fireEvent('currencyRefresh', {data:populateTableWithPairs()});

};

function refreshCurrencies(_args) {
	
	var db = require('/currencydb');
	fetchValues({pairings: db.selectPairs(), view: _args.view});
};
exports.refreshCurrencies = refreshCurrencies;

function getAccountSize() {
	return Ti.App.Properties.getDouble('accountSize', 500);
}
exports.getAccountSize = getAccountSize;

function getPercentageRisk() {
	return Ti.App.Properties.getDouble('percentRisk', 1);
}
exports.getPercentageRisk = getPercentageRisk;

function getRiskReward() {
	return Ti.App.Properties.getInt('riskReward', 2);
}
exports.getRiskReward = getRiskReward;

function getTradeRisk() {
	return getAccountSize() * (getPercentageRisk() / 100);
}
exports.getTradeRisk = getTradeRisk;