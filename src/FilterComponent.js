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

    return (<div className={classString} onAnimationEnd={props.animationStop} >test</div>);
}


export default FilterComponent;
