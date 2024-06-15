const Movement = require("./movement");
module.exports = class Action {
	constructor(data) {
		Object.assign(this, data);
	}
	/**
	 *
	 * @param {Movement} movement Accepts a movement vector obect.
	 */
	setMovement(x, y, relative = true) {
		if (x.x) {
			this.movement = x;
			return this;
		}
		this.movement = new Movement(x, y, relative);
		return this;
	}
	setPlayer(player) {
		this.player = player;
		return this;
	}

	setPlant(plant, position) {
		const { sun_cost, direction } = plant;
		this.sun_cost = sun_cost;
		this.direction = direction;
		this.position = position;
		this.plant = plant;
		return this;
	}
	addPlayers(player_list) {
		return player_list.map((p) => new Action({ add_player: p }));
	}
};
