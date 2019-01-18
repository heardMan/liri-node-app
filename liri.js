require('dotenv').config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require('request');
var axios = require("axios");
var moment = require('moment');
var fs = require('fs');

var command = process.argv[2];
var input = process.argv[3];

function concertThis(input) {
    var queryString = `https://rest.bandsintown.com/artists/${input}/events?app_id=codingbootcamp`;
    request(queryString, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        var data = JSON.parse(body);
        data.forEach(function (concert) {
            console.log(concert.venue.name);
            console.log(`${concert.venue.city}, ${concert.venue.region} ${concert.venue.country}`);
            console.log(concert.datetime);
            console.log(' ');
        })
        console.log();
    });
}

function spotifyThisSong(input) {
    if (!input) {
        input = 'The Sign';
    }

    spotify.search({ type: 'track', query: input }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var tracks = data.tracks;
        tracks.items.forEach(function (track) {
            console.log(`Song Name: ${track.name}`);
            console.log(`Albumn: ${track.album.name}`);
            console.log(`Artists:`);
            var artists = track.artists;
            artists.forEach(function (artist) {
                console.log(`${artist.name}`);
            });
            console.log(`Preview Song: ${track.preview_url}`);
            console.log(' ');
        });
    });
}

function movieThis(input) {
    if (!input) {
        input = 'Mr. Nobody';
    }
    var queryString = `http://www.omdbapi.com/?t=${input}&y=&plot=short&apikey=trilogy`;
    axios.get(queryString)
        .then(function (response) {
            var data = response.data;
            console.log(`Title: ${data.Title}`);
            console.log(`Year: ${data.imdbRating}`);
            console.log(`Year: ${data.Ratings.source}`);
            console.log(`Year: ${data.Country}`);
            console.log(`Year: ${data.Language}`);
            console.log(`Year: ${data.Plot}`);
            var actors = data.Actors;
            console.log(`Actors:`);
            console.log(actors);
            console.log(' ');

        }).catch(function (err) {
            if (err) throw err;
        });
}

function userInput(command, input) {

    if (command === 'concert-this') {

        concertThis(input);
    }

    if (command === 'spotify-this-song') {

        spotifyThisSong(input);
    }

    if (command === 'movie-this') {

        movieThis(input);
    }

    if (command === 'do-what-it-says') {
        fs.readFile('random.txt', 'utf8', function (err, data) {
            if (err) throw err;
            var args = data.split(',');

            if (args[0] === 'concert-this') {
                concertThis(args[1]);
            } else if (args[0] === 'spotify-this-song') {
                spotifyThisSong(args[1]);
            } else if (args[0] === 'movie-this') {
                movieThis(args[1]);
            }

        })
    }

    var log = `${command}, `;

    fs.appendFile('log.txt', log, function(err){
        if(err) throw err;
    })

}

userInput(command, input);
