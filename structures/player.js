const { loadImage } = require("canvas");
const path = require("path");
module.exports = class Player {
	constructor(data) {
		this.health = 3;

		Object.assign(this, data);
		this.max_health = this.health;
	}
	async sprite() {
		return await loadImage(
			path.join(__dirname, `../assets/players/${this.name}.png`)
		);
	}
};
