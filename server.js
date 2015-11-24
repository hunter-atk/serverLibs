var http = require('http');

var routes = {
  '/': (function() {
    
  })(),



};

var server = http.createServer( function( request, response ) {

  // grab req and res
  console.log(request.url);

  gRouter.getInfoFor( request, response )

  response.end( "bam: " + request.url );
})


var gRouter = (function(){

  function getInfoFor( request, response ) {
    console.log(routes['/']);
  }

  return {
    getInfoFor: getInfoFor

  }
})()


var PORT = 4567
server.listen( PORT, function() {
  console.log("listening on on:" + PORT );
} )


// request.method
// request.statusCode
// request.url
// request.headers
// request.headers: host
