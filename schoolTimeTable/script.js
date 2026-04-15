function el(id) {return document.getElementById(id)};

let nowTime; // new Date()する変数
let now = { // nowTimeから分離して使う関数
	y: null,
	mo: null,
	d: null,
	da: null,
	h: null,
	mi: null,
	s: null,
	ms: null
};
// ここの日課表と時間割は全て例です。
const DAILY_ROUTINE = { // 日課表
	regular: [
		["SHR1", [9, 0], [9, 10]],
		["after-SHR1", [9, 10], [9, 15]],
		["1st", [9, 15], [10, 0]],
		["after-1st", [10, 0], [10, 10]],
    ["2nd", [10, 10], [10, 55]],
		["after-2nd", [10, 55], [11, 5]],
    ["3rd", [11, 5], [11, 50]],
		["after-3rd", [11, 50], [12, 0]],
    ["4th", [12, 0], [12, 45]],
    ["lunch", [12, 45], [13, 25]],
		["after-lunch", [13, 25], [13, 30]],
    ["5th", [13, 30], [14, 15]],
		["after-5th", [14, 15], [14, 25]],
    ["6th", [14, 25], [15, 10]],
		["after-6th", [15, 10], [15, 15]],
    ["cleaning", [15, 15], [15, 25]],
		["after-cleaning", [15, 25], [15, 30]],
    ["SHR2", [15, 30], [15, 40]],
		["after-SHR2", [15, 40], [16, 0]],
    ["7th", [16, 0], [16, 45]],
	],
	thursday: [
		["SHR1", [9, 0], [9, 10]],
		["after-SHR1", [9, 10], [9, 15]],
		["1st", [9, 15], [10, 0]],
		["after-1st", [10, 0], [10, 10]],
    ["2nd", [10, 10], [10, 55]],
		["after-2nd", [10, 55], [11, 5]],
    ["3rd", [11, 5], [11, 50]],
		["4th", [11, 50], [12, 0]],
    ["4th", [12, 0], [12, 45]],
    ["lunch", [12, 45], [13, 25]],
		["after-lunch", [13, 25], [13, 30]],
    ["5th", [13, 30], [14, 15]],
		["after-5th", [14, 15], [14, 25]],
    ["6th", [14, 25], [15, 10]],
		["after-6th", [15, 10], [15, 15]],
    ["SHR2", [15, 15], [15, 25]],
	]
}
const TIME_TABLE = [
	undefined,
	[
		"languageCulture",
		"health",
		"mathA",
		"history",
		"globalLife",
		"globalLife",
		null
	],
	[
		"mathI",
		"public",
		"japanese",
		"sport",
		"industry",
		"industry",
		null
	],
	[
		"englishI",
		"sport",
		"information",
		"information",
		"mathI",
		"LHR",
		"indonesiaI"
	],
	[
		"englishExpressionI",
		"englishExpressionI",
		"science",
		"science",
		"englishI",
		"mathA",
		null
	],
	[
		"englishExpressionI",
		"englishExpressionI",
		"science",
		"science",
		"englishI",
		"mathA",
		null
	]
];
const SUBJECT_DATA = {
	languageCulture: {
		name: "言語文化",
		color: "#fcd"
	},
	health: {
		name: "保健",
		color: "#fec"
	},
	mathA: {
		name: "数学A",
		color: "#5af"
	},
	history: {
		name: "歴史総合",
		color: "#ec9"
	},
	globalLife: {
		name: "グローバルライフ",
		color: "#c8f"
	},
	indonesiaI: {
		name: "(インドネシア語I)",
		color: "#ede"
	},
	mathI: {
		name: "数学I",
		color: "#56f"
	},
	public: {
		name: "公共",
		color: "#f8b"
	},
	japanese: {
		name: "現代国語",
		color: "#f55"
	},
	sport: {
		name: "体育",
		color: "#fa5"
	},
	industry: {
		name: "産社",
		color: "#dae"
	},
	information: {
		name: "情報",
		color: "#cfe"
	},
	english: {
		name: "英コI",
		color: "#ef8"
	},
	englishExpressionI: {
		name: "論表I",
		color: "#fe8"
	},
	science: {
		name: "科学人間",
		color: "#6f4"
	},
	SHR: {
		name: "SHR",
		color: "#ccc"
	},
	LHR: {
		name: "LHR",
		color: "#ccc"
	},
	containsAfter: {
		name: "休み時間",
		color: "#fff"
	},
	afterSchool: {
		name: "学校外"
	},
	lunch: {
		name: "昼休み"
	}
}

function addZero(num, length=2) {
	return num.toString().padStart(length, "0");
}
function nowUpdate() {
	nowTime = new Date();
	now.y = nowTime.getFullYear();
	now.mo = nowTime.getMonth();
	now.d = nowTime.getDate();
	now.da = nowTime.getDay();
	now.h = nowTime.getHours();
	now.mi = nowTime.getMinutes();
	now.s = nowTime.getSeconds();
	now.ms = nowTime.getMilliseconds();
}

function timeUpdate() {
	nowUpdate();

	if(now.s == 0) {
		el("otherTime").innerHTML = addZero(now.h) + ":" + addZero(now.mi)
		if(now.h == 0) {
			el("date").innerHTML = now.y + "/" + addZero(now.mo + 1) + "/" + addZero(now.d);
		}
	}
	el("secondTime").innerHTML = "." + addZero(now.s);
	el("secondTime").style.opacity = 1 - now.ms / 1000;

	updateTimeTable();

	requestAnimationFrame(timeUpdate);
}

timeUpdate();
el("otherTime").innerHTML = addZero(now.h) + ":" + addZero(now.mi);
el("date").innerHTML = now.y + "/" + addZero(now.mo + 1) + "/" + addZero(now.d);
updateTimeTable(true);

function updateTimeTable(isFirstTime=false) {
	nowUpdate();

	let week = now.d;
	let time = now.h * 60 + now.mi;
	let todayDailyRoutine = (week == 4) ? DAILY_ROUTINE.thursday : DAILY_ROUTINE.regular;
	let nowWorkingOn;
	let nowSubject;

	for(let i = 0; i < todayDailyRoutine.length; i++) {
		if(time >= todayDailyRoutine[i][1][0] * 60 + todayDailyRoutine[i][1][1] && time < todayDailyRoutine[i][2][0] * 60 + todayDailyRoutine[i][2][1]) {
			nowWorkingOn = todayDailyRoutine[i];
			break;
		}
	}
	if(nowWorkingOn == undefined) {nowWorkingOn = ["afterSchool",[23,5],[23,60]]};

	if(now.ms < 200 || isFirstTime) {
		if(nowWorkingOn[0].includes("after") && !(nowWorkingOn[0] == "afterSchool")) {
			el("nowSubject").innerHTML = SUBJECT_DATA["containsAfter"].name;
			el("nowSubject").style.setProperty("--afterText", "\" です\"");
		} else {
			el("nowSubject").style.setProperty("--afterText", "\" の時間です\"");
			if(/^[0-9]+$/.test(nowWorkingOn[0][0])) {
				nowSubject = TIME_TABLE[now.da][Number(nowWorkingOn[0][0])-1]
				el("nowSubject").innerHTML = SUBJECT_DATA[nowSubject].name;
			} else if(nowWorkingOn[0]) {
				nowSubject = nowWorkingOn[0];
				el("nowSubject").innerHTML = SUBJECT_DATA[nowWorkingOn[0]].name;
			}
		}
		console.log(nowSubject + "222");
		if(nowWorkingOn[0] == "afterSchool") {
			el("timeLeftText").style.display = "none";
			el("timeLeftGraphParent").style.display = "none";
		} else {
			el("timeLeftText").style.display = "inline";
			el("timeLeftGraphParent").style.display = "block";
		}
	}

	let timeLeft = (nowWorkingOn[2][0] * 3600 + nowWorkingOn[2][1] * 60) - (now.h * 3600 + now.mi * 60 + now.s + now.ms / 1000);
	el("timeLeftMin").innerHTML = addZero(Math.floor(timeLeft / 60));
	el("timeLeftSec").innerHTML = addZero(Math.floor(timeLeft % 60));
	let timeLeftPercent = (timeLeft / ((nowWorkingOn[2][0] * 3600 + nowWorkingOn[2][1] * 60) - (nowWorkingOn[1][0] * 3600 + nowWorkingOn[1][1] * 60))) * 100;
	el("timeLeftGraph").style.width = timeLeftPercent + "%";
}