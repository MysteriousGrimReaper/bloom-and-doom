const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
const { loadImage } = require("canvas");
const path = require("path");
class PotatoMine extends Plant {
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
			const cost_map = zombie_list.map(
				(z) =>
					Math.abs(z.position.x - this.position.x) +
					Math.abs(z.position.y - this.position.y)
			);
			action_list.zombie_list[
				cost_map.indexOf(Math.min(...cost_map))
			].health -= 50;
			return new Action({ notes: `Potato Mine exploded zombie` });
		}
	}
}
module.exports = {
	PotatoMine,
};
