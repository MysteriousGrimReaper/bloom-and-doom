const Action = require("../structures/action");
const Plant = require("../structures/plant");

class LightningReed extends Plant {
	constructor(data) {
		super({
			name: `Lightning Reed`,
			sun_cost: 125,
			health: 1,
			cooldown: 3,
			hidden: true,
		});
		Object.assign(this, data);
	}
	onEndTurn() {
		const render_list = [];
		this.action_list.near(this.position, 3, `zombies`).forEach((p) => {
			render_list.push(
				new Action({
					render: {
						position: p.position,
						effect: `bolt`,
						alpha: 0.5,
					},
				})
			);
			const zap_list = [p];
			const chain_zap = (zombie) => {
				const nearby_zombies = this.action_list.nearSquare(
					zombie.position,
					1,
					`zombies`
				);
				// console.log(nearby_zombies);
				for (const z of nearby_zombies) {
					if (!zap_list.includes(z)) {
						zap_list.push(z);
						chain_zap(z);
					}
				}
			};
			chain_zap(p);
			zap_list.forEach((z) => {
				z.damage(0.5, `lightning`);
				render_list.push(
					new Action({
						render: {
							position: z.position,
							effect: `bolt`,
							alpha: 0.5,
						},
					})
				);
			});
		});
		return new Action({
			actions: render_list,
		});
	}
}
module.exports = {
	LightningReed,
};
