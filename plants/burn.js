const Action = require("../structures/action");
const Movement = require("../structures/movement");
const Plant = require("../structures/plant");

class Snapdragon extends Plant {
	constructor(data) {
		super({
			name: `Snapdragon`,
			sun_cost: 275,
			cooldown: 5,
			damage: 2,
			hidden: true,
		});
		Object.assign(this, data);
	}
	onEndTurn() {
		const square_center = this.position.vAdd(this.direction);

		this.action_list
			.nearSquare(square_center, 1, `zombies`)
			.forEach((zombie) => {
				zombie.damage(this.damage, `fire`);
			});
		const square_area = Array.from(Array(9).fill(square_center)).map(
			(_, index) => {
				return square_center.vAdd(
					new Movement((index % 3) - 1, Math.floor(index / 3) - 1)
				);
			}
		);
		return new Action({
			actions: square_area.map((s) => {
				return new Action({
					tile_render: {
						effect: `burn.png`,
						position: s,
						alpha: 0.7,
					},
				});
			}),
		});
	}
}
module.exports = {
	Snapdragon,
};
