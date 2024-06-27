const Action = require("../structures/action");
const Plant = require("../structures/plant");

class HomingThistle extends Plant {
	constructor(data) {
		super({
			name: `Homing Thistle`,
			sun_cost: 250,
			damage: 1,
			hidden: true,
		});
		Object.assign(this, data);
	}
	onEndTurn(action_list) {
		const { zombie_list } = action_list;
		const cost_map = zombie_list.map(
			(z) =>
				Math.abs(z.position.x - this.position.x) +
				Math.abs(z.position.y - this.position.y)
		);
		const min_cost_index = cost_map.indexOf(Math.min(...cost_map));
		const target_zombie = zombie_list[min_cost_index];
		if (target_zombie) {
			target_zombie.damage(this.damage);
			return new Action({
				render: {
					effect: `target.png`,
					position: target_zombie.position,
				},
			});
		}
		return new Action({});
	}
}
class Cattail extends Plant {
	constructor(data) {
		super({
			name: `Cattail`,
			sun_cost: 250,
			damage: 1,
			amphibious: true,
			hidden: true,
		});
		Object.assign(this, data);
	}
	onEndTurn(action_list) {
		const zombie_list = action_list.nearSquare(this.position, 3, `zombies`);
		const cost_map = zombie_list.map(
			(z) =>
				Math.abs(z.position.x - this.position.x) +
				Math.abs(z.position.y - this.position.y)
		);
		const min_cost_index = cost_map.indexOf(Math.min(...cost_map));
		const target_zombie = zombie_list[min_cost_index];
		if (target_zombie) {
			target_zombie.damage(this.damage);
			return new Action({
				render: {
					effect: `target.png`,
					position: target_zombie.position,
				},
			});
		}
		return new Action({});
	}
}
module.exports = {
	HomingThistle,
	Cattail,
};