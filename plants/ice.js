const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
class IcebergLettuce extends Plant {
	constructor(data) {
		super({ name: `Iceberg Lettuce`, sun_cost: 0, cooldown: 5 });
		Object.assign(this, data);
	}
	onDeath(action_list) {
		const { zombie_list } = action_list;
		const cost_map = zombie_list.map(
			(z) =>
				Math.abs(z.position.x - this.position.x) +
				Math.abs(z.position.y - this.position.y)
		);
		action_list.zombie_list[
			cost_map.indexOf(Math.min(...cost_map))
		].status.push({ name: `frozen`, time: 5 });
		return new Action({ notes: `Iceberg Lettuce froze Zombie` });
	}
}
module.exports = {
	IcebergLettuce,
	IceShroom: class IceShroom extends IcebergLettuce {
		constructor(data) {
			super({
				name: `Ice-shroom`,
				sun_cost: 75,
				cooldown: 10,
				health: 0,
				hidden: true,
			});
			Object.assign(this, data);
		}
		onDeath(action_list) {
			console.log(action_list.nearSquare(this.position, 4, `zombies`));
			action_list
				.nearSquare(this.position, 4, `zombies`)
				.forEach((z) => z.status.push({ name: `frozen`, time: 5 }));
			return new Action({
				tile_render: {
					effect: `icecloud.png`,
					position: this.position,
					size: { x: 9, y: 9 },
					alpha: 0.5,
				},
			});
		}
	},
};
