function convertDBobjectToresponse(dbObject) {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  }
}

module.exports = convertDBobjectToresponse