function returnThePair(pairText) {
	// returns EURUSD when passed EUR to USD which is returned from Yahoo
	return pairText.replace(' to ', '');
};
exports.returnThePair = returnThePair;

function addCommentary(_args) {
	// create a new currency commentary
	
	var db = require("currencydb");
	db.addComment({pair:    _args.pair,
		           rate:    _args.rate,
		           comment: _args.commentary});
}
exports.addCommentary = addCommentary;

function getLast3Comments(_args) {
	
	var db = require('currencydb');
	_args.success(db.getCommentary({pair: null}));
};
exports.getLast3Comments = getLast3Comments;

// The last three bits of commentary for a given pair 
function getLast3CommentsOnPair(_args) {
	
	var db = require('currencydb');
	_args.success(db.getCommentary({pair: _args.pair}));
};
exports.getLast3CommentsOnPair = getLast3CommentsOnPair;
