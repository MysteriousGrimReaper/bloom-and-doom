const Zombie = require("../structures/zombie.js");
const Action = require("../structures/action.js");

module.exports = {
	Basic: class Basic extends Zombie {
		constructor(data) {
			super({
				name: `Basic`,
				health: 3,
			});
			Object.assign(this, data);
		}
	},
	Conehead: class Conehead extends Zombie {
		constructor(data) {
			super({
				name: `Conehead`,
				health: 6,
			});
			Object.assign(this, data);
		}
	},
	Buckethead: class Buckethead extends Zombie {
		constructor(data) {
			super({
				name: `Buckethead`,
				health: 12,
			});
			Object.assign(this, data);
		}
	},
};
