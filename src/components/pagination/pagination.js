import React from 'react';
import { Pagination, Row } from 'antd';

const MoviePagination = ({ currentPage = 1, totalPages = 1, SearchByNewPage }) => {
  const switchPage = (page, size) => {
    SearchByNewPage(page);
  };

  return (
    <Row justify="center" style={{ marginTop: 30 }}>
      <Pagination
        current={currentPage}
        total={totalPages * 20}
        showSizeChanger={false}
        onChange={switchPage}
        pageSize={20}
      />
    </Row>
  );
};

export default MoviePagination;
