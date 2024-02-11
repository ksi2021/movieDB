import React from 'react';
import { Col, Row, Alert } from 'antd';

import Search from '../search/search';
import MoviePagination from '../pagination/pagination';
import FilmCard from '../film-card/film-card';

export default class SearchPage extends React.Component {
  render() {
    const { movies, page, totalPages } = this.props;
    if (!movies || !movies.length)
      return (
        <>
          {this.props._search && <Search SearchByNewQuery={this.props.SearchByNewQuery} />}
          <Alert message="Informational Notes" description="No movies were found" type="warning" showIcon />
        </>
      );

    return (
      <>
        {this.props._search && <Search SearchByNewQuery={this.props.SearchByNewQuery} />}
        <Row gutter={16}>
          {movies.length > 0 &&
            movies.map((el) => (
              <Col key={el.id} xl={{ span: 12 }} lg={{ span: 12 }} md={{ span: 24 }} xs={{ span: 24 }}>
                <FilmCard disabled={this.props.disableRate} addRating={this.props.addRating} movie={el} />
              </Col>
            ))}
        </Row>
        <MoviePagination currentPage={page} totalPages={totalPages} SearchByNewPage={this.props.SearchByNewPage} />
      </>
    );
  }
}
