var Cloud = require('Ti.Cloud');
var className = 'forexCommentary';

function returnThePair(pairText) {
	// returns EURUSD when passed EUR to USD which is returned from Yahoo
	return pairText.replace(' to ', '');
};
exports.returnThePair = returnThePair;

//login as the cloud user....
function init(_args) {
	if (!Cloud.sessionId) {
		Cloud.Users.login({
		    login: 'forex',
		    password: 'forex'
		}, function (e) {
		    if (e.success) {
		        _args.success({user : e.users[0]});
		    } else {
		        _args.error({error: e.error});
		    }
		});
	}
};
exports.init = init;

function addCommentary(_args) {
	// create a new currency commentary
	
	Cloud.Objects.create({
	    classname: className,
	    fields: {
	        pair:    _args.pair,
	        rate:    _args.rate,
	        comment: _args.commentary
	    }
	}, function (e) {
	    if (e.success) {
	        _args.success(e.forexCommentary[0]);
	    } else {
		    _args.error({error: e.error});
	    }
	});
}
exports.addCommentary = addCommentary;

// The last three bits of commentary - for the iPad version, on the front screen
function getLast3Comments(_args) {

	Cloud.Objects.query({
	    classname: className,
	    limit:     3,
	    order :    '-created_at'
	}, function (e) {
	    if (e.success) {
	        _args.success(e.forexCommentary);
	    } else {
		    _args.error({error: e.error});
		}
	});
};
exports.getLast3Comments = getLast3Comments;

// The last three bits of commentary for a given pair 
function getLast3CommentsOnPair(_args) {
	
	Cloud.Objects.query({
	    classname: className,
	    limit:     3,
	    order :    -created_at,
	    where :    {pair : _args.pair} 
	}, function (e) {
	    if (e.success) {
	        _args.success(e.forexCommentary);
	    } else {
		    _args.error({error: e.error});
	    }
	});
};
exports.getLast3CommentsOnPair = getLast3CommentsOnPair;
