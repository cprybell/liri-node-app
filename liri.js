require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");

let command = process.argv[2];
let itemToFind = process.argv[3];
bandsAPIKey = keys.bandThis.apiKey;

if (command === "concert-this") {
    axios.get("https://rest.bandsintown.com/artists/" + itemToFind + "/events?app_id=" + bandsAPIKey).then(function(response) {
        if(response.data[0]) {
            console.log(itemToFind + "'s upcomiing events:\n")
            for(i = 0; i < response.data.length; i++) {
                console.log("Venue: " + response.data[i].venue.name);
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                console.log("Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY") + "\n");
            }
        }
        else {
            console.log("Sorry " + itemToFind + " does not have any upcoming events!");
        }
    })
    .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("---------------Data---------------");
          console.log(error.response.data);
          console.log("---------------Status---------------");
          console.log(error.response.status);
          console.log("---------------Status---------------");
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
    });
}

if (command === "spotify-this-song") {
    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret,
    });

    spotify.search({ type: 'track', query: itemToFind }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
        console.log(data); 
        console.log(data.tracks.items[0]);
        console.log(data.tracks.items[0].artists[0].name);
    });  
}
