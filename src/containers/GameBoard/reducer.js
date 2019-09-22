import produce from 'immer';
const initialState = {
    text: "",
    boardStatus: null,
    gutiStatus: {
        p1: {

        },
        p2: {

        }
    }
};

const gameBoardReducer = (state = initialState, action) => {
    state = produce(state, draft => {
        switch(action.type) {
            case "INIT_ACTION": {
                draft.text=action.payload;
            }
            case "UPDATE_BOARD_STATUS": {
                console.log("UPDATING BOARD STATUS", action.payload);
                draft.boardStatus = action.payload;
            }
            case "ON_CLICK_GUTI": {
                draft.selectedGuti = action.gutiId;
                draft.selectedBoardIndex = action.boardIndex;
            }
            default: {
                return draft;
            }
        }
    });
    console.log("STATE: ", state);
    return state;
};

export default gameBoardReducer;