// Do not import any other modules. 
var http = require('http');
var fs = require('fs');

// Get the sever host from another student,
// this is where you will get your story from
// they should have a sendstory route that sends their updated story

// A working solution exists at this url
// Once you are ready to test with a partner, replace this url
// with your partners URL. The story at this default is very basic. 
var previousNode = 'serverlibs.herokuapp.com';

var server = http.createServer( function( request, response ) {
  // Every request to your server starts here.  

  // check if the url has no path
  // If there is one, then grab the path, and ignore any query strings
  if (request.url === "/") {
    routes['root'](request.url, request, response);
  } else {
    // Here, parse the request url to get the route
    // then call the appropriate function.
  }
});

// the routes object contains each route as a key.
var routes = {

  root: function( url, request, response) {
    var filePath = __dirname + "/index.html";
    var stat = fs.statSync(filePath);

    fs.readFile(filePath, function (err, data) {
      if (err) {
        return console.error(err);
      }

      // specificy headers in the response
      response.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': stat.size,
        'Charset': 'utf-8'
      });

      response.end(data);
    });
  },

  updatestory: function( url, request, response) {
    var query = url.split("?")[1]

    if (query) {
      addMadLib(query);
      response.end("adding word to story: " + query)
    } else {
      response.end("no query sent");
    }
  },

  sendstory: function( url, request, response ){

    var filePath = __dirname + "/story.txt";
    var stat = fs.statSync(filePath);

    fs.readFile(filePath, function (err, data) {
      if (err) {
        return console.error(err);
      }

      // specificy headers in the response
      response.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Content-Length': stat.size,
      });

      response.end(data);
    });
  },

  getstory: function( url, request, response ){

    var filePath = __dirname + "/story.txt"
    var stat = fs.statSync(filePath);

    var options = {
         host: previousNode,
         path: '/sendstory',
      };

    // Make a request to the server
    var req = http.request(options, function(res){
      var content = '';
      console.log(res.headers);

      // res is a stream, so we continously add data to the body string
      res.on('data', function(data) {
        content += data;
      });

      // once the response stream is finished
      res.on('end', function() {
      // Data received completely.
        console.log("Received story: ", content);

        response.writeHead(200, {
           'Content-Type': 'text/javascript',
           'Content-Length': stat.size
        });

        saveStory(content);
        response.end(content);
      });
    });

    req.end();
  }
}

// saves a story from a server with the getstory route
function saveStory(story){
  fs.writeFile('story.txt', story,  function(err) {
    if (err) {
       return console.error(err);
    }
    console.log("Data saved to story.txt successfully!");
  });
}

// used in the updatestory route
function addMadLib(queryWord) {
  // get the current story
  var story;

  fs.readFile('story.txt', function (err, data) {
    if (err) {
      return console.log(err);
    }
    console.log("Reading story.txt:\n" + data.toString());
    story = data.toString();

    // update story with new word
    addNewWord(story, queryWord)
  });
}

// Used in addMadLib to add a new work from the string query to the story.txt
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
});
