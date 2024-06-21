const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
class Sunflower extends Plant {
	constructor(data) {
		super({
			name: `Sunflower`,
			sun_cost: 50,
			sun_production: 25,
			cooldown: 0,
		});
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
	TwinSunflower: class TwinSunflower extends Sunflower {
		constructor(data) {
			super({
				name: `Twin Sunflower`,
				sun_cost: 125,
				sun_production: 50,
				unlock_timer: 10,
				cooldown: 3
			})
			Object.assign(this, data)
		}
	},
	PrimalSunflower: class PrimalSunflower extends Sunflower {
		constructor(data) {
			super({
				name: `Primal Sunflower`,
				sun_cost: 125,
				sun_production: 175,
				unlock_timer: 20,
				cooldown: 3,
				sun_timer: 3
			})
			
			Object.assign(this, data)
		}
		onEndTurn() {
			this.sun_timer--
			if (this.sun_timer <= 0) {
				this.sun_timer = 3
				return new Action({
					sun_gain: this.sun_production,
					from: `Primal Sunflower`,
				});
			}
			else {
				return new Action({
					notes: `Awaiting sun from Primal Sunflower`
				})
			}
		}
	},
	Sunshroom: class Sunshroom extends Sunflower {
		constructor(data) {
			super({
				name: `Sun-shroom`,
				sun_cost: 25,
				sun_production: 5,
				max_sun_production: 25,
				cooldown: 0,
				hidden: true
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
