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
			hidden: false,
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
	shoot(direction, damage = this.damage, render_options = {}) {
		const { zombie_list, board_width, board_height } = this.action_list;
		const projectile = {
			x: this.position.x,
			y: this.position.y,
			damage,
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
			return new Action({});
		} else {
			const z_index = zombie_list.indexOf(zombie_colliding);
			const z_position = new Movement(
				zombie_list[z_index].position.x,
				zombie_list[z_index].position.y
			);
			zombie_list[z_index].damage(projectile.damage);
			if (this.apply_effects) {
				zombie_list[z_index].addStatus(...this.apply_effects);
			}
			return new Action({
				render: {
					start_pos: this.position,
					end_pos: z_position,
					direction: projectile.direction,
					projectile: `${this.projectile_sprite}.png`,
				},
			});
		}
	}
	pierce(direction, damage = this.damage, render_options = {}) {
		const { zombie_list, board_width, board_height } = this.action_list;
		let repetitions = 1;
		const projectile = {
			x: this.position.x,
			y: this.position.y,
			damage,
			direction,
		};
		let zombie_colliding = zombie_list.find(
			(z) => z.position.x == projectile.x && z.position.y == projectile.y
		);
		const isOutOfBounds = (x, y) => {
			return x < 0 || y < 0 || x >= board_width || y >= board_height;
		};
		const render_list = [];
		while (!isOutOfBounds(projectile.x, projectile.y)) {
			const render = {
				position: new Movement(projectile.x, projectile.y),
				effect: `${this.projectile_sprite}.png`,
				alpha: 0.5,
			};
			Object.assign(render, render_options);
			render_list.push(
				new Action({
					render,
				})
			);

			zombie_colliding = zombie_list.find((z) => {
				return (
					z.position.x == projectile.x && z.position.y == projectile.y
				);
			});
			if (zombie_colliding) {
				const z_index = zombie_list.indexOf(zombie_colliding);
				zombie_list[z_index].damage(projectile.damage);
			}
			projectile.x += projectile.direction.x;
			projectile.y += projectile.direction.y;
			repetitions++;
		}
		return new Action({
			actions: render_list,
		});
	}
	onEndTurn() {
		return this.shoot(this.direction);
	}
}
class MelonPult extends Peashooter {
	constructor(data) {
		super({
			name: `Melon-pult`,
			sun_cost: 350,
			damage: 3,
			cooldown: 5,

			projectile_sprite: `melon`,
			splash_sprite: `melonburst`,
			hidden: true,
		});
		Object.assign(this, data);
	}
	shoot(direction) {
		const { zombie_list, board_width, board_height } = this.action_list;
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
			return new Action({});
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

			return new Action({
				actions: [
					new Action({
						render: {
							start_pos: this.position,
							end_pos: zombie_list[z_index].position,
							direction: projectile.direction,
							projectile: `${this.projectile_sprite}.png`,
						},
					}),
					new Action({
						tile_render: {
							position: zombie_list[z_index].position,
							effect: `${this.splash_sprite}.png`,
							size: { x: 3, y: 3 },
						},
					}),
				],
			});
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

				projectile_sprite: `star`,
				hidden: true,
			});
			Object.assign(this, data);
		}
		onEndTurn() {
			return new Action({
				actions: [
					this.shoot(new Movement(-1, 0)),
					this.shoot(new Movement(0, 1)),
					this.shoot(new Movement(0, -1)),
					this.shoot(new Movement(1, 1)),
					this.shoot(new Movement(1, -1)),
				],
			});
		}
	},
	Rotobaga: class Rotobaga extends Peashooter {
		constructor(data) {
			super({
				name: `Rotobaga`,
				sun_cost: 350,
				cooldown: 5,
				projectile_sprite: `rutabaga`,
				flying: true,
				hidden: true,
			});
			Object.assign(this, data);
		}
		onEndTurn() {
			return new Action({
				actions: [
					this.shoot(new Movement(-1, 1)),
					this.shoot(new Movement(1, 1)),
					this.shoot(new Movement(1, -1)),
					this.shoot(new Movement(-1, -1)),
				],
			});
		}
	},
	SplitPea: class SplitPea extends Peashooter {
		constructor(data) {
			super({
				name: `Split Pea`,
				sun_cost: 300,

				hidden: true,
			});
			Object.assign(this, data);
		}
		onEndTurn() {
			let opposite_side = new Movement(
				this.direction.x,
				this.direction.y
			);
			opposite_side.x = -this.direction.x;
			opposite_side.y = -this.direction.y;
			const front_shot = this.shoot(this.direction);
			const rev_shot = this.shoot(opposite_side, 2);
			rev_shot.render.projectile = `twopea.png`;
			return new Action({ actions: [front_shot, rev_shot] });
		}
	},
	ThreePea: class ThreePea extends Peashooter {
		constructor(data) {
			super({
				name: `Threepeater`,
				sun_cost: 300,

				hidden: true,
			});
			Object.assign(this, data);
		}
		onEndTurn() {
			let left_side = new Movement(this.direction.y, this.direction.x);
			let right_side = new Movement(-this.direction.y, -this.direction.x);
			return new Action({
				actions: [
					this.shoot(this.direction),
					this.shoot(left_side),
					this.shoot(right_side),
				],
			});
		}
	},
	LaserBean: class LaserBean extends Peashooter {
		constructor(data) {
			super({
				name: `Laser Bean`,
				sun_cost: 175,

				projectile_sprite: `bolt`,
				hidden: true,
			});
			Object.assign(this, data);
		}
		onEndTurn() {
			return this.pierce(this.direction);
		}
	},
	Guacodile: class Guacodile extends Peashooter {
		constructor(data) {
			super({
				name: `Guacodile`,
				sun_cost: 125,

				projectile_sprite: `guacopit`,
				hidden: true,
			});
			Object.assign(this, data);
		}
		onDeath() {
			const rush = this.pierce(this.direction, 4, {
				effect: `guacodilerush.png`,
				alpha: 1,
			});

			return rush;
		}
	},
	SnowPea: class SnowPea extends Peashooter {
		constructor(data) {
			super({
				name: `Snow Pea`,
				sun_cost: 175,
				apply_effects: [{ name: `frozen`, time: 1 }],
				cooldown: 4,

				hidden: true,
			});
			Object.assign(this, data);
		}
	},
	LilyOfAlchemy: class LilyOfAlchemy extends Peashooter {
		constructor(data) {
			super({
				name: `Lily of Alchemy`,
				sun_cost: 175,
				apply_effects: [{ name: `poison`, time: 1 }],
				cooldown: 4,

				hidden: true,
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
				hidden: true,
			});
		}
	},
	GooPea: class GooPea extends Peashooter {
		constructor(data) {
			super({
				name: `Goo Peashooter`,
				sun_cost: 275,
				apply_effects: [{ name: `poison`, time: 3 }],
				hidden: true,
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

				hidden: true,
			});
			Object.assign(this, data);
		}
		onEndTurn() {
			this.mega_cabbage_timer--;
			if (this.mega_cabbage_timer <= 0) {
				this.projectile_sprite = `megacabbage`;
				this.damage = 3;
				this.mega_cabbage_timer = 3;
			} else {
				this.projectile_sprite = `cabbage`;
				this.damage = 1;
			}
			return this.shoot(this.direction);
		}
	},
	KernelPult: class KernelPult extends Peashooter {
		constructor(data) {
			super({
				name: `Kernel-pult`,
				sun_cost: 100,
				butter_timer: 3,
				cooldown: 5,

				hidden: true,
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
				projectile_sprite: `wintermelon`,
				splash_sprite: `wintermelonburst`,
			});
			Object.assign(this, data);
		}
	},
};
