function el(id) {return document.getElementById(id)};
let score = 0; // s
let time = 0; // t
let timeMulti = null; // m
let usedScore = 0; // s_u
let scoreError = 0; // e_r
let animationStartedTime = null;
let shopData = {
	m: {
		name: "m",
		cost: 5,
		value: 0,
		level: 0,
		increase: 1,
		costMultiplier: 1.15
	}
};

function query(query, isAll=false) {return isAll ? document.querySelectorAll(query) : document.querySelector(query)};

function updateShop(shopName) {
	const targetShopId = shopName + "Shop";
	const targetShopData = shopData[shopName];
	query(`#${targetShopId} .level`).innerHTML = targetShopData.level;
	query(`#${targetShopId} .effect`).innerHTML = `\\( ${shopName} ← + ${targetShopData.increase} \\)`;
	query(`#${targetShopId} .cost`).innerHTML = `\\(s_u ← + ${targetShopData.cost} \\)`;
	MathJax.typesetPromise([query(`#${targetShopId} .effect`), query(`#${targetShopId} .cost`)]);
}

function buy(shop, val=1) {
	for(let i=0;i<val;i++) {
		if(shop.cost <= score) {
			shop.value += shop.increase;
			shop.level++;
			score -= shop.cost;
			shop.cost *= shop.costMultiplier;
		};
	};
	updateShop(shop.name);
}

function update(currentTime) {
	if(!animationStartedTime) animationStartedTime = currentTime;

	const timeDiffSec = (currentTime - animationStartedTime) / 1000;
	time = timeDiffSec;
	score = time * (timeMulti ?? 1) - usedScore - scoreError;

	requestAnimationFrame(update);
}

requestAnimationFrame(update);

el("mShop").onclick = function() {
	const shop = shopData.m;

	if(timeMulti == null) {
		el("m").style.display = "inline";
		buy(shop);
		shop.cost = 5;
		shop.level = 1;
		shop.value = 1;
		shop.increase = .05;
		updateShop(shop.name);
		query("#mShop .title").innerHTML = "Upgrade<span class=\"formula\">\\(~~m\\)</span>";
		MathJax.typesetPromise([query("#mShop .title .formula")]);
	} else {
		buy(shop);
	}
}