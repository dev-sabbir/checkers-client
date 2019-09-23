export const generateBoardStatus =  (row, col) => {
    let boardStatus = {};
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
                    boardStatus[count].isOccupied = true;
                    boardStatus[count].gutiId = gutiCount;
                }
            }

            count++;
        }
    }
    return boardStatus;
};

export const checkValidMoves = (boardStatus, index, direction=0, isKing = false) =>{
    let ret = [];
    let currRow = Math.floor(Number(index / 8));
    let currCol = Number(index % 8);
    let dirArr = [[-1, -1], [-1, 1]];
    if(isKing) {
        dirArr.push([1,-1]);
        dirArr.push([1, 1]);
    }

    let isValid = true;
    for(let i in dirArr) {
        let row = currRow + dirArr[i][0] * direction;
        let col = currCol + dirArr[i][1] * direction;
        let data = row * 8 + col;
        isValid = checkValidity(row, col) && !boardStatus[data].isOccupied;
        if (isValid) {
            ret.push(data);
        }
    }
    console.log("Valid index: ", ret);
    return ret;
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
}