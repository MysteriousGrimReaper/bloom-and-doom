const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
const Movement = require("../structures/movement.js");
class Aloe extends Plant {
	constructor(data) {
		super({
			name: `Aloe`,
			sun_cost: 100,
			health: 1,
			to_heal: `plants`,
			cooldown: 3,
			hidden: true,
			heal_image: `heal.png`,
		});
		Object.assign(this, data);
	}
	onEndTurn(action_list) {
		action_list.nearSquare(this.position, 1, this.to_heal).forEach((p) => {
			if (
				Math.abs(p.position.x - this.position.x) == 1 ||
				Math.abs(p.position.y - this.position.y) == 1
			) {
				if (p.health < p.max_health) {
					p.health += 0.4;
					p.health = Math.min(p.health, p.max_health);
				}
			}
		});
		const actions = Array.from(Array(9)).map((_, index) => {
			return new Action({
				tile_render: {
					position: new Movement(
						(index % 3) - 1 + this.position.x,
						Math.floor(index / 3) - 1 + this.position.y
					),
					effect: this.heal_image,
				},
			});
		});
		// console.log(actions);
		return new Action({
			actions,
		});
	}
}
module.exports = {
	Aloe,
	HeavenlyPeach: class HeavenlyPeach extends Aloe {
		constructor(data) {
			super({
				name: `Heavenly Peach`,
				sun_cost: 75,
				to_heal: `players`,
				heal_image: `player-heal.png`,
			});
			Object.assign(this, data);
		}
	},
};
