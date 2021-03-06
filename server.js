// Do not import any other modules.
var http = require('http');
var fs = require('fs');

// Get the sever host from another student,
// this is where you will get your story from
// they should have a sendstory route that sends their updated story

// A working solution exists at this url
// Once you are ready to test with a partner, replace this url
// with your partners URL. The story at this default is very basic.
var previousNode = 'server-libs-g80.herokuapp.com';

var server = http.createServer( function( request, response ) {
  // Every request to your server starts here.

  // check if the url has no path
  // If there is one, then grab the path, and ignore any query strings
  if (request.url === "/") {
    routes['root'](request.url, request, response);
  } else {
    console.log("WORKS");
    let route = request.url.slice(1).split('?')[0];
    if (Object.keys(routes).includes(route)){
      routes[route](request.url, request, response);
    } else {
      response.write(route);
    }
  }
});

// the routes object contains each route as a key.
var routes = {

  // root is done for you. :)
  root: function( url, request, response) {
    // __dirname is handled by node. It is the directory
    // of the server.js file.
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

  /**
    Updates the story based on the query parameter in the url.
  */
  updatestory: function( url, request, response) {
    // Fetch the passed in word from the url query parameters
    let filePath = __dirname + "/story.txt";
    let stat = fs.statSync(filePath);
    var word = url.slice(1).split('?')[1];

    // get the story file
    fs.readFile(filePath, 'UTF8', function (err, data) {
      if (err){
        return console.log(error);
      } else {
        let theLib = data.split(" ");
        let firstBrackIndex = theLib.indexOf('{{');
        theLib[firstBrackIndex + 1] = word;
        theLib.splice(firstBrackIndex + 2, 1);
        theLib.splice(firstBrackIndex, 1);
        if (firstBrackIndex < 1){
          return "fuck off";
        }
        theLib = theLib.join(" ");
        response.end(theLib);
        //data = theLib;
        fs.writeFile("./story.txt", theLib, err=>{
          if (err){
            console.log(error);
          } else {
            response.end(theLib);
          }
        })
      }
    });

    // save the word into the first available placeholder
    // those are {{ verb }}, {{ noun }} or {{ adjective }}

    // save the story file
    // send the updated version of the story to the browser
  },

  /**
    sends the current text of story.txt to whoever made
    the request.
  */
  sendstory: function( url, request, response ){

   let filePath = __dirname + "/story.txt";
   let stat = fs.statSync(filePath);

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

  /**
    Fetch the story from your partners server by making
    an HTTP request to their /sendstory route.

    Once you have recived your partners story, replace
    your own story.txt file with this data.
  */
  getstory: function( url, request, response ){
    console.log('a');
    // var filePath = __dirname + "/story.txt"
    // var stat = fs.statSync(filePath);
    var thisUrl = 'http://'+ previousNode +'/sendstory';
    http.get(thisUrl, (resp) => {
       let data = '';

       // A chunk of data has been recieved.
       console.log('b');

       resp.on('data', (chunk) => {
          data += chunk;
       });
       console.log('c');
       resp.on('end', () => {
         fs.writeFile('./story.txt', data, err=>{
           if (err){
             console.log(error);
           } else {
             response.end('Data saved to file');
           }
         })
         console.log('d');
       });
    })
    // Make an HTTP request to your partners server
      // When that HTTP request has been processed, and
      // you have the data, save that data into your story.txt
      // file.

      // Don't forget to end the request.

  }
};

var PORT = process.env.PORT || 4567

server.listen( PORT, function() {
  console.log("listening on on:" + PORT );
});
