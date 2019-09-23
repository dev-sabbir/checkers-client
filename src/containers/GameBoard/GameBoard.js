import React, {Component} from 'react';
import {connect} from 'react-redux';
import './GameBoard.css';
import Guti from '../Guti/Guti';
import { updateBoardStatus, onClickGuti, updateBoardIndex, updateHighlightedIndex, onClickHighlightedIndex } from './actions';
import {generateBoardStatus, checkValidMoves, checkIfArrSame} from '../../utils/utilities'

class GameBoard extends Component {
    render() {
        let generateBoard = (boardStatus) => {
            // boardStatus = clearBoardStatusHighlight(boardStatus);
            let board = [];
            let rowArr = [];
            for(let boardIndex in boardStatus) {
                if(boardIndex && this.props.selectedBoardIndex && Number(boardIndex) === Number(this.props.selectedBoardIndex)) {
                    console.log(this.props.selectedBoardIndex);
                    console.log(boardIndex);
                    let direction = boardStatus[boardIndex].gutiType === 'player-one' ? -1 : 1;
                    let validIndexes = checkValidMoves(boardStatus, boardIndex, direction, false);
                    if(validIndexes && validIndexes.length && !checkIfArrSame(validIndexes, this.props.highlightedIndexes)) {
                        this.props.updateHighlightedIndex(validIndexes, 'isHighlighted', true);
                    }
                }
                let guti = "";
                let gutiId = boardStatus[boardIndex].gutiId;
                let gutiType = boardStatus[boardIndex].gutiType;
                let indexColor = boardStatus[boardIndex].color;
                let highlightClass = this.props.highlightedIndexes && this.props.highlightedIndexes.includes(Number(boardIndex)) ? 'highlight' : '';

                if(boardStatus[boardIndex].isOccupied) {
                    guti = <Guti currentIndex = {boardIndex} gutiId={gutiId} onClickGuti={this.props.onClickGuti} type={gutiType}></Guti>
                }

                let temp = "";
                if(highlightClass === 'highlight') {
                    temp = (<span key={boardIndex}>
                        <div data-index={boardIndex} className={`col ${indexColor} ${highlightClass}`}
                             onClick={this.props.onClickHighlightedIndex}>
                            {guti}
                        </div>
                    </span>);
                } else {
                    temp = (<span key={boardIndex}>
                        <div data-index={boardIndex} className={`col ${indexColor} ${highlightClass}`}>
                            {guti}
                        </div>
                    </span>);
                }
                if(boardIndex % 8 === 0) {
                    let rowFinished = <div key={boardIndex / 8} className="row">{rowArr}</div>;
                    board.push(rowFinished);
                    rowArr = [];
                    rowArr.push(temp);
                } else {
                    rowArr.push(temp);
                }
            }
            let rowFinished = <div key={63 / 8} className="row">{rowArr}</div>;
            board.push(rowFinished);
            return board;
        };

        let numOfRow = 8;
        let numOfCol = 8;
        let board = "";
        if (this.props.boardStatus===null) {
            let boardStatus = generateBoardStatus(numOfRow, numOfCol);
            this.props.updateBoardStatus(boardStatus);
            board = generateBoardStatus(numOfRow, numOfCol);
        }
        board = generateBoard(this.props.boardStatus);
        return (
            <div>
                <div className="game-board">{board}</div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    let gameBoardState = state.gameBoardReducer;
    return {
        boardStatus: gameBoardState.boardStatus,
        selectedGuti: gameBoardState.selectedGuti,
        selectedBoardIndex: gameBoardState.selectedBoardIndex,
        highlightedIndexes: gameBoardState.highlightedIndexes,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onClickGuti: (evt) => {
            dispatch(updateHighlightedIndex([]));
            dispatch(onClickGuti( evt.target.getAttribute("id"), evt.target.getAttribute("data-index")));
        },
        updateBoardStatus: (boardStatus) => {
            return dispatch(updateBoardStatus(boardStatus))
        },
        updateBoardIndex: (arrOfIndex, key, value) => {
            return dispatch(updateBoardIndex(arrOfIndex, key, value));
        },
        updateHighlightedIndex: (arrOfIndex) => {
            return dispatch(updateHighlightedIndex(arrOfIndex));
        },
        onClickHighlightedIndex: (evt) => {
            dispatch(updateHighlightedIndex([]));
            dispatch(onClickHighlightedIndex(evt.target.getAttribute("data-index")))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (GameBoard);