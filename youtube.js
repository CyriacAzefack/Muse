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
        getYoutubeAudioURL(url, callback);
    }

}

function getYoutubeAudioURL(youtubeUrl, callback) {

    const options = ['--format=bestaudio/best', '--extract-audio']

    const stream = youtubedl(youtubeUrl, options);
// Will be called when the download starts.


    stream.on('info', function(info) {

        //console.log(info)
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);
        console.log('url: ' + info.url);

        let results = null;

        results = {
            songName: info.title,
            sampleUrl: info.url,
            songUrl: youtubeUrl,
            imageUrl: info.thumbnails[0].url
        };

        callback(results)
    });
}



module.exports = {
    searchSong,
    getYoutubeAudioURL,
};
