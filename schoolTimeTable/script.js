function el(id) {return document.getElementById(id)};

let nowTime; // new Date()する変数
let now = { // nowTimeから分離して使う関数
	y: null,
	mo: null,
	d: null,
	h: null,
	mi: null,
	s: null,
	ms: null
}

function addZero(num, length=2) {
	return num.toString().padStart(length, "0");
}
function nowUpdate() {
	nowTime = new Date();
	now.y = nowTime.getFullYear();
	now.mo = nowTime.getMonth();
	now.d = nowTime.getDate();
	now.h = nowTime.getHours();
	now.mi = nowTime.getMinutes();
	now.s = nowTime.getSeconds();
	now.ms = nowTime.getMilliseconds();
}

function timeUpdate() {
	nowUpdate();

	el("date").innerHTML = now.y + "/" + addZero(now.mo + 1) + "/" + addZero(now.d);
	el("otherTime").innerHTML = addZero(now.h) + ":" + addZero(now.mi)
	el("secondTime").innerHTML = "." + addZero(now.s);
	el("secondTime").style.opacity = 1 - now.ms / 1000;
	// el("secondTime").style.textDecorationColor = `hsl(0, 0%, ${now.ms / 10}%)`;
	requestAnimationFrame(timeUpdate);
}

try {
timeUpdate()
} catch(error) {console.log(`${error.name}\n${error.stack}`)}