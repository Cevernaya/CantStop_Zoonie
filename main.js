// DATA
var turn = 0	// Player number
var state = 0    // 0: can roll or be chicken, 1: choose combi
var dice = [3, 1, 5, 2]	//1st, 2nd, 3rd, 4th dice's number
var combi = [[null, null], [null, null], [null, null]] // (1st+2nd, 3rd+4th), (1st+3rd, 2nd+4th), (1st+4th, 2nd+3rd)
var blackDotPlace = [[1, 3], [4, 7], [8, 4]]	// coordination of black dots, strictly follows column & tile elements' children order. ex) every number tile is [i, 0]
var baseCamps = [new Array(11), new Array(11), new Array(11)] // coordianate of player's basecamp, baseCapms[playerIndex][column] = baseCampPlace
var isConquered = new Array(11)
var playerPoint = [0, 0, 0] //p1 point , p2 point, p3 point

/*
turn = 2
dice = [2, 3, 1, 5]
combi = [[5,6],[3,8],[7,4]]

blackDotPlace = [[4,3],[5,4],[7,4]]

baseCamps = [[undefined,undefined,3,undefined,undefined,undefined,7,5,2,1,undefined],[1,undefined,undefined,undefined,undefined,3,undefined,5,4,3,2],[undefined,undefined,undefined,3,undefined,undefined,undefined,undefined,undefined,undefined,undefined]]
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
            if(baseCamps[i][j] !== undefined) {
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
        if(isConquered[i] !== undefined){
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


header.addEventListener("mouseover", function(){
	header.innerHTML = "let's roll"
})
header.addEventListener("mouseout", function(){
	header.innerHTML = "Can't Stop"
})