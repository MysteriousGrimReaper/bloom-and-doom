const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
class Aloe extends Plant {
	constructor(data) {
		super(data);
		this.name = `Aloe`;
		this.sun_cost = 100;
		this.health = 1;
	}
	onEndTurn(action_list) {
		const { plant_list } = action_list;
		plant_list.forEach((p) => {
			if (
				Math.abs(p.position.x - this.position.x) == 1 ||
				Math.abs(p.position.y - this.position.y) == 1
			) {
				if (p.health < p.max_health) {
					p.health += 0.2;
				}
			}
		});
		if (!zombie_colliding) {
			return new Action({ notes: `Peashooter missed` });
		} else {
			const z_index = zombie_list.indexOf(zombie_colliding);
			zombie_list[z_index].damage(projectile.damage);
			return new Action({ notes: `Peashooter hit zombie` });
		}
	}
}
module.exports = {
	IcebergLettuce,
};
