const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
const { loadImage } = require("canvas");
const path = require("path");
class Chomper extends Plant {
	constructor(data) {
		super({
			name: `Chomper`,
			sun_cost: 150,
			cooldown: 6,
			eat_timer: 0,
			hidden: true,
		});
		Object.assign(this, data);
	}
	async sprite() {
		return await loadImage(
			path.join(
				__dirname,
				`../assets/plants/${this.name}${
					this.eat_timer <= 0 ? `` : ` Eating`
				}.png`
			)
		);
	}
	onEndTurn() {
		this.eat_timer--;
		if (this.eat_timer > 0) {
			return new Action({
				notes: `${this.name} eating, ${this.eat_timer} turns left`,
			});
		}
		this.action_list
			.near(this.position, 2, `zombies`)[0]
			.damage(25, `bite`);
		this.eat_timer = 8;
	}
}
module.exports = {
	Chomper,
};
