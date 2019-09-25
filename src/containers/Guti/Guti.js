import React from 'react';
import "./Guti.css";
function Guti (props){
    let type = props.type;
    let kingClass = "";
    let activeClass = "";
    if(props.isKing) {
        kingClass = "king";
    }
    if(props.isActive) {
        activeClass = "active";
    }
    return (<div data-index={props.currentIndex} id={props.gutiId} onClick={props.onClickGuti} className={`guti ${type} ${kingClass} ${activeClass}`}></div>);
}
export default Guti;