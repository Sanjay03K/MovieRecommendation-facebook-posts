from operator import le
from flask import Flask, request
from pandas import array
from textblob import TextBlob
import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
import matplotlib.pyplot as plt
import seaborn as sns
import json 

movies = pd.read_csv("../archive/movies.csv")
ratings = pd.read_csv("../archive/ratings.csv")

no_user_voted = ratings.groupby('movieId')['rating'].agg('count')
no_movies_voted = ratings.groupby('userId')['rating'].agg('count')

final_dataset = ratings.pivot(index='movieId',columns='userId',values='rating')
final_dataset.fillna(0,inplace=True)

final_dataset = final_dataset.loc[no_user_voted[no_user_voted > 10].index,:]
final_dataset=final_dataset.loc[:,no_movies_voted[no_movies_voted > 50].index]
sample = np.array([[0,0,3,0,0],[4,0,0,0,2],[0,0,0,0,1]])
sparsity = 1.0 - ( np.count_nonzero(sample) / float(sample.size) )
csr_sample = csr_matrix(sample)
csr_data = csr_matrix(final_dataset.values)
final_dataset.reset_index(inplace=True)
knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=20, n_jobs=-1)
knn.fit(csr_data)

app = Flask(__name__) 

@app.route('/getrec', methods = ['POST']) 
def sum_of_array(): 
    data = request.get_json() 
    good_movies = []
    final_rec = []
    post_movie_genre = []
    for i in range(len(data)):
        good_movies.append(get_rating(data[i]['post'],data[i]['Movie Name']))
    for i in range(len(good_movies)):
        final_rec.append(get_movie_recommendation(good_movies[i]['movie']))
    for i in range(len(good_movies)):
        post_movie_genre.append(find_postmovie_genre(good_movies[i]['movie']))
    
    final_list = []
    for i in range(len(post_movie_genre)):
        for j in range(len(final_rec[i][0])):
            # print(final_rec[i])
            split = final_rec[i][0].iloc[j,0].split('|')
            # print(split)
            if(check(split,post_movie_genre[i],1)):
                final_list.append(final_rec[i][0].iloc[j,1])
    
    return json.dumps({"result":final_list})


def get_rating(feedback,movie) :
    blob = TextBlob(feedback)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    if(polarity > 0) :
        rating = ((round(polarity,2)*100)/100)*5
        res  = {'movie' : movie,'polarity' : polarity , 'subjectivity' : subjectivity, 'rating' : rating}
    return res


def get_movie_recommendation(movie_name):
    n_movies_to_reccomend = 10
    movie_list = movies[movies['title'].str.contains(movie_name)]  
    if len(movie_list):        
        movie_idx= movie_list.iloc[0]['movieId']
        movie_idx = final_dataset[final_dataset['movieId'] == movie_idx].index[0]
        distances , indices = knn.kneighbors(csr_data[movie_idx],n_neighbors=n_movies_to_reccomend+1)    
        rec_movie_indices = sorted(list(zip(indices.squeeze().tolist(),distances.squeeze().tolist())),key=lambda x: x[1])[:0:-1]
        recommend_frame = []
        for val in rec_movie_indices:
            movie_idx = final_dataset.iloc[val[0]]['movieId']
            idx = movies[movies['movieId'] == movie_idx].index
            recommend_frame.append({'Genres':movies.iloc[idx]['genres'].values[0],'Title':movies.iloc[idx]['title'].values[0],'Distance':val[1]})
        df = pd.DataFrame(recommend_frame,index=range(1,n_movies_to_reccomend+1))
        return [df]
    else:
        return "No movies found. Please check your input"

def find_postmovie_genre(movie):
    find_movie = movies[movies['title'] == movie]
    find_movie_genres = find_movie['genres'].to_string()
    genre_list = []
    if('Adventure' in find_movie_genres):
        genre_list.append("Adventure")
    if('Action' in find_movie_genres):
        genre_list.append("Action")
    if('Animation' in find_movie_genres):
        genre_list.append("Animation")
    if('Children' in find_movie_genres):
        genre_list.append("Children")
    if('Thriller' in find_movie_genres):
        genre_list.append("Thriller")
    if('Romance' in find_movie_genres):
        genre_list.append("Romance")
    if('Drama' in find_movie_genres):
        genre_list.append("Drama")
    if('Comedy' in find_movie_genres):
        genre_list.append("Comedy")
    if('Crime' in find_movie_genres):
        genre_list.append("Crime")
    if('Fantasy' in find_movie_genres):
        genre_list.append("Fantasy")
    if('Sci-Fi' in find_movie_genres):
        genre_list.append("Sci-Fi")
    return genre_list

def check(ars,genre_list,size):
    list_as_set = set(ars)
    intersection = list_as_set.intersection(genre_list)
    intersection_as_list = list(intersection)
    len_list = len(intersection_as_list)
    if(len_list>=size):
        return 1;
    else:
        return 0;

if __name__ == "__main__": 
    app.run(port=4000)