var http = require('http');

var server = http.createServer( function( request, response ) {
  response.end( "bam: " + request.url );
})

var PORT = 4567
server.listen( PORT, function() {
  console.log("listening on on:" + PORT );
} )
