import produce from 'immer';
import {getRowColFromIndex} from '../../utils/utilities';
const initialState = {
    text: "",
    boardStatus: null,
    activePlayer: "player-one",
    highlightedIndexes: null,
};

const gameBoardReducer = (state = initialState, action) => {
    state = produce(state, draft => {
        switch(action.type) {
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
                    draft.selectedGuti = action.gutiId;
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
                console.log(selectedBoardIndex);
                console.log(destIndex);
                if(action.isKillingMove) {
                    let killedIndex = (Number(selectedBoardIndex) + Number(destIndex)) / 2;
                    console.log(killedIndex);
                    let data = state.boardStatus;
                    console.log(data);
                    console.log(data[killedIndex]);
                    let gutiId = data[killedIndex].gutiId;
                    draft.boardStatus = clearBoardIndex(draft.boardStatus, killedIndex);

                    if(gutiId <= 11) {
                        draft.playerOneGuti[gutiId].status = "inactive";
                    } else {
                        draft.playerTwoGuti[gutiId].status = "inactive";
                    }
                } else {

                }

                let isKing = draft.boardStatus[selectedBoardIndex].isKing;
                let gutiType = draft.boardStatus[selectedBoardIndex].gutiType;

                draft.selectedGuti = null;
                draft.selectedBoardIndex = null;

                draft.boardStatus = clearBoardIndex(draft.boardStatus, selectedBoardIndex);

                draft.boardStatus[destIndex].isOccupied = true;
                draft.boardStatus[destIndex].gutiId = selectedGuti;
                draft.boardStatus[destIndex].gutiType = gutiType;
                draft.boardStatus[destIndex].isKing = isKing;



                draft.activePlayer = draft.activePlayer === 'player-one' ? 'player-two' : 'player-one';
                break;
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
}

export default gameBoardReducer;