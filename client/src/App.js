import React, { Component, Fragment } from 'react';
import './App.scss';
import ChatContainer from './ChatContainer/ChatContainer';

class App extends Component {
  render() {
    return (
      <Fragment>
        <ChatContainer />
      </Fragment>
    );
  }
}

export default App;
