const { loadImage } = require("canvas");
const path = require("path");
module.exports = class Player {
	constructor(data) {
		this.health = 3;
		this.max_health = this.health;
		Object.assign(this, data);
	}
	async sprite() {
		return await loadImage(
			path.join(__dirname, `../assets/${this.name}.png`)
		);
	}
};
