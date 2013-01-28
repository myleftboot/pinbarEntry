function pinBarView() {
  var pinBar = Ti.UI.createView();

        // PAIR
        // Risk
        var pair, risk = 0, bull = true;
        
        var vwBorderWidth = 1;
        var vwBorderColor = '#000';
        var pb = {BEARSL:  '5%',
                  BULLSL:  '95%',
                  PBTOP:   '10%',
                  BEARTOP: '75%',
                  BULLTOP: '15%',
                  PBHGT:   '80%',
                  BULLBODY:'#FFF',
                  BEARBODY:'#000',
                  LINECOL: '#000',
                  SLCOL:   'red',
                  ENTRYCOL:'green',
                  LINEWDTH: 2,
                  BULLNAME: 'Bullish Pin',
                  BEARNAME: 'Bearish Pin',
                  thePinBar: null,
                  entryLbl:   Ti.UI.createLabel({text : 0
                                              ,textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                                              ,color:     'red'}),
                  lotSizeLbl: Ti.UI.createLabel({text : 0
                                              ,textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                                              ,color:     'red'}),
                  takeProfitLbl:Ti.UI.createLabel({text : 0
                                              ,textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                                              ,color:     'red'}),
                  vEntry:   Ti.UI.createView({
                                     width:            '100%',
                                     height:           2,
                                     backgroundColor:  'green'
                                    }),
                };
        
        var theScreen     = Ti.UI.createView({layout:       'vertical'});
        
        var pinBarEntryVw = Ti.UI.createView({layout:       'horizontal',
                                              height:       '80%',
                                              borderWidth:  vwBorderWidth,
                                              borderColor:  vwBorderColor});
        
        var pinbarVw      = Ti.UI.createView({width:        '20%',
                                              height:       '100%',
                                              borderWidth:  vwBorderWidth,
                                              borderColor:  vwBorderColor});
        
        var entryParamsVw = Ti.UI.createView({width:        '80%',
                                              borderWidth:  vwBorderWidth,
                                              borderColor:  vwBorderColor});
        
        function popDefaults() {
        	iStopLoss.value = rate;
        	iPBTop.value    = rate;
        	iPBBtm.value    = rate;
        }
        
        function computeEntryParams(_args) {
            var rr = require('/riskReward');
            var cc = require('/currencycommon');
            
            console.log('computeEntryParams');
            if (pair) {
               var retrace = rr.determineRetracement({pair          : pair,
                                                      retracement   : _args.retracement,
                                                      top           : iPBTop.value,
                                                      bottom        : iPBBtm.value,
                                                      bull          : bull});
              pb.entryLbl.text = retrace;

              pb.lotSizeLbl.text = rr.calculatePositionSize({
                                                      pair            : pair,
                                                      risk            : cc.getTradeRisk(),
                                                      stopLoss        : iStopLoss.value,
                                                      entryPoint      : retrace
                                                      });  
                                                     
             pb.takeProfitLbl.text = rr.calculateNxRiskReward({
                                                      pair            : pair,
                                                      RR              : cc.getRiskReward(),
                                                      stopLoss        : iStopLoss.value,
                                                      entryPoint      : retrace
                                                      });  

             updateEntryPointIndicator(_args);
           }
        }
        
        function updateEntryPointIndicator(_args) {
          pinbarVw.remove(pb.vEntry);
          if (_args.retracement != 0) {
            if (bull) {
              // retracement is from top
              pb.vEntry.top = String.format("%2f", (_args.retracement*0.8)+10)+'%';
            } else {
              pb.vEntry.top = String.format("%2f", (80 - (_args.retracement*0.8))+10)+'%';
            }
            pinbarVw.add(pb.vEntry);
          } 
          
        }
        
        function drawTakeProfitView(_args) {
            var profitVw  = Ti.UI.createView({layout:'horizontal'});
            
            var entryPointVw = Ti.UI.createView({layout:'vertical',
                                                 width:'33%'});
            var lotSizeVw    = Ti.UI.createView({layout:'vertical',
                                                 width:'33%'});
            var takeProfitVw = Ti.UI.createView({layout:'vertical',
                                                 width:'33%'});
            
            var lEntry = Ti.UI.createLabel({
	                                    text: 'Entry Point',
	                                    height: '30%',
	                                          top: 0,
	                                          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	                                          color: vwBorderColor
                                      });

            var lLotSize = Ti.UI.createLabel({
	                                    text: 'Lot Size',
	                                    height: '30%',
	                                          top: 0,
	                                          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	                                          color: vwBorderColor
                                      });
            var cc = require('/currencycommon')
            var lTakeProfit = Ti.UI.createLabel({
	                                    text: cc.getRiskReward()+'x Take Profit',
	                                    height: '30%',
	                                          top: 0,
	                                          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	                                          color: vwBorderColor
                                      });
            entryPointVw.add(lEntry);
            entryPointVw.add(pb.entryLbl);
            lotSizeVw.add(lLotSize);
            lotSizeVw.add(pb.lotSizeLbl);
            takeProfitVw.add(lTakeProfit);
            takeProfitVw.add(pb.takeProfitLbl);
            profitVw.add(entryPointVw);
            profitVw.add(lotSizeVw);
            profitVw.add(takeProfitVw);
            return profitVw;
        }
        
        function processTableClick(_args) {
          // if the rowSource is the bull indicator then switch from bull to bear
          if (bull) {
              positionSize.updateRow(_args.index, 
                                     createTableRow({title: pb.BEARNAME}),
                                     {animated : true}
                                    );
              bull = false;
              pinbarVw.remove(pb.thePinBar);
              pb.thePinBar = drawPB({bull:bull});
              pinbarVw.add(pb.thePinBar);
          }
          else {
              positionSize.updateRow(_args.index, 
                                     createTableRow({title: pb.BULLNAME}),
                                     {animated : true}
                                    );
              bull = true;
              pinbarVw.remove(pb.thePinBar);
              pb.thePinBar = drawPB({bull:bull});
              pinbarVw.add(pb.thePinBar);
          }
          updateEntryPointIndicator({retracement: iRetracement.value});
        }
        
        function processRetracementChange(_args) {
            // update the label
            lRetracement.text = String.format("%3.1f", _args.value);
            // compute the take profit position
            computeEntryParams({retracement: _args.value});
        }
        
        // Arguments - vw the view, bull - a bullish (true) or bearish (false) pin bar
        function drawPB(_args) {
          
          var vw = Ti.UI.createView({/*size: Ti.UI.FILL*/});
          
          var bull = (_args.bull)||false;
          
          var SL = Ti.UI.createView({
                                     width:            '100%',
                                     height:           pb.LINEWDTH,
                                     backgroundColor:  pb.SLCOL,
                                     top:              (bull) ? pb.BULLSL : pb.BEARSL,
                                    });
          
          var pbLine = Ti.UI.createView({
                                     top:              pb.PBTOP,
                                     height:           pb.PBHGT,
                                     width:            pb.LINEWDTH,
                                     backgroundColor:  pb.LINECOL,
                                     left:             '50%'
                                    });
                                    
          var pbBody = Ti.UI.createView({
                                     top:              (bull) ? pb.BULLTOP: pb.BEARTOP,
                                     borderWidth:      pb.LINEWDTH,
                                     borderColor:      pb.LINECOL,
                                     width:            '14%',
                                     height:           '10%',
                                     backgroundColor:  (bull) ? pb.BULLBODY: pb.BEARBODY,
                                     left:             '45%'
                                    });
          
          vw.add(SL);
          vw.add(pbLine);
          vw.add(pbBody);
          
          return vw;
        }
        
	// create the input items

	function getKeyboardToolbar() {
		if (!(Ti.Platform.name == 'iPhone OS')) return null;
		
		var done = Titanium.UI.createButton({
		    title: 'Done',
		    style: Titanium.UI.iPhone.SystemButtonStyle.DONE,
		});
        done.addEventListener('click', function(e) {iStopLoss.blur(); iPBTop.blur(); iPBBtm.blur();});
		var toolbar = Titanium.UI.iOS.createToolbar({
		    items:[done],
		    top:0,
		    borderTop:false,
		    borderBottom:true
		}); 

		return toolbar;
	};

	var iStopLoss     = Ti.UI.createTextField({keyboardType : Ti.UI.KEYBOARD_NUMBER_PAD, keyboardToolbar: getKeyboardToolbar(), right:10, width:'35%', textAlign:Ti.UI.TEXT_ALIGNMENT_RIGHT, color:pb.SLCOL});
	var iPBTop        = Ti.UI.createTextField({keyboardType : Ti.UI.KEYBOARD_NUMBER_PAD, keyboardToolbar: getKeyboardToolbar(), right:10, width:'35%', textAlign:Ti.UI.TEXT_ALIGNMENT_RIGHT});
	var iPBBtm        = Ti.UI.createTextField({keyboardType : Ti.UI.KEYBOARD_NUMBER_PAD, keyboardToolbar: getKeyboardToolbar(), right:10, width:'35%', textAlign:Ti.UI.TEXT_ALIGNMENT_RIGHT});

        var iRetracement  = Ti.UI.createSlider({
                                      top: 50,
                                      min: 0,
                                      max: 55,
                                      width: '100%',
                                      value: 38
                                  });
    
        var lRetracement = Ti.UI.createLabel({
                                      text: iRetracement.value,
                                      right: 10,
                                      width:'25%',
                                      textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
                                      color: pb.ENTRYCOL
                                      });
        
        var lEntryPoint   = Ti.UI.createLabel({right:10, width:'25%', text:'0', textAlign:Ti.UI.TEXT_ALIGNMENT_RIGHT});
        var l2xRiskReward = Ti.UI.createLabel({right:10, width:'25%', text:'0', textAlign:Ti.UI.TEXT_ALIGNMENT_RIGHT});

        var lPositionSize = Ti.UI.createLabel({right:10, width:'25%', text:'0.00', textAlign:Ti.UI.TEXT_ALIGNMENT_RIGHT});

      

	function createTableRow(_args) {
	  var row = Ti.UI.createTableViewRow({});
	  if (_args.title)     {var lbl = Ti.UI.createLabel({left : 10, text: _args.title, textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT});
	                        row.add(lbl)}
	  if (_args.textField) {row.add(_args.textField)};
	  if (_args.label)     {row.add(_args.label)};
      if (_args.slider)    {row.add(_args.slider)};
      if (_args.check)     {row.hasCheck = true};
	  return row
	};

	// Construct the tableview

	var stopLoss = Ti.UI.createTableViewSection({ headerTitle: 'Stop Loss' });
	stopLoss.add(createTableRow({title: 'Stop placement',        textField : iStopLoss}));

	var pinBarDets = Ti.UI.createTableViewSection({ headerTitle: 'Pin Bar Details' });
	pinBarDets.add(createTableRow({title: 'Top',                 textField : iPBTop}));
	pinBarDets.add(createTableRow({title: 'Bottom',              textField : iPBBtm}));
	pinBarDets.add(createTableRow({title: pb.BULLNAME}));

	var retracement = Ti.UI.createTableViewSection({ headerTitle: 'Retracement' });
	retracement.add(createTableRow({title: '% Retracement',       slider : iRetracement, label:lRetracement}));


	var positionSize = Ti.UI.createTableView({
	  data: [stopLoss, pinBarDets, retracement],
	  backgroundColor: (Ti.Platform.osname == 'android') ? 'black': 'white'
	});

        // process any clicks on the table
        positionSize.addEventListener('click', function(e) {
           processTableClick(e);
        });
        
	// add the eventListeners

        iRetracement.addEventListener('change', function(e) {
           processRetracementChange(e);
        });

	// Construct the views
	entryParamsVw.add(positionSize);
	pinBarEntryVw.add(pinbarVw);
	pinBarEntryVw.add(entryParamsVw);

	theScreen.add(pinBarEntryVw);
        theScreen.add(drawTakeProfitView());
        
	pinBar.add(theScreen);

	pinBar.addEventListener('currencySelected', function(_args) {

		pair = _args.pair;
		risk = _args.risk;
		rate = _args.rate
		pb.thePinBar = drawPB({bull:bull});
		pinbarVw.add(pb.thePinBar);
		popDefaults();
	});

	return pinBar;
};

module.exports = pinBarView;
