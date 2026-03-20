// ここにテスト用のメーターの処理部分があります
el("input1").oninput = function() {
	el("output1").innerHTML = this.value + " deg";
	el("ground").style.rotate = this.value + "deg";
	el("highScale").style.rotate = this.value + "deg";
	el("bankPointer").style.rotate = this.value + "deg";
	BANK_POINTER.clearRect(0,0, 400,225);
	if(Math.abs(this.value) >= 35) {
		BANK_POINTER.strokeStyle = "#fb1";
		drawLine(BANK_POINTER, [[200,3], [185,23], [215,23]], true, true);
	} else {
		BANK_POINTER.strokeStyle = "white";
		drawLine(BANK_POINTER, [[200,3], [185,23], [215,23]], true, false);
	};
};
el("input2").oninput = function() {
	el("output2").innerHTML = this.value + " px";
	el("ground").style.translate = "calc(-50% + " + this.value + "px) " + el("input3").value + "px";
	el("highScale").style.translate = this.value + "px " + el("input3").value + "px";
}
el("input3").oninput = function() {
	el("output3").innerHTML = this.value + " px";
	el("ground").style.translate = "calc(-50% + " + el("input2").value + "px) " + this.value + "px";
	el("highScale").style.translate = el("input2").value + "px " + this.value + "px";
}

/** この関数は、取得したidを持つ要素を返します。
 * @param {string} id - 取得する要素のidです。
 * @returns {ElementObject} そのidを持つ要素です。
*/
function el(id) {return document.getElementById(id)};
const HIGH_SCALE = el("highScale").getContext("2d");
const BANK_SCALE = el("bankScale").getContext("2d");
const BANK_POINTER = el("bankPointer").getContext("2d");
const SYMBOL = el("symbol").getContext("2d");
const SPEED_SCALE = el("speedScale").getContext("2d");
const ALTITUDE_SCALE = el("altitudeScale").getContext("2d");
const HEADING_SCALE = el("headingScale").getContext("2d");
const HEADING_POINTER = el("headingPointer").getContext("2d");
const LINE_WIDTH = 3; // 目盛りの線の太さ

// canvasタグの画質を良くする
document.querySelectorAll("canvas").forEach((canvas) => {
	const ratio = window.devicePixelRatio ?? 1;
	canvas.width *= ratio;
	canvas.height *= ratio;
	canvas.style.width = (canvas.width / devicePixelRatio) + "px";
	canvas.style.height = (canvas.height / devicePixelRatio) + "px";
	canvas.getContext("2d").scale(ratio, ratio);
});

/** この関数は、要素に線を描画します。
 * @param {object} objective - 描画先の要素の描画コンテキストです。
 * @param {array} paths - 描画する線のパスです。[[x1, y1], [x2, y2]]のように配列で入力してください。
 * @param {boolean} [doClose=false] - 描画した線を閉じるかどうかを定義します。
 * @param {boolean} [doFill=false] - 描画した線を図形として塗りつぶすがどうかを定義します。これをtrueにするとき、必ずdoCloseもtrueにしてください。
*/
function drawLine(objective, paths, doClose=false, doFill=false) {
	const firstPath = paths[0];
	const otherPath = paths.slice(1);
	objective.beginPath();
	objective.moveTo(firstPath[0], firstPath[1]);
	for(const path of otherPath) {
		objective.lineTo(path[0], path[1]);
	};
	if(doClose) objective.closePath();
	objective.stroke();
	if(doFill) objective.fill();
};
/** この関数は、要素の中心に線を描画します。
 * @param {object} objective - 描画先の要素の描画コンテキストです。
 * @param {number} y - 描画する線の高さです。
 * @param {number} width - 描画する線の幅です。
 * @param {boolean} [doClose=true] - 描画した線を閉じるかどうかを定義します。
*/
function drawLineOnCenter(objective, y, width, doClose=true) {
	const centerStart = 700 - (width / 2);
	const centerEnd = 700 + (width / 2);
	objective.beginPath();
	objective.moveTo(centerStart, y);
	objective.lineTo(centerEnd, y);
	if(doClose) objective.closePath();
	objective.stroke();
};
/** この関数は、特定の円の円周上の点の座標を返します。
 * @param {array} circleCenter - 円の中心を[x, y]という形式で入力します。
 * @param {number} radius - 円の半径です。
 * @param {number} deg - 一般的にθで表される、始線(円の中心からx+方向に伸びる線)から反時計回りに回る角度です。
 * @returns {Array} - [x,y]の形の、指定した円の円周上の指定した角度の点の座標です。
 */
function onCircle(circleCenter, radius, deg) {
	const theta = deg * Math.PI / 180 // degをラジアンに変換

	let result = [,];
	result[0] = circleCenter[0] + radius * Math.cos(theta);
	result[1] = circleCenter[1] - radius * Math.sin(theta);

	return result;
};

HIGH_SCALE.fillStyle = "white";
HIGH_SCALE.font = "bold 25px \"numFont\"";
HIGH_SCALE.lineWidth = LINE_WIDTH;
HIGH_SCALE.strokeStyle = "white";

drawLineOnCenter(HIGH_SCALE, 697.5, 1400);

/** この関数は、addScaleOnCenter関数で描画したような目盛りの左右にラベルを付けます。上下の角度を表す目盛りのみに使われます。
 * @param {string} [text=""] - 描画するテキストです(英数半角2文字指定)。
 * @param {number} y - テキストのy座標です。描画したいところのy座標から10増やした値を入れます。
*/
function addScaleLabel(objective, text="", y) {
	objective.fillText(text, 560, y);
	objective.fillText(text, 820, y);
};
// 上下の角度を表す線を描く
for(let i=0;i<9;i++) { // 上方向
	let linePositionY = [];
	for(let j=0;j<4;j++) {
		linePositionY[j] = (-80*i) + (677.5 - 20*j)
	};
	drawLineOnCenter(HIGH_SCALE, linePositionY[0], 50);
	drawLineOnCenter(HIGH_SCALE, linePositionY[1], 100);
	drawLineOnCenter(HIGH_SCALE, linePositionY[2], 50);
	drawLineOnCenter(HIGH_SCALE, linePositionY[3], 200);
};
for(let i=0;i<9;i++) { // 下方向
	let linePositionY = [];
	for(let j=0;j<4;j++) {
		linePositionY[j] = (80*i) + (717.5 + 20*j);
	};
	drawLineOnCenter(HIGH_SCALE, linePositionY[0], 50);
	drawLineOnCenter(HIGH_SCALE, linePositionY[1], 100);
	drawLineOnCenter(HIGH_SCALE, linePositionY[2], 50);
	drawLineOnCenter(HIGH_SCALE, linePositionY[3], 200);
};
document.fonts.ready.then(() => { // フォントを読み込めたら目盛りの数字を描画する
	for(let i=0;i<9;i++) {
		addScaleLabel(HIGH_SCALE, `${(i+1)*10}`, -80*i + 627.5); // 上方向
		addScaleLabel(HIGH_SCALE, `${(i+1)*10}`, 80*i + 787.5); // 下方向
	};
});

BANK_SCALE.fillStyle = "white";
BANK_SCALE.lineWidth = LINE_WIDTH;
BANK_SCALE.strokeStyle = "white";

// 上のバンク角の目盛りを描く
const CIRCLES_CENTER = [200, 220]; // 基準となる3つの円の中心の座標(x,y)
const CIRCLE_RADIUS = { // 基準となる3つの円の半径
	basic: 200, // 全ての目盛りの内側の始点となる円
	short: 230, // 短い目盛りの外側の終点となる円
	long: 250 // 長い目盛りの外側の終点となる円
};
/** この関数は、ここでのみ使われる基準の一つである最も内側の円の円周上の点の座標を返します。
 * @param {number} deg - onCircle関数のdegと同じです。onCircle関数自身の引数degと混同しないように注意してください。
 * @returns {Array} [x,y]の形の、その円の円周上の指定した角度の点の座標です。
 */
function onBasicCircle(deg) {
	return onCircle(CIRCLES_CENTER, CIRCLE_RADIUS.basic, deg);
};
/** この関数は、ここでのみ使われる基準の一つである2番目の円の円周上の点の座標を返します。
 * @param {number} deg - onCircle関数のdegと同じです。onCircle関数自身の引数degと混同しないように注意してください。
 * @returns {Array} [x,y]の形の、その円の円周上の指定した角度の点の座標です。
 */
function onShortCircle(deg) {
	return onCircle(CIRCLES_CENTER, CIRCLE_RADIUS.short, deg);
};
/** この関数は、ここでのみ使われる基準の一つである最も外側の円の円周上の点の座標を返します。
 * @param {number} deg - onCircle関数のdegと同じです。onCircle関数自身の引数degと混同しないように注意してください。
 * @returns {Array} [x,y]の形の、その円の円周上の指定した角度の点の座標です。
 */
function onLongCircle(deg) {
	return onCircle(CIRCLES_CENTER, CIRCLE_RADIUS.long, deg);
};
// 上のバンク角の中央の三角形
drawLine(BANK_SCALE, [[185,0], [215,0], onBasicCircle(90)], true, true);
drawLine(BANK_SCALE, [onBasicCircle(100), onShortCircle(100)]);
drawLine(BANK_SCALE, [onBasicCircle(110), onShortCircle(110)]);
drawLine(BANK_SCALE, [onBasicCircle(120), onLongCircle(120)]);
drawLine(BANK_SCALE, [onBasicCircle(135), onShortCircle(135)]);
drawLine(BANK_SCALE, [onBasicCircle(150), onShortCircle(150)]);

drawLine(BANK_SCALE, [onBasicCircle(80), onShortCircle(80)]);
drawLine(BANK_SCALE, [onBasicCircle(70), onShortCircle(70)]);
drawLine(BANK_SCALE, [onBasicCircle(60), onLongCircle(60)]);
drawLine(BANK_SCALE, [onBasicCircle(45), onShortCircle(45)]);
drawLine(BANK_SCALE, [onBasicCircle(30), onShortCircle(30)]);

BANK_POINTER.fillStyle = "#fb1"
BANK_POINTER.lineWidth = LINE_WIDTH;
BANK_POINTER.strokeStyle = "white";

drawLine(BANK_POINTER, [[200,3], [185,23], [215,23]], true, false);

// 中心の飛行機のシンボルを描画する
SYMBOL.fillStyle = "black";
SYMBOL.lineWidth = LINE_WIDTH + 2; // 塗りつぶしの色が違うので太さが小さくなる
SYMBOL.strokeStyle = "white";
drawLine(SYMBOL, [[194,209], [206,209], [206,221], [194,221]], true, true);
drawLine(SYMBOL, [[33,210], [133,210], [133,250], [123,250], [123,220], [33,220]], true, true);
drawLine(SYMBOL, [[367,210], [267,210], [267,250], [277,250], [277,220], [367,220]], true, true);

SPEED_SCALE.fillStyle = "white";
SPEED_SCALE.lineWidth = LINE_WIDTH;
SPEED_SCALE.strokeStyle = "white";
for(let i=0;i<13;i++) {
	const linePositionY = 600 - (600/12*i);
	drawLine(SPEED_SCALE, [[72, linePositionY], [90, linePositionY]]);
};

ALTITUDE_SCALE.fillStyle = "white";
ALTITUDE_SCALE.lineWidth = LINE_WIDTH;
ALTITUDE_SCALE.strokeStyle = "white";
for(let i=0;i<9;i++) {
	const linePositionY = 600 * (i/8);
	drawLine(ALTITUDE_SCALE, [[0, linePositionY], [18, linePositionY]]);
};

HEADING_SCALE.fillStyle = "white";
HEADING_SCALE.lineWidth = LINE_WIDTH;
HEADING_SCALE.strokeStyle = "white";

for(let i=0;i<72;i++) { // 目盛りを描く
	const lineStartPosition = onCircle([300,300], 300, i*5);
	const lineEndPosition = onCircle([300,300], i%2===0 ? 280 : 290, i*5);
	drawLine(HEADING_SCALE, [lineStartPosition, lineEndPosition]);
};

document.fonts.ready.then(() => {// 目盛りの数字を描く 書く場所のサイズを半分にし、位置を右下に置き、そこから回転しながら描画することで、回転しても数字が回転せずに描画する
	HEADING_SCALE.translate(300, 300);
	HEADING_SCALE.scale(.5, .5);
	for(let i=0;i<36;i++) {
		if(i % 3 === 0) { // 3の倍数のときは数字を大きくする
			HEADING_SCALE.font = "bold 50px \"numFont\""; // サイズを半分にしているので、実際のフォントサイズは25pxになる
			HEADING_SCALE.fillText(i, i<10 ? -12 : -25, -510); // i<10 ?...ってやつは2桁だと中心の位置がずれるから場合分けしてる
		} else {
			HEADING_SCALE.font = "bold 35px \"numFont\""; // サイズを半分にしているので、実際のフォントサイズは17.5pxになる
			HEADING_SCALE.fillText(i, i<10 ? -8 : -17, -520);
		};
		HEADING_SCALE.rotate(Math.PI/18); // 30°回転する
	};
});

// 方位のやつの三角形
HEADING_POINTER.lineWidth = LINE_WIDTH;
HEADING_POINTER.strokeStyle = "white";
drawLine(HEADING_POINTER, [[285,25], [315,25], [300,47]], true, false);

// ここから設定に関するプログラム
let isSettingsOpen = false; // 設定が開いているかどうか
const allSettings = document.querySelectorAll(".settings");

allSettings.forEach(element => {
	const parent = element.parentElement;
	const dataset = element.dataset;
	const top = dataset.top;
	const bottom = dataset.bottom;
	const left = dataset.left;
	const right = dataset.right;
	const data = {
		pos: [
			{direction: null, value: null},
			{direction: null, value: null}
		], // 要素が設定元の要素からどれだけ離れているか
		isProtrude: null // 要素が設定元の要素から完全にはみ出しているか
	};

	// data-*の値から設定元の要素からの位置を指定する
	if(left) {
		element.style.left = left + "px";
		data.pos[0].direction = "left";
		data.pos[0].value = left;
	} else {
		element.style.right = right + "px";
		data.pos[0].direction = "right";
		data.pos[0].value = right;
	};
	if(top) {
		element.style.top = top + "px";
		data.pos[1].direction = "top";
		data.pos[1].value = top;
	} else {
		element.style.bottom = bottom + "px";
		data.pos[1].direction = "bottom";
		data.pos[1].value = bottom;
	};

	if(data.pos.some(el => el.value < 0)) { // 位置の指定にマイナスが使われているなら、その要素は設定元の要素から完全にはみ出している
		data.isProtrude = true;
	} else if(parent.offsetWidth <= data.pos[0].value || parent.offsetHeight <= data.pos[1].value) { // 位置の指定が設定元の要素の幅や高さ以上なら、その要素は設定元の要素から完全にはみ出している
		data.isProtrude = true;
	} else {
		data.isProtrude = false;
	};

	if(data.isProtrude) { // 要素が設定元の要素からはみ出しているときに線を引く
		const line = document.createElement("div");
		line.classList.add("settingsLine");
		element.appendChild(line);
	};
});

function settings() {
	allSettings.forEach(element => {
		if(isSettingsOpen) {
			element.style.display = "none";
		} else {
			element.style.display = "block";
		};
		isSettingsOpen = !isSettingsOpen;
	})
};

// ここからセンサーの値を取得するプログラム
let altitude, speed, heading; // GPS
let alpha, beta, gamma; // 角度
let updateID; // 更新のID
let accError = 9.8; // 加速度の誤差 初期値は重力加速度(の近似値)
let doUpdateAccError = false; // 加速度の誤差を更新するかどうか
let lastTime = performance.now(); // 加速度の更新時間

function startSensors() {
	el("startSensors").style.display = "none"; // ボタンを消す
	if(updateID) navigator.geolocation.clearWatch(updateID); // すでに位置情報の更新を取得しているときはそれを止める
	// iPhoneの位置情報の許可を取る
	if(typeof DeviceOrientationEvent.requestPermission === "function") { // iPhone用の許可するための関数が存在するか
		DeviceOrientationEvent.requestPermission().then(response => {
			if(response === "granted") defineSensors();
		});
	} else defineSensors();
};

function defineSensors() {
	updateID = navigator.geolocation.watchPosition((pos)=>{ // GPSの定義
		const coords = pos.coords;
		altitude = coords.altitude;
		speed = coords.speed;
		heading = coords.heading;
	}, null, {
		enableHighAccuracy: true, // 高精度な位置情報を取得する
		maximumAge: 0,
		timeout: 100
	});

	if(updateID == 1) { // 最初だけ定義をする
		window.addEventListener("deviceorientation",(event)=>{ // 角度の定義
			if(event.webkitCompassHeading) { // iPhoneの方位角はalphaではなくwebkitCompassHeadingに入っているので、そっちがあるときはそっちをheadingに入れる
				alpha = event.webkitCompassHeading;
			} else {
				alpha = event.alpha;
			};
			beta = event.beta;
			gamma = event.gamma;
		});

		window.addEventListener("devicemotion",(e)=>{ // 加速度の定義　GPSによって速度を取得する間を補完するためのもの
			const acc = e.accelerationIncludingGravity;
			if(acc) { // 加速度が取得できたときのみ実行
				const accX = acc.x;
				const accY = acc.y;
				const accZ = acc.z;
				const accSum = Math.sqrt(accX**2 + accY**2 + accZ**2);

				const now = performance.now();
				const dt = (now - lastTime) / 1000; // 前回の更新からの時間(秒)
				if(doUpdateAccError) {
					accError = accSum;
					doUpdateAccError = false;
				};
				speed += (accSum - accError) * dt; // 加速度から速度を求める 誤差を引いてdtをかけることで、前回の更新からの速度の変化量を求めて、それを今の速度に足す
				lastTime = now;
			};
		});
	};
	update(); // 表示を更新し続けるトリガー
};

function update() {
	el("outputAlpha").innerHTML = alpha ? alpha.toFixed(2) : 0;
	el("outputBeta").innerHTML = beta ? beta.toFixed(2) : 0;
	el("outputGamma").innerHTML = gamma ? gamma.toFixed(2) : 0;
	el("outputAltitude").innerHTML = altitude ? altitude.toFixed(2) : 0;
	el("outputSpeed").innerHTML = speed ? speed.toFixed(2) : 0;
	el("outputHeading").innerHTML = heading ? heading.toFixed(2) : 0;

	el("headingScale").style.rotate = (alpha || 0) + "deg"; // 方位を更新

	const absBeta = Math.abs(beta) || 0;
	if(Math.sign(beta-90) === -1) {
		el("ground").style.translate = "-50% " + (absBeta < 67 ? -180 : (absBeta - 90) * 8) + "px";
	} else {
		el("ground").style.translate = "-50% " + (absBeta > 113 ? 180 : (absBeta - 90) * 8) + "px";
	}; // 地面の角度を更新　90°からの差が23°以上のときは位置を固定
	el("highScale").style.translate = "0 " + (absBeta > 180 ? 0 : (absBeta - 90) * 8) + "px"; // 上下の角度を更新　90°以上のときは動かないようにしている

	// 傾きの角度を更新　常に真上を向くようにしたいので、傾ける角度は-gamma
	el("ground").style.rotate = (-gamma || 0) + "deg";
	el("highScale").style.rotate = (-gamma || 0) + "deg";
	el("bankPointer").style.rotate = (-gamma || 0) + "deg";
	BANK_POINTER.clearRect(0,0, 400,225);
	if(Math.abs(gamma) >= 35) { // 角度にって色が変わるので、その処理
		BANK_POINTER.strokeStyle = "#fb1";
		drawLine(BANK_POINTER, [[200,3], [185,23], [215,23]], true, true);
	} else {
		BANK_POINTER.strokeStyle = "white";
		drawLine(BANK_POINTER, [[200,3], [185,23], [215,23]], true, false);
	};

	requestAnimationFrame(update);
};