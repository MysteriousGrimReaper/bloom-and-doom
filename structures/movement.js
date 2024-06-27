module.exports = class Movement {
	constructor(x, y, relative = true) {
		this.x = x;
		this.y = y;
		this.relative = relative;
	}
	teleporting() {
		this.teleport = true;
		return this;
	}
	add(movement) {
		const { x, y, relative } = movement;
		if (relative) {
			this.x += x;
			this.y += y;
		} else {
			this.x = x;
			this.y = y;
		}
		return this;
	}
	vAdd(movement) {
		const m = new Movement(this.x, this.y);
		const { x, y, relative } = movement;
		if (relative) {
			m.x += x;
			m.y += y;
		} else {
			m.x = x;
			m.y = y;
		}
		return m;
	}
};
