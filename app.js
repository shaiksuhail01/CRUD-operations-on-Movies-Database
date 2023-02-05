const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const path = require("path");
module.exports = app;
const db_path = path.join(__dirname, "moviesData.db");

let db = null;
const initalizeDbAndServer = async () => {
  try {
    db = await open({
      filename: db_path,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running!");
    });
  } catch (error) {
    console.log(`Database Error ${error.message}`);
  }
};
initalizeDbAndServer();

//API 1

app.get("/movies/", async (request, response) => {
  const query1 = `SELECT movie_name AS movieName 
    FROM 
    movie;`;
  const moviesList = await db.all(query1);
  response.send(moviesList);
});

//API 2

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const query2 = `INSERT INTO movie(director_id,movie_name,lead_actor)VALUES('${directorId}','${movieName}','${leadActor}');`;
  await db.run(query2);
  response.send("Movie Successfully Added");
});

//API 3
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query3 = `SELECT movie_id as movieId, director_id AS directorId, movie_name AS movieName,lead_actor AS leadActor
    FROM movie
    WHERE 
    movie_id=${movieId};`;
  const movie = await db.get(query3);
  response.send(movie);
});

//API 4

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const updateDetails = request.body;
  const { directorId, movieName, leadActor } = updateDetails;
  const query4 = `UPDATE movie SET
    director_id='${directorId}',movie_name='${movieName}',lead_actor='${leadActor}'
    WHERE movie_id=${movieId};`;
  await db.run(query4);
  response.send("Movie Details Updated");
});

//API 5

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query5 = `DELETE 
    FROM movie WHERE 
    movie_id=${movieId};`;
  await db.run(query5);
  response.send("Movie Removed");
});

//API 6
app.get("/directors/", async (request, response) => {
  const query6 = `SELECT director_id AS directorId, director_name AS directorName
    FROM director;`;
  const listDirectors = await db.all(query6);
  response.send(listDirectors);
});

//API 7

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const query7 = `SELECT movie_name AS movieName FROM 
    movie WHERE director_id=${directorId};`;
  const moviesList = await db.all(query7);
  response.send(moviesList);
});
