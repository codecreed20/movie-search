document.addEventListener("DOMContentLoaded", function () {
    const apiKey = '0e06e83dec5b03c322ff45ad9620292c'; // Replace with your TMDb API key

    const searchMovieButton = document.getElementById("search-movie-button");
    const searchActorButton = document.getElementById("search-actor-button");
    const searchDirectorButton = document.getElementById("search-director-button");
    const movieSearchInput = document.getElementById("movie-search");
    const actorSearchInput = document.getElementById("actor-search");
    const directorSearchInput = document.getElementById("director-search");
    const movieTitleElement = document.getElementById("movie-title");
    const overviewElement = document.getElementById("overview");
    const releaseDateElement = document.getElementById("release-date");
    const actorsElement = document.getElementById("actors");
    const directorElement = document.getElementById("director");
    const movieographyElement = document.getElementById("movieography");
    const posterElement = document.getElementById("poster");
    const personImageElement = document.getElementById("person-image");
    const moviePosterContainer = document.getElementById("movie-poster-container");

    searchMovieButton.addEventListener("click", function () {
        searchMovie();
    });

    searchActorButton.addEventListener("click", function () {
        searchPerson(actorSearchInput.value, "actor");
    });

    searchDirectorButton.addEventListener("click", function () {
        searchPerson(directorSearchInput.value, "director");
    });

    function searchMovie() {
        const movieTitle = movieSearchInput.value;

        if (movieTitle.trim() === "") {
            alert("Please enter a movie title.");
            return;
        }

        const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movieTitle}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    const movie = data.results[0];
                    displayMovieDetails(movie);
                } else {
                    alert("Movie not found.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function searchPerson(personName, job) {
        if (personName.trim() === "") {
            alert("Please enter a name.");
            return;
        }

        const personSearchUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${personName}`;

        fetch(personSearchUrl)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    const person = data.results[0];
                    displayPersonDetails(person, job);
                } else {
                    alert("Person not found.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function displayMovieDetails(movie) {
        movieTitleElement.textContent = movie.title;
        overviewElement.textContent = movie.overview;
        releaseDateElement.textContent = `Release Date: ${movie.release_date}`;
        actorsElement.textContent = "Actors: N/A";
        directorElement.textContent = "Director: N/A";
        movieographyElement.textContent = "Movies: N/A";

        if (movie.poster_path) {
            posterElement.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        } else {
            posterElement.src = ""; // Clear poster if not available
        }
    }

    function displayPersonDetails(person, job) {
        if (job === "actor") {
            actorsElement.textContent = `Actors: ${person.name}`;
        } else if (job === "director") {
            directorElement.textContent = `Director: ${person.name}`;
        }

        const filmographyUrl = `https://api.themoviedb.org/3/person/${person.id}/movie_credits?api_key=${apiKey}`;

        fetch(filmographyUrl)
            .then(response => response.json())
            .then(data => {
                const movies = data.cast.map(movie => {
                    // Display movie posters
                    const poster = movie.poster_path
                        ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster">`
                        : "";
                    return `
                        <div class="movie-poster">
                            ${poster}
                            <p>${movie.title}</p>
                        </div>
                    `;
                });
                movieographyElement.innerHTML = `Movies: ${movies.join(", ")}`;
            })
            .catch(error => {
                console.error('Error:', error);
            });

        if (person.profile_path) {
            personImageElement.src = `https://image.tmdb.org/t/p/w500${person.profile_path}`;
        } else {
            personImageElement.src = ""; // Clear image if not available
        }
    }
});
