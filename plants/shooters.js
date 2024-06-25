const Plant = require("../structures/plant.js");
const Action = require("../structures/action.js");
const Movement = require("../structures/movement.js");
class Peashooter extends Plant {
	constructor(data) {
		super({
			name: `Peashooter`,
			sun_cost: 100,
			damage: 1,
			cooldown: 1,
			projectile_sprite: `pea`,
		});
		Object.assign(this, data);
	}
	range() {
		if (!this.direction) {
			return [];
		}
		const range_output = [];
		const check_pos = this.position;
		const isOutOfBounds = (pos) => {
			const { x, y } = pos;
			return x < 0 || y < 0 || x >= board_width || y >= board_height;
		};
		while (!isOutOfBounds(check_pos)) {
			range_output.push(check_pos);
			check_pos.x += this.direction.x;
			check_pos.y += this.direction.y;
		}
		return range_output;
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
			if (this.apply_effects) {
				zombie_list[z_index].addStatus(...this.apply_effects);
			}
			return new Action({
				render: {
					start_pos: this.position,
					end_pos: zombie_list[z_index].position,
					direction: projectile.direction,
					projectile: `${this.projectile_sprite}.png`,
				},
			});
		}
	}
	pierce(action_list, direction) {
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
		while (!isOutOfBounds(projectile.x, projectile.y)) {
			projectile.x += projectile.direction.x;
			projectile.y += projectile.direction.y;
			zombie_colliding = zombie_list.find((z) => {
				return (
					z.position.x == projectile.x && z.position.y == projectile.y
				);
			});
			if (zombie_colliding) {
				const z_index = zombie_list.indexOf(zombie_colliding);
				zombie_list[z_index].damage(projectile.damage);
			}
		}
		return new Action({ notes: `Pierce` });
	}
	onEndTurn(action_list) {
		return this.shoot(action_list, this.direction);
	}
}
class MelonPult extends Peashooter {
	constructor(data) {
		super({
			name: `Melon-pult`,
			sun_cost: 350,
			damage: 3,
			cooldown: 5,
			unlock_timer: 25,
		});
		Object.assign(this, data);
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
			zombie_list.forEach((z) => {
				const cost = Math.max(
					Math.abs(z.position.x - zombie_colliding.position.x),
					Math.abs(z.position.y - zombie_colliding.position.y)
				);
				if (cost <= 1) {
					z.damage(projectile.damage / 2);
					if (this.apply_effects) {
						z.addStatus(...this.apply_effects);
					}
				}
			});

			return new Action({ notes: `Melonpult hit zombie` });
		}
	}
}
module.exports = {
	Peashooter,
	Starfruit: class Starfruit extends Peashooter {
		constructor(data) {
			super({
				name: `Starfruit`,
				sun_cost: 400,
				unlock_timer: 12,
				projectile_sprite: `star`,
			});
			Object.assign(this, data);
		}
		onEndTurn(action_list) {
			return new Action({
				actions: [
					this.shoot(action_list, new Movement(-1, 0)),
					this.shoot(action_list, new Movement(0, 1)),
					this.shoot(action_list, new Movement(0, -1)),
					this.shoot(action_list, new Movement(2, 1)),
					this.shoot(action_list, new Movement(2, -1)),
				],
			});
		}
	},
	SplitPea: class SplitPea extends Peashooter {
		constructor(data) {
			super({ name: `Split Pea`, sun_cost: 300, unlock_timer: 9 });
			Object.assign(this, data);
		}
		onEndTurn(action_list) {
			let opposite_side = this.direction;
			opposite_side.x = -this.direction.x;
			opposite_side.y = -this.direction.y;
			this.shoot(action_list, this.direction);
			this.shoot(action_list, opposite_side);
			return new Action({ notes: `Split Pea shoots` });
		}
	},
	ThreePea: class ThreePea extends Peashooter {
		constructor(data) {
			super({ name: `Threepeater`, sun_cost: 325, unlock_timer: 11 });
			Object.assign(this, data);
		}
		onEndTurn(action_list) {
			let left_side = this.direction;
			left_side.x = this.direction.y;
			left_side.y = this.direction.x;
			let right_side = this.direction;
			right_side.x = -left_side.x;
			right_side.y = -left_side.y;
			this.shoot(action_list, this.direction);
			this.shoot(action_list, left_side);
			this.shoot(action_list, right_side);
			return new Action({ notes: `Threepeater shoots` });
		}
	},
	LaserBean: class LaserBean extends Peashooter {
		constructor(data) {
			super({ name: `Laser Bean`, sun_cost: 175, unlock_timer: 4 });
			Object.assign(this, data);
		}
		onEndTurn(action_list) {
			this.pierce(action_list, this.direction);
			return new Action({ notes: `Laser Bean shoots` });
		}
	},
	Guacodile: class Guacodile extends Peashooter {
		constructor(data) {
			super({ name: `Guacodile`, sun_cost: 125, unlock_timer: 8 });
			Object.assign(this, data);
		}
		onDeath(action_list) {
			this.pierce(action_list, this.direction);
			this.pierce(action_list, this.direction);
			this.pierce(action_list, this.direction);
			this.pierce(action_list, this.direction);
			this.pierce(action_list, this.direction);
			return new Action({ notes: `Guacodeath` });
		}
	},
	SnowPea: class SnowPea extends Peashooter {
		constructor(data) {
			super({
				name: `Snow Pea`,
				sun_cost: 175,
				apply_effects: [{ name: `frozen`, time: 1 }],
				cooldown: 4,
				unlock_timer: 10,
			});
			Object.assign(this, data);
		}
	},
	FirePea: class FirePea extends Peashooter {
		constructor(data) {
			super({
				name: `Fire Peashooter`,
				sun_cost: 200,
				damage: 2,
				damage_type: `fire`,
				hidden: true,
			});
		}
	},
	GooPea: class GooPea extends Peashooter {
		constructor(data) {
			super({
				name: `Goo Peashooter`,
				sun_cost: 175,
				apply_effects: [{ name: `poison`, time: 3 }],
				hidden: true,
			});
			Object.assign(this, data);
		}
	},
	CabbagePult: class CabbagePult extends Peashooter {
		constructor(data) {
			super({
				name: `Cabbage-pult`,
				sun_cost: 100,
				mega_cabbage_timer: 3,
				cooldown: 5,
				unlock_timer: 25,
			});
			Object.assign(this, data);
		}
		onEndTurn() {
			this.mega_cabbage_timer--;
			if (this.mega_cabbage_timer <= 0) {
				this.damage = 3;
			} else {
				this.damage = 1;
			}
			this.mega_cabbage_timer = 3;
			return new Action({ notes: `Cabbage-pult charges up` });
		}
	},
	KernelPult: class KernelPult extends Peashooter {
		constructor(data) {
			super({
				name: `Kernel-pult`,
				sun_cost: 100,
				butter_timer: 3,
				cooldown: 5,
				unlock_timer: 25,
			});
			Object.assign(this, data);
		}
		onEndTurn() {
			this.butter_timer--;
			if (this.butter_timer <= 0) {
				this.apply_effects = [{ name: `frozen`, time: 2 }];
			} else {
				this.apply_effects = [];
			}
			this.butter_timer = 3;
			return new Action({ notes: `Kernel-pult butters up` });
		}
	},
	MelonPult,
	WinterMelon: class WinterMelon extends MelonPult {
		constructor(data) {
			super({
				sun_cost: 600,
				name: `Winter Melon`,
				apply_effects: [{ name: `frozen`, time: 1 }],
			});
			Object.assign(this, data);
		}
	},
};
