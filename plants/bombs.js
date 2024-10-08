const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
const { loadImage } = require("canvas");
const path = require("path");
const EntityList = require("../structures/entity_list.js");
class PotatoMine extends Plant {
	constructor(data) {
		super({
			name: `Potato Mine`,
			sun_cost: 25,
			recharge_timer: 4,
			cooldown: 6,
			explosion_sprite: `spudow`,
			hidden: false,
		});
		Object.assign(this, data);
	}
	async sprite() {
		return await loadImage(
			path.join(
				__dirname,
				`../assets/plants/${this.name}${
					this.recharge_timer <= 0 ? `` : ` Unarmed`
				}.png`
			)
		);
	}
	onEndTurn() {
		this.recharge_timer--;
		return new Action({
			notes:
				this.recharge_timer <= 0
					? `Potato mine ready!`
					: `Potato mine timer: ${this.recharge_timer}`,
		});
	}
	onDeath() {
		if (this.recharge_timer <= 0) {
			for (const z of this.action_list.zombie_list.near(
				this.position,
				0,
				EntityList.Square
			)) {
				z.damage(25, `explosion`);
			}
			return new Action({
				render: {
					position: this.position,
					effect: `${this.explosion_sprite}.png`,
				},
			});
		}
	}
}
module.exports = {
	PotatoMine,
	TangleKelp: class TangleKelp extends PotatoMine {
		constructor(data) {
			super({
				name: `Tangle Kelp`,
				recharge_timer: 0,
				aquatic: true,
				explosion_sprite: `kelp`,
				hidden: true,
			});
			Object.assign(this, data);
		}
	},
	Squash: class Squash extends PotatoMine {
		constructor(data) {
			super({
				name: `Squash`,
				recharge_timer: 0,
				sun_cost: 50,
				hidden: true,
			});
			Object.assign(this, data);
		}
	},
	CherryBomb: class CherryBomb extends Plant {
		constructor(data) {
			super({
				name: `Cherry Bomb`,
				sun_cost: 150,
				health: 0,

				cooldown: 10,
				hidden: true,
			});
			Object.assign(this, data);
		}
		onDeath() {
			const { zombie_list } = this.action_list;
			zombie_list.forEach((z) => {
				const cost = Math.max(
					Math.abs(z.position.x - this.position.x),
					Math.abs(z.position.y - this.position.y)
				);
				if (cost <= 1) {
					z.damage(25);
				}
			});
			return new Action({
				tile_render: {
					position: this.position,
					effect: `spudow.png`,
					size: { x: 3, y: 3 },
				},
			});
		}
	},
	Jalapeno: class Jalapeno extends Plant {
		constructor(data) {
			super({
				name: `Jalapeno`,
				sun_cost: 125,
				health: 0,

				cooldown: 8,
				hidden: true,
			});
			Object.assign(this, data);
		}
		onDeath() {
			const { zombie_list } = this.action_list;
			zombie_list.forEach((z) => {
				const cost = z.position.y == this.position.y;
				if (cost) {
					z.damage(25, `fire`);
				}
			});
			return new Action({
				render: {
					position: this.position,
					effect: `jaleburn.png`,
					size: { x: 16, y: 1 },
					start_x: 0,
				},
			});
		}
	},
	ChillyPepper: class ChillyPepper extends Plant {
		constructor(data) {
			super({
				name: `Chilly Pepper`,
				sun_cost: 175,
				health: 0,

				cooldown: 8,
				hidden: true,
			});
			Object.assign(this, data);
		}
		onDeath() {
			const { zombie_list } = this.action_list;
			zombie_list.forEach((z) => {
				const cost = z.position.y == this.position.y;
				if (cost) {
					z.damage(8);
					z.addStatus({ name: `frozen`, time: 4 });
				}
			});
			return new Action({
				render: {
					position: this.position,
					effect: `freezeburn.png`,
					size: { x: 1, y: 16 },
					start_y: 0,
				},
			});
		}
	},
};
