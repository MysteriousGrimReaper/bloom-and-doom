const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
class Sunflower extends Plant {
	constructor(data) {
		super({ name: `Sunflower`, sun_cost: 50, sun_production: 25 });
		Object.assign(this, data);
	}
	onEndTurn() {
		return new Action({
			sun_gain: this.sun_production,
			from: `Sunflower`,
		});
	}
}
module.exports = {
	Sunflower,
	Sunshroom: class Sunshroom extends Sunflower {
		constructor(data) {
			super({
				name: `Sun-shroom`,
				sun_cost: 25,
				sun_production: 5,
				max_sun_production: 25,
			});
			Object.assign(this, data);
		}
		onEndTurn() {
			if (this.sun_production < this.max_sun_production) {
				this.sun_production += 5;
			}
			return new Action({
				sun_gain: this.sun_production,
				from: `Sun-shroom`,
			});
		}
	},
};
