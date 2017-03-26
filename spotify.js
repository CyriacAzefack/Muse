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
/*
spotifyApi.searchTracks('track:Alright artist:Kendrick Lamar')
    .then(function(data) {
        console.log('Search tracks by "Alright" in the track name and "Kendrick Lamar" in the artist name');
        console.log(data.body.tracks.items);
    }, function(err) {
        console.log('Something went wrong!', err);
    });
*/

function searchSongAndArtist(songName, artistName, callback) {

    spotifyApi.searchTracks('track:'+songName+' artist:'+artistName+'')
        .then(function(data) {
            console.log('Search tracks by "'+songName+'" in the track name and "'+artistName+'" in the artist name');

            //Now let's build the
            track = data.body.tracks.items[0];

            var urls =  {
                sample : track.preview_url,
                song : track.external_urls.spotify,
                image : track.album.images[0].url
            };

            callback(urls);
        }, function(err) {
            console.log('Something went wrong!', err);
        });

}

module.exports = {
    searchSongAndArtist
};