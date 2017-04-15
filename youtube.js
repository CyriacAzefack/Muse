/**
 * Created by I327247 on 15/04/2017.
 */
const fs = require('fs');
const youtubedl = require('youtube-dl');

function searchSong (songName, artistName, callback) {

    let url = 'https://www.youtube.com/watch?v=QRRPt0ysfyI';

    getYoutubeAudioURL(url, callback);
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
/*
var url = 'https://www.youtube.com/watch?v=QRRPt0ysfyI';

getYoutubeAudioURL(url, function(results) {
   console.log(results)
});

*/



module.exports = {
    getYoutubeAudioURL,
};
