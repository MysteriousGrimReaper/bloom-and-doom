const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
const Movement = require("../structures/movement.js");
class Aloe extends Plant {
	constructor(data) {
		super({
			name: `Aloe`,
			sun_cost: 100,
			health: 1,

			cooldown: 2,
			hidden: true,
		});
		Object.assign(this, data);
	}
	onEndTurn(action_list) {
		action_list.nearSquare(this.position, 1, `plants`).forEach((p) => {
			if (
				Math.abs(p.position.x - this.position.x) == 1 ||
				Math.abs(p.position.y - this.position.y) == 1
			) {
				if (p.health < p.max_health) {
					p.health += 0.2;
				}
			}
		});
		return new Action({
			actions: [
				new Action({
					tile_render: {
						position: new Movement(
							this.position.x,
							this.position.y + 1
						),
						effect: `heal.png`,
					},
				}),
				new Action({
					tile_render: {
						position: new Movement(
							this.position.x,
							this.position.y - 1
						),
						effect: `heal.png`,
					},
				}),
				new Action({
					tile_render: {
						position: new Movement(
							this.position.x + 1,
							this.position.y + 1
						),
						effect: `heal.png`,
					},
				}),
				new Action({
					tile_render: {
						position: new Movement(
							this.position.x + 1,
							this.position.y - 1
						),
						effect: `heal.png`,
					},
				}),
				new Action({
					tile_render: {
						position: new Movement(
							this.position.x - 1,
							this.position.y + 1
						),
						effect: `heal.png`,
					},
				}),
				new Action({
					tile_render: {
						position: new Movement(
							this.position.x - 1,
							this.position.y - 1
						),
						effect: `heal.png`,
					},
				}),
				new Action({
					tile_render: {
						position: new Movement(
							this.position.x + 1,
							this.position.y
						),
						effect: `heal.png`,
					},
				}),
				new Action({
					tile_render: {
						position: new Movement(
							this.position.x - 1,
							this.position.y
						),
						effect: `heal.png`,
					},
				}),
			],
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
	Aloe,
};
