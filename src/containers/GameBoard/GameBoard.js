import React, {Component} from 'react';
import {connect} from 'react-redux';
import './GameBoard.css';
import Guti from '../Guti/Guti';
import { updateBoardStatus, onClickGuti, updateBoardIndex, updateHighlightedIndex, onClickHighlightedIndex } from './actions';
import {generateBoardStatus, checkIfArrSame, getValidIndexes, checkKillingMove} from '../../utils/utilities'

class GameBoard extends Component {
    render() {
        let generateBoard = (boardStatus) => {

            let killingMoveData = checkKillingMove(boardStatus, this.props.activePlayer);
            let board = [];
            let rowArr = [];
            for(let boardIndex in boardStatus) {
                if(boardIndex && this.props.selectedBoardIndex && Number(boardIndex) === Number(this.props.selectedBoardIndex)) {
                    let validIndexeData = getValidIndexes(boardStatus, boardIndex);
                    let validIndexes = [];
                    if(validIndexeData.hasKillingMove) {
                        validIndexes = validIndexeData.killingMoves;
                    } else {
                        validIndexes = validIndexeData.validMoves;
                    }
                    if(validIndexes && validIndexes.length && !checkIfArrSame(validIndexes, this.props.highlightedIndexes)) {
                        this.props.updateHighlightedIndex(validIndexes);
                    }
                }
                let guti = "";
                let gutiId = boardStatus[boardIndex].gutiId;
                let gutiType = boardStatus[boardIndex].gutiType;
                let indexColor = boardStatus[boardIndex].color;
                let highlightClass = this.props.highlightedIndexes && this.props.highlightedIndexes.includes(Number(boardIndex)) ? 'highlight' : '';

                if(boardStatus[boardIndex].isOccupied) {
                    if((killingMoveData.hasKillingMove && killingMoveData.killingMoves.includes(boardIndex)) || !killingMoveData.hasKillingMove) {
                        guti = <Guti currentIndex = {boardIndex} gutiId={gutiId} onClickGuti={this.props.onClickGuti} type={gutiType}></Guti>
                    } else {
                        guti = <Guti currentIndex = {boardIndex} gutiId={gutiId}  type={gutiType}></Guti>
                    }
                }

                let temp = "";
                if(highlightClass === 'highlight') {
                    temp = (<span key={boardIndex}>
                        <div data-is-killing-move={killingMoveData.hasKillingMove} data-index={boardIndex} className={`col ${indexColor} ${highlightClass}`}
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

        let generatePlayerGutiSection = (playerOneGuti, playerTwoGuti) => {
            let playerOneData = [];
            let playerTwoData = [];
            for(let i in playerOneGuti) {
                if(playerOneGuti[i].status === 'inactive') {
                    let guti = <div className="col"><Guti currentIndex = {i} gutiId={i} type="player-one"></Guti></div>;
                    playerOneData.push(guti);
                }
            }

            for(let i in playerTwoGuti) {
                if(playerTwoGuti[i].status === 'inactive') {
                    let guti = <div className="col"><Guti currentIndex = {i} gutiId={i} type="player-two"></Guti></div>;
                    playerTwoData.push(guti);
                }
            }
            return {playerOneData, playerTwoData};
        }

        let numOfRow = 8;
        let numOfCol = 8;
        let board = "";
        if (this.props.boardStatus===null) {
            let initData = generateBoardStatus(numOfRow, numOfCol);
            console.log(initData);
            this.props.updateBoardStatus(initData);
        }
        board = generateBoard(this.props.boardStatus);
        let gutiData = {
            playerOneData: [],
            playerTwoData: [],
        }
        gutiData = generatePlayerGutiSection(this.props.playerOneGuti, this.props.playerTwoGuti);
        return (
            <div>
                <h1>Player One</h1>
                <div className="player-one-guti">{gutiData.playerOneData}</div>
                <div className="game-board">{board}</div>
                <div className="player-two-guti">{gutiData.playerTwoData}</div>
                <h1>Player Two</h1>
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
        activePlayer: gameBoardState.activePlayer,
        playerOneGuti: gameBoardState.playerOneGuti,
        playerTwoGuti: gameBoardState.playerTwoGuti,
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
            dispatch(onClickHighlightedIndex(evt.target.getAttribute("data-index"), evt.target.getAttribute("data-is-killing-move")))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (GameBoard);