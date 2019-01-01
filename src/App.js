import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const appDbaseLocal = {
  titleText:  "Germantown Guide",
  places:     [
    { name:     "Kingsway Christian Church",
      address:  "7887 Poplar Avenue, Germantown, TN",
      category: "church"
    },
    { name:     "Germantown Baptist Church",
      address:  "9450 Poplar Avenue, Germantown, TN",
      category: "church"
    },   
  ]
};

function AppHeader(props) {
  return (
    <header className="page-header">
      <span className="page-title-icon"><i className="fa fa-bars page-title-text" onClick={props.iconHandler}></i></span>
      <div className="page-title page-title-text">{props.headerText}</div>
    </header>
  );
}

function AppMap(props) {
  return (<div className="map-col">test</div>);
}

function AppFilter(props) {
  let classString = "fixed-filter-col";
  let classModifier = "";

  //  if the filter display's hidden state is to be changed ...
  if (props.flags & 1) {
    if (props.flags & 2) {
      classModifier = " open";
    } else {
      classModifier = " close";
    }
  //  else if the filter display is to remain as it is
  } else {
    if (props.flags & 2) {
      classModifier = " visible";
    } else {
      classModifier = " invisible";
    }
  }

  classString = classString + classModifier;

  return (<div className={classString}>test</div>);
}

function AppBody(props) {
  return (
    <div className="page-content">
      <AppFilter flags={props.flags} flagMod={props.flagMod} />
      <AppMap />
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flags: 0
      
    };

    this.iconHandler = this.burgerIconHandler.bind(this);
    this.flagMod = this.flagModifier.bind(this);
  }

  //  mask: identifies bits of this.state.flags to change;
  //  action: 'S': set; 'C': clear; 'T': toggle
  flagModifier(mask, action) {
    
    switch (action) {
      case 'S':
        this.setState(state=>({flags: state.flags | mask}));
        break;
      case 'C':
        this.setState(state=>({flags: state.flags & ~mask}));
        break;
      case 'T':
        this.setState(state=>({flags: state.flags ^ mask}));
        break;
      default:
        break;
    }
  }

  //  event handler for a click of the hamburger icon
  burgerIconHandler() {
    //  flag to set an open or close animation on the filter menu
    this.flagModifier(1, 'S');
    //  toggle the required state of the filter menu -- visible or invisible
    this.flagModifier(2, 'T');
  }

  componentDidMount() {
    //  prevent a repeat of the open or close filter animation until the menu
    //  icon is clicked again
    if (this.state.flags & 1) {
      this.flagModifier(1, 'C');
    }
  }

  render() {
    return (
      <div className="page-container">
        <AppHeader iconHandler={this.iconHandler} headerText={appDbaseLocal.titleText} />        
        <AppBody flags={this.state.flags} flagMod={this.flagMod} />
      </div>
    );
  }
}

export default App;
