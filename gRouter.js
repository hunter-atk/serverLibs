function RouteObj() {
  var _this = this

  this.getInfoFor = function( request, response ){
    console.log(_this);
    _this.url = request.url;
    _this.request = request;
    _this.repsonse = response;
  }

  this.route = function( url, call ) {
    // console.log(this.request);
    if (url = _this.url) {
      call( _this.request, _this.repsonse );
    }
  }

}

// RouteObj.prototype.getInfoFor = function( request, response){
//   console.log(this);
//   this.url = request.url;
//   this.request = request;
//   this.repsonse = response;
//
// }
//
// RouteObj.prototype.route = function( url, call ) {
//   // console.log(this.request);
//   if (url = this.url) {
//     call( this.request, this.repsonse );
//   }
// }

routeObj = new RouteObj();

module.exports = {
  getInfoFor: routeObj.getInfoFor,
  route: routeObj.route
}
