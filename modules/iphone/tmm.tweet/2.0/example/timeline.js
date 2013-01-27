Ti.include('humanized_time_span.js');

function showTimeline(args) {
	
	win = Ti.UI.createWindow({title : 'Timeline'});
	
	var data = args.data;
	
	var rowData = [];

    for (var i=0; i < data.length; i++) {
      var tweet  = data[i].text; // The tweet message
      var user   = data[i].user.screen_name; // The screen name of the user
      var avatar = data[i].user.profile_image_url; // The profile image

      // Create a row and set its height to auto
      var row = Titanium.UI.createTableViewRow({
        height     : 100,
        className  : 'tweet'
      });

      // Create the view that will contain the text and avatar
      var postView = Titanium.UI.createView({ 
        height : Ti.UI.FILL,
        layout : 'vertical',
        top    : 5,
        right  : 5,
        bottom : 5,
        left   : 5
      });

      // Create image view to hold profile pic
      var av_image = Titanium.UI.createImageView({
        image  : avatar, // the image for the image view
        top    : 0,
        left   : 0,
        height : 48,
        width  : 48
      });
      postView.add(av_image);
      
      var retweet = Ti.UI.createButton({bottom : 0,
      	                                left :   10,
      	                                height:  16,
      	                                width:   40,
      	                                title:   'RT',
      	                                tweet:   data[i].id_str
      	                                })
      
      retweet.addEventListener('click', function(e) {

      	var test = require('tmm.tweet');
      	test.retweet({accountName: "@account_name",
    	              id         : e.source.tweet,
    	              trim_user  : "true",
                      success:       function(returnObj) {
                        	       	      var objs = returnObj.objects;
  	                                      Ti.API.info('-------------------+++------------------------');
                                          Ti.API.info(objs);
   	                                      Ti.API.info('-------------------+++------------------------');
   	                                      Ti.API.info('Result = '+returnObj.result);
                                       }, 
                     error:         function(returnObj) {  Ti.API.info('retweet failed '+returnObj.result); }
    	              });
       });
      postView.add(retweet);
      var headerVw = Ti.UI.createView({left: 50, height:16, top: -48});
      
      // Create the label to hold the screen name
      var user_lbl = Titanium.UI.createLabel({
        text      : user,
        left      : 0,
        width     : 120,
        top       : 0,
        bottom    : 2,
        height    : 16,
        textAlign : 'left',
        color     : '#444444',
        font      : {fontSize : 16, fontWeight : 'bold' }
      });
      headerVw.add(user_lbl);
      
      // Create the label to hold the screen name
      var twTime = Titanium.UI.createLabel({
        text      : humanized_time_span(data[i].created_at),
        right     : 0,
        width     : 100,
        top       : 0,
        bottom    : 2,
        height    : 16,
        textAlign : 'right',
        color     : '#444444',
        font      : {fontSize : 12 }
      });
      headerVw.add(twTime);
      
      postView.add(headerVw);
      // Create the label to hold the tweet message
      var tweet_lbl = Titanium.UI.createLabel({
          text      : tweet,
          left      : 54,
          top       : 0,
          bottom    : 2,
          height    : Ti.UI.FILL,
          width     : 236,
          textAlign : 'left',
          font      : { fontSize : 12 }
      });
      postView.add(tweet_lbl); 

      // Add the post view to the row
      row.add(postView);
      
      // add the url to the row
      try{
      	row.url = data[i].entities.urls[0].expanded_url;
      } catch (e)
      {
      	row.url = null;
      } 

      // Add row to the rowData array
      rowData[i] = row;
    }
    
    var layout = Ti.UI.createView({layout:'vertical'});
    
    var close = Ti.UI.createButton({top:  0,
    	                           title: 'Close',
    	                           height: 30});
    close.addEventListener('click', function() {win.close();});
    
    // Create the table view and set its data source to "rowData" array
    var tableView = Titanium.UI.createTableView({ data : rowData });
    
    tableView.addEventListener('click', function(e) {
    	if (e.rowData.url) {
    		var tweetDetail = Ti.UI.createWindow({});
    		var tweetContent = Ti.UI.createWebView({url:e.rowData.url});
    		tweetDetail.add(tweetContent);
    		win.open(tweetDetail);
    	}
    })
    //Add the table view to the window
    layout.add(close);
    layout.add(tableView);
    win.add(layout);
    
    return win;
}

exports.showTimeline = showTimeline;