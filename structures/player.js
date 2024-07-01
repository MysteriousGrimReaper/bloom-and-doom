const { loadImage } = require("canvas");
const path = require("path");
module.exports = class Player {
	constructor(data) {
		this.health = 3;
		this.has_acted = false;
		Object.assign(this, data);
		this.max_health = this.health;
	}
	async sprite() {
		return await loadImage(
			path.join(__dirname, `../assets/players/${this.name}.png`)
		);
	}
	get displayName() {
		return `${this.has_acted ? `` : `• `}${this.name}`;
	}
	act() {
		this.has_acted = true;
		return this;
	}
	reset_act() {
		this.has_acted = false;
		return this;
	}
};
