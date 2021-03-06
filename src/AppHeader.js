import React from 'react';
import './App.css';


function AppHeader(props) {
    return (
      <header className="page-header">
        <span className="page-title-icon"><i className="fa fa-bars page-title-text" tabIndex={0} onClick={props.iconHandler} onKeyPress={props.iconHandler}></i></span>
        <div className="page-title page-title-text">{props.headerText}</div>
      </header>
    );
  }


export default AppHeader;
