//Do what the instructions tell you
require("dotenv").config();

//Install  the needed "node" packages
var fs = require("fs");
var keys = require("./keys.js")
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify)
var userQuery = "";


// Capture user input to liri, userQuery, "the search variable"
for (var i = 3; i < process.argv.length; i++) {
    if (i > 3 && i < process.argv.length) {
        // cooncatinate the liri command with the seach variable"
        userQuery = userQuery + " " + process.argv[i];
    } else {

        userQuery += process.argv[i];
    }

}
//store liri command
var userChoice = process.argv[2];

console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
console.log("User comand to liri: " + userChoice);
console.log(userQuery);
console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

//switch logig for each user choiice 
switch (userChoice) {

    case "concert-this":
        //function name for this case
        concertThis();
        break;
    case "spotify-this-song":
        //function name for this case
        //console.log("got to spotify case")
        spotifyThis();
        break;
    case "movie-this":
        //function name for this case
        movieThis();
        break;
    case "do-what-it-says":
        doThis();
        //function name for this case
        break;
    default:
        logThis("Please enter a valid search term, such as {concert-this},");
        logThis("{spotify-this-song}, {movie-this}, or {do-what-it-says}");
        break;
}
//  Create the funciton logic for each case

// Spotify Function
function spotifyThis() {

    // Catch empty input, supply default song "Convoy" my funny choice
    if (!userQuery) {
        userQuery = "Convoy";
    }
    // console.log(spotify);
    // console.log("::::");
    // console.log(userQuery);
    spotify.search({
            type: "track",
            query: userQuery
        },
        function(err, data) {

            if (err) {
                logThis(err);
            }

            var userSong = data.tracks.items;
            // console.log("..............................");
            // console.log(userSong);
            // console.log("..............................");
            logThis("Artist: " + userSong[0].artists[0].name);
            logThis("Song Name: " + userSong[0].name);
            logThis("Preview Link: " + userSong[0].preview_url);
            logThis("Album: " + userSong[0].album.name);
        });
};

function movieThis() {

    if (!userQuery) {
        userQuery = "Mr. Nobody";
        logThis("If you haven't watched 'Mr. Nobody,' then you should: <http://www.imdb.com/title/tt0485947/>");
        logThis("It's on Netflix!");
    }

    axios.get("http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=" + keys.movieThis.id)
        .then(function(response) {

            logThis("Title: " + response.data.Title);
            logThis("Year Released: " + response.data.Year);
            logThis("IMDB rating: " + response.data.imdbRating);
            logThis("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            logThis("Country/Countries Produced: " + response.data.Country);
            logThis("Language: " + response.data.Language);
            logThis("Plot: " + response.data.Plot);
            logThis("Cast: " + response.data.Actors);
        });
};

function concertThis() {

    if (!userQuery) {
        userQuery = "Slayer";
    }
    axios.get("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=" + keys.bands.id)
        .then(function(response) {
            for (var i = 0; i < response.data.length; i++) {

                logThis("Venue Name: " + response.data[i].venue.name);
                logThis("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                logThis("Date of the Event: " + moment(response.data[i].datetime).format("L"));
            }
        });
}

function doThis() {
    fs.readFile("random.txt", "utf8", function(err, data) {

        if (err) {
            logThis(err);
        }

        var readArray = data.split(",");

        userQuery = readArray[1];

        spotifyThis(userQuery);
    })
};
// logfile function
function logThis(logQuery) {

    console.log(logQuery);

    fs.appendFile("log.txt", logQuery + "\n----------------\n", function(err) {
        if (err) {
            return logThis("Error: " + err);
        }
    });
};