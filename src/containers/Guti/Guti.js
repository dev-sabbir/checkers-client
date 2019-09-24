import React from 'react';
import "./Guti.css";
function Guti (props){
    let type = props.type;
    let kingClass = "";
    if(props.isKing) {
        kingClass = "king";
    }
    return (<div data-index={props.currentIndex} id={props.gutiId} onClick={props.onClickGuti} className={`guti ${type} ${kingClass}`}></div>);
}
export default Guti;