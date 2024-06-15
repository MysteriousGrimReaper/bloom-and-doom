const Plant = require("../structures/plant.js");
class WallNut extends Plant {
	constructor(data) {
		super({ name: `Wall-Nut`, sun_cost: 50, health: 10 });
		Object.assign(this, data);
	}
}
module.exports = {
	WallNut,
	Infinut: class Infinut extends WallNut {
		constructor(data) {
			super({ name: `Infinut`, sun_cost: 75, health: 7 });
			Object.assign(this, data);
		}
		onEndTurn() {
			if (this.health < this.max_health) {
				this.health += 0.5;
			}
			return this;
		}
	},
};
