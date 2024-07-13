module.exports = class EntityList extends Array {
	constructor(data) {
		super();
		Object.assign(this, data);
	}
	static Diamond = 0;
	static Square = 1;
	static Circle = 2;
	near(x, y, radius, shape) {
		const distance_functions = [
			(to_x, to_y) => {
				const d = Math.abs(to_x - x) + Math.abs(to_y - y);
				return d <= radius;
			},
			(to_x, to_y) => {
				const d = Math.max(Math.abs(to_x - x), Math.abs(to_y - y));
				return d <= radius;
			},
			(to_x, to_y) => {
				const d = Math.pow(to_x - x, 2) + Math.pow(to_y - y, 2);
				return d <= radius * radius;
			},
		];
		return this.filter((e) =>
			distance_functions[shape](e.position.x, e.position.y)
		);
	}
};
