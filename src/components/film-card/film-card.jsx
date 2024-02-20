import React, { Component } from 'react';
import { Card, Row, Col, Image, Button, Rate } from 'antd';
import './film-card.css';
import { format } from 'date-fns';

import { MovieServiceConsumer } from '../genresContext/genresContext';

import img from './posterNotFound1.png';

export default class FilmCard extends Component {
  getColor = (val) => {
    if (val > 7) return '#66E900';
    if (val >= 5 && val <= 7) return '#E9D100';
    if (val >= 3 && val <= 5) return '#E97E00';
    if (val < 3) return '#E90000';
    return '#000000';
  };

  rateChangeHandler = (rating) => {
    this.props.addRating(this.props.movie.id, rating);
  };

  render() {
    const { movie } = this.props;
    const imgPath = `https://image.tmdb.org/t/p/original/${movie.poster}`;

    return (
      <Card
        style={{
          marginTop: '20px',
          boxShadow: '7px 9px 12px 0px rgba(34, 60, 80, 0.4)',
          // width:'450px'
        }}
        styles={{
          body: {
            padding: '0 10px 0 0',
          },
        }}
      >
        <Row gutter={16}>
          <Col span={11}>
            <Image
              style={{
                maxWidth: '250px',
                borderTopLeftRadius: '10px',
                borderBottomLeftRadius: '5px',
              }}
              preview={false}
              src={movie.poster ? imgPath : img}
            />
          </Col>
          <Col span={13}>
            <div style={{ display: 'flex' }}>
              {/* название */}
              <h2 style={{ float: 'left', marginRight: '10px' }}>{movie.title}</h2>

              {/* рейтинг */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginLeft: 'auto',
                  marginTop: '10px',

                  alignItems: 'center',
                  minWidth: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  boxSizing: 'content-box',
                  boxShadow: `0 0 0 1px black, 0 0 0 4px ${this.getColor(movie.rate)}, 0 0 0 5px black`,
                  // float: 'right', // Add this line
                }}
              >
                {movie.rate.toFixed(2)}
              </div>
            </div>

            {/* дата */}
            <p>{movie.date ? format(new Date(movie.date), 'dd MMMM yyyy') : null}</p>

            {/* жанры */}
            <div>
              <MovieServiceConsumer>
                {(genres) =>
                  movie.genres.map((el, id) => (
                    <Button
                      key={id}
                      style={{ background: 'rgba(100,100,100,.1)', marginRight: '5px', marginBottom: '10px' }}
                      size={'small'}
                    >
                      {genres[el]}
                    </Button>
                  ))
                }
              </MovieServiceConsumer>
            </div>

            {/* описание */}
            <p style={{ wordWrap: 'break-word' }}>{movie.overview}</p>
            {/* звезды */}
            <Rate
              allowHalf
              defaultValue={movie.rating ? movie.rating : 0}
              count={10}
              disabled={this.props.disabled ? this.props.disabled : false}
              onChange={this.rateChangeHandler}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}
