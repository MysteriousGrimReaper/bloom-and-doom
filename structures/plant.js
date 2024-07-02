const { loadImage } = require("canvas");
const path = require("path");
const Action = require("./action.js");
const Movement = require("./movement.js");
const { Tiles } = require("./enums.js");
module.exports = class Plant {
	/**
	 *
	 * @param {PlantData} data
	 */
	constructor(data) {
		this.position = new Movement(0, 0);
		this.health = 1;

		this.unlock_timer = 0;
		this.cooldown = 1;
		this.cooldown_timer = 0;
		Object.assign(this, data);
		this.max_health = this.health;
	}
	async sprite() {
		return await loadImage(
			path.join(__dirname, `../assets/plants/${this.name}.png`)
		);
	}
	onPlant(action_list) {
		this.cooldown_timer = this.cooldown;
		if (
			!(this.aquatic || this.amphibious || this.flying) &&
			action_list.tile_map[
				this.position.x + this.position.y * action_list.board_width
			] == Tiles.Water
		) {
			this.health -= 10000;
		}
		return new Action({
			sun_cost: this.sun_cost,
			notes: `Planting ${this.name}`,
		});
	}
	onDeath() {
		return new Action({
			notes: `${this.name} eaten by zombie`,
		});
	}
	onEndTurn() {
		return new Action({
			notes: `Default action: do nothing (${this.name})`,
		});
	}
	setPosition(x, y) {
		this.position.x = x;
		this.position.y = y;
		return this;
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
};
