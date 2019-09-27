import produce from 'immer';
const initialState = {
    boardStatus: null,
    activePlayer: "player-one",
    highlightedIndexes: null,
    winner: "",
    killingGuti: "",
};

const gameBoardReducer = (state = initialState, action) => {
    state = produce(state, draft => {
        switch(action.type) {
            case "INIT": {
                draft.winner= "";
                break;
            }
            case "UPDATE_BOARD_STATUS": {
                draft.boardStatus = action.payload.boardStatus;
                draft.playerOneGuti = action.payload.playerOneGuti;
                draft.playerTwoGuti = action.payload.playerTwoGuti;
                break;
            }
            case "ON_CLICK_GUTI": {
                let gutiType = draft.boardStatus[action.boardIndex].gutiType;
                let activePlayer = draft.activePlayer;
                if(activePlayer === gutiType) {
                    draft.selectedGuti = Number(action.gutiId);
                    draft.selectedBoardIndex = action.boardIndex;
                }
                break;
            }
            case "UPDATE_HIGHLIGHTED_INDEX": {
                draft.highlightedIndexes = [];
                Array.prototype.push.apply(draft.highlightedIndexes, action.indexes);
                break;
            }
            case "MOVE_GUTI": {
                let selectedGuti = draft.selectedGuti;
                let selectedBoardIndex = draft.selectedBoardIndex;
                let destIndex = action.index;

                if(destIndex<=7 && draft.activePlayer === "player-two") {
                    draft.boardStatus[selectedBoardIndex].isKing = true;
                } else if( destIndex>=56 && draft.activePlayer === "player-one" ) {
                    draft.boardStatus[selectedBoardIndex].isKing = true;
                }

                if(action.isKillingMove) {
                    draft.hasKillingMove = true;
                    let killedIndex = (Number(selectedBoardIndex) + Number(destIndex)) / 2;

                    let data = state.boardStatus;

                    let killedGutiId = Number(data[killedIndex].gutiId);
                    draft.killingGuti = selectedGuti;
                    if(killedGutiId <= 11) {
                        draft.playerOneGuti[killedGutiId].status = "inactive";
                    } else {
                        draft.playerTwoGuti[killedGutiId].status = "inactive";
                    }
                    draft.boardStatus = clearBoardIndex(draft.boardStatus, killedIndex);
                } else {
                    draft.activePlayer = draft.activePlayer === 'player-one' ? 'player-two' : 'player-one';
                }

                let isKing = draft.boardStatus[selectedBoardIndex].isKing;
                let gutiType = draft.boardStatus[selectedBoardIndex].gutiType;

                draft.boardStatus = clearBoardIndex(draft.boardStatus, selectedBoardIndex);

                draft.boardStatus[destIndex].isOccupied = true;
                draft.boardStatus[destIndex].gutiId = Number(selectedGuti);
                draft.boardStatus[destIndex].gutiType = gutiType;
                draft.boardStatus[destIndex].isKing = isKing;

                draft.selectedGuti = null;
                draft.selectedBoardIndex = null;
                break;
            }
            case "ON_FINISH_GAME": {
                draft.winner = action.winner;
                draft.boardStatus = null;
                draft.activePlayer = "player-one";
                draft.highlightedIndexes = null;
                draft.killingGuti= "";
                break;
            }
            case "TOGGLE_ACTIVE_PLAYER": {
                draft.activePlayer = draft.activePlayer === 'player-one' ? 'player-two' : 'player-one';
                draft.hasKillingMove = false;
                draft.killingGuti = '';
                draft.selectedBoardIndex = '';
                draft.selectedGuti = "";
            }
            default: {
                return draft;
            }
        }
    });
    return state;
};

let clearBoardIndex = (boardStatus, index) => {
    boardStatus[index].isOccupied = false;
    boardStatus[index].isKing = false;
    boardStatus[index].gutiId = null;
    boardStatus[index].gutiType = null;
    return boardStatus;
};

export default gameBoardReducer;