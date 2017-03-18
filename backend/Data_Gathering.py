# -*- coding: utf-8 -*-
"""
Created on Wed Jan 25 22:07:41 2017

@author: I327247
"""

import spotipy
import spotipy.util as util
import os
import json
import sys
import pandas as pd

#Application (Muse) credentials
#os.environ["SPOTIPY_CLIENT_ID"] = 'd79b7361b6e74f6d935c68d1cdb32502'
#os.environ["SPOTIPY_CLIENT_SECRET"] = 'e8248bd02998406d935d0d16e684592c'
#os.environ["SPOTIPY_REDIRECT_URI"] = 'http://localhost:3030/callback'

#Dump function for a better display of dictionnaries objects
def dumpclean(obj):
    print(json.dumps(obj, indent = 10))
    
#Print the track
def show_track(track):
        print("%s %32.32s %s" % ('Track', track['artists'][0]['name'], track['name']))
        
def show_artist(artist):
    print()


def main(sp):
    """
        Main Function : Take the Spotify context as parameter 
    """
    
    #ranges = ['short_term', 'medium_term', 'long_term']
    time_range = 'long_term'

    tracks_id = []
    
    #Dataframe containing Tracks overall description
    track_df = pd.DataFrame(columns=['track_id', 'title', 'artist_id', 'popularity',
                                     'duration_ms', 'like'])
    
    #Dataframe containing Artists overall description
    artist_df = pd.DataFrame(columns=['artist_id', 'name', 'genre', 'popularity', 'followers'])
    
    #Dataframe containing features of the tracks
    feat_columns=['id', 'danceability', 'energy', 'key', 'loudness', 'mode',
                'speechiness', 'acousticness', 'instrumentalness',
                'liveness', 'valence', 'tempo', 'duration_ms', 
                'time_signature']
    feature_df = pd.DataFrame(columns=feat_columns)
    
    print("time range:", time_range)

    '''
    1) Retrieving user top tracks 
    '''
       
    results = sp.current_user_top_tracks(limit=50, time_range=time_range)
    first = True
    hasNext = True
    while hasNext :
        if first :
            first = False
        else :
            results = sp.next(results)

        for i, item in enumerate(results['items']) :
            track = sp.track(item['uri'])
            tracks_id.append(item['id'])
            
            #Add track to the tracks dataframe
            row = [item['id'], track['name'], track['artists'][0]['id'],
                   track['popularity'], track['duration_ms'], 1]
            track_df.loc[len(track_df)] = row
            #show_track(track)
        hasNext = results['next']
             
   
    '''
    2) Retrieving user top artists 
    '''
     
    results = sp.current_user_top_artists(limit=50, time_range=time_range)
    first = True
    hasNext = True
    while hasNext :
        if first :
            first = False
        else :
            results = sp.next(results)

        for i, artist in enumerate(results['items']) :
            #Add artist to the artist dataframe
            row = [artist['id'], artist['name'], artist['genres'], artist['popularity'],
                   artist['followers']['total']]
            artist_df.loc[len(artist_df)] = row
            #show_track(track)
        hasNext = results['next']
    
    
    print('There are %d tracks retrieved after seed' % (len(track_df)))
    
    '''
    3) Get the seed recommendations based on the tracks and artists
    '''
    nb_seed_per_track = 10
    
    track_artist_df = track_df.merge(artist_df, how='inner', on='artist_id',
                                     suffixes=['_track', '_artist'])
    
    
    print(sp.recommendation_genre_seeds())
    
    for index, track in track_artist_df.iterrows():
        print('##### %s #####' % (track.title))
        seed_artists = [track.artist_id, track.artist_id]
        seed_tracks =  [track.track_id, track.track_id]
        results = sp.recommendations(seed_artists=seed_artists,
                                     seed_tracks=seed_tracks,
                                     target_popularity=int(track.popularity_track),
                                     limit=nb_seed_per_track)
        for i, seed_track in enumerate(results['tracks']) :
            show_track(seed_track)
            row = [seed_track['id'], seed_track['name'], seed_track['artists'][0]['id'],
                   seed_track['popularity'], seed_track['duration_ms'], 0]
            track_df.loc[len(track_df)] = row
    
    print('There are %d tracks retrieved after seed' % (len(track_df)))
    
    print(track_df.head())
    
    #Drop duplicates in the dataframe
    track_df = track_df.drop_duplicates(['track_id'])
    artist_df = artist_df.drop_duplicates(['artist_id'])
    
    '''
    4) Get the tracks features
    '''
    #Get the tracks features
    nb_tracks = len(track_df)
    
    #Audio features for severals tracks required max 100 tracks id
    nb_tracks_id_max = 100
    for offset in range(0, nb_tracks, nb_tracks_id_max):
        track_id_list = list(track_df.track_id)[offset:offset+nb_tracks_id_max]
        features_results = sp.audio_features(track_id_list)
        
        for track_features in features_results :
            solo_feat_df = pd.DataFrame(track_features, index=[0])
            solo_feat_df = solo_feat_df[feat_columns]
            feature_df = feature_df.append(solo_feat_df, ignore_index=True)
        
    
   
    
    #Dump the dataframe
    track_df.to_csv('tracks.csv', index=False, encoding='utf-8')
    
    feature_df.to_csv('tracks_features.csv', index=False, encoding='utf-8')
    #Join the two dataframes

if __name__ == '__main__':
    username = 'marshallerikson'

    #Let's start with the public scope and we'll refine it when needed
    scope = 'user-top-read'
    
    #Create the authentication token.
    #Also use the Muse credentials to connect to the right app
    token = util.prompt_for_user_token(username, scope=scope)
    
    if token :
       
        sp = spotipy.Spotify(auth=token)
        print('Authentication successfull as %s !!!' % sp.current_user()['id'])
        main(sp)    
        
        print('Script done !!!')
    else : 
        print('Authentication failed. Can\'t get token for', username)
        sys.exit()