const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
class IcebergLettuce extends Plant {
	constructor(data) {
		super({
			name: `Iceberg Lettuce`,
			sun_cost: 0,
			cooldown: 5,
			hidden: false,
		});
		Object.assign(this, data);
	}
	onDeath(action_list) {
		const near_zombies = action_list.near(this.position, 0, `zombies`);
		if (near_zombies.length > 0) {
			near_zombies[0].status.push({ name: `frozen`, time: 5 });
		}
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
			// console.log(action_list.nearSquare(this.position, 4, `zombies`));
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
