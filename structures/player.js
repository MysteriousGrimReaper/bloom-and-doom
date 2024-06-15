module.exports = class Player {
	constructor(data) {
		this.health = 3;
		this.max_health = this.health;
		Object.assign(this, data);
	}
};
