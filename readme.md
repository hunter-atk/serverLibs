# Server Mad Libs

This is a server mad libs game to be played in the classroom.

Each student deploys a server, and a text file gets passed around from one student's server to another.

The text file contains a story with placeholders like this: {{ noun }} , or this: {{ verb }}.

Each time the text file gets passed from one server to another, the placeholder must be replaced with an actual word.

What story will your class write?

## Requirements and tools used

- Node

- Built in Node modules
 - FileStream
 - HTTP

- Heroku Toolbelt

## Setup

- Fork and clone
- Deploy to Heroku

## What to do next

- Get the server of the person you plan to send your story to.

- Write the neccessary code to:
  - Send a request to a server to receive a story.txt
  - Update a story by replacing the next placeholder in the story.txt
  - Respond to other server requests by sending them your updated story.txt

- Routes:
  - /getstory
  - /updatestory?(word)
  - /sendstory


### Story
 - This is a {{ verb }} story that does not {{ noun }} care about {{ noun }}
