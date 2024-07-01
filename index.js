const game_index = "tdq";

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
const games = require("./actions.js");
const actions = new ActionList()
	.setActions(games[game_index].actions)
	.setPlayers(games[game_index].players);
// console.log(actions);
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
const { Tiles } = require("./structures/enums.js");
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
} = actions;
let last_turn_index = actions.length;
while (!actions[last_turn_index]?.end_turn && last_turn_index >= 0) {
	last_turn_index--;
}
const render_images = actions
	.slice(last_turn_index)
	.filter((action) => action.render);
const tile_render_images = actions
	.slice(last_turn_index)
	.filter((action) => action.tile_render);
async function drawBG() {
	const entity_images = [];
	const lock_image = await loadImage(`./assets/lock.png`);
	for (let i of [...player_list, ...plant_list, ...zombie_list]) {
		let image;
		try {
			image = await loadImage(`./assets/plants/${i.name}.png`);
		} catch {
			try {
				image = await loadImage(`./assets/players/${i.name}.png`);
			} catch {
				try {
					image = await loadImage(`./assets/zombies/${i.name}.png`);
				} catch {
					image = await loadImage("./assets/default.png");
				}
			}
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
	const board_color = "#FFF090";
	const water_color = "#0000FF30";
	ctx.strokeStyle = board_color;
	ctx.fillStyle = board_color + "30";

	// draw tiles
	ctx.fillRect(bb[0], bb[1], bb[2] * board_width, bb[3] * board_height);
	for (let i in actions.tile_map) {
		for (let j in actions.tile_map) {
			switch (actions.tile_map[i][j]) {
				case Tiles.Water:
					ctx.fillStyle = water_color;
					ctx.fillRect(
						bb[0] + bb[2] * j,
						bb[1] + bb[3] * i,
						bb[2],
						bb[3]
					);
					break;
			}
		}
	}

	// grid
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
	// render tile (behind entities)
	for (const action of tile_render_images) {
		const render = action.tile_render;
		if (render.effect) {
			ctx.globalAlpha = render.alpha ?? 1;
			await ctx.drawImage(
				await loadImage(
					path.join(
						__dirname,
						`/assets/effects/${
							render.effect.endsWith(`.png`)
								? render.effect
								: render.effect + ".png"
						}`
					)
				),
				bb[0] +
					(render?.start_x ??
						render.position.x - ((render?.size?.x ?? 1) - 1) / 2) *
						bb[2],
				bb[1] +
					(render?.start_y ??
						render.position.y - ((render?.size?.y ?? 1) - 1) / 2) *
						bb[3],
				bb[2] * (render?.size?.x ?? 1),
				bb[3] * (render?.size?.y ?? 1)
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
	}
	ctx.globalAlpha = 1;
	const margin = 3;
	await [...plant_list, ...zombie_list, ...player_list].forEach(async (p) => {
		// draw entities
		await ctx.drawImage(
			await p.sprite(),
			bb[0] + p.position.x * bb[2] + margin,
			bb[1] + p.position.y * bb[3] + margin,
			bb[2] - margin * 2,
			bb[3] - margin * 2
		);
		// direction arrow

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
			console.log(py_normal);
			let angle = Math.atan(py_normal / px_normal);
			if (py_normal == 0) {
				console.log(`py_normal is 0`);
				angle = px_normal < 0 ? Math.PI : 0;
			}
			const left_angle = angle - Math.PI / 8;
			const right_angle = angle + Math.PI / 8;
			const triangle_x = [
				px_normal * 25,
				Math.cos(left_angle) * 20,
				Math.cos(right_angle) * 20,
			];
			const triangle_y = [
				py_normal * 25,
				Math.sin(left_angle) * 20,
				Math.sin(right_angle) * 20,
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

		// status
		if (p.status) {
			p.status.forEach(async (s) => {
				let s_image;
				try {
					s_image = await loadImage(
						`./assets/statuses/${s.name}.png`
					);
				} catch {
					s_image = await loadImage(
						`./assets/statuses/default_status.png`
					);
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
		// health bar
		if (p.health < p.max_health) {
			const proportion = p.health / p.max_health;
			ctx.fillStyle = `rgb(${proportion < 0.67 ? `200` : `0`}, ${
				proportion > 0.33 ? `200` : `0`
			}, 20)`;
			ctx.beginPath();
			ctx.rect(
				bb[0] + p.position.x * bb[2],
				bb[1] + p.position.y * bb[3] - 2,
				bb[2] * proportion,
				4
			);
			ctx.fill();
			ctx.strokeStyle = `rgb(255, 255, 255)`;
			ctx.beginPath();
			ctx.rect(
				bb[0] + p.position.x * bb[2],
				bb[1] + p.position.y * bb[3] - 2,
				bb[2],
				4
			);
			ctx.stroke();
			ctx.fillStyle = `rgb(255, 255, 255)`;
		}
	});
	// plant labels
	ctx.fillStyle = `rgb(255, 255, 255)`;
	ctx.strokeStyle = `rgb(255, 255, 255)`;
	const g_offset = 250;
	const gardener_label_offset = 80;
	ctx.fillText(`Gardeners`, 373 + g_offset + gardener_label_offset, 105);
	ctx.fillText(`Seeds`, g_offset - 100, 105);
	ctx.font = "30px Archivo";
	// player names
	for (let p in player_list) {
		ctx.fillStyle = player_list[p].fillStyle ?? `#ffffff`;
		ctx.fillText(
			player_list[p].displayName,
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
	const all_plant_keys = Object.keys(seed_slot_list).sort();
	const plant_keys = all_plant_keys.filter((s) => {
		const plant = seed_slot_list[s];
		return !plant.hidden;
	});
	for (let p in plant_keys) {
		const temp_plant = seed_slot_list[plant_keys[p]];
		const is_recharged = !(
			temp_plant.unlock_timer > 0 || temp_plant.cooldown_timer > 0
		);
		ctx.fillStyle = temp_plant.fillStyle ?? `#fff`;
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
	}
	ctx.fillStyle = board_color + "88";
	for (let i = 1; i <= 16; i++) {
		ctx.textAlign = "center";
		ctx.fillText(i, 1025 + i * 50, 153);
		ctx.textAlign = "right";
		ctx.fillText(i, 1040, 143 + i * 50);
	}
	for (const action of render_images) {
		const { render } = action;
		if (render.effect) {
			ctx.globalAlpha = render.alpha ?? 1;
			await ctx.drawImage(
				await loadImage(
					path.join(
						__dirname,
						`/assets/effects/${
							render.effect.endsWith(`.png`)
								? render.effect
								: render.effect + ".png"
						}`
					)
				),
				bb[0] +
					(render?.start_x ??
						render.position.x - ((render?.size?.x ?? 1) - 1) / 2) *
						bb[2],
				bb[1] +
					(render?.start_y ??
						render.position.y - ((render?.size?.y ?? 1) - 1) / 2) *
						bb[3],
				bb[2] * (render?.size?.x ?? 1),
				bb[3] * (render?.size?.y ?? 1)
			);
		} else if (render.projectile) {
			const projectile_image = await loadImage(
				path.join(__dirname, `/assets/projectiles/${render.projectile}`)
			);
			let draw_x = render.start_pos.x;
			let draw_y = render.start_pos.y;
			const repetitions = Math.min(
				16,
				isNaN(
					Math.abs((draw_x - render.end_pos.x) / render.direction.x)
				)
					? Math.abs((draw_y - render.end_pos.y) / render.direction.y)
					: Math.abs((draw_x - render.end_pos.x) / render.direction.x)
			);
			let i = 0;
			while (i < repetitions) {
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
	}
}
drawBG().then(() => {
	const out = fs.createWriteStream(
		path.join(__dirname, "/web-app/public/images/state.png")
	);
	const stream = canvas.createPNGStream();
	stream.pipe(out);
	out.on("finish", () => console.log("The PNG file was created."));
});
