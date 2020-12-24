// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

// DATA
var turn = 0	// Player number
var state = 0    // 0: can roll or be chicken, 1: choose combi
var dice = [3, 1, 5, 2]	//1st, 2nd, 3rd, 4th dice's number
var combi = [[null, null], [null, null], [null, null]] // (1st+2nd, 3rd+4th), (1st+3rd, 2nd+4th), (1st+4th, 2nd+3rd)
var blackDotPlace = []	// coordination of black dots, strictly follows column & tile elements' children order. ex) every number tile is [i, 0]
var baseCamps = [[0,0,0,0,0,0,0,0,0,0,0], 
				 [0,0,0,0,0,0,0,0,0,0,0],
				 [0,0,0,0,0,0,0,0,0,0,0]] // coordianate of player's basecamp, baseCapms[playerIndex][column] = baseCampPlace
var isConquered = new Array(11)
var playerPoint = [0, 0, 0] //p1 point , p2 point, p3 point

/*
turn = 2
dice = [2, 3, 1, 5]
combi = [[5,6],[3,8],[7,4]]

blackDotPlace = [[4,3],[5,4],[7,4]]

baseCamps = [[0,0,3,0,0,0,7,5,2,1,0],[1,0,0,0,0,3,0,5,4,3,2],[0,0,0,3,0,0,0,0,0,0,0]]
isConquered = [undefined, 1, 2, 0, undefined, 0, undefined, 2, 1, undefined, 0]
playerPoint = [1, 2, 3]
*/

// p1: magenta, p2: yellow, p3: cyan
// ELEMENTS
var header = document.getElementById('header')
var columns = document.getElementsByClassName('column')
var dices = document.getElementsByClassName('dice')

var player1 = document.getElementById('player1')
var player2 = document.getElementById('player2')
var player3 = document.getElementById('player3')

var nowTurn = document.getElementById('nowturn')
var nextturn = document.getElementById('nextturn')
var combiCells = document.getElementsByClassName('combi-cell')


// FUNCTIONS
function update() {
    // CLEAR BOARD
    for(var i=0; i<columns.length; i++){
        for(var j=1; j<columns[i].children.length-1; j++){
            columns[i].children[j].innerHTML = ""
        }
    }
    
    // UPDATE TURN
    nowTurn.innerHTML = "Now Playing<br> Player " + (turn+1)
    
	// UPDATE DICE
	for(var i=0; i<dices.length; i++){
		dices[i].innerHTML = dice[i]
	}
	
	// UPDATE COMBINATION OF DICES
	combiCells[0].innerHTML = combi[0][0]
	combiCells[1].innerHTML = combi[0][1]
	combiCells[2].innerHTML = combi[1][0]
	combiCells[3].innerHTML = combi[1][1]
	combiCells[4].innerHTML = combi[2][0]
	combiCells[5].innerHTML = combi[2][1]
	
	// UPDATE BLACKDOT
	for(var i=0; i<blackDotPlace.length; i++){
		var s = columns[blackDotPlace[i][0]].children[blackDotPlace[i][1]].innerHTML
		columns[blackDotPlace[i][0]].children[blackDotPlace[i][1]].innerHTML = s + "<div class='blackdot'></div>"
	}
	
	// UPDATE BASECAMP
    for(var i=0; i<3; i++){    // i: player
        for(var j=0; j<baseCamps[i].length; j++){    // j: column
            if(baseCamps[i][j] != 0) {
                var s = columns[j].children[baseCamps[i][j]].innerHTML
                if(i == 0) {
                    columns[j].children[baseCamps[i][j]].innerHTML = s + "<div class='magentadot'></div>"
                }
                else if(i == 1) {
                    columns[j].children[baseCamps[i][j]].innerHTML = s + "<div class='yellowdot'></div>"
                }
                else if(i == 2) {
                    columns[j].children[baseCamps[i][j]].innerHTML = s + "<div class='cyandot'></div>"
                }
            }
        }
    }
    
    // UPDATE ISCONQUERED
    for(var i=0; i<11; i++){
        if(isConquered[i] != undefined){
            var l = columns[i].children.length
            if(i == 0) {
                columns[i].children[l-1].innerHTML = "<div class='magentadot'></div>"
            }
            else if(i == 1) {
                columns[i].children[l-1].innerHTML = "<div class='yellowdot'></div>"
            }
            else if(i == 2) {
				columns[i].children[l-1].innerHTML = "<div class='cyandot'></div>"
            }
        }
	}
    
    // UPDATE PLAYER POINT
    player1.innerHTML = "Player 1 : " + playerPoint[0]
	player2.innerHTML = "Player 2 : " + playerPoint[1]
	player3.innerHTML = "Player 3 : " + playerPoint[2]
}


function roll() {
    if(state == 1) return
    
    // PUT RANDOM NUMBER IN DICES
    for(var i = 0; i<dice.length; i++){
		dice[i] = Math.floor(Math.random()*6+1)
	}
    // MAKE COMBINATION
    combi[0][0]=dice[0]+dice[1]
	combi[0][1]=dice[2]+dice[3]
    
    combi[1][0]=dice[0]+dice[2]
    combi[1][1]=dice[1]+dice[3]
	
	combi[2][0]=dice[0]+dice[3]
	combi[2][1]=dice[1]+dice[2]
    
	// MAKE PLAYER MUST CHOOSE
	state = 1
    
    // UPDATE 
    update()
}

function chooseCombi(com, num) {
    let isCombiIn = false
    let combiReal = [combi[com][0]-2, combi[com][1]-2]
    
    let originalBlackDot = Object.assign([], blackDotPlace)
    
	if(state == 0) return
    
    if(blackDotPlace.length == 3) {
        if(isConquered[combiReal[0]] && isConquered[combiReal[1]]){
            // 불가능
			return
        }
        else if(!isConquered[combiReal[0]] && isConquered[combiReal[1]]){
            // 앞에꺼 한 칸 올림
            for(let i=0; i<blackDotPlace.length; i++){
                if(blackDotPlace[i][0] == combiReal[0]){
                    blackDotPlace[i][1] += 1
                }
            }
        }
        else if(isConquered[combiReal[0]] && !isConquered[combiReal[1]]){
            // 뒤에꺼 한 칸 올림
            for(let i=0; i<blackDotPlace.length; i++){
                if(blackDotPlace[i][0] == combiReal[1]){
                    blackDotPlace[i][1] += 1
                }
            }
        }
        else if(!isConquered[combiReal[0]] && !isConquered[combiReal[1]]){
            // 둘 다 한 칸씩 올림
			for(let i=0; i<blackDotPlace.length; i++){
                if(blackDotPlace[i][0] == combiReal[0]){
                    blackDotPlace[i][1] += 1
                }
            }
            for(let i=0; i<blackDotPlace.length; i++){
                if(blackDotPlace[i][0] == combiReal[1]){
                    blackDotPlace[i][1] += 1
                }
            }
        }
    }
    else if(blackDotPlace.length == 2) {
        if(isConquered[combiReal[0]] && isConquered[combiReal[1]]){
            // 불가능
			return
        }
        else if(!isConquered[combiReal[0]] && isConquered[combiReal[1]]){
            // 앞에꺼 - 현재 이미 진행중이면 올리고 만약 비어있으면 추가
            isCombiIn = false
			for(let i=0; i<blackDotPlace.length; i++){
                if(blackDotPlace[i][0] == combiReal[0]){
                    blackDotPlace[i][1] += 1
                    isCombiIn = true
                }
            }
            if(!isCombiIn){
                blackDotPlace.push([combiReal[0], baseCamps[turn][combiReal[0]]+1])
            }
        }
        else if(isConquered[combiReal[0]] && !isConquered[combiReal[1]]){
            // 뒤에꺼 - 현재 이미 진행중이면 올리고 만약 비어있으면 추가
			isCombiIn = false
			for(let i=0; i<blackDotPlace.length; i++){
                if(blackDotPlace[i][0] == combiReal[1]){
                    blackDotPlace[i][1] += 1
                    isCombiIn = true
                }
            }
            if(!isCombiIn){
                blackDotPlace.push([combiReal[1], baseCamps[turn][combiReal[1]]+1])
            }
        }
        else if(!isConquered[combiReal[0]] && !isConquered[combiReal[1]]){
            // 둘 중 하나 선택(num)되었고, 현재 이미 진행중이면 올리고 만약 비어있으면 추가 (경우 2가지) !! 여기가 좀 바꿔야할거같
            var combi0exist = (blackDotPlace.findIndex(bdp => bdp[0] == combiReal[0]) > -1)
            var combi1exist = (blackDotPlace.findIndex(bdp => bdp[0] == combiReal[1]) > -1)
    
            if(combi0exist || combi1exist) {
                isCombiIn = false
                for(let i=0; i<blackDotPlace.length; i++){
                    if(blackDotPlace[i][0] == combiReal[0]){
                        blackDotPlace[i][1] += 1
                        isCombiIn = true
                    }
                }
                if(!isCombiIn){
                    blackDotPlace.push([combiReal[0], baseCamps[turn][combiReal[0]]+1])
                }
                
                isCombiIn = false
                for(let i=0; i<blackDotPlace.length; i++){
                    if(blackDotPlace[i][0] == combiReal[1]){
                        blackDotPlace[i][1] += 1
                        isCombiIn = true
                    }
                }
                if(!isCombiIn){
                    blackDotPlace.push([combiReal[1], baseCamps[turn][combiReal[1]]+1])
                }
            }
            else{
                isCombiIn = false
                for(let i=0; i<blackDotPlace.length; i++){
                    if(blackDotPlace[i][0] == combiReal[num]){
                        blackDotPlace[i][1] += 1
                        isCombiIn = true
                    }
                }
                if(!isCombiIn){
                    blackDotPlace.push([combiReal[num], baseCamps[turn][combiReal[num]]+1])
                }
            }
        }
    }
    else if(blackDotPlace.length == 1) {
        if(isConquered[combiReal[0]] && isConquered[combiReal[1]]){
			return                
        }
        else if(!isConquered[combiReal[0]] && isConquered[combiReal[1]]){
            // 앞에꺼 - 현재 이미 진행중이면 올리고 만약 비어있으면 추가
            isCombiIn = false
			for(let i=0; i<blackDotPlace.length; i++){
                if(blackDotPlace[i][0] == combiReal[0]){
                    blackDotPlace[i][1] += 1
                    isCombiIn = true
                }
            }
            if(!isCombiIn){
                blackDotPlace.push([combiReal[0], baseCamps[turn][combiReal[0]]+1])
            }
        }
        else if(isConquered[combiReal[0]] && !isConquered[combiReal[1]]){
            // 뒤에꺼 - 현재 이미 진행중이면 올리고 만약 비어있으면 추가
            isCombiIn = false
			for(let i=0; i<blackDotPlace.length; i++){
                if(blackDotPlace[i][0] == combiReal[1]){
                    blackDotPlace[i][1] += 1
                    isCombiIn = true
                }
            }
            if(!isCombiIn){
                blackDotPlace.push([combiReal[1], baseCamps[turn][combiReal[1]]+1])
            }
        }
        else if(!isConquered[combiReal[0]] && !isConquered[combiReal[1]]){
            // 둘 다 올리기
            isCombiIn = false
			for(let i=0; i<blackDotPlace.length; i++){
                if(blackDotPlace[i][0] == combiReal[0]){
                    blackDotPlace[i][1] += 1
                    isCombiIn = true
                }
            }
            if(!isCombiIn){
                blackDotPlace.push([combiReal[0], baseCamps[turn][combiReal[0]]+1])
            }
            
            isCombiIn = false
			for(let i=0; i<blackDotPlace.length; i++){
                if(blackDotPlace[i][0] == combiReal[1]){
                    blackDotPlace[i][1] += 1
                    isCombiIn = true
                }
            }
            if(!isCombiIn){
                blackDotPlace.push([combiReal[1], baseCamps[turn][combiReal[1]]+1])
            }
        }
    }
    else if(blackDotPlace.length == 0) {
        if(isConquered[combiReal[0]] && isConquered[combiReal[1]]){
            // 불가능
            return                      
        }
        else if(!isConquered[combiReal[0]] && isConquered[combiReal[1]]){
            // 앞에꺼 새로 추가
            isCombiIn = false
			for(let i=0; i<blackDotPlace.length; i++){
                if(blackDotPlace[i][0] == combiReal[0]){
                    blackDotPlace[i][1] += 1
                    isCombiIn = true
                }
            }
            if(!isCombiIn){
                blackDotPlace.push([combiReal[0], baseCamps[turn][combiReal[0]]+1])
            }
        }
        else if(isConquered[combiReal[0]] && !isConquered[combiReal[1]]){
            // 뒤에꺼 새로 추가
            isCombiIn = false
			for(let i=0; i<blackDotPlace.length; i++){
                if(blackDotPlace[i][0] == combiReal[1]){
                    blackDotPlace[i][1] += 1
                    isCombiIn = true
                }
            }
            if(!isCombiIn){
                blackDotPlace.push([combiReal[1], baseCamps[turn][combiReal[1]]+1])
            }
        }
        else if(!isConquered[combiReal[0]] && !isConquered[combiReal[1]]){
            // 둘다 새로 추가
            blackDotPlace.push([combiReal[0], baseCamps[turn][combiReal[0]]+1])
            
            isCombiIn = false
			for(let i=0; i<blackDotPlace.length; i++){
                if(blackDotPlace[i][0] == combiReal[1]){
                    blackDotPlace[i][1] += 1
                    isCombiIn = true
                }
            }
            if(!isCombiIn){
                blackDotPlace.push([combiReal[1], baseCamps[turn][combiReal[1]]+1])
            }
        }
    }
    
    if(!originalBlackDot.equals(blackDotPlace)) {
        state = 0
    }
    
    update()
}


function beChicken() {
    
}


header.addEventListener("mouseover", function(){
	header.innerHTML = "let's roll"
})
header.addEventListener("mouseout", function(){
	header.innerHTML = "Can't Stop"
})