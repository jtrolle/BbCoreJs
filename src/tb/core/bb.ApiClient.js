define("bb.apiClient", ["jquery","bb.Api", "jsclass"], function($, bbCore,jsClass){
    
    /**
     * BB Api Client
     **/
    var ApiClient = new jsClass.Class({
        publicKey: null,
        privateKey: null,
        host: null,
        resourceManager: {},
        userAgent: null,
        initialize: function(publicKey, privateKey, host, userAgent) {
            this.publicKey = publicKey;
            this.privateKey = privateKey;
            this.host = host;
            if (typeof userAgent !== "undefined") {
                this.userAgent = userAgent;
            }
        },        
        
        send: function (request) {
            return $.ajax(request);
        },
        
        /**
         * Get user agent
         * 
         * @returns {String}
         */
        getUserAgent: function() {
            if(null !== this.userAgent) {
                return this.userAgent;
            }
            
            return 'BackBee Api Client 0.10 (' + this.publicKey + ', ' + window.location.host  + ')';
        },
        
        /**
         * Construct request object
         * 
         * @param String url
         * @param String method
         * @param PlainObject queryParams
         * @param PlainObject data
         * @param PlainObject headers
         * @returns PlainObject
         */
        createRequest: function(url, method, queryParams, data, headers) {
            var request = {"type" : method};
            
            if (typeof queryParams !== "undefined"  && "" !== queryParams.trim()) {
                url += ((url.indexOf('?') == -1) ? '?' : '&') + $.param(queryParams);
            }
            
            request["url"] = url;
            
            if (typeof data !== "undefined") {
                request["data"] = data;
            }
            
            if (typeof headers !== "undefined") {
                request["headers"] = headers;
            }
            
            return request;
        },
        
        /**
         * Get resource by its name
         * 
         * @param string name
         * @returns bb.ApiResource
         */
        getResource: function(name) {
            if(this.resourceManager[name]) {
                var resource = new ApiResource(name, this);
                
                this.resourceManager[name] = resource;
            }
            
            return this.resourceManager[name];
        }

    });
    
    bbCore.register("apiClient", ApiClient);
    
    return ApiClient;
});