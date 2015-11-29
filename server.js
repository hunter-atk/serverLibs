var http = require('http');
var fs = require('fs');

var server = http.createServer( function( request, response ) {
  // grab req and res
  gRoute( request.url, request, response );
})

// Handles all the routes
function gRoute( url, req, res) {
  var route;
  var getRoute;

  // check if the url has no path
  // If there is one, then grab the path, and ignore any query strings
  if (url === "/") {
    route = "root"
  } else {
    route = url.split("?")[0].slice(1,url.length);
  }

  // find the route (a.k.a path) from the routes object
  if ( routes.hasOwnProperty(route) ) {
    getRoute = routes[route];
    getRoute( url, req, res )
  }

}

// the routes object contains each route as a key.
var routes = {

  root: runRoute(function( url, request, response) {
    response.end("ROOTER" + url)
  }),

  updatestory: runRoute(function( url, request, response) {
    var query = url.split("?")[1]

    if (query) {
      addMadLib(query)
      response.end("adding word to story: " + query)
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

      // add custom headers, node will be heroku servers
      response.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Content-Length': stat.size,
        'Node-List': '{"nodes":[1,2,3,4]}'
      });

      response.end(data);
    });
  }),

  getstory: runRoute(function( url, request, response ){

    var filePath = __dirname + "/story.txt"
    var stat = fs.statSync(filePath);

    var options = {
         host: 'serverlibs.herokuapp.com',
         path: '/sendstory',
      };

    // Make a request to the server
    var req = http.request(options, function(res){
      // Continuously update stream with data
      var body = '';
      console.log(res.headers);

      res.on('data', function(data) {
        body += data;
      });

      res.on('end', function() {
      // Data received completely.
      console.log("Received story: ", body);

      response.writeHead(200, {
         'Content-Type': 'text/javascript',
         'Content-Length': stat.size
      });

      writeStory(body);
      response.end(body);
      });
    });
    req.end();
  })
}

function runRoute( fn ) {
  return fn;
}

function writeStory(story){
  fs.writeFile('story.txt', story,  function(err) {
    if (err) {
       return console.error(err);
    }
    console.log("Data saved to story.txt successfully!");
  });
}

function readMadLib(queryWord){
  fs.readFile('story.txt', function (err, data) {
    if (err) {
      return console.log(err);
    }
    console.log("Reading story.txt" + data.toString());
    story = data.toString();
    // addMadLib(queryWord, story)
  });
}

function addMadLib(queryWord) {
  // get the current story
  var story;

  fs.readFile('story.txt', function (err, data) {
    if (err) {
      return console.log(err);
    }
    console.log("Reading story.txt" + data.toString());
    story = data.toString();

    // update story with new word
    addNewWord(story, queryWord)
  });
}

function addNewWord(currentStory, newWord){
  var placeholderText = /({{.*?}})/
  updatedStory = currentStory.replace(placeholderText, newWord)

  fs.writeFile('story.txt', updatedStory,  function(err) {
    if (err) {
       return console.error(err);
    }
    console.log("Data written successfully!");
  });
}

var PORT = process.env.PORT || 4567
server.listen( PORT, function() {
  console.log("listening on on:" + PORT );
})
