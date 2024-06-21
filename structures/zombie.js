const Action = require("./action.js");
const Movement = require("./movement.js");
const { loadImage } = require("canvas");
const path = require("path");
module.exports = class Zombie {
	constructor(data) {
		this.health = 3;

		this.position = new Movement(0, 0);
		this.dead = false;
		this.bite = 1;
		this.name = `Zombie`;
		this.status = [];
		Object.assign(this, data);
		this.max_health = this.health;
	}
	onEnter() {
		return new Action({
			notes: `Zombie spawned at ${this.position.x}, ${this.position.y}`,
		});
	}
	evalStatuses() {
		const frozen = this.status.find((s) => s.name == `frozen`);
		if (frozen != undefined) {
			if (frozen.time > 0) {
				frozen.time--;
				return false;
			} else {
				this.status.splice(this.status.indexOf(frozen), 1);
			}
		}
		return true;
	}
	damage(hp) {
		this.health -= hp;
		return this;
	}
	setPosition(x, y) {
		this.position.x = x;
		this.position.y = y;
		return this;
	}
	async sprite() {
		return await loadImage(
			path.join(__dirname, `../assets/${this.name}.png`)
		);
	}
	move(movement) {
		const { x, y, relative } = movement;
		if (relative) {
			this.position.x += x;
			this.position.y += y;
		} else {
			this.position.x = x;
			this.position.y = y;
		}
		return this;
	}
	setSunCost(cost) {
		this.sun_cost = cost;

		return this;
	}
	addSun(bonus = 0) {
		return new Action({ sun_gain: bonus + this.sun_production });
	}
	closest(player_list, plant_list) {
		const cost_list = player_list.map(
			(p) =>
				(p.position.x - this.position.x) *
					(p.position.x - this.position.x) +
				(p.position.y - this.position.y) *
					(p.position.y - this.position.y)
		);
		const plant_cost_list = plant_list.map(
			(p) =>
				(p.position.x - this.position.x) *
					(p.position.x - this.position.x) +
				(p.position.y - this.position.y) *
					(p.position.y - this.position.y) +
				0.1
		);
		const min_player_cost = Math.min(...cost_list);
		const min_plant_cost = Math.min(...plant_cost_list);
		let target;
		if (min_plant_cost > min_player_cost) {
			target = player_list[cost_list.indexOf(min_player_cost)];
		} else {
			target = plant_list[plant_cost_list.indexOf(min_plant_cost)];
		}

		return target;
	}
	orthoPathfind(player_list, plant_list) {
		const target = this.closest(player_list, plant_list);
		console.log(`Target position:`);
		console.log(target.position);
		const h_direction = target.position.x - this.position.x;
		const v_direction = target.position.y - this.position.y;
		const go_h_axis = Math.abs(h_direction) >= Math.abs(v_direction);

		const movement_direction = new Movement(
			go_h_axis ? Math.sign(h_direction) : 0,
			!go_h_axis ? Math.sign(v_direction) : 0
		);
		console.log(`Current position:`);
		console.log(this.position);
		console.log(movement_direction);
		return movement_direction;
	}
	diagPathfind(player_list, plant_list) {
		const target = this.closest(player_list, plant_list);
		const h_direction = target.position.x - this.position.x;
		const v_direction = target.position.y - this.position.y;
		return new Movement(Math.sign(h_direction), Math.sign(v_direction));
	}
	onEndTurn(player_list, plant_list) {
		if (!this.evalStatuses()) {
			return new Action({
				zombie_status: ``,
			});
		}
		if (this.health <= 0) {
			this.dead = true;
			return new Action({
				notes: `Zombie has died`,
			});
		}
		this.move(this.orthoPathfind(player_list, plant_list));
		player_list.forEach((p) => {
			if (
				p.position.x == this.position.x &&
				p.position.y == this.position.y
			) {
				p.health -= this.bite;
			}
		});
		plant_list.forEach((p) => {
			if (
				p.position.x == this.position.x &&
				p.position.y == this.position.y
			) {
				p.health -= this.bite;
			}
		});
		return new Action({
			zombie_movement: `Moving to ${this.position.x}, ${this.position.y}`,
		});
	}
};