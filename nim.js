let arr = [];
let playerTaken = {
	cnt: 0,
	row: -1,
};

function rand(l,r) {
	return l+Math.floor(Math.random()*(r-l+1));
}

function takeStone(row) {
	--arr[row];
	if(arr[row]) {
		$(`#stone-${row}-${arr[row]}`).width('0px');
	}else {
		$(`#stone-${row}-${arr[row]}`).css('opacity', '0');
	}
	$(`#cnt${row}`).text(`${arr[row]}`);
}

function playerTake(row) {
	if(arr[row] == 0) {
		alert("You cannot take stone in a empty pile");
		return;
	}
	if(playerTaken.row != -1 && playerTaken.row != row) {
		alert("You can take one pile in one move");
		return;
	}
	takeStone(row);
	playerTaken.row = row;
	playerTaken.cnt++;
	if(arr[row] == 0) comTake();
}

function comTake() {
	if(playerTaken.cnt == 0) {
		alert("You haven't move yet!");
		return;
	}
	playerTaken = {
		cnt: 0,
		row: -1,
	};
	let tot = 0;
	for(let i = 0; i < arr.length; i++) tot += arr[i];
	if(tot == 0) {
		alert("Player Win!");
		return;
	}
	$(`#ready`).hide();
	let xor_sum = 0;
	for(let i = 0; i < arr.length; i++) xor_sum ^= arr[i];
	let moves = [];
	if(xor_sum == 0) {
		for(let i = 0; i < arr.length; i++) if(arr[i] != 0) {
			moves.push({
				pos: i,
				num: rand(1,arr[i]),
			});
		}
	}else {
		for(let i = 0; i < arr.length; i++) if((arr[i]^xor_sum) < arr[i]) {
			moves.push({
				pos: i,
				num: arr[i] - (arr[i]^xor_sum),
			});
		}
		/*
		for(let i = 0; i < arr.length; i++) {
			console.log("num = " + (arr[i] - (arr[i]^xor_sum)));
		}
		console.log("COM takes " + pos + "*" + num);
		*/
	}
	let id = rand(0,moves.length-1);
	let delay_time = 500 / (moves[id].num);
	for(let i = 0; i < moves[id].num; i++) {
		setTimeout(takeStone, delay_time*(i+1), moves[id].pos);
	}
	setTimeout(function() {
		let tot = 0;
		for(let i = 0; i < arr.length; i++) tot += arr[i];
		if(tot == 0) {
			alert("Computer Win!");
		}
		$(`#ready`).show();
	}, delay_time*moves[id].num);
}

function showRule() {
	window.open("https://hackmd.io/Wolwkk29QhWdPLOjvpcepQ");
}

function showTuto() {
	window.open("https://hackmd.io/p8NFDRJ8TkqPxg4JLp51hQ");
}

function calcXor() {
	let arr = prompt("input some integers").split(' ');
	let sum = 0;
	for(let i in arr) sum ^= arr[i];
	alert(sum);
}

function init(n,C) {
	let sum = 0;
	for(let i = 0; i < n-1; i++) {
		let x = rand(1,C);
		arr.push(x);
		sum ^= x;
	}
	while(arr.length < n) {
		let x = rand(1,C);
		if((x^sum) != 0) arr.splice(rand(0,arr.length), 0, x);
	}
	for(let i = 0; i < n; i++) {
		$(`body`).append(`<span class="badge badge-pill badge-success" id="cnt${i}" style="font-size: 40px">${arr[i]}</span>`);
		let bgstyle = i&1 ? "badge-light" : "badge-dark";
		$(`body`).append(`<div class="badge badge-pill ${bgstyle}" style="font-size: 40px" id="row${i}" onclick="playerTake(${i})">`);
		for(let j = 0; j < arr[i]; j++) $(`#row${i}`).append(`<img src="cobbleStone.png" class="stone" id="stone-${i}-${j}">`);
		$(`body`).append(`</div><br>`);
	}
	$(`body`).append(`
		<button id="reset" class="btn btn-info" style="font-size: 25px" onclick="location.reload()"> Reset </button>
		<button id="rules" class="btn btn-info" style="font-size: 25px" onclick="showRule()"> Rules </button>
		<button id="hint"  class="btn btn-info" style="font-size: 25px" onclick="calcXor()"> Hint </button>
		<button id="tutor" class="btn btn-info" style="font-size: 25px" onclick="showTuto()"> Tutorial </button>
		<button id="ready" class="btn btn-info" style="font-size: 25px" onclick="comTake()"> OK! </button>
	`);
}
init(6,9);