import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function AppHeader(props) {
  return (
    <header className="page-header">
      <span className="page-title-icon"><i className="fa fa-bars page-title-text"></i></span>
      <div className="page-title page-title-text">{props.headerText}</div>
    </header>
  );
}

function AppMap(props) {
  return (<div className="map-col">test</div>);
}

function AppFilter(props) {
  return (<div className="fixed-filter-col">test</div>);
}

function AppBody(props) {
  return (
    <div className="page-content">
      <AppFilter />
      <AppMap />
    </div>
  );
}

class App extends Component {
  render() {
    return (
      <div className="page-container">
        <AppHeader headerText="GERMANTOWN PLACES" />        
        <AppBody />
      </div>
    );
  }
}

export default App;
