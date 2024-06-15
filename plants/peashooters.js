const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
const Movement = require("../structures/movement.js");
class Peashooter extends Plant {
	constructor(data) {
		super(data);
		this.name = `Peashooter`;
		this.sun_cost = 100;
		this.damage = 1;
	}
	shoot(action_list, direction) {
		const { zombie_list, board_width, board_height } = action_list;
		const projectile = {
			x: this.position.x,
			y: this.position.y,
			damage: this.damage,
			direction,
		};
		let zombie_colliding = zombie_list.find(
			(z) => z.position.x == projectile.x && z.position.y == projectile.y
		);
		const isOutOfBounds = (x, y) => {
			return x < 0 || y < 0 || x >= board_width || y >= board_height;
		};
		while (
			!isOutOfBounds(projectile.x, projectile.y)
				? zombie_colliding == undefined
				: false
		) {
			projectile.x += projectile.direction.x;
			projectile.y += projectile.direction.y;
			zombie_colliding = zombie_list.find((z) => {
				console.log(z);
				return (
					z.position.x == projectile.x && z.position.y == projectile.y
				);
			});
		}
		if (!zombie_colliding) {
			return new Action({ notes: `Peashooter missed` });
		} else {
			const z_index = zombie_list.indexOf(zombie_colliding);
			zombie_list[z_index].damage(projectile.damage);
			console.log(`hit!`);
			return new Action({ notes: `Peashooter hit zombie` });
		}
	}
	onEndTurn(action_list) {
		return this.shoot(action_list, this.direction);
	}
}
module.exports = {
	Peashooter,
	Starfruit: class Starfruit extends Peashooter {
		constructor(data) {
			super(data);
			this.name = `Starfruit`;
			this.sun_cost = 400;
		}
		onEndTurn(action_list) {
			this.shoot(action_list, new Movement(-1, 0));
			this.shoot(action_list, new Movement(0, 1));
			this.shoot(action_list, new Movement(0, -1));
			this.shoot(action_list, new Movement(2, 1));
			this.shoot(action_list, new Movement(2, -1));
			return new Action({ notes: `Starfruit shoots` });
		}
	},
	SnowPea: class SnowPea extends Peashooter {
		constructor(data) {
			super(data);
			this.name = `Snow Pea`;
			this.sun_cost = 150;
			this.apply_effects = [`chill`];
		}
	},
	FirePea: class FirePea extends Peashooter {
		constructor(data) {
			super(data);
			this.name = `Fire Peashooter`;
			this.sun_cost = 200;
			this.damage = 2;
			this.damage_type = `fire`;
		}
	},
	GooPea: class GooPea extends Peashooter {
		constructor(data) {
			super(data);
			this.name = `Goo Peashooter`;
			this.sun_cost = 175;
			this.apply_effects = [`poison`];
		}
	},
};
