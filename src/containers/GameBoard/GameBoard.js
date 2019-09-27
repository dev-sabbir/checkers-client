import React, {Component} from 'react';
import {connect} from 'react-redux';
import './GameBoard.css';
import Guti from '../Guti/Guti';
import { updateBoardStatus, onClickGuti, updateBoardIndex, updateHighlightedIndex, onClickHighlightedIndex,
    onFinishGame, toggleActivePlayer, init } from './actions';
import {generateBoardStatus, checkIfArrSame, getValidIndexes, checkKillingMove} from '../../utils/utilities'

class GameBoard extends Component {
    render() {
        let generateBoard = (boardStatus) => {
            let killingMoveData = checkKillingMove(boardStatus, this.props.activePlayer);
            if(!killingMoveData.hasKillingMove && this.props.hasKillingMove) {
                this.props.toggleActivePlayer();
            } else {
                if(killingMoveData.hasKillingMove && this.props.killingGuti && this.props.killingGuti != ''
                    && !killingMoveData.killingGutis.includes(Number(this.props.killingGuti))) {
                    this.props.toggleActivePlayer();
                }
            }
            let board = [];
            let rowArr = [];
            for(let boardIndex in boardStatus) {
                if(boardIndex && this.props.selectedBoardIndex &&
                    Number(boardIndex) === Number(this.props.selectedBoardIndex)) {
                    let validIndexeData = getValidIndexes(boardStatus, boardIndex);
                    let validIndexes = [];
                    if(validIndexeData.hasKillingMove) {
                        validIndexes = validIndexeData.killingMoves;
                    } else {
                        validIndexes = validIndexeData.validMoves;
                    }
                    if(validIndexes && validIndexes.length
                        && !checkIfArrSame(validIndexes, this.props.highlightedIndexes)) {
                        this.props.updateHighlightedIndex(validIndexes);
                    }
                }
                let guti = "";
                let gutiId = boardStatus[boardIndex].gutiId;
                let gutiType = boardStatus[boardIndex].gutiType;
                let indexColor = boardStatus[boardIndex].color;
                let highlightClass = this.props.highlightedIndexes
                && this.props.highlightedIndexes.includes(Number(boardIndex)) ? 'highlight' : '';

                if(boardStatus[boardIndex].isOccupied) {
                    if((killingMoveData.hasKillingMove && killingMoveData.killingMoves.includes(boardIndex))
                        || !killingMoveData.hasKillingMove) {
                        guti = <Guti isActive={gutiType===this.props.activePlayer} currentIndex = {boardIndex}
                                     gutiId={gutiId} onClickGuti={this.props.onClickGuti} type={gutiType}
                                     isKing={boardStatus[boardIndex].isKing}></Guti>
                    } else {
                        guti = <Guti isActive={gutiType===this.props.activePlayer} currentIndex = {boardIndex}
                                     gutiId={gutiId}  type={gutiType} isKing={boardStatus[boardIndex].isKing}></Guti>
                    }
                }

                let temp = "";
                if(highlightClass === 'highlight') {
                    temp = (<div data-is-killing-move={killingMoveData.hasKillingMove} data-index={boardIndex}
                                 className={`col board-item ${indexColor} ${highlightClass}`}
                                 onClick={this.props.onClickHighlightedIndex}>
                        {guti}
                    </div>);
                } else {
                    temp = (<div data-index={boardIndex} className={`col board-item ${indexColor} ${highlightClass}`}>
                        {guti}
                    </div>);
                }
                if(boardIndex % 8 === 0) {
                    let rowFinished = <div key={boardIndex / 8} className="row no-gutters">{rowArr}</div>;
                    board.push(rowFinished);
                    rowArr = [];
                    rowArr.push(temp);
                } else {
                    rowArr.push(temp);
                }
            }
            let rowFinished = <div key={63 / 8} className="row no-gutters">{rowArr}</div>;
            board.push(rowFinished);
            return board;
        };

        let generatePlayerGutiSection = (playerOneGuti, playerTwoGuti) => {
            let playerOneData = [];
            let playerTwoData = [];
            let p1InactiveCount = 0;
            let p2InactiveCount = 0;
            for(let i in playerOneGuti) {
                if(playerOneGuti[i].status === 'inactive') {
                    p1InactiveCount++;
                    let guti = <div><Guti currentIndex = {i} gutiId={i} type="player-one"></Guti></div>;
                    playerOneData.push(guti);
                }
            }
            for(let i in playerTwoGuti) {
                if(playerTwoGuti[i].status === 'inactive') {
                    p2InactiveCount++;
                    let guti = <div><Guti currentIndex = {i} gutiId={i} type="player-two"></Guti></div>;
                    playerTwoData.push(guti);
                }
            }
            let winner = null;
            if(p1InactiveCount === 12) {
                winner = "player-two";
            } else if(p2InactiveCount === 12) {
                winner = "player-one";
            }
            if(winner && winner.length) {
                this.props.onFinishGame(winner);
            }
            return {playerOneData, playerTwoData};
        };
        let modal;
        let numOfRow = 8;
        let numOfCol = 8;
        let board = "";
        if (this.props.boardStatus===null) {
            let initData = generateBoardStatus(numOfRow, numOfCol);
            this.props.updateBoardStatus(initData);
        }
        board = generateBoard(this.props.boardStatus);
        let gutiData = {
            playerOneData: [],
            playerTwoData: [],
        };

        modal = (
            <div className={`modal ${this.props.winner && this.props.winner.length
            && this.props.boardStatus ? 'show-modal' : ''}`} tabIndex={-1} role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Game Over</h5>
                            <button type="button" className="close" data-dismiss="modal"
                                    onClick={this.props.init} aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className={this.props.winner}>Winner is : {this.props.winner == 'player-one' ? 'Player One' : 'Player Two'}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"
                                    onClick={this.props.init} data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );

        gutiData = generatePlayerGutiSection(this.props.playerOneGuti, this.props.playerTwoGuti);
        return (
            <div>
                <div className="row no-gutters">
                    <h1 className="col-12 text-center">Player One</h1>
                </div>
                <div className="row no-gutters">
                    <div className="col-1">
                        <div className="player-one-guti inactive-guti">{gutiData.playerOneData}</div>
                    </div>
                    <div className="col-10">
                        <div className="game-board">{board}</div>
                    </div>
                    <div className="col-1">
                        <div className="player-two-guti inactive-guti">{gutiData.playerTwoData}</div>
                    </div>
                </div>
                <div className="row no-gutters">
                    <h1 className="col-12 text-center">Player Two</h1>
                </div>


                {modal}

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
        winner: gameBoardState.winner,
        hasKillingMove: gameBoardState.hasKillingMove,
        killingGuti: gameBoardState.killingGuti,
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
        },
        onFinishGame: (winner) => {
            dispatch(onFinishGame(winner));
        },
        toggleActivePlayer: () => {
            dispatch(toggleActivePlayer());
        },
        init: () => {
            dispatch(init());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (GameBoard);