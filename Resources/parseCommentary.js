function addCommentary(_args) {
	// create a new currency commentary using Parse
	var url = 'https://api.parse.com/1/classes/forexCommentary';
	var post = Ti.Network.createHTTPClient({
		
    onload : function(e) {
         console.log("Received text: " + this.responseText);
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.warn(JSON.stringify(e));
     },
     timeout : 5000  // in milliseconds
    });
 // Prepare the connection
    post.open("POST", url);
    post.setRequestHeader('X-Parse-Application-Id', '8UydIBVdelk3kOgYyAR0wCN01ZjYrQ4AWeVg8JwO');
    post.setRequestHeader('X-Parse-REST-API-Key', 'oFLviNoxggr0jR4oNtIB8tk89gcb31nGc4dBMA5u');
    post.setRequestHeader('Content-Type', 'application/json');

    var data = JSON.stringify({
	        pair:    _args.pair,
	        rate:    _args.rate,
	        comment: _args.commentary
	   });
    // Send the request.
    post.send(data); 
};
exports.addCommentary = addCommentary;