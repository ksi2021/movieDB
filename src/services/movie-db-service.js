export default class MovieDbService {
  _apiBase = 'https://api.themoviedb.org/3/';

  _apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjk2NmI4OTE5NGUxNDMwZjgzNjM5MDMwMjJmOTI4YSIsInN1YiI6IjY1YTNlOTYyN2Q1ZjRiMDBjNWI3ZjM4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.N0cKRdVWDNAtF0ISWQW885FxUG3POQp6lVEOqO7cbeQ';

  _imgBase = 'https://image.tmdb.org/t/p/original/';

  apiKey = 'd2966b89194e1430f8363903022f928a';

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this._apiKey}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  }

  async getAllFilms(query = 'return', page = 1) {
    const res = await this.getResource(`search/movie?query=${query}&page=${page}`);
    const data = res.results.map((el) => this._transformMovie(el));
    return { page: res.page, totalPages: res.total_pages, movies: data };
  }

  async getAllGenres() {
    const res = await this.getResource('genre/movie/list?language=en');
    return res.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  }

  async createGuesSession() {
    const res = await fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.apiKey}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(
        `Could not fetch https://api.themoviedb.org/3/authentication/guest_session , received ${res.status}`,
      );
    }
    return await res.json();
  }

  async getRatedMovies(guestSessionID, page = 1) {
    if (!guestSessionID) throw new Error('guestSessionID not found');

    let res = await fetch(
      `${this._apiBase}guest_session/${guestSessionID}/rated/movies?api_key=${this.apiKey}&language=en-US&page=${page}`,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        },
      },
    );
    if (!res.ok) {
      throw new Error(`Could not fetch ${this._apiBase}guest_session/${guestSessionID}, received ${res.status}`);
    }

    res = await res.json();
    const data = res.results.map((el) => this._transformMovie(el));
    return { page: res.page, totalPages: res.total_pages, movies: data };
  }

  async addRating(guestSessionID, movieID, rating) {
    if (!guestSessionID || !movieID || !rating) throw new Error('bad request');

    const res = await fetch(
      `${this._apiBase}movie/${movieID}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionID}`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: rating }),
      },
    );

    if (!res.ok) {
      res.json().then(console.log);
      throw new Error(
        `Could not fetch movie/${movieID}/rating?guest_session_id=${guestSessionID}, received ${res.status}`,
      );
    }
    return await res.json();
  }

  _extractId(item) {
    const idRegExp = /\/([0-9]*)\/$/;
    return item.url.match(idRegExp)[1];
  }

  _transformMovie(movie) {
    return {
      id: movie.id,
      title: movie.title,
      rate: movie.vote_average,
      poster: movie.poster_path,
      overview: this._prepareOverviewLength(movie.overview),
      date: movie.release_date,
      genres: movie.genre_ids,
      rating: movie.rating ? movie.rating : null,
    };
  }

  _prepareOverviewLength(overview = '') {
    const baseLength = 200;
    if (!overview) return 'overview not found';
    if (baseLength > overview.length) return overview;
    let endIndex = baseLength;

    while (overview[endIndex] !== ' ' && endIndex < overview.length) {
      endIndex++;
    }

    return `${overview.substring(0, endIndex)}...`;
  }
}
