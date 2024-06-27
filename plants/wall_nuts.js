const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
class WallNut extends Plant {
	constructor(data) {
		super({
			name: `Wall-Nut`,
			sun_cost: 50,
			health: 6,
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

				hidden: true,
			});
			Object.assign(this, data);
		}
		onEndTurn() {
			if (this.health < this.max_health) {
				this.health += 0.5;
			}
			return new Action({});
		}
	},
	Endurian: class Endurian extends WallNut {
		constructor(data) {
			super({
				name: `Endurian`,
				sun_cost: 75,
				health: 4,
				cooldown: 4,
				hidden: true,
			});
			Object.assign(this, data);
		}
		onEndTurn(action_list) {
			action_list.near(this.position, 1, `zombies`).forEach((zombie) => {
				zombie.damage(1);
			});
			return new Action({});
		}
	},
	Ent: class Ent extends WallNut {
		constructor(data) {
			super({
				name: `Ent`,
				sun_cost: 400,
				health: 8,
				hidden: true,
				cooldown: 4,
			});
			Object.assign(this, data);
		}
		onEndTurn(action_list) {
			action_list.near(this.position, 1, `zombies`).forEach((zombie) => {
				zombie.damage(1);
			});
			if (this.health < this.max_health) {
				this.health += 0.2;
			}
			return new Action({});
		}
	},
};
