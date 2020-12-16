// DATA
var turn = 0	// Player number
var dice = [3, 1, 5, 2]	//1st, 2nd, 3rd, 4th dice's number
var combi = [[null, null], [null, null], [null, null]] // (1st+2nd, 3rd+4th), (1st+3rd, 2nd+4th), (1st+4th, 2nd+3rd)
var blackDotPlace = [[1, 3], [4, 7], [8, 4]]	// coordination of black dots, strictly follows column & tile elements' children order. ex) every number tile is [i, 0]
var baseCamps = [new Array(11), new Array(11), new Array(11)] // coordianate of player's basecamp
var isConquered = new Array(11)
var playerPoint = [0, 0, 0] //p1 point , p2 point, p3 point


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
	// UPDATE DICE
	for(var i=0; i<dices.length; i++){
		dices[i].innerHTML = dice[i]
	}
	
	// UPDATE COMBINATION OF DICES
	combiCells[0].innerHTML = dice[0] + dice[1]
	combiCells[1].innerHTML = dice[2] + dice[3]
	combiCells[2].innerHTML = dice[0] + dice[2]
	combiCells[3].innerHTML = dice[1] + dice[3]
	combiCells[4].innerHTML = dice[0] + dice[3]
	combiCells[5].innerHTML = dice[1] + dice[2]
	
	// UPDATE BLACKDOT
	for(var i=0; i<blackDotPlace.length; i++){
		var s = columns[blackDotPlace[i][0]].children[blackDotPlace[i][1]].innerHTML
		columns[blackDotPlace[i][0]].children[blackDotPlace[i][1]].innerHTML = s + "<div class='blackdot'></div>"
	}
	
	// UPDATE 
	
}



header.addEventListener("mouseover", function(){
	header.innerHTML = "let's roll"
})
header.addEventListener("mouseout", function(){
	header.innerHTML = "Can't Stop"
})

