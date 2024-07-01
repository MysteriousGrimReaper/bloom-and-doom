const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
class Lilypad extends Plant {
	constructor(data) {
		super({
			name: `Lily Pad`,
			sun_cost: 25,
			cooldown: 1,
			health: 1,
			amphibious: true,
			hidden: true,
		});
		Object.assign(this, data);
	}
	onPlant(action_list) {
		action_list.plant_list.unshift(
			...action_list.plant_list.splice(
				action_list.plant_list.length - 1,
				1
			)
		);
		return new Action({
			notes: `Plant order edited`,
		});
	}
}
module.exports = {
	Lilypad,
	FlowerPot: class FlowerPot extends Lilypad {
		constructor(data) {
			super({
				name: `Flower Pot`,
				sun_cost: 50,
				cooldown: 1,
				health: 1,
				hidden: true,
			});
			Object.assign(this, data);
		}
	},
};
