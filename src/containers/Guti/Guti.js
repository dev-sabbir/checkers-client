import React from 'react';
import "./Guti.css";
function Guti (props){
    let type = props.type;
    return (<div data-index={props.currentIndex} id={props.gutiId} onClick={props.onClickGuti} className={`guti ${type}`}></div>);
}
export default Guti;