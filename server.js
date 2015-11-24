var http = require('http');
var gRouter = require('./gRouter');

var server = http.createServer( function( request, response ) {

  // grab req and res
  console.log(request.url);
  gRouter.getInfoFor( request, response )
  response.end( "bam: " + request.url );
})

gRouter.route("/", function( request, response ){
  console.log("route bam");
})

var PORT = 4567
server.listen( PORT, function() {
  console.log("listening on on:" + PORT );
} )


// request.method
// request.statusCode
// request.url
// request.headers
// request.headers: host
