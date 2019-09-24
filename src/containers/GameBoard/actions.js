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

export const updateBoardIndex = (arrOfIndex, key, value) => {
  return {
      type: "UPDATE_BOARD_INDEX",
      indexes: arrOfIndex,
      key,
      value,
  }
};

export const updateHighlightedIndex = (indexes) => {
    return {
        type: "UPDATE_HIGHLIGHTED_INDEX",
        indexes,
    };
};

export const onClickHighlightedIndex = (index, isKillingMove) => {
    return {
        type: "MOVE_GUTI",
        index,
        isKillingMove,
    }
};

export const onFinishGame = (winner) => {
    return {
        type: "ON_FINISH_GAME",
        winner,
    }
};

export const toggleActivePlayer = () => {
    return {
        type: "TOGGLE_ACTIVE_PLAYER",
    };
};