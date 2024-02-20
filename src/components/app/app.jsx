import React from 'react';
import { Layout, Alert } from 'antd';

import CardList from '../card-list/card-list';

const { Content, Footer } = Layout;
export default class App extends React.Component {
  state = { networkConnect: true };

  updateNetworkStatus = () => {
    this.setState({ networkConnect: navigator.onLine });
  };

  componentDidMount() {
    window.addEventListener('online', this.updateNetworkStatus);
    window.addEventListener('offline', this.updateNetworkStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.updateNetworkStatus);
    window.removeEventListener('offline', this.updateNetworkStatus);
  }

  render() {
    if (!this.state.networkConnect)
      return (
        <Alert
          message="You are offline now"
          description="This is an error message about network state."
          type="error"
          showIcon
          style={{ margin: '20px' }}
        />
      );

    return (
      <Layout
        style={{
          width: '85%',
          marginLeft: 'auto',
          marginRight: 'auto',
          minHeight: '100vh',
        }}
      >
        <Content style={{ padding: '0 20px' }}>
          <CardList />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    );
  }
}
