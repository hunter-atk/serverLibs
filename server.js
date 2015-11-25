var http = require('http');
var fs = require('fs');
var story;

var server = http.createServer( function( request, response ) {

  // grab req and res
  gRoute( request.url, request, response );

})

var routes = {

  root: (function() {
    return function( url, request, response) {
        response.end("ROOTER" + url)
    }
  })(),

  sendstory: (function() {
    return function( url, request, response) {
        var query = url.split("?")[1]
        if (query) {

          readMadLib(query)
          response.end("writing to story" + query)
        } else {
          resposne.end("no query sent")
        }
    }
  })(),
}

function gRoute( url, req, res) {
  var route;
  var getRoute;

  if (url === "/") {
    route = "root"
  } else {
    route = url.split("?")[0].slice(1,url.length);
  }

  if ( routes.hasOwnProperty(route) ) {
    getRoute = routes[route];
    getRoute( url, req, res )
  }

}


function readMadLib(queryWord){
  fs.readFile('story.txt', function (err, data) {
     if (err) {
        return console.error(err);
     }
     console.log("Reading story.txt" + data.toString());
     story = data.toString();
     var word = queryWord.split("=")[1];
     addMadLib(word, story)

  });
}

function addMadLib(word, story) {
  // get story, find first instance of {{ }}
  // replace with word
  fs.writeFile('story.txt', word,  function(err) {
    if (err) {
       return console.error(err);
    }
    // console.log("Data written successfully!");
  });
}

var PORT = process.env.PORT || 4567
server.listen( PORT, function() {
  console.log("listening on on:" + PORT );
} )


// request.method
// request.statusCode
// request.url
// request.headers
// request.headers: host
