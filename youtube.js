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
        maxResults: 10
        },

        getVideoUrl
    );

    function getVideoUrl(results) {
        //console.log(result);

        for (let result of results) {

            console.log(result);
            if(result.id.kind == "youtube#video") {
                var url = urlRoot + result.id.videoId;
                getYoutubeAudioURL(url, callback);

                break;
            }
        }


    }

}


function getYoutubeAudioURL(youtubeUrl, callback) {

    const options = ['--format=bestaudio/best', '--extract-audio', '--skip-download', '--get-url']

    // Optional arguments passed to youtube-dl.
    //var options = ['--username=user', '--password=hunter2'];
    youtubedl.getInfo(youtubeUrl, options, function(err, info) {
        if (err) throw err;

        //console.log(info)
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);

        const songUrl =  "www.youtubeinmp3.com/fetch/?video=https://www.youtube.com/watch?v="
        let results = null;

        results = {
            songName: info.title,
            songUrl: songUrl+info.id,
            sampleUrl: youtubeUrl,
            streamUrl: info.formats[0].url,
            imageUrl: info.thumbnails[0].url
        };

        callback(results)
    });
}


/*
searchSong("tantine keblack", function(results) {
    console.log(results);
});

*/

module.exports = {
    searchSong,
    getYoutubeAudioURL,
};
