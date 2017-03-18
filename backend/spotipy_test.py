

# shows a user's playlists (need to be authenticated via oauth)

import spotipy
import spotipy.util as util
import os
import json
import sys
import pandas as pd

#Application (Muse) credentials
os.environ["SPOTIPY_CLIENT_ID"] = 'd79b7361b6e74f6d935c68d1cdb32502'
os.environ["SPOTIPY_CLIENT_SECRET"] = 'e8248bd02998406d935d0d16e684592c'
os.environ["SPOTIPY_REDIRECT_URI"] = 'http://localhost:3030/callback'


def show_tracks(tracks):
    for i, item in enumerate(tracks['items']):
        track = item['track']
        print ("   %d %32.32s %s" % (i, track['artists'][0]['name'],
            track['name']))


if __name__ == '__main__':
    username = 'marshallerikson'
    #username = raw_input("Please enter your username: ")
    token = util.prompt_for_user_token(username, scope='user-top-read')

    if token:
        sp = spotipy.Spotify(auth=token)
        playlists = sp.user_playlists(username)
        for playlist in playlists['items']:
            if playlist['owner']['id'] == username:
                print()
                print(playlist['name'])
                print( '  total tracks', playlist['tracks']['total'])
                results = sp.user_playlist(username, playlist['id'],
                    fields="tracks,next")
                tracks = results['tracks']
                show_tracks(tracks)
                while tracks['next']:
                    tracks = sp.next(tracks)
                    show_tracks(tracks)
    else:
        print( "Can't get token for", username)
