const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
const { loadImage } = require("canvas");
const path = require("path");


module.exports = {
	PotatoMine: class PotatoMine extends Plant {
		constructor(data) {
			super({
				name: `Potato Mine`,
				sun_cost: 25,
				recharge_timer: 4,
				cooldown: 6,
			});
			Object.assign(this, data);
		}
		async sprite() {
			return await loadImage(
				path.join(
					__dirname,
					`../assets/${this.name}${
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
		onDeath(action_list) {
			if (this.recharge_timer <= 0) {
				const { zombie_list } = action_list;
				zombie_list.forEach(z => {
					const cost = Math.max(Math.abs(z.position.x - this.position.x),
					Math.abs(z.position.y - this.position.y))
					if (cost <= 0) {
						z.damage(25)
					}
				});
				return new Action({ notes: `Potato Mine exploded zombie` });
			}
		}
	},
	CherryBomb: class CherryBomb extends Plant {
		constructor(data) {
			super({
				name: `Cherry Bomb`,
				sun_cost: 150,
				health: 0,
				unlock_timer: 18,
				cooldown: 8,
			});
			Object.assign(this, data);
		}
		onDeath(action_list) {
				const { zombie_list } = action_list;
				zombie_list.forEach(z => {
					const cost = Math.max(Math.abs(z.position.x - this.position.x),
					Math.abs(z.position.y - this.position.y))
					if (cost <= 1) {
						z.damage(25)
					}
				});
				return new Action({ notes: `Cherry Bomb exploded zombie` });
			
		}
	},
	Jalapeno: class Jalapeno extends Plant {
		constructor(data) {
			super({
				name: `Jalapeno`,
				sun_cost: 125,
				health: 0,
				unlock_timer: 18,
				cooldown: 8,
			});
			Object.assign(this, data);
		}
		onDeath(action_list) {
				const { zombie_list } = action_list;
				zombie_list.forEach(z => {
					const cost = z.position.y == this.position.y
					if (cost) {
						z.damage(25, `fire`)
					}
				});
				return new Action({ notes: `Jalapeno burned zombie` });
			
		}
	},
	ChillyPepper: class ChillyPepper extends Plant {
		constructor(data) {
			super({
				name: `Chilly Pepper`,
				sun_cost: 175,
				health: 0,
				unlock_timer: 18,
				cooldown: 8,
			});
			Object.assign(this, data);
		}
		onDeath(action_list) {
				const { zombie_list } = action_list;
				zombie_list.forEach(z => {
					const cost = z.position.y == this.position.y
					if (cost) {
						z.damage(10)
						z.addStatus({name: `frozen`, time: 4})
					}
				});
				return new Action({ notes: `Chilly Pepper cooled zombie` });
			
		}
	}
};
