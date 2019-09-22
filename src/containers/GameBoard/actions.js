export const initAction = (className) => {
    console.log("here");
    return {
        type: "INIT_ACTION",
        payload: className,
    };
};

export const onClickGuti = (gutiId, boardIndex) => {
    return {
        type: "ON_CLICK_GUTI",
        gutiId: gutiId,
        boardIndex: boardIndex
    }
};

export const updateBoardStatus = (boardStatus) => {
    return {
        type: "UPDATE_BOARD_STATUS",
        payload: boardStatus,
    }
};