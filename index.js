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
const games = [];
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

const actions_tdq = new ActionList({ board_width: 16, board_height: 16 });
const players_tdq = new PlayerList();
players_tdq.push(
	...[
		new Player({ name: `arno`, position: new Movement(0, 0) }),
		new Player({ name: `Bradicus`, position: new Movement(1, 0) }),
		new Player({ name: `Captain Totalitea`, position: new Movement(2, 0) }),
		new Player({ name: `Chilly Billy`, position: new Movement(3, 0) }),
		new Player({ name: `Cube492`, position: new Movement(4, 0) }),
		new Player({ name: `Lazarus Alarie`, position: new Movement(5, 0) }),
		new Player({ name: `Tatters`, position: new Movement(6, 0) }),
		new Player({ name: `The CAACN`, position: new Movement(7, 0) }),
		new Player({ name: `CT`, position: new Movement(8, 0) }),
		new Player({ name: `AMS`, position: new Movement(9, 0) }),
		new Player({ name: `Lillith Lazuli`, position: new Movement(10, 0) }),
		new Player({ name: `Azalea`, position: new Movement(11, 0) }),
		new Player({ name: `Snow SMA`, position: new Movement(12, 0) }),
		new Player({ name: `Firework Dragon`, position: new Movement(13, 0) }),
	]
);
actions_tdq.setPlayers(players_tdq);
actions_tdq.push(
	...[
		new Action({ begin_turn: true }),
		new Action({
			new_plant: `Peashooter`,
			position: new Movement(8, 8),
			direction: new Movement(0, 1),
		}),
		new Action({ new_zombie: `Basic`, position: new Movement(8, 15) }),
		...Array(20).fill(new Action({ end_turn: true })),
		new Action({
			new_plant: `Jalapeno`,
			position: new Movement(4, 4),
		}),
	]
);
const ff = 0;
actions.push(...Array(ff).fill(new Action({ end_turn: true })));
actions_tdq.push(...Array(ff).fill(new Action({ end_turn: true })));
games.push(actions);
games.push(actions_tdq);
const game_index = 1;
const valid = games[game_index].validate();
if (valid) {
	console.log("\x1b[32m", "All set! Find the game log in game.json.");
	fs.writeFile(
		`game.json`,
		JSON.stringify(games[game_index].toJSON()),
		(err) => {
			if (err) throw err;
			console.log(`The file has been saved!`);
		}
	);
}

console.log(`Done`);

// draw image
const { createCanvas, loadImage, registerFont } = require("canvas");
registerFont("assets/Archivo-SemiBold.ttf", { family: "Archivo" });
registerFont("assets/HelveticaNeueMedium.otf", { family: "HelveticaNeue" });
const canvas = createCanvas(1920, 1080);
const ctx = canvas.getContext("2d");
const {
	sun,
	player_list,
	zombie_list,
	plant_list,
	board_height,
	board_width,
	seed_slot_list,
	show_projectiles,
} = games[game_index];
let last_turn_index = games[game_index].length;
while (!games[game_index][last_turn_index]?.end_turn && last_turn_index >= 0) {
	last_turn_index--;
}
const render_images = games[game_index]
	.slice(last_turn_index)
	.filter((action) => action.render);
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
	const margin = 3;
	await [...plant_list, ...zombie_list, ...player_list].forEach(async (p) => {
		await ctx.drawImage(
			await p.sprite(),
			bb[0] + p.position.x * bb[2] + margin,
			bb[1] + p.position.y * bb[3] + margin,
			bb[2] - margin * 2,
			bb[3] - margin * 2
		);
		if (p.direction) {
			ctx.fillStyle = `rgb(255, 255, 255)`;
			ctx.beginPath();
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
				px_normal * 25,
				Math.cos(left_angle) * 15,
				Math.cos(right_angle) * 15,
			];
			const triangle_y = [
				py_normal * 25,
				Math.sin(left_angle) * 15,
				Math.sin(right_angle) * 15,
			];
			ctx.moveTo(
				p.position.x * bb[2] + bb[0] + bb[2] / 2 + triangle_x[0],
				p.position.y * bb[3] + bb[1] + bb[3] / 2 + triangle_y[0]
			);
			ctx.lineTo(
				p.position.x * bb[2] + bb[0] + bb[2] / 2 + triangle_x[1],
				p.position.y * bb[3] + bb[1] + bb[3] / 2 + triangle_y[1]
			);
			ctx.lineTo(
				p.position.x * bb[2] + bb[0] + bb[2] / 2 + triangle_x[2],
				p.position.y * bb[3] + bb[1] + bb[3] / 2 + triangle_y[2]
			);
			ctx.fill();
		}
		if (p.status) {
			p.status.forEach(async (s) => {
				let s_image;
				try {
					s_image = await loadImage(`./assets/${s.name}.png`);
				} catch {
					s_image = await loadImage(`./assets/default_status.png`);
				}
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
				)}${
					temp_plant.unlock_timer <= 0
						? `/${temp_plant.cooldown}`
						: ``
				}`,
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
	render_images.forEach(async (action) => {
		const { render } = action;
		if (render.effect) {
			await ctx.drawImage(
				await loadImage(
					path.join(__dirname, `/assets/effects/${render.effect}`)
				),
				bb[0] +
					(render?.start_x ??
						render.position.x - (render?.size?.x - 1) / 2) *
						bb[2] +
					margin,
				bb[1] +
					(render?.start_y ??
						render.position.y - (render?.size?.y - 1) / 2) *
						bb[3] +
					margin,
				bb[2] * (render?.size?.x ?? 1) - margin * 2,
				bb[3] * (render?.size?.y ?? 1) - margin * 2
			);
		} else if (render.projectile) {
			const projectile_image = await loadImage(
				path.join(__dirname, `/assets/projectiles/${render.projectile}`)
			);
			let draw_x = render.start_pos.x;
			let draw_y = render.start_pos.y;
			const repetitions = isNaN(
				Math.abs((draw_x - render.end_pos.x) / render.direction.x)
			)
				? Math.abs((draw_y - render.end_pos.y) / render.direction.y)
				: Math.abs((draw_x - render.end_pos.x) / render.direction.x);
			let i = 0;
			while (i < repetitions) {
				console.log(
					`drawing ${render.projectile} at ${draw_x}, ${draw_y}`
				);
				ctx.globalAlpha = i / repetitions;
				await ctx.drawImage(
					projectile_image,
					bb[0] +
						(render?.start_x ??
							draw_x - ((render?.size?.x ?? 1) - 1) / 2) *
							bb[2] +
						margin,
					bb[1] +
						(render?.start_y ??
							draw_y - ((render?.size?.y ?? 1) - 1) / 2) *
							bb[3] +
						margin,
					bb[2] * (render?.size?.x ?? 1) - margin * 2,
					bb[3] * (render?.size?.y ?? 1) - margin * 2
				);
				draw_x += render.direction.x;
				draw_y += render.direction.y;
				i++;
			}
		}
	});
}
drawBG().then(() => {
	const out = fs.createWriteStream(
		path.join(__dirname, "/web-app/public/images/state.png")
	);
	const stream = canvas.createPNGStream();
	stream.pipe(out);
	out.on("finish", () => console.log("The PNG file was created."));
});
