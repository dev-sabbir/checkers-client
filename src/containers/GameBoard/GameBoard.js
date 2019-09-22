import React, {Component} from 'react';
import {connect} from 'react-redux';
import './GameBoard.css';
import Guti from '../Guti/Guti';
import {initAction, updateBoardStatus, onClickGuti} from './actions';


class GameBoard extends Component {
    render() {
        console.log(this.props.boardStatus);
        let generateBoardStatus = (row, col) => {
            let boardStatus = {};
            let board = [];
            let count = 0;
            let gutiCount = 0;
            for (let i = 0; i < row; i++) {
                let row = [];
                for (let j = 0; j < col; j++) {
                    boardStatus[count] = {isOccupied: false, gutiId: null};
                    let colName = 'white';
                    if(i%2 === 0) {
                        if(count%2 === 1) {
                            colName = 'black';
                        }
                    } else {
                        if(count%2===0) {
                            colName = 'black';
                        }
                    }
                    let guti = "";
                    let gutiType = "";
                    if(i<=1 || i>=6) {
                        if(i<=1) {
                            gutiType = "player-one";
                        } else {
                            gutiType = "player-two";
                        }
                        if(colName==='black') {
                            gutiCount ++;
                            guti = <Guti currentIndex = {count} gutiId={gutiCount} onClickGuti={this.props.onClickGuti} type={gutiType}></Guti>;
                            boardStatus[count].isOccupied = true;
                            boardStatus[count].gutiId = gutiCount;
                        }
                    }
                    let temp = <span><div className={`col ${colName}`}>{guti}</div></span>;
                    count++;
                    row.push(temp);
                }
                let rowFinished = <div className="row">{row}</div>;
                board.push(rowFinished);
            }
            this.props.updateBoardStatus(boardStatus);
            return board;
        };
        let generateBoard = (row, col) => {
            let boardStatus = {};
            let board = [];
            let count = 0;
            let gutiCount = 0;
            for (let i = 0; i < row; i++) {
                let row = [];
                for (let j = 0; j < col; j++) {
                    boardStatus[count] = {};
                    let colName = 'white';
                    if(i%2 === 0) {
                        if(count%2 === 1) {
                            colName = 'black';
                        }
                    } else {
                        if(count%2===0) {
                            colName = 'black';
                        }
                    }
                    let guti = "";
                    let gutiType = "";
                    if(i<=1 || i>=6) {
                        if(i<=1) {
                            gutiType = "player-one";
                        } else {
                            gutiType = "player-two";
                        }
                        if(colName==='black') {
                            gutiCount ++;
                            guti = <Guti currentIndex = {count} gutiId={gutiCount} onClickGuti={this.props.onClickGuti} type={gutiType}></Guti>
                        }
                    }
                    let temp = <span><div className={`col ${colName}`}>{guti}</div></span>;
                    count++;
                    row.push(temp);
                }
                let rowFinished = <div className="row">{row}</div>;
                board.push(rowFinished);
            }

            return board;
        };
        let numOfRow = 8;
        let numOfCol = 8;
        let board = "";
        if (this.props.boardStatus===null) {
            board = generateBoardStatus(numOfRow, numOfCol);
        }
        board = generateBoard(numOfRow, numOfCol);
        return (
            <div>
                <h1>{this.props.text}</h1>
                <div className="game-board">{board}</div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    let gameBoardState = state.gameBoardReducer;
    return {
        text: gameBoardState.text,
        boardStatus: gameBoardState.boardStatus,
        selectedGuti: gameBoardState.selectedGuti,
        selectedBoardIndex: gameBoardState.selectedBoardIndex,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onClickGuti: (evt) => {
            return dispatch(onClickGuti( evt.target.getAttribute("id"), evt.target.getAttribute("data-index")));
        },
        updateBoardStatus: (boardStatus) => {
            return dispatch(updateBoardStatus(boardStatus))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (GameBoard);