const Action = require("./structures/action.js");
const ActionList = require("./structures/action_list.js");
const Movement = require("./structures/movement.js");
const Player = require("./structures/player.js");
const PlayerList = require("./structures/player_list.js");
module.exports = {
	qoth_players: [
		new Player({ name: `woooowoooo`, position: new Movement(9, 9, true) }),
	],
	qoth_actions: [
		new Action({ begin_turn: true }),
		new Action({ new_plant: `Sunflower`, position: new Movement(8, 8) }),
		new Action({ new_plant: `PotatoMine`, position: new Movement(10, 10) }),
		new Action({
			new_plant: `IcebergLettuce`,
			position: new Movement(8, 10),
		}),
		new Action({
			end_turn: 1,
		}),
		new Action({
			player: `woooowoooo`,
			movement: new Movement(-1, -1),
		}),
		new Action({
			new_plant: `Peashooter`,
			position: new Movement(7, 9),
			direction: new Movement(0, 1),
		}),
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(7, 7),
		}),
		new Action({ end_turn: 1 }),
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(7, 8),
		}),
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(8, 7),
		}),
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(9, 8),
		}),
		new Action({
			player: `woooowoooo`,
			movement: new Movement(7, 7, false),
		}),
		new Action({ end_turn: 1 }),
		// (7, 8), (7, 9), (8, 7), and (9, 7)
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(6, 7),
		}),
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(6, 8),
		}),
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(7, 6),
		}),
		new Action({
			new_plant: `Sunflower`,
			position: new Movement(8, 6),
		}),
		new Action({
			end_turn: 1,
		}),
		new Action({
			new_zombie: "Basic",
			position: new Movement(12, 0),
		}),
		new Action({
			new_zombie: "Basic",
			position: new Movement(15, 3),
		}),
		new Action({
			new_zombie: "Basic",
			position: new Movement(9, 15),
		}),
		new Action({
			new_zombie: "Basic",
			position: new Movement(0, 10),
		}),
		new Action({
			new_plant: "LaserBean",
			position: new Movement(6, 6),
			direction: new Movement(3, -1),
		}),
		new Action({
			new_plant: "Peashooter",
			position: new Movement(9, 9),
			direction: new Movement(0, 1),
		}),
		new Action({
			new_zombie: "Basic",
			position: new Movement(15, 10),
		}),
		new Action({
			end_turn: 10,
		}),
	],
};
