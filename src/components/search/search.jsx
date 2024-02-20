import React from 'react';
import { Form, Input } from 'antd';
import { debounce } from 'lodash';

export default class Search extends React.Component {
  formRef = React.createRef();

  debouncedHandleChange = debounce((value) => {
    if (value.trim()) {
      this.props.SearchByNewQuery(value);
      this.formRef.current.resetFields();
    }
  }, 1500);

  onChange(e) {
    this.debouncedHandleChange(e.currentTarget.value);
  }

  componentWillUnmount() {
    this.debouncedHandleChange.cancel();
  }

  render() {
    return (
      <Form ref={this.formRef}>
        <Form.Item name="name" style={{ marginTop: '20px' }}>
          <Input onChange={(e) => this.onChange(e)} placeholder="Введите название фильма" />
        </Form.Item>
      </Form>
    );
  }
}
