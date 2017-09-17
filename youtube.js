/**
 * Created by I327247 on 15/04/2017.
 */
const fs        = require('fs');
const youtubedl = require('youtube-dl');
const yss       = require('youtube-simple-search');
const request   = require('request')
const config    = require('./config.json');

const express   = require('express');

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

        const download_base_url = "https://www.youtubeinmp3.com/fetch/?format=JSON&video=https://www.youtube.com/watch?v="

        request(download_base_url+info.id, function(err, response, body){
                if (err) throw err;
                body_json = JSON.parse(body)
                let results = null;

                results = {
                    songName: info.title,
                    donwloadUrl: body_json.link,
                    youtubeUrl: youtubeUrl,
                    streamUrl: info.formats[0].url,
                    imageUrl: info.thumbnails[0].url
                };

                callback(results)
            });

    });
}

/*
searchSong("tantine keblack", function(results) {
    console.log(results);
});
*/
function getYoutubeToMp3(youtubeID) {

}


module.exports = {
    searchSong,
    getYoutubeAudioURL,
};
