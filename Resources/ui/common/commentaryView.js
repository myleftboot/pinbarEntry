function forexCommentaryView() {

	var forex = require('/forexCommentary');
	var parse = require('/parseCommentary');

	var thePair, theRate = null;

	var mainVw = Ti.UI.createView({layout:'vertical'});

	var title = Ti.UI.createLabel({
		color:'#000'
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

	commentary.addEventListener('return', function(e) {var db = require('/currencydb');
	                                                   db.addComment({pair:    thePair,
	                                                   	              rate:    theRate,
	                                                   	              comment: e.value})
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
	mainVw.add(commentary);
	mainVw.add(latestCommentary);

	// run this when the form opens
	forex.getLast3Comments({success: function(e) {createCommentaryRows(e)}});

	mainVw.addEventListener('currencySelected', function(e) {
		title.text = 'Thoughts on '+e.pair+': '+e.rate;
		thePair = forex.returnThePair(e.pair);
		theRate = e.rate;
		forex.getLast3CommentsOnPair({success: function(e) {createCommentaryRows(e)}});
	});

	return mainVw;
};

module.exports = forexCommentaryView;
