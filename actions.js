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
	tdq_players: [
		new Player({
			name: `arno`,
			position: new Movement(0, 0),
			fillStyle: `#2a2`,
		}),
		new Player({
			name: `Bradicus`,
			position: new Movement(1, 0),
			fillStyle: `#e44`,
		}),
		new Player({
			name: `Captain Totalitea`,
			position: new Movement(2, 0),
			fillStyle: `#77a`,
		}),
		new Player({
			name: `Chilly Billy`,
			position: new Movement(3, 0),
			fillStyle: `#aff`,
		}),
		new Player({ name: `Cube492`, position: new Movement(4, 0) }),
		new Player({ name: `Lazarus Alarie`, position: new Movement(5, 0) }),
		new Player({ name: `Tatters`, position: new Movement(6, 0) }),
		new Player({ name: `The CAACN`, position: new Movement(7, 0) }),
		new Player({ name: `CT`, position: new Movement(8, 0) }),
		new Player({ name: `AMS`, position: new Movement(9, 0) }),
		new Player({ name: `Lillith Lazuli`, position: new Movement(10, 0) }),
		new Player({ name: `Azalea`, position: new Movement(11, 0) }),
		new Player({ name: `Snow SMA`, position: new Movement(12, 0) }),
		new Player({ name: `Firework Dragon`, position: new Movement(13, 0) }),
	],
	tdq_actions: [
		new Action({ begin_turn: true }),
		new Action({ end_turn: 5 }),
		new Action({
			end_turn: 30,
		}),
		new Action({
			new_plant: `Infinut`,
			position: new Movement(0, 2),
		}),
		new Action({
			new_plant: `WallNut`,
			position: new Movement(15, 2),
		}),
		new Action({
			new_zombie: `Conehead`,
			position: new Movement(15, 4),
		}),
		new Action({
			new_zombie: `Conehead`,
			position: new Movement(0, 4),
		}),
		new Action({
			end_turn: 6,
		}),
		new Action({
			new_plant: `WinterMelon`,
			position: new Movement(1, 2),
			direction: new Movement(-1, 0)
		}),
		new Action({
			end_turn: 3
		})
	],
};
