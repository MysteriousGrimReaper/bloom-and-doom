const Action = require("./action.js");
const z = require("../zalmanac.js");
const a = require("../almanac.js");
const almanac = Object.entries(a).reduce((acc, cv) => {
	acc[cv[0]] = new cv[1]();
	return acc;
}, {});
const zalmanac = Object.entries(z).reduce((acc, cv) => {
	acc[cv[0]] = new cv[1]();
	return acc;
}, {});
const { Tiles } = require("./enums.js");
module.exports = class ActionList extends Array {
	constructor(data) {
		super();
		this.sun = 0;
		this.game_timers = { zombie: 0, plant: 0 };
		this.player_list = [];
		this.zombie_list = [];
		this.plant_list = [];
		this.corpse_list = [];
		this.seed_slot_list = almanac;
		this.zombie_almanac_list = zalmanac;
		this.board_width = 16;
		this.board_height = 16;
		this.clock = 0;
		this.base_sun_gain = 100;
		this.show_projectiles = true;
		Object.assign(this, data);
	}
	setActions(action_list) {
		this.push(...action_list);
		return this;
	}
	setTiles(tiles_string) {
		this.board_tiles = tiles_string;
		return this;
	}
	get tile_map() {
		if (!this.board_tiles) {
			this.board_tiles = `.`.repeat(this.board_height * this.board_width);
		}
		const parser = {
			".": Tiles.None,
			w: Tiles.Water,
			g: Tiles.Gold,
			u: Tiles.SliderUp,
			d: Tiles.SliderDown,
			r: Tiles.SliderRight,
			l: Tiles.SliderLeft,
		};
		const lilypad_tiles = this.plant_list
			.filter((p) => {
				return p.name == `Lily Pad`;
			})
			.map((p) => {
				return [p.position.x, p.position.y];
			});
		const isLilypadTile = (pos_array) => {
			return (
				lilypad_tiles.find(
					(plant) =>
						plant[0] == pos_array[0] && plant[1] == pos_array[1]
				) != undefined
			);
		};
		const board_map = Array.from({ length: this.board_height }, () =>
			Array(this.board_width).fill(0)
		);
		for (let j = 0; j < this.board_height; j++) {
			for (let i = 0; i < this.board_width; i++) {
				let tileChar =
					this.board_tiles[j * this.board_width + i] ?? `.`;
				if (isLilypadTile([i, j])) {
					tileChar = `.`;
				}
				board_map[j][i] = parser[tileChar];
			}
		}

		return board_map;
	}
	near(position, radius, list = `plants`) {
		let list_to_use = this.plant_list;
		switch (list) {
			case `plants`:
				list_to_use = this.plant_list;
				break;
			case `zombies`:
				list_to_use = this.zombie_list;
				break;
			case `players`:
				list_to_use = this.player_list;
				break;
		}
		return list_to_use.filter((p) => {
			const cost =
				Math.abs(p.position.x - position.x) +
				Math.abs(p.position.y - position.y);
			if (cost <= radius) {
				return true;
			}
		});
	}
	nearSquare(position, radius, list = `plants`) {
		let list_to_use = this.plant_list;
		switch (list) {
			case `plants`:
				list_to_use = this.plant_list;
				break;
			case `zombies`:
				list_to_use = this.zombie_list;
				break;
			case `players`:
				list_to_use = this.player_list;
				break;
		}

		return list_to_use.filter((p) => {
			const cost = Math.max(
				Math.abs(p.position.x - position.x),
				Math.abs(p.position.y - position.y)
			);
			if (cost <= radius) {
				return true;
			}
		});
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
			const tile_map = this.tile_map;
			if (this[i].actions) {
				this.splice(i + 1, 0, ...this[i].actions);
			}
			if (target_player) {
				if (this[i].exhaust) {
					target_player.exhaustion = this[i].exhaust;
				}
			}
			if (this[i].dig) {
				const plant_index = this.plant_list.findIndex(
					(p) =>
						p.position.x == this[i].dig.x &&
						p.position.y == this[i].dig.y
				);
				this.plant_list.splice(plant_index, 1);
			}
			if (this[i].mutate) {
				let j = 0;
				while (j < this.plant_list.length) {
					const p = this.plant_list[j];
					if (p.name == this[i].mutate[0]) {
						const old_plant = this.plant_list.splice(j, 1)[0];
						const new_plant = new a[this[i].mutate[1]]();
						new_plant.position = old_plant.position;
						if (old_plant.direction) {
							new_plant.direction = old_plant.direction;
						}
						this.plant_list.push(new_plant);
						const plant_action = new_plant.onPlant(this);
						plant_action.sun_cost = 0;
						this.splice(i + 1, 0, plant_action);
					} else {
						j++;
					}
				}
			}
			if (this[i].attack_zombie) {
				const z_index = this.zombie_list.findIndex(
					(p) =>
						p.x == this[i].attack_zombie.x &&
						p.y == this[i].attack_zombie.y
				);
				this.zombie_list[z_index].damage(
					this[i].attack_zombie.damage,
					this[i].attack_zombie.damage_type
				);
			}
			if (this[i].set_tiles) {
				this.setTiles(this[i].set_tiles);
			}
			if (this[i].set_players) {
				this.setPlayers(this[i].set_players);
			}
			if (this[i].show_seed) {
				try {
					this.seed_slot_list[this[i].show_seed].hidden = false;
				} catch (error) {
					if (this[i].show_seed != `all`) {
						console.log(error);
						console.log(Object.keys(almanac));
						throw Error(
							`${this[i].show_seed} is not a plant. See above for list of accepted plants.`
						);
					}
					Object.keys(almanac).forEach((key) => {
						this.seed_slot_list[key].hidden = false;
					});
				}
			}
			if (this[i].hide_seed) {
				try {
					this.seed_slot_list[this[i].hide_seed].hidden = true;
				} catch (error) {
					if (this[i].hide_seed != `all`) {
						console.log(error);
						console.log(Object.keys(almanac));
						throw Error(
							`${this[i].hide_seed} is not a plant. See above for list of accepted plants.`
						);
					}
					Object.keys(almanac).forEach((key) => {
						this.seed_slot_list[key].hidden = true;
					});
				}
			}
			if (this[i].new_plant) {
				try {
					this[i].plant = new a[this[i].new_plant]();
				} catch (error) {
					console.log(error);
					console.log(Object.keys(almanac));
					throw Error(
						`${this[i].new_plant} is not a plant. See above for list of accepted plants.`
					);
				}
				if (
					this.seed_slot_list[this[i].new_plant].unlock_timer > 0 ||
					this.seed_slot_list[this[i].new_plant].cooldown_timer > 0
				) {
					throw Error(`${this[i].plant.name} is on cooldown!`);
				}
				this.seed_slot_list[this[i].new_plant].cooldown_timer =
					this.seed_slot_list[this[i].new_plant].cooldown;
				this[i].plant.position = this[i].position;
				if (this[i].direction) {
					this[i].plant.direction = this[i].direction;
				}
				if (!(this[i].plant.amphibious || this[i].plant.flying)) {
					if (
						tile_map[this[i].position.y][this[i].position.x] ==
							Tiles.Water &&
						!this[i].plant.aquatic
					) {
						throw Error(
							`${this[i].plant.name} cannot be planted in water!`
						);
					}
					if (
						tile_map[this[i].position.y][this[i].position.x] !=
							Tiles.Water &&
						this[i].plant.aquatic
					) {
						throw Error(
							`${this[i].plant.name} cannot be planted on land!`
						);
					}
				}

				this.plant_list.push(this[i].plant);
				this.splice(i + 1, 0, this[i].plant.onPlant(this));
			}
			if (this[i].new_zombie) {
				try {
					this[i].zombie = new z[this[i].new_zombie]();
				} catch (error) {
					console.log(error);
					console.log(Object.keys(zalmanac));
					throw Error(
						`${this[i].new_zombie} is not a zombie. See above for list of accepted zombies.`
					);
				}
				this[i].zombie.position = this[i].position;
				this.zombie_list.push(this[i].zombie);
				this.splice(i + 1, 0, this[i].zombie.onEnter(this));
			}
			if (this[i].new_player) {
				this.player_list.push(this[i].new_player);
			}
			if (this[i].end_turn) {
				if (this[i].end_turn > 1) {
					this.splice(
						i + 1,
						0,
						new Action({ end_turn: this[i].end_turn - 1 })
					);
				}
				let actions_added = 0;
				for (let p of this.plant_list) {
					const plant_action = p.onEndTurn(this);
					if (plant_action) {
						actions_added++;
						this.splice(i + actions_added, 0, plant_action);
					}
				}
				for (let p of this.player_list) {
					const player_action = p.onEndTurn(this);
					if (player_action) {
						actions_added++;
						this.splice(i + actions_added, 0, player_action);
					}
				}

				for (let z of this.zombie_list) {
					const zombie_action = z.onEndTurn(this);
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
				for (let p in this.seed_slot_list) {
					this.seed_slot_list[p].unlock_timer--;
					this.seed_slot_list[p].cooldown_timer--;
				}
				for (let p of this.player_list) {
					p.reset_act();
				}
				for (let t of Object.keys(this.game_timers)) {
					this.game_timers[t] -= 1;
				}
			}
			if (this[i].set_timer) {
				Object.assign(this.game_timers, this[i].set_timer);
			}
			if (this[i].act) {
				this.player_list.find((p) => p.name == this[i].act).act();
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
