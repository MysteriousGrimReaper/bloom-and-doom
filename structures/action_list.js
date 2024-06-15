const Action = require("./action.js");
module.exports = class ActionList extends Array {
	constructor(data) {
		super();
		this.sun = 0;
		this.player_list = [];
		this.zombie_list = [];
		this.plant_list = [];
		this.corpse_list = [];
		this.board_width = 16;
		this.board_height = 16;
		this.clock = 0;
		this.base_sun_gain = 100;
		Object.assign(this, data);
	}
	/**
	 *
	 * @param {Movement} position position to check
	 * @returns
	 */
	isOutOfBounds(position) {
		return (
			position.x < 0 ||
			position.y < 0 ||
			position.x >= board_width ||
			position.y >= board_height
		);
	}
	setPlayers(player_list) {
		this.player_list = player_list;
		return this;
	}
	validate() {
		// sun cost validation
		let sun = 0;

		for (let i = 0; i < this.length; i++) {
			const target_player = this[i].player
				? this.player_list.find((p) => p.name == this[i].player)
				: false;
			if (this[i].plant) {
				if (this[i].plant.position.relative) {
					this[i].plant.move(target_player.position);
				}

				this.plant_list.push(this[i].plant);
				this.splice(i + 1, 0, this[i].plant.onPlant());
			}
			if (this[i].spawn_zombie) {
				this.zombie_list.push(this[i].spawn_zombie);
			}
			if (this[i].new_player) {
				this.player_list.push(this[i].new_player);
			}
			if (this[i].end_turn) {
				let actions_added = 0;
				for (let p of this.plant_list) {
					p.unlock_timer--;
					p.cooldown_timer--;
					const plant_action = p.onEndTurn(this);
					if (plant_action) {
						actions_added++;
						this.splice(i + actions_added, 0, plant_action);
					}
				}
				for (let z of this.zombie_list) {
					const zombie_action = z.onEndTurn(
						this.player_list,
						this.plant_list
					);
					if (z.dead) {
						this.corpse_list.push(
							this.zombie_list.splice(
								this.zombie_list.indexOf(z),
								1
							)
						);
					}
					if (zombie_action) {
						actions_added++;
						this.splice(i + actions_added, 0, zombie_action);
					}
				}
				actions_added++;
				this.splice(
					i + actions_added,
					0,
					new Action({ begin_turn: true })
				);
			}
			if (this[i].begin_turn) {
				this.clock++;
				this.splice(
					i + 1,
					0,
					new Action({ sun_gain: this.base_sun_gain })
				);
			}
			sun += (this[i].sun_gain ?? 0) - (this[i].sun_cost ?? 0);
			if (sun < 0) {
				throw new Error(`Error at index ${i}: Not enough sun`);
			}
			if (this[i].movement) {
				if (this[i].player) {
					const player = this.player_list.find(
						(p) => p.name == this[i].player
					);
					player.position.add(this[i].movement);
				}
			}
			const entity_list = [
				...this.plant_list,
				...this.zombie_list,
				...this.player_list,
			];
			for (let j = 0; j < entity_list.length; j++) {
				if (
					entity_list[j].position.x >= this.board_width ||
					entity_list[j].position.y >= this.board_height ||
					entity_list[j].position.x < 0 ||
					entity_list[j].position.y < 0
				) {
					throw new Error(
						`Error at index ${i}: ${entity_list[j].name} out of bounds (${entity_list[j].position.x}, ${entity_list[j].position.y})`
					);
				}
			}
			for (let l of [
				this.plant_list,
				this.player_list,
				this.zombie_list,
			]) {
				l.forEach((entity, index) => {
					if (entity.health <= 0) {
						if (typeof entity.onDeath === "function") {
							this.splice(i + 1, 0, entity.onDeath(this));
						}

						this.corpse_list.push(l.splice(index, 1));
					}
				});
			}
		}
		this.sun = sun;
		return this;
	}
	print() {
		let str = ``;
		for (let n of this) {
			str += n;
		}
		return str;
	}
	toJSON() {
		// Get all own properties of the object
		const ownProperties = Object.keys(this).reduce((acc, key) => {
			if (isNaN(parseInt(key))) {
				acc[key] = this[key];
			}

			return acc;
		}, {});
		// Get array elements
		const arrayElements = [...this];

		// Return combined object
		return { actions: arrayElements, ...ownProperties };
	}
};
