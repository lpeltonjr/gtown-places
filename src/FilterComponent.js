import React from 'react';
import './App.css';


function FilterComponent(props) {
    
    let classModifier = "";
    let classString = "filter-comp";
        
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

    const listEvent = name=>{props.listSelect(name)};

    return (
        <div className={classString} onAnimationEnd={props.animationStop} >
            <div className="filter-query-box">
                <input className="search-window" value={props.query} onChange={props.queryHandler} ></input>
                <span><i className="fa fa-search search-icon"></i></span>
            </div>
            <ul className="filter-list">
                {props.places.map(
                    (item, idx)=>(<li key={idx} className="filter-listitem" tabIndex={0} onClick={e=>listEvent(item.name)} onKeyPress={e=>listEvent(item.name)}>{item.name}</li>)
                )}
            </ul>
        </div>
    );
}


export default FilterComponent;
