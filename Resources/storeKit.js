// All source code Copyright 2013 Cope Consultancy Services
 
 
function askToBuy(_args) {
	// show alert box asking to user if they wish to purchase
	var alertDialogBox = 	Ti.UI.createAlertDialog
	({
	    title: 	_args.title,
	    message:   'Would you like to buy '+_args.title+' which costs '+_args.formattedPrice,
	    cancel:	1,
	    buttonNames: ['Confirm', 'Cancel'],
	});
	alertDialogBox.show();

	alertDialogBox.addEventListener('click', function(e)
	{
		if (Ti.Platform.osname === 'android' && a.buttonNames === null) {
			null;
		} else {
			if (e.index == 0) {
				// user wishes to buy
				purchaseProduct({PRODUCT: 		_args
						,SUCCESS:		function(e) {alert('Product purchased, show content')}
						});
			};
		}
	});
};
exports.askToBuy = askToBuy;

function requestProduct(_args) {
	var Storekit = require('ti.storekit');
	Storekit.requestProducts([_args.PRODUCT], function (e) {

		if (!e.success) {
			_args.ERROR({MSG:'Error'});
		}
		else if (e.invalid) {
			_args.ERROR({MSG:'Invalid'});
		}
		else {
			_args.SUCCESS({PRODUCT:	e.products[0]});
		}
	});
};
exports.requestProduct = requestProduct;

function purchaseProduct(_args) {
	var Storekit = require('ti.storekit');
	Storekit.purchase(_args.PRODUCT, function (e) {

		switch (e.state) {
			case Storekit.FAILED:
				_args.ERROR({CODE:Storekit.FAILED});
			case Storekit.PURCHASED:
				_args.SUCCESS({CODE:Storekit.PURCHASED});
			case Storekit.RESTORED:
				_args.SUCCESS({CODE:Storekit.RESTORED});
		}
	});
};
exports.purchaseProduct = purchaseProduct;

/* restore any purchases that have not been remembered */
function restorePurchases(_args) {
	var Storekit = require('ti.storekit');
	Storekit.restoreCompletedTransactions();

	Storekit.addEventListener('restoredCompletedTransactions', function (e) {
		if (e.error) {
			_args.ERROR({ERRM: e.error});
		}
		else if (e.transactions == null || e.transactions.length == 0) {
			alert('There were no purchases to restore!');
		}
		else {
			_args.SUCCESS({PRODUCTS:e.transactions});
		}
	});
};
exports.restorePurchases = restorePurchases;

function canMakePayments() {
	var Storekit = require('ti.storekit');
	return (Storekit.canMakePayments);

};
exports.canMakePayments = canMakePayments;