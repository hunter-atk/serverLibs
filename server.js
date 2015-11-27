var http = require('http');
var fs = require('fs');

var placeholder = /({{.*?}})/;

var server = http.createServer( function( request, response ) {
  // grab req and res
  gRoute( request.url, request, response );
})

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

function runRoute( fn ) {
  return fn;
}

var routes = {

  root: runRoute(function( url, request, response) {
      response.end("ROOTER" + url)
  }),

  updatestory: runRoute(function( url, request, response) {

      var query = url.split("?")[1]

      if (query) {
        readMadLib(query)
        response.end("writing to story" + query)
      } else {
        response.end("no query sent")
      }
  }),

  sendstory: runRoute(function( url, request, response ){

    var filePath = __dirname + "/story.txt"
    var stat = fs.statSync(filePath);

    fs.readFile(filePath, function (err, data) {
       if (err) {
          return console.error(err);
       }

       response.writeHead(200, {
          'Content-Type': 'text/javascript',
          'Content-Length': stat.size
       });

       response.end(data);
    });
  }),

  // getstory: runRoute(function( url, request, response ){
  //
  //   var filePath = __dirname + "/story.txt"
  //   var stat = fs.statSync(filePath);
  //
  //
  //   var options = {
  //        host: 'https://serverlibs.herokuapp.com',
  //        path: '/sendstory'
  //     };
  //
  //   // Make a request to the server
  //   var req = http.request(options, function(res){
  //      // Continuously update stream with data
  //      var body = '';
  //      res.on('data', function(data) {
  //         body += data;
  //      });
  //
  //      res.on('end', function() {
  //         // Data received completely.
  //
  //
  //         console.log("Received story",body);
  //      });
  //   });
  //
  //   req.end();
  //
  //   fs.readFile(filePath, function (err, data) {
  //      if (err) {
  //         return console.log(err);
  //      }
  //
  //      response.writeHead(200, {
  //         'Content-Type': 'text/javascript',
  //         'Content-Length': stat.size
  //      });
  //
  //      response.end(data);
  //   });
  //
  //
  // })

}

function readMadLib(queryWord){
  fs.readFile('story.txt', function (err, data) {
     if (err) {
        return console.log(err);
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
})


// request.method
// request.statusCode
// request.url
// request.headers
// request.headers: host
