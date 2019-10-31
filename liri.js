require("dotenv").config();
const keys = require("./keys.js");
const axios = require("axios");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const fs = require("fs");

let command = process.argv[2];
let itemToFind = "";
for (i = 3; i < process.argv.length; i ++) {
    itemToFind += " " + process.argv[i];
}
bandsAPIKey = keys.bandThis.apiKey;

if (command === "concert-this") {
    concertThis(itemToFind);
}

if (command === "spotify-this-song") {
    spotifyThis(itemToFind);
}

function printArtist(artArray) {
    console.log("\nArtist(s): ");
    artArray.forEach(function(artist) {
        console.log("\t" + artist.name);
    });
}

if (command === "movie-this") {
    let urlInput = inputFormat(itemToFind)
    movieThis(urlInput);
}

if (command == "do-what-it-says") {
    fs.readFile('./random.txt', 'utf8', function(err, data) {
        if (err) throw err;
        inputArr = data.split(",");
        console.log(inputArr);
        if (inputArr[0] === 'spotify-this-song') {
            spotifyThis(inputArr[1]);
        }
        else if (inputArr[0] === 'movie-this') {
            let searchItem = inputFormat(inputArr[1]);
            movieThis(searchItem);
        }
        else if (inputArr[0] === 'concert-this') {
            let searchItem = inputFormat(inputArr[1]);
            concertThis(searchItem);
        }
        else {
            console.log("Not a valid command in the random.txt file. Please change and try again.")
        }
    });
}


function spotifyThis(item2Search) {
    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret,
    });

    spotify.search({ type: 'track', query: item2Search }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
        
        //console.log(data.tracks.items[0]);
        printArtist(data.tracks.items[0].artists);
        console.log("Song Title: " + data.tracks.items[0].name);
        console.log("Song Preview: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name)

    });  
}

function movieThis(item2Search) {
    axios.get("http://www.omdbapi.com/?t=" + item2Search + "&type=movie&apikey=trilogy").then(function(response) {
        if(response.data.Title != undefined) {
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country of Origin: " + response.data.Country);
            console.log("Langauge: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
        else {
            axios.get("http://www.omdbapi.com/?t=Mr.+Nobody&apikey=trilogy").then(function(response) {
                console.log("Title: " + response.data.Title);
                console.log("Release Year: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.imdbRating);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("Country of Origin: " + response.data.Country);
                console.log("Langauge: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
            })
        }
    })
    .catch(function(error) {
        console.log("An error occured: " + error);
    })
}

function concertThis(item2Search) {
    axios.get("https://rest.bandsintown.com/artists/" + item2Search + "/events?app_id=" + bandsAPIKey).then(function(response) {
        if(response.data[0]) {
            console.log(itemToFind + "'s upcomiing events:\n")
            for(i = 0; i < response.data.length; i++) {
                console.log("Venue: " + response.data[i].venue.name);
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                console.log("Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY") + "\n");
            }
        }
        else {
            console.log("Sorry" + item2Search + " does not have any upcoming events!");
        }
    })
    .catch(function(error) {
        if (error) throw(error);
    });
}

function inputFormat(userInput) {
    let formattedInput = userInput
    if (command === 'concert-this' || 'movie-this') {
        userInput.replace(" ", "+");
    }
    else if (command === 'do-what-it-says') {
        let tempString = userInput.slice(1, userInput.length - 2);
        formattedInput = tempString.replace(" ", "+");
    }
    return formattedInput;
}