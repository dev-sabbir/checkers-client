import produce from 'immer';
const initialState = {
    text: "",
    boardStatus: null,
    activePlayer: "player-one",
    gutiStatus: {
        p1: {

        },
        p2: {

        }
    },
    highlightedIndexes: null,
};

const gameBoardReducer = (state = initialState, action) => {
    state = produce(state, draft => {
        switch(action.type) {
            case "UPDATE_BOARD_STATUS": {
                draft.boardStatus = action.payload;
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

                draft.selectedGuti = null;
                draft.selectedBoardIndex = null;

                draft.boardStatus[selectedBoardIndex].isOccupied = false;
                draft.boardStatus[selectedBoardIndex].gutiId = null;
                draft.boardStatus[destIndex].isOccupied = true;
                draft.boardStatus[destIndex].gutiId = selectedGuti;
                draft.boardStatus[destIndex].gutiType = draft.boardStatus[selectedBoardIndex].gutiType;
                draft.boardStatus[selectedBoardIndex].gutiType = null;
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

export default gameBoardReducer;