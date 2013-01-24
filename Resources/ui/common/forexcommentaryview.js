function forexCommentaryView() {
  var self = Ti.UI.createWindow({title: 'Forex Commentary'});
	var forex = require('/forexCommentary');
	var parse = require('/parseCommentary');
	forex.init();
	var thePair, theRate = null;

	var mainVw = Ti.UI.createView({layout:'vertical'});

	var title = Ti.UI.createLabel({
		color:'#000'
	});

	var riskReward = Ti.UI.createButton({title: 'Calculate Risk Reward'});
	riskReward.addEventListener('click', function(e) {
		var RiskVw = require('/riskReward');
		var riskVw = new RiskVw();

		riskVw.fireEvent('calculateRisk', {
			pair:thePair,
			rate:theRate
		});

		Forex.navGroup.open(riskVw);
	});

	var pinbar = Ti.UI.createButton({title: 'Pin Bar Entry'});
	pinbar.addEventListener('click', function(e) {
		var PBVw = require('view/pinbarentry');
		var pbVw = new PBVw();

		pbVw.fireEvent('popPinBar', {
			pair:thePair,
			risk:1,
			rate: theRate
		});

		Forex.navGroup.open(pbVw);
	});

	var commentary = Ti.UI.createTextArea({
		borderWidth:2,
		borderColour:'blue',
		borderRadius:5,
	  keyboardType: Ti.UI.KEYBOARD_ASCII,
	  returnKeyType: Ti.UI.RETURNKEY_DONE,
	  textAlign: 'left',
	  hintText: 'Enter your thoughts on '+thePair,
	  width: '90%',
	  height : 150
	});

	commentary.addEventListener('return', function(e) {//forex.addCommentary({
		                                               //      pair:       thePair, 
		                                               //      rate:       theRate, 
		                                               //      commentary: e.value});
		                                               parse.addCommentary({
		                                                     pair:       thePair, 
		                                                     rate:       theRate, 
		                                                     commentary: e.value});
		                                             });
	// Additions for forex commentary

	function createCommentaryRows(_args) {
		var tabRows = [];
		var moment = require('moment');

		for (var i in _args) {

			var tableRow = Ti.UI.createTableViewRow({
				height: 70,
				className: 'CommentaryRow',
			});
			/* its aloways a good idea to give you tableview rows a class, especially if the format is common. It helps Titanium to optimise the display */
			var layout = Ti.UI.createView({layout:'horizontal'});

			var leftPanel = Ti.UI.createView({
				layout: 'vertical',
				width: '30%'
			});


			var pair = Ti.UI.createLabel({
				text: _args[i].pair,
				color: '#000',
				font: {
					fontSize: 16
				},
			});

			var rate = Ti.UI.createLabel({
				text:  _args[i].rate,
				color: 'black',
				height: 20,
				font: {
					fontSize: 16
				},
			});

			var created = moment(_args[i].created_at);

			var when = Ti.UI.createLabel({
				text:  created.fromNow(),
				color: 'black',
				height: 20,
				font: {
					fontSize: 14
				},
			});
			var comments = Ti.UI.createLabel({
				text:  _args[i].comment,
				color: 'black',
				height: Ti.UI.FILL,
				width: Ti.UI.FILL,
				font: {
					fontSize: 12
				},
			});

			//layout the left panel
			leftPanel.add(pair);
			leftPanel.add(rate);
			leftPanel.add(when);
			// layout the row
			layout.add(leftPanel);
			layout.add(comments);

			tableRow.add(layout);

			tabRows.push(tableRow);
		}
		latestCommentary.setData(tabRows);
	};

	var latestCommentary = Ti.UI.createTableView({});


	mainVw.add(title);
	mainVw.add(riskReward);
	mainVw.add(pinbar);
	mainVw.add(commentary);
	mainVw.add(latestCommentary);

	// run this when the form opens
	forex.getLast3Comments({success: function(e) {createCommentaryRows(e)}});

	mainVw.addEventListener('currencySelected', function(e) {
		title.text = 'Thoughts on '+e.pair+': '+e.rate;
		thePair = forex.returnThePair(e.pair);
		theRate = e.rate;
	});

	return mainVw;
};

module.exports = forexCommentaryView;
