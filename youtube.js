/**
 * Created by I327247 on 15/04/2017.
 */
const fs        = require('fs');
const youtubedl = require('youtube-dl');
const yss       = require('youtube-simple-search');
const config    = require('./config.json');

function searchSong (searchString, callback) {

    let urlRoot = 'https://www.youtube.com/watch?v=';

    yss({
        key: config.youtube.apiKey,
        query: searchString,
        maxResults: 1
        },

        getVideoUrl
    );

    function getVideoUrl(results) {
        //console.log(result);
        let videoID = undefined;
        results.forEach(function(result) {

            if(result.id.kind == "youtube#video") {
                videoID = result.id.videoId;

            }
        });
        var url = urlRoot + videoID
        console.log(url);
        getYoutubeAudioURL(url, callback);
    }

}

function getYoutubeAudioURL(youtubeUrl, callback) {

    const options = ['--format=bestaudio/best', '--extract-audio', '--skip-download']

    // Optional arguments passed to youtube-dl.
    //var options = ['--username=user', '--password=hunter2'];
    youtubedl.getInfo(youtubeUrl, function(err, info) {
        if (err) throw err;

        //console.log(info)
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);

        let results = null;

        results = {
            songName: info.title,
            sampleUrl: info.formats[0].url,
            songUrl: youtubeUrl,
            imageUrl: info.thumbnails[0].url
        };

        callback(results)
    });
}
/*
searchSong("onynye psquare", function(results) {
    console.log(results);
});

*/

module.exports = {
    searchSong,
    getYoutubeAudioURL,
};
