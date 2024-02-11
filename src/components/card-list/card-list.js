import React, { Component } from 'react';
import { Alert, Tabs } from 'antd';

import './card-list.css';
import MovieDbService from '../../services/movie-db-service';
import Loader from '../loader';
import { MovieServiceProvider } from '../genresContext/genresContext';
import Page from '../page/page';

export default class CardList extends Component {
  movieService = new MovieDbService();

  state = {
    genres: {},
    isLoading: true,
    error: false,
    guestSession: {},
    // фильмы
    query: undefined,
    movies: [],
    page: undefined,
    totalPages: undefined,
    // оцененные из гостевой сессии
    ratedMovies: [],
    ratedPage: undefined,
    ratedTotalPages: undefined,
  };

  componentDidMount() {
    // получения списка фильмов
    try {
      this.movieService
        .getAllFilms()
        .then((res) => {
          this.onMoviesLoaded(res.movies);
          this.onMoviesLoadedInfo(res);
          this.setState(() => ({ isLoading: false }));
        })
        .catch((e) => {
          this.setState(() => ({ isLoading: false }));
          this.setState(() => ({ error: true }));
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
    // получения списка жанров
    try {
      this.movieService.getAllGenres().then((res) => {
        this.setState({ genres: res });
      });
    } catch (error) {
      console.log(error);
    }
    // создание гостевой сессии
    try {
      this.movieService.createGuesSession().then((res) => {
        this.setState({ guestSession: res });
      });
    } catch (error) {
      console.log(error);
    }
  }

  Error = () => {
    return <Alert message="Error" description="Не удалось загрузить список фильмов" type="error" showIcon />;
  };

  addRating = (movieID, rating) => {
    try {
      this.movieService
        .addRating(this.state.guestSession.guest_session_id, movieID, rating)
        .then(console.log)
        .catch(console.log);
    } catch (error) {
      console.log(error);
    }
  };

  onMoviesLoaded = (movies) => {
    this.setState((state) => {
      return { movies };
    });
  };

  onMoviesLoadedInfo = ({ page, totalPages }) => {
    this.setState((state) => {
      return { page, totalPages };
    });
  };

  SearchByNewQuery = (query) => {
    try {
      this.setState(() => ({ isLoading: true }));
      this.movieService
        .getAllFilms(query)
        .then((res) => {
          this.onMoviesLoaded(res.movies);
          this.onMoviesLoadedInfo(res);
          this.setState(() => ({ isLoading: false }));
          this.setState(() => ({ query }));
        })
        .catch((e) => {
          this.setState(() => ({ isLoading: false }));
          this.setState(() => ({ error: true }));
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  };

  SearchByNewPage = (page) => {
    try {
      this.setState(() => ({ isLoading: true }));
      this.movieService
        .getAllFilms(this.state.query, page)
        .then((res) => {
          this.onMoviesLoaded(res.movies);
          this.onMoviesLoadedInfo(res);
          this.setState(() => ({ isLoading: false }));
        })
        .catch((e) => {
          this.setState(() => ({ isLoading: false }));
          this.setState(() => ({ error: true }));
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  };

  SearchByNewPageRated = (page) => {
    try {
      this.setState(() => ({ isLoading: true }));
      this.movieService
        .getRatedMovies(this.state.guestSession.guest_session_id, page)
        .then((res) => {
          console.log(res);
          this.setState(({ ratedPage, ratedTotalPages, ratedMovies }) => {
            return {
              ratedMovies: res.movies,
              ratedTotalPages: res.totalPages,
              ratedPage: res.page,
            };
          });
          this.setState(() => ({ isLoading: false }));
        })
        .catch((e) => {
          this.setState(() => ({ isLoading: false }));
          this.setState(() => ({ error: true }));
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  };

  TabsChangeHandler = (key) => {
    if (key === '2') {
      try {
        this.movieService
          .getRatedMovies(this.state.guestSession.guest_session_id, this.state.ratedPage)
          .then((res) => {
            console.log(res);
            this.setState(({ ratedPage, ratedTotalPages, ratedMovies }) => {
              return {
                ratedMovies: res.movies,
                ratedTotalPages: res.totalPages,
                ratedPage: res.page,
              };
            });
          })
          .catch(console.log);
      } catch (error) {
        console.log(error, 196);
      }
    }
  };

  render() {
    const { isLoading, error, movies, page, totalPages, ratedMovies, ratedPage, ratedTotalPages } = this.state;
    const items = [
      {
        key: '1',
        label: 'Tab 1',
        children: (
          <Page
            movies={movies}
            page={page}
            totalPages={totalPages}
            addRating={this.addRating}
            _search
            SearchByNewQuery={this.SearchByNewQuery}
            SearchByNewPage={this.SearchByNewPage}
          />
        ),
      },
      {
        key: '2',
        label: 'Tab 2',
        children: (
          <Page
            movies={ratedMovies}
            page={ratedPage}
            totalPages={ratedTotalPages}
            addRating={function test() {}}
            disableRate
            SearchByNewPage={this.SearchByNewPageRated}
          />
        ),
      },
    ];
    const loader = isLoading ? <Loader /> : null;
    const _error = error ? <this.Error /> : null;
    const tabs =
      !isLoading && !error ? (
        <Tabs centered indicator={{ size: 65 }} items={items} onChange={this.TabsChangeHandler} />
      ) : null;
    return (
      <MovieServiceProvider value={this.state.genres}>
        {loader}
        {_error}
        {tabs}
      </MovieServiceProvider>
    );
  }
}
