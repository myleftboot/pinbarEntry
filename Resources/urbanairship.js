/* Created by Darren Cope, Cope Consultancy Services
  UrbanAirship javascript registration API for iOS
*/

var baseurl = 'https://go.urbanairship.com';

/* Mandatory parameters for this call
*  _args.token  : the device token returned from APNS
*  _args.key    : the Application key as registered with UrbanAirship
*  _args.secret : The Application secret as registered with UrbanAirship
*/
var register = function(_args) {
      var method = 'PUT';

      var url = baseurl+'/api/device_tokens/'+_args.token;
      var payload = (_args.params) ? JSON.stringify(_args.params) : '';

      var xhr = Ti.Network.createHTTPClient();
      xhr.setTimeout(60000);

      xhr.onerror = function(e) {
         _args.error({success: false,
                      error: this.status+':'+this.responseText});
      };
      xhr.onload = function(e) {
        var action, success;
        if (this.status == 200) {
            action = "updated",success = true;
        } else if (this.status == 201) {
            action = "created",success = true;
        } else {
          success = false;
        }
        _args.success({success: success,
                       action : action,
                       response: this.status+':'+this.responseText});
      };

      // open the client
      xhr.open('PUT', url);
      if (_args.params) {
        xhr.setRequestHeader('Content-Type','application/json');
      }
      xhr.setRequestHeader('Authorization','Basic '+Ti.Utils.base64encode(_args.key + ":" + _args.secret));
      // send the data
      xhr.send(payload);
};
exports.register = register;
