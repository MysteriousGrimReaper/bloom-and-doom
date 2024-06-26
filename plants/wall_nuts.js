const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js")
class WallNut extends Plant {
	constructor(data) {
		super({
			name: `Wall-Nut`,
			sun_cost: 50,
			health: 10,
			unlock_timer: 2,
			cooldown: 5,
		});
		Object.assign(this, data);
	}
}
module.exports = {
	WallNut,
	Infinut: class Infinut extends WallNut {
		constructor(data) {
			super({
				name: `Infi-nut`,
				sun_cost: 75,
				health: 4,
				max_health: 4,
				unlock_timer: 15,
			});
			Object.assign(this, data);
		}
		onEndTurn() {
			if (this.health < this.max_health) {
				this.health += 0.5;
			}
			return this;
		}
	},
	Endurian: class Endurian extends WallNut {
		constructor(data) {
			super({
				name: `Endurian`,
				sun_cost: 75,
				health: 8,
				cooldown: 4
			})
			Object.assign(this, data)
		}
		onEndTurn(action_list) {
			action_list.near(this.position, 1, `zombies`).forEach(zombie => {
				zombie.damage(1)
			});
			return new Action({})
		}
	}
};
