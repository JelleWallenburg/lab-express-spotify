require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req,res) => {
    res.render('index')
})

app.get('/artist-search', (req, res) => {
    console.log('req.query', req.query["artist-name"])
    spotifyApi
    .searchArtists(req.query["artist-name"])
    .then(data => {
        const artistFromApi= data.body.artists.items;
        console.log('The received data from the API: ', artistFromApi)
        res.render('artist-search-result', {artistFromApi:artistFromApi});
  })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums', (req, res) =>{
    console.log('req.query',req.query['artist-id'])
    spotifyApi
    .getArtistAlbums(req.query['artist-id'])
    .then(data => {
        const albumsFromApi= data.body.items
        console.log('The received data:', albumsFromApi)
        res.render('albums', {albumsFromApi:albumsFromApi})
    })
    .catch(err => console.log('The error while searching the albums occurred: ', err))
})

app.get('/album-tracks', (req, res) => {
    console.log(req.query)
    spotifyApi
    .getAlbumTracks(req.query['album-id'])
    .then(data=> {
        const tracksFromApi= data.body.items
        console.log('The received data:', tracksFromApi)
        res.render('tracks', {tracksFromApi:tracksFromApi})
    })
    .catch(err => console.log('The error while searching the albums occurred: ', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
