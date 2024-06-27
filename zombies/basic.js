const Zombie = require("../structures/zombie.js");
const Action = require("../structures/action.js");

module.exports = {
	Basic: class Basic extends Zombie {
		constructor(data) {
			super({
				name: `Basic`,
				health: 4,
			});
			Object.assign(this, data);
		}
	},
	Conehead: class Conehead extends Zombie {
		constructor(data) {
			super({
				name: `Conehead`,
				health: 8,
			});
			Object.assign(this, data);
		}
	},
	Buckethead: class Buckethead extends Zombie {
		constructor(data) {
			super({
				name: `Buckethead`,
				health: 15,
			});
			Object.assign(this, data);
		}
	},
	Imp: class Imp extends Zombie {
		constructor(data) {
			super({
				name: `Imp`,
				health: 2,
			});
			this.pathfind_ai = this.diagPathfind;
			Object.assign(this, data);
		}
	},
};
