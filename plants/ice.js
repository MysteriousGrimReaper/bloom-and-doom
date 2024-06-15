const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
class IcebergLettuce extends Plant {
	constructor(data) {
		super(data);
		this.name = `Iceberg Lettuce`;
		this.sun_cost = 0;
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
};
