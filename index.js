const Action = require("./structures/action.js");
const ActionList = require("./structures/action_list.js");
const Movement = require("./structures/movement.js");
const Player = require("./structures/player.js");
const PlayerList = require("./structures/player_list.js");
const Plant = require("./structures/plant.js");
const fs = require("node:fs");
const path = require("path");

const almanac = require("./almanac.js");
const zalmanac = require("./zalmanac.js");
const Zombie = require("./structures/zombie.js");
const actions = new ActionList({ board_width: 16, board_height: 16 });
const players = new PlayerList();
players.push(
	...[new Player({ name: `woooowoooo`, position: new Movement(9, 9, true) })]
);
actions.setPlayers(players);
actions.push(
	...[
		new Action({ begin_turn: true }),
		new Action({ new_plant: `Sunflower`, position: new Movement(8, 8) }),
		new Action({ new_plant: `PotatoMine`, position: new Movement(10, 10) }),
		new Action({
			new_plant: `IcebergLettuce`,
			position: new Movement(8, 10),
		}),
		new Action({
			end_turn: true,
		}),
		new Action({
			player: `woooowoooo`,
			movement: new Movement(-1, -1),
		}),
		new Action({
			new_plant: `Peashooter`,
			position: new Movement(7, 9),
			direction: new Movement(0, 1),
		}),
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(7, 7),
		}),
		new Action({ end_turn: true }),
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(7, 8),
		}),
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(8, 7),
		}),
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(9, 8),
		}),
		new Action({
			player: `woooowoooo`,
			movement: new Movement(7, 7, false),
		}),
		new Action({ end_turn: true }),
		// (7, 8), (7, 9), (8, 7), and (9, 7)
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(6, 7),
		}),
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(6, 8),
		}),
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(7, 6),
		}),
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(8, 6),
		}),
		new Action({
			end_turn: true,
		}),
		new Action({
			new_zombie: "Basic",
			position: new Movement(12, 0),
		}),
		new Action({
			new_zombie: "Basic",
			position: new Movement(15, 3),
		}),
		new Action({
			new_zombie: "Basic",
			position: new Movement(9, 15),
		}),
		new Action({
			new_zombie: "Basic",
			position: new Movement(0, 10),
		}),
		new Action({
			new_plant: "LaserBean",
			position: new Movement(6, 6),
			direction: new Movement(3, -1),
		}),
	]
);
const ff = 1;
actions.push(...Array(ff).fill(new Action({ end_turn: true })));
const valid = actions.validate();
if (valid) {
	console.log("\x1b[32m", "All set! Find the game log in game.json.");
	fs.writeFile(`game.json`, JSON.stringify(actions.toJSON()), (err) => {
		if (err) throw err;
		console.log(`The file has been saved!`);
	});
}

console.log(`Done`);

// draw image
const { createCanvas, loadImage, registerFont } = require("canvas");
registerFont("assets/Archivo-SemiBold.ttf", { family: "Archivo" });
registerFont("assets/HelveticaNeueMedium.otf", { family: "HelveticaNeue" });
const canvas = createCanvas(1920, 1080);
const ctx = canvas.getContext("2d");
const board_canvas = createCanvas(3200, 3200);
const bctx = board_canvas.getContext("2d");
const {
	sun,
	player_list,
	zombie_list,
	plant_list,
	board_height,
	board_width,
	seed_slot_list,
} = actions;
async function drawBG() {
	const entity_images = [];
	const lock_image = await loadImage(`./assets/lock.png`);
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
	ctx.font = "45px Archivo";
	ctx.fillText(`☀️ ${sun}`, 1300, 100);

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
	await [...plant_list, ...zombie_list, ...player_list].forEach(async (p) => {
		await ctx.drawImage(
			await p.sprite(),
			bb[0] + p.position.x * bb[2],
			bb[1] + p.position.y * bb[3],
			bb[2],
			bb[3]
		);
		await bctx.drawImage(
			await p.sprite(),
			p.position.x * 200 + 5,
			p.position.y * 200 + 5,
			190,
			190
		);
		if (p.direction) {
			bctx.fillStyle = `rgb(255, 255, 255)`;
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
				ctx.drawImage(
					s_image,
					bb[0] + p.position.x * bb[2] + bb[2] / 2,
					bb[1] + p.position.y * bb[3],
					bb[2] / 2,
					bb[3] / 2
				);
			});
		}
	});
	/**
	 * STATE EXCLUSIVE
	 */
	ctx.fillStyle = `rgb(255, 255, 255)`;
	const g_offset = 250;
	const gardener_label_offset = 80;
	ctx.fillText(`Gardeners`, 373 + g_offset + gardener_label_offset, 105);
	ctx.fillText(`Seeds`, g_offset - 100, 105);
	ctx.font = "30px Archivo";
	for (let p in player_list) {
		ctx.fillText(
			player_list[p].name,
			373 + g_offset + gardener_label_offset,
			155 + 40 * p
		);
		ctx.drawImage(
			await player_list[p].sprite(),
			333 + g_offset + gardener_label_offset,
			130 + 40 * p,
			30,
			30
		);
	}
	const plant_keys = Object.keys(seed_slot_list).sort();
	for (let p in plant_keys) {
		const temp_plant = seed_slot_list[plant_keys[p]];
		const is_recharged = !(
			temp_plant.unlock_timer > 0 || temp_plant.cooldown_timer > 0
		);
		if (!is_recharged) {
			ctx.fillStyle = "rgb(122, 122, 122)";
			ctx.fillText(
				`🔄 ${Math.max(
					temp_plant.unlock_timer,
					temp_plant.cooldown_timer
				)}${temp_plant.unlock_timer <= 0 ? `/${temp_plant.cooldown}` : ``}`,
				g_offset + 280,
				155 + 40 * p
			);
			if (temp_plant.unlock_timer > 0) {
				ctx.drawImage(lock_image, g_offset - 150, 130 + 40 * p, 30, 30);
			} else {
				ctx.drawImage(
					await temp_plant.sprite(),
					g_offset - 150,
					130 + 40 * p,
					30,
					30
				);
			}
		} else {
			ctx.drawImage(
				await temp_plant.sprite(),
				g_offset - 150,
				130 + 40 * p,
				30,
				30
			);
		}
		ctx.fillText(temp_plant.name, g_offset - 100, 155 + 40 * p);
		const sun_value = sun >= temp_plant.sun_cost;
		ctx.fillStyle =
			sun_value && is_recharged
				? `rgb(255, 255, 100)`
				: sun_value
				? `rgb(100, 100, 0)`
				: is_recharged
				? `rgb(255, 100, 100)`
				: `rgb(100, 100, 100)`;
		ctx.fillText(`☀️ ${temp_plant.sun_cost}`, g_offset + 150, 155 + 40 * p);
		ctx.fillStyle = "rgb(255, 255, 255)";
	}
	ctx.fillStyle = "rgba(100,255,100,0.5)";
	for (let i = 1; i <= 16; i++) {
		ctx.textAlign = "center";
		ctx.fillText(i, 1025 + i * 50, 153);
		ctx.textAlign = "right";
		ctx.fillText(i, 1040, 143 + i * 50);
	}

	/**
	 * BOARD EXCLUSIVE
	 */
	// direction arrows
	bctx.fillStyle = "rgb(255,255,255)";
	await entity_images.forEach(async (p) => {});
}
drawBG().then(() => {
	const out = fs.createWriteStream(
		path.join(
			__dirname,
			"/web-app/public/images/state.png"
		)
	);
	const b_out = fs.createWriteStream(
		__dirname + "/web-app/public/images/board.png"
	);
	const stream = canvas.createPNGStream();
	const b_stream = board_canvas.createPNGStream();
	stream.pipe(out);
	b_stream.pipe(b_out);
	out.on("finish", () => console.log("The PNG file was created."));
	b_out.on("finish", () => console.log("The PNG file was created."));
});
