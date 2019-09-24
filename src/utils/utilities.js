export const generateBoardStatus =  (row, col) => {
    let boardStatus = {};
    let playerOneGuti = {};
    let playerTwoGuti = {};
    let count = 0;
    let gutiCount = 0;
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            boardStatus[count] = {isOccupied: false, gutiId: null, isHighlighted: false, color: 'white'};
            if(i<=2) {
                boardStatus[count].gutiType = "player-one";
            }
            if(i>=5){
                boardStatus[count].gutiType = "player-two";
            }

            if((i%2 === 0 && count%2 === 1) || (i%2 === 1 && count%2 === 0)) {
                boardStatus[count].color = 'black';
                if(i<=2 || i>=5) {
                    gutiCount ++;
                    if(gutiCount <=11) {
                        playerOneGuti[gutiCount] = {};
                        playerOneGuti[gutiCount].status = "active";
                    } else {
                        playerTwoGuti[gutiCount] = {};
                        playerTwoGuti[gutiCount].status = "active";
                    }
                    boardStatus[count].isOccupied = true;
                    boardStatus[count].gutiId = gutiCount;
                    boardStatus[count].isKing = false;
                }
            }

            count++;
        }
    }

    return {boardStatus, playerOneGuti, playerTwoGuti};
};

export const checkKillingMove = (boardStatus, activePlayer) => {
    let returnData = {};
    let killingIndex = [];
    let direction =activePlayer === 'player-one' ? -1 : 1;
    for(let i in boardStatus) {
        if(boardStatus[i].isOccupied && boardStatus[i].gutiType === activePlayer) {
            let dirArr = getDirArr(boardStatus[i].isKing);
            let coord = getRowColFromIndex(i);
            let currRow = coord.row;
            let currCol = coord.col;
            for(let j in dirArr) {
                let row = currRow + dirArr[j][0] * direction;
                let col = currCol + dirArr[j][1] * direction;
                let isValid = checkValidity(row, col);
                if(isValid) {
                    let data = getIndexFromRowCol(row, col);

                    if(boardStatus[data].isOccupied && boardStatus[data].gutiType != activePlayer) {
                        row = row + dirArr[j][0] * direction;
                        col = col + dirArr[j][1] * direction;
                        let isValid = checkValidity(row, col);
                        data = getIndexFromRowCol(row, col);
                        isValid = isValid && !boardStatus[data].isOccupied;
                        if(isValid) {
                            killingIndex.push(i);
                            returnData.hasKillingMove = true;
                        }
                    }
                }

            }

        }
    }

    returnData.killingMoves = killingIndex;
    return returnData;
};

export const getValidIndexes = (boardStatus, index) =>{
    let direction = boardStatus[index].gutiType === 'player-one' ? -1 : 1;
    let dirArr = getDirArr(boardStatus[index].isKing);
    let ret = [];
    let killingRet = [];
    let coordinate = getRowColFromIndex(index);
    let currRow = coordinate.row;
    let currCol = coordinate.col;
    let returnData = {
        hasKillingMove: false,
        killingMoves: null,
        validMoves: null,
    };
    let isValid = true;
    for(let i in dirArr) {
        let row = currRow + dirArr[i][0] * direction;
        let col = currCol + dirArr[i][1] * direction;
        isValid = checkValidity(row, col);
        if(isValid) {
            let data = getIndexFromRowCol(row, col);
            if(!boardStatus[data].isOccupied) {
                ret.push(data);
            } else if(boardStatus[data].isOccupied && boardStatus[data].gutiType != boardStatus[index].gutiType) {
                row = row + dirArr[i][0] * direction;
                col = col + dirArr[i][1] * direction;
                isValid = checkValidity(row, col);
                if(isValid) {
                    data = getIndexFromRowCol(row, col);
                    isValid = isValid && !boardStatus[data].isOccupied;
                    if(isValid) {
                        killingRet.push(data);
                        returnData.hasKillingMove = true;
                    }
                }

            }
        }

    }
    returnData.killingMoves = killingRet;
    returnData.validMoves = ret;

    return returnData;
};

export const checkValidity = (row, col) => {
    if (row>=0 && row<=7 && col >=0 && col <= 7 ) {
        return true;
    }
    return false;
};

export const checkIfArrSame = (arr1, arr2) => {

    if(arr1 && arr2 && arr1.length === arr2.length) {
        for(let i in arr1) {
            if(arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }
    return false;
};

export const getDirArr = (isKing) => {
    let dirArr = [[-1, -1], [-1, 1]];
    if(isKing) {
        dirArr.push([1,-1]);
        dirArr.push([1, 1]);
    }
    return dirArr;
};

export const getIndexFromRowCol = (row, col) => {
    let index = row * 8 + col;
    return index;
};
export const getRowColFromIndex = (index) => {
    let currRow = Math.floor(Number(index / 8));
    let currCol = Number(index % 8);
    return {
        row: currRow,
        col: currCol,
    };
};