// All source code Copyright 2013 Cope Consultancy Services. All rights reserved
// Currency database operations


// need to have last rate and selected added to table
var dbName = 'currencies';

function createCurrencyTable() {
	
	try {
		Ti.API.warn('Installing currency table');
		if ( Ti.Platform.osname == 'android' ) {
	       var db = Ti.Database.install('/db/currencies.sqlite', dbName);
	   }
	    else {
	    	var db = Ti.Database.install('/db/currencies.sqlite', dbName);
	    }
	Ti.API.warn('Installed');
	
	} catch (e) {
		// create it manually
		Ti.API.info('manually creating');
		var db = Ti.Database.install(dbName, dbName);
		db.execute('CREATE TABLE currencies (base varchar2(5) not null,counter  varchar2(5) not null,nickname varchar2(30),type varchar2(10) not null,pipdp number,lastrate number,last_updated integer);');
	
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("EUR","USD","Fiber","Major","5");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("USD","JPY","Yen","Major","3");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("GBP","USD","Cable","Major","5");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("AUD","USD","Aussie","Major","5");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("USD","CHF","Swiss","Major","5");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("USD","CAD","Loonie","Major","5");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("GBP","JPY","","Cross","3");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("EUR","GBP","","Cross","5");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("EUR","JPY","","Cross","3");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("NZD","USD","Kiwi","Major","5");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("AUD","JPY","","Cross","3");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("XAG","USD","","Cross","5");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("XAU","USD","","Cross","5");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("NZD","JPY","","Cross","3");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("CHF","JPY","","Cross","3");');
		db.execute('INSERT INTO currencies (base, counter, nickname, type, pipdp) VALUES ("GBP","CHF","","Cross","5");');
	}
	
	return db;
}

function openDB() {
	
	var dbPath;
	var dbFile;
	if ( Ti.Platform.osname == 'android' ) {
	    dbPath = 'file:///data/data/' + Ti.App.getID() + '/databases/';
	    dbFile = Ti.Filesystem.getFile( dbPath + dbName ); 
	    if (dbFile.exists()) {Ti.API.info('Opening DB');return Ti.Database.open(dbFile);}
		else {return createCurrencyTable();}
	}
	else {
		return Ti.Database.install('/db/currencies.sqlite', dbName);
	}
}
function makePair(_args) {
	return _args.replace(' to ', '');
}

function selectPairs(_args) {
	Ti.API.warn('SelectPairs');
    var db = openDB();
	var sql = 'SELECT base||counter pair, lastrate, pipdp FROM currencies';
	try {
		var data = db.execute(sql);
	}  catch (e) {Ti.API.info('Select Pair issue'+e); createCurrencyTable(db);}


	var pairs = [{}];
	while (data.isValidRow()) {
		if (data.fieldByName('pair')){
		  pairs.push({pair:      data.fieldByName('pair'),
		              lastRate:  parseFloat(data.fieldByName('lastrate')).toFixed(data.fieldByName('pipdp'))
		            });
	    }
		data.next();
	}

	data.close();
	db.close()

	return pairs;
}
exports.selectPairs = selectPairs;

function getRate(_args) {
	//TODO should add a displayed tag to the database
	console.log('Getting rate for '+_args.base+_args.counter);
    var base      = _args.base;
    var counter   = _args.counter;
    
    var retval = 0;
    if (base && counter) {
      var db = openDB();
	var sql = 'SELECT lastrate FROM currencies WHERE base||counter = "'+base+counter+'";';
	try {
		var data = db.execute(sql);
	} catch (e) {console.log(e); return;}
	if (data.isValidRow()) {
		var retval = data.fieldByName('lastrate');
	}

	data.close();
	db.close();
	}
    return retval;
}
exports.getRate = getRate;

function getPipDP(_args) {
    var counter = makePair(_args.counter);
    var retval  = 0;
    var db = openDB();
	var sql = 'SELECT pipdp FROM currencies WHERE counter = "'+counter+'";';
	try {
		var data = db.execute(sql);
	}  catch (e) {console.log(e)}
	if (data.isValidRow()) {
		var retval = data.fieldByName('pipdp');
	}

	data.close();
	db.close();

	return retval;
}
exports.getPipDP = getPipDP;

function updateRate(_args) {
	var pair = makePair(_args.pair);
	var db = openDB();
    if (_args.rate && _args.pair) {
	var sql = 'UPDATE currencies SET lastrate = "'+_args.rate+'", last_updated = DATE("now")  WHERE base||counter = "'+pair+'";';
	try {
		db.execute(sql);
	} catch (e) {console.log(e)}
	db.close();
    }
}
exports.updateRate = updateRate;
