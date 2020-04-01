var data = {
	coins: 0,
	prestiges: [0,0,0,0,0,0,0,0,0,0],
	tokens: 0,
	multiForOthers: 1
};

var multiFromOthers = 0;

function getGain() {
	var gain = 1;
	data.prestiges.forEach(function (el) {
		gain *= 1+el;
	})
	return gain;
}

function getRequirement(id) {
	if (id === 0) {
		return Math.floor((((10)+(10+Math.pow(data.prestiges[0],1.05)))/2)*(data.prestiges[0]+1));
	} else {
		return (id+1)*(data.prestiges[id]+1)
	}
}

function canActivatePrestige(id) {
	if (id===0) {
		return (data.coins >= getRequirement(0));
	} else {
		return (data.prestiges[id-1] >= getRequirement(id));
	}
}

function activatePrestige(id) {
	if (canActivatePrestige(id)) {
			data.coins = 0;
			for (var i = 0; i < id; i++) {
				data.prestiges[i] = 0;
			}
			data.prestiges[id]++;
			data.multiForOthers++;
	}
	draw();
}

function update() {
	data.coins += getGain();
	localStorage.META = JSON.stringify(data);
}

function draw() {
	document.getElementById("coins").innerHTML = data.coins;
	document.getElementById("gain").innerHTML = getGain();
	data.prestiges.forEach(function (el, i) {
		document.getElementById("tier"+(i+1)+"cost").innerHTML = getRequirement(i);
		document.getElementById("tier"+(i+1)+"a").innerHTML = el;
		document.getElementById("tier"+(i+1)+"mul").innerHTML = "x"+(el+1);
		if (canActivatePrestige(i)) {
			document.getElementById("tier"+(i+1)+"btn").disabled = false;
		} else {
			document.getElementById("tier"+(i+1)+"btn").disabled = true;
		}
	})
	document.getElementById("bonus_taken").innerHTML = multiFromOthers;
	document.getElementById("bonus_given").innerHTML = data.multiForOthers;
}

function updateMultiFromOthers() {
	multiFromOthers = 1;
	if (localStorage.SHITPOST) {
		let tmp_data = JSON.parse(localStorage.SHITPOST);
		for (let i = 0; i < tmp_data.prestiges.length; i++) {
			multiFromOthers += tmp_data.prestiges[i];
		}
	}
	if (localStorage.QUADRATIC_SHITPOST) {
		let tmp_data = JSON.parse(localStorage.QUADRATIC_SHITPOST);
		let total = 0;
		for (let x = 0; i < tmp_data.prestiges.length; i++) {
			const el = tmp_data.prestiges[x];
			for (let y = 0; y < el.length; y++) {
				total += el[y];
			}
		}
		multiFromOthers += total**(1/2)
	}
	if (localStorage.OH_NO) {
		let tmp_data = JSON.parse(localStorage.OH_NO);
		let total = 0;
		for (let x = 0; i < tmp_data.prestiges.length; i++) {
			const el = tmp_data.prestiges[x];
			for (let y = 0; y < el.length; y++) {
				for (let z = 0; z < el[y].length; z++) {
					total +=  el[y][z];
				}
			}
		}
		multiFromOthers += total**(1/3)
	}
	multiFromOthers **= 1/3;
}

window.addEventListener("load",function () {
	if (localStorage.META) {
		data = JSON.parse(localStorage.META);
	}
	updateMultiFromOthers();
	draw();
	for (var i = 0; i < 10; i++) {
		document.getElementById("tier"+(i+1)+"btn").addEventListener(
			"click",
			(function(n) {
				return (function () {
					activatePrestige(n);
				})
			}(i))
		);
	}
	setInterval(function () {
		update();
		draw();
	}, 1000);
	console.log("interval loaded")
})
