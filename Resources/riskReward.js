
// Risk Reward Calculations
// Darren Cope - (C) Cope Consultancy Services 2013


function getCounter(pair) {
	if (!pair) return null;
    return pair.toUpperCase().slice(-3);
};

function getPip(pair) {

    var cdb = require('/currencydb');
    return cdb.getPipDP({counter: getCounter(pair)});	
};

function convertToCounter(pair) {
    var cdb = require('/currencydb');
    return cdb.getRate({base   : 'GBP'   // should have a settings screen where the defualt account currency is set
		       ,counter: getCounter(pair)});
};

function dumpParams(_args, func) {
	if (func) console.log(func);
	console.log('*** Debug Parameters ***');
	if (_args.risk) {console.log('Risk '+ _args.risk)};
	if (_args.pair) {console.log('Pair '+ _args.pair)};
	if (_args.RR) {console.log('RiskReward '+ _args.RR)};
    if (_args.retracement) {console.log('Retracement '+ _args.retracement)};
    if (_args.top) {console.log('Top '+ _args.top)};
    if (_args.bottom) {console.log('Bottom '+ _args.bottom)};
    if (_args.stopLoss) {console.log('stopLoss '+ _args.stopLoss)};
    if (_args.entryPoint) {console.log('entryPoint '+ _args.entryPoint)};
    console.log('*** Done ***');

};

// Public

/* calculatePointsToStop Arguments
  pair - the currency pair
  stopLoss - the stop loss position
  entryPoint - the entryPoint
*/
function calculatePointsToStop(_args) {
  // ensure mandatory items have values, otherwise do nothing
  var pointsToStop;
  // if this is YEN or GOLD or SILVER then multiply by 100 otherwise 10000
  var pipPos = getPip(_args.pair);
  var divisor = Math.pow(10,pipPos);

  if (_args.pair && _args.stopLoss && _args.entryPoint) {

    try {
// multiply up the entry and stop loss values to get a integer
      var stopLoss = parseFloat(_args.stopLoss) * divisor;
      var entryPoint = parseFloat(_args.entryPoint) * divisor;
// now work out the number of pips
      pointsToStop = parseInt(Math.abs(stopLoss - entryPoint));
      console.log('Points to stop'+pointsToStop);
      console.log('Entry point'+entryPoint);

    } catch (e) {console.log(e)};
  }
  return pointsToStop;
};
exports.calculatePointsToStop = calculatePointsToStop;

/* calculatePositionSize Arguments
  pair - the currency pair
  risk - the risk amount
  stopLoss - the stop loss position
  entryPoint - the entryPoint
*/
function calculatePositionSize(_args) {
	dumpParams(_args, 'calculatePositionSize');
  // ensure mandatory items have values, otherwise do nothing
  var positionSize = 0;
  // if this is YEN or GOLD or SILVER then multiply by 100 otherwise 10000
  var pipPos = getPip(_args.pair);
  var divisor = Math.pow(10,pipPos);

  if (_args.pair && _args.risk && _args.stopLoss && _args.entryPoint) {

    try {
// convert the position size to our counter currency
      var counterRisk = parseFloat(_args.risk) * convertToCounter(_args.pair);
// now work out the number of pips
      var pointsToStop = calculatePointsToStop(_args)
      // now work out position size
      var posSize = (counterRisk / pointsToStop) * divisor;
      console.log(posSize);
      positionSize = (posSize / 100000).toFixed(2);

    } catch (e) {console.log(e)};
  }
  return positionSize;
}
exports.calculatePositionSize = calculatePositionSize;

/* calculateNxRiskReward Arguments
  pair - the currency pair
  RR   - the riskreward multiplier (2,3 or more!)
  stopLoss - the stop loss
  entryPoint - the entryPoint
*/
function calculateNxRiskReward(_args) {
	dumpParams(_args, 'calculateNxRiskReward');
  // ensure mandatory items have values, otherwise do nothing
  var riskReward = 0;
  // if this is YEN or GOLD or SILVER then multiply by 100 otherwise 10000
  var pipPos = getPip(_args.pair);
  var divisor = Math.pow(10,pipPos);

  if (_args.pair && _args.RR && _args.stopLoss && _args.entryPoint) {

    try {
// multiply up the entry and stop loss values to get a integer
      var stopLoss = parseFloat(_args.stopLoss) * divisor;
      var entryPoint = parseFloat(_args.entryPoint) * divisor;
      console.log('S'+stopLoss+'E'+entryPoint);
// now work out the number of pips
      var pointsToStop = parseInt(Math.abs(stopLoss - entryPoint));
      console.log('Points to stop'+pointsToStop);
      console.log('Entry point'+entryPoint);

      if (stopLoss > entryPoint) {
	riskReward = ((entryPoint - (pointsToStop * _args.RR)) / divisor).toFixed(pipPos);
      } else {
	riskReward = ((entryPoint + (pointsToStop * _args.RR)) / divisor).toFixed(pipPos);
      }

    } catch (e) {console.log(e)};
  }
  return riskReward;
}
exports.calculateNxRiskReward = calculateNxRiskReward;

function calculateRiskAmount(_args) {
  if (_args.percentRisk && _args.accountSize) {

    return (parseFloat(accountSize) * (parseFloat(percentRisk) / 100)).toFixed(2);
  }
};
exports.calculateRiskAmount = calculateRiskAmount;

/* determineRetracement Arguments
  pair          - the currency pair
  retracement   - the percentage retracement
  top           - the top marker
  bottom        - the bottom marker
*/
function determineRetracement(_args) {

	dumpParams(_args, 'determineRetracement');
  var retracement = 0;
  // if this is YEN or GOLD or SILVER then multiply by 100 otherwise 10000
  var pipPos = getPip(_args.pair);
  var divisor = Math.pow(10,pipPos);
  
  if (_args.retracement == 0) return (_args.bull) ? _args.top : _args.bottom;
  if (_args.pair && _args.top && _args.bottom) {
  
    try {
// multiply up the entry and stop loss values to get a integer
      var top = parseFloat(_args.top) * divisor;
      var bottom = parseFloat(_args.bottom) * divisor;
      if (bottom > top) {
      	
      	top = bottom;
      	bottom = parseFloat(_args.top) * divisor;
      }

// if _args.retracement > 1 then it must be a percentage, otherwise its absolute
      var percentageR = parseFloat(_args.retracement) / 100;
      if (_args.bull) retracement = ((top - ((top - bottom) * percentageR)) / divisor).toFixed(pipPos);
      else retracement = ((bottom + ((top - bottom) * percentageR)) / divisor).toFixed(pipPos);

    } catch (e) {console.log(e)};
  }
  return retracement;
};
exports.determineRetracement = determineRetracement;
