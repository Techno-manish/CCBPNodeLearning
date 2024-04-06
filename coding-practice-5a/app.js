const express = require('express')
const path = require('path')
const convertDBobjectToresponse = require('./DBobjectToResponse.js')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'moviesData.db')

db = null
const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server started at port 3000')
    })
  } catch (e) {
    console.log(`Error: ${e}`)
  }
}
initializeDBandServer()

app.get('/movies/', async (request, response) => {
  const getListOfMoviesQuery = `
  SELECT 
    movie_name
  FROM 
    movie;
  `
  const movies = await db.all(getListOfMoviesQuery)
  response.send(movies.map(eachMovie => convertDBobjectToresponse(eachMovie)))
})

app.get('/movies/:movieId', async (request, response) => {
  const {movieId} = request.params
  const getMoviesQuery = `
  SELECT 
    *
  FROM 
    movie
  WHERE
    movie_id = ${movieId};
  `
  const movie = await db.get(getMoviesQuery)
  response.send(convertDBobjectToresponse(movie))
})

app.post('/movies/', async (request, response) => {
  const movieDetatils = request.body
  const {directorId, movieName, leadActor} = movieDetatils
  const addMovieQuery = `
  INSERT INTO
    movie (director_id, movie_name, lead_actor)
  VALUES
  (
    ${directorId},
    '${movieName}',
    '${leadActor}'
  );
  `
  const dbResponse = await db.run(addMovieQuery)
  const movieId = dbResponse.lastID
  response.send('Movie Successfully Added')
})

app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails

  const updateMovieQuery = `
  UPDATE
    movie
  SET
    director_id= ${directorId},
    movie_name= '${movieName}',
    lead_actor= '${leadActor}';
  WHERE
    movie_id = ${movieId};
  `
  await db.run(updateMovieQuery)
  response.send('Movie Details Updated')
})

app.delete('/movies/:movieId/', (request, response) => {
  const {movieId} = request.params
  const deleteMovieQuesry = `
  DELETE FROM
    movie
  WHERE
    movie_id = ${movieId};
  `
  response.send('Movie Removed')
})

app.get('/directors/', async (request, response) => {
  const getDirectorsQuery = `
  SELECT * FROM
    director;
  `
  const directors = await db.all(getDirectorsQuery)
  response.send(
    directors.map(eachDirec => convertDBobjectToresponse(eachDirec)),
  )
})

app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getDirectorMovieQuery = `
  SELECT
    distinct movie_name
  FROM
    movie
  WHERE
    director_id = ${directorId};
  `
  const movies = await db.all(getDirectorMovieQuery)
  response.send(movies.map(eachMovie => convertDBobjectToresponse(eachMovie)))
})

module.exports = app
