const Action = require("./structures/action.js");
const ActionList = require("./structures/action_list.js");
const Movement = require("./structures/movement.js");
const Player = require("./structures/player.js");
const PlayerList = require("./structures/player_list.js");
const Plant = require("./structures/plant.js");
const fs = require("node:fs");
const {
	Sunflower,
	Peashooter,
	WallNut,
	Sunshroom,
	IcebergLettuce,
	Starfruit,
} = require("./almanac");
const Zombie = require("./structures/zombie.js");
const actions = new ActionList({ board_width: 16, board_height: 16 });
const players = new PlayerList();
players.push(
	...[
		new Player({ name: `Lazarus`, position: new Movement(12, 6) }),
		new Player({ name: `Tatters`, position: new Movement(5, 10) }),
		new Player({ name: `Cube492`, position: new Movement(11, 9) }),
		new Player({ name: `The CAACN`, position: new Movement(9, 4) }),
		new Player({ name: `arnim`, position: new Movement(9, 12) }),
		new Player({ name: `AMS`, position: new Movement(7, 8) }),
	]
);
actions.setPlayers(players);
actions.push(
	...[
		new Action({
			spawn_zombie: new Zombie({ position: new Movement(0, 0) }),
		}),
		new Action({ begin_turn: true }),

		new Action({
			sun_gain: 100,
		}),
		new Action({
			player: "Lazarus",
			plant: new Sunshroom({ position: new Movement(11, 6, false) }),
		}),
		new Action({
			player: "arno",
			plant: new Starfruit({
				position: new Movement(1, 13, false),
			}),
		}),
		new Action({
			player: "arno",
			plant: new IcebergLettuce({
				position: new Movement(1, 1, false),
			}),
		}),
		new Action({
			player: "AMS",
			plant: new WallNut({ position: new Movement(3, 3, false) }),
		}),
		new Action({ end_turn: true }),
		new Action({ end_turn: true }),
		new Action({ end_turn: true }),
	]
);
const valid = actions.validate();
if (valid) {
	console.log("\x1b[32m", "All set! Here's the game log:");
	console.log(actions);
	fs.writeFile(`game.json`, JSON.stringify(actions.toJSON()), (err) => {
		if (err) throw err;
		console.log(`The file has been saved!`);
	});
}
console.log(`Done`);

// draw image
const { createCanvas, loadImage } = require("canvas");
const canvas = createCanvas(1920, 1080);
const ctx = canvas.getContext("2d");
const board_canvas = createCanvas(3200, 3200);
const bctx = board_canvas.getContext("2d");
const { sun, player_list, zombie_list, plant_list, board_height, board_width } =
	actions;
async function drawBG() {
	const entity_images = [];
	for (let i of [...player_list, ...plant_list, ...zombie_list]) {
		let image;
		try {
			image = await loadImage(`./assets/${i.name}.png`);
		} catch {
			image = await loadImage("./assets/default.png");
		}
		entity_images.push(
			await {
				name: i.name,
				image,
				position: i.position,
				direction: i.direction,
				status: i.status,
			}
		);
	}
	const bg = await loadImage("./assets/bg.png");
	ctx.drawImage(bg, 0, 0, 1920, 1080);
	const bb = [1048, 160, 50, 50]; // board boundaries

	// Write sun value
	ctx.fillStyle = `rgb(255 255 0)`;
	ctx.font = "45px Impact";
	ctx.fillText(`Sun: ${sun}`, 1300, 100);

	// Draw bg under players
	ctx.strokeStyle = "rgba(0,255,0,1)";
	ctx.fillStyle = "rgba(0,255,0,0.2)";
	bctx.strokeStyle = "rgba(255,255,255,1)";
	bctx.fillStyle = "rgba(255,255,255,0.2)";
	bctx.lineWidth = 4;
	bctx.fillRect(0, 0, 3200, 3200);

	ctx.fillRect(bb[0], bb[1], bb[2] * board_width, bb[3] * board_height);
	ctx.beginPath();
	let i = 0;
	while (i <= board_width) {
		ctx.moveTo(bb[0] + i * bb[2], bb[1]);
		ctx.lineTo(bb[0] + i * bb[2], bb[1] + board_height * 50);
		i++;
	}
	i = 0;
	while (i <= board_height) {
		ctx.moveTo(bb[0], bb[1] + i * bb[3]);
		ctx.lineTo(bb[0] + board_width * 50, bb[1] + i * bb[3]);
		i++;
	}

	ctx.stroke();

	bctx.beginPath();
	i = 0;
	while (i <= board_width) {
		bctx.moveTo(i * 200, 0);
		bctx.lineTo(i * 200, 3200);
		i++;
	}
	i = 0;
	while (i <= board_height) {
		bctx.moveTo(0, i * 200);
		bctx.lineTo(3200, i * 200);
		i++;
	}
	bctx.stroke();
	await entity_images.forEach(async (p) => {
		await ctx.drawImage(
			p.image,
			bb[0] + p.position.x * bb[2],
			bb[1] + p.position.y * bb[3],
			bb[2],
			bb[3]
		);
		await bctx.drawImage(
			p.image,
			p.position.x * 200 + 5,
			p.position.y * 200 + 5,
			190,
			190
		);
	});

	// direction arrows
	bctx.fillStyle = "rgb(255,255,255)";
	await entity_images.forEach(async (p) => {
		if (p.direction) {
			bctx.beginPath();
			const px_normal =
				p.direction.x /
				Math.sqrt(
					Math.pow(p.direction.x, 2) + Math.pow(p.direction.y, 2)
				);
			const py_normal =
				p.direction.y /
				Math.sqrt(
					Math.pow(p.direction.x, 2) + Math.pow(p.direction.y, 2)
				);
			const angle =
				Math.atan(py_normal / px_normal) +
				(px_normal < 0 ? Math.PI / 2 : 0);
			const left_angle = angle - Math.PI / 8;
			const right_angle = angle + Math.PI / 8;
			const triangle_x = [
				px_normal * 110,
				Math.cos(left_angle) * 90,
				Math.cos(right_angle) * 90,
			];
			const triangle_y = [
				py_normal * 110,
				Math.sin(left_angle) * 90,
				Math.sin(right_angle) * 90,
			];
			bctx.moveTo(
				p.position.x * 200 + 100 + triangle_x[0],
				p.position.y * 200 + 100 + triangle_y[0]
			);
			bctx.lineTo(
				p.position.x * 200 + 100 + triangle_x[1],
				p.position.y * 200 + 100 + triangle_y[1]
			);
			bctx.lineTo(
				p.position.x * 200 + 100 + triangle_x[2],
				p.position.y * 200 + 100 + triangle_y[2]
			);
			bctx.fill();
		}
		if (p.status) {
			console.log(p);
			p.status.forEach(async (s) => {
				let s_image;
				try {
					s_image = await loadImage(`./assets/${s.name}.png`);
				} catch {
					s_image = await loadImage(`./assets/default_status.png`);
				}
				bctx.drawImage(
					s_image,
					p.position.x * 200 + 100,
					p.position.y * 200,
					100,
					100
				);
			});
		}
	});
}
drawBG().then(() => {
	const out = fs.createWriteStream(__dirname + "/assets/state.png");
	const b_out = fs.createWriteStream(__dirname + "/assets/board.png");
	const stream = canvas.createPNGStream();
	const b_stream = board_canvas.createPNGStream();
	stream.pipe(out);
	b_stream.pipe(b_out);
	out.on("finish", () => console.log("The PNG file was created."));
	b_out.on("finish", () => console.log("The PNG file was created."));
});
