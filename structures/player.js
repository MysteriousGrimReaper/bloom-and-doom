const { loadImage } = require("canvas");
const path = require("path");
const Action = require("./action");
module.exports = class Player {
	constructor(data) {
		this.health = 3;
		this.has_acted = false;
		this.exhaustion = 0;
		Object.assign(this, data);
		this.max_health = this.health;
	}
	async sprite() {
		return await loadImage(
			path.join(__dirname, `../assets/players/${this.name}.png`)
		);
	}
	get displayName() {
		return `${this.has_acted || this.exhaustion > 0 ? `` : `• `}${
			this.name
		}${this.exhaustion > 0 ? ` (⚠️ ${this.exhaustion})` : ``}`;
	}
	damage(hp, type = null) {
		this.health -= hp;
		return this;
	}
	act() {
		this.has_acted = true;
		return this;
	}
	reset_act() {
		this.has_acted = false;
		return this;
	}
	onEndTurn(action_list) {
		this.exhaustion--;
		return new Action({
			player: this.name,
			exhaust: this.exhaustion,
		});
	}
};
