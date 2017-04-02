/**
 * Created by I327247 on 26/03/2017.
 */
var spotifyWebApi = require('spotify-web-api-node');

const config = require("./config.json");

//credentials settings
var spotifyApi = new spotifyWebApi({
    clientId : config.spotify.clientId,
    clientSecret : config.spotify.clientSecret,
    redirectUri : config.spotify.redirectUSri
});


// Search tracks whose artist's name contains 'Kendrick Lamar', and track name contains 'Alright'

function searchSongAndArtist(songName, artistName, callback) {

    spotifyApi.searchTracks('track:'+songName+' artist:'+artistName)
        .then(function(data) {
            console.log('Search tracks by "'+songName+'" in the track name and "'+artistName+'" in the artist name');

            //Now let's build the results
            track = data.body.tracks.items[0];

            var results = null;
            if(track) {
                results = {
                    songName: track.name,
                    sampleUrl: track.preview_url,
                    songUrl: track.external_urls.spotify,
                    imageUrl: track.album.images[0].url
                };

            }

            callback(results);
        }, function(err) {
            console.log('Something went wrong!', err);
        });
}



function searchSong(songName, callback) {

    spotifyApi.searchTracks('track:'+songName)
        .then(function(data) {
            console.log('Search tracks by "'+songName+'" in the track name');

            //Now let's build the results
            track = data.body.tracks.items[0];

            var results = null;
            if(track) {
                results = {
                    songName: track.name,
                    sampleUrl: track.preview_url,
                    songUrl: track.external_urls.spotify,
                    imageUrl: track.album.images[0].url
                };

            }


            callback(results);

        }, function(err) {
            console.log('Something went wrong!', err);
        });

}

module.exports = {
    searchSong,
    searchSongAndArtist
};