const Action = require("./structures/action.js");
const ActionList = require("./structures/action_list.js");
const Movement = require("./structures/movement.js");
const Player = require("./structures/player.js");
const PlayerList = require("./structures/player_list.js");
module.exports = {
	qoth: {
		players: [
			new Player({
				name: `woooowoooo`,
				position: new Movement(9, 9, true),
			}),
		],
		actions: [
			new Action({ begin_turn: true }),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(8, 8),
			}),
			new Action({
				new_plant: `PotatoMine`,
				position: new Movement(10, 10),
			}),
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
	},
	tdq: {
		players: [
			new Player({
				name: `arno`,
				position: new Movement(0, 0),
				fillStyle: `#2a2`,
			}),
			new Player({
				name: `Bradicus`,
				position: new Movement(13, 1),
				fillStyle: `#e44`,
			}),
			new Player({
				name: `Captain Totalitea`,
				position: new Movement(2, 0),
				fillStyle: `#77a`,
			}),
			/*new Player({
				name: `Chilly Billy`,
				position: new Movement(3, 0),
				fillStyle: `#aff`,
			}),*/
			new Player({
				name: `Cube492`,
				position: new Movement(4, 0),
				fillStyle: `#2562f9`,
			}),
			/*new Player({
				name: `Lazarus Alarie`,
				position: new Movement(5, 0),
				fillStyle: `#90d7ec`,
			}),*/
			new Player({
				name: `Tatters`,
				position: new Movement(6, 0),
				fillStyle: `#efa339`,
			}),
			new Player({
				name: `The CAACN`,
				position: new Movement(7, 0),
				fillStyle: `#94918c`,
			}),
			new Player({
				name: `CT`,
				position: new Movement(8, 0),
				fillStyle: `#6154cf`,
			}),
			new Player({
				name: `AMS`,
				position: new Movement(9, 0),
				fillStyle: `#c18ac6`,
			}),
			new Player({
				name: `Lillith Lazuli`,
				position: new Movement(10, 0),
				fillStyle: `#447cc1`,
			}),
			/*new Player({
				name: `Azalea`,
				position: new Movement(11, 0),
				fillStyle: `#ebdde2`,
			}),
			new Player({
				name: `Snow SMA`,
				position: new Movement(12, 0),
				fillStyle: `#ccddf3`,
			}),
			new Player({
				name: `Firework Dragon`,
				position: new Movement(13, 0),
				fillStyle: `#e45656`,
			}),*/
		],
		actions: [
			new Action({
				set_tiles: `................................................................................w..............wwww..........wwwwwwww......wwwwwwwwwwww..wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww`,
			}),
			new Action({ begin_turn: true }),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(11, 0),
			}),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(0, 1),
			}),
			new Action({
				end_turn: true,
			}),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(9, 0),
			}),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(8, 1),
			}),
			new Action({
				player: `Cube492`,
				movement: new Movement(0, 1),
				new_plant: `Sunflower`,
				position: new Movement(5, 1),
			}),
			new Action({
				new_plant: `IcebergLettuce`,
				position: new Movement(13, 2),
			}),
			new Action({
				end_turn: true,
			}),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(13, 0),
			}),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(3, 0),
			}),
			new Action({
				new_plant: `Peashooter`,
				position: new Movement(7, 1),
				direction: new Movement(0, 1),
			}),
			new Action({
				new_plant: `PotatoMine`,
				position: new Movement(9, 1),
			}),
			new Action({
				set_tiles: `................................................................................................................w..............wwww..........wwwwwwww......wwwwwwwwwwww..wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww`,
				end_turn: true,
				show_seed: `TwinSunflower`,
			}),
			new Action({
				player: `arno`,
				movement: new Movement(1, 1, false),
				new_plant: `Sunflower`,
				position: new Movement(0, 0),
			}),
			new Action({
				player: `The CAACN`,
				movement: new Movement(0, 1),
			}),
			new Action({
				player: `AMS`,
				movement: new Movement(0, 1),
				new_plant: `TwinSunflower`,
				position: new Movement(8, 0),
			}),
		],
	},
	test: {
		players: [
			new Player({
				name: `arno`,
				position: new Movement(0, 0),
				fillStyle: `#2a2`,
			}),
		],
		actions: [
			new Action({ begin_turn: true }),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(11, 0),
			}),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(0, 1),
			}),
			new Action({
				end_turn: true,
			}),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(9, 0),
			}),
			new Action({
				end_turn: 20,
			}),
			new Action({
				new_plant: `Snapdragon`,
				position: new Movement(5, 5),
				direction: new Movement(0, 2),
			}),
			new Action({
				new_zombie: `Basic`,
				position: new Movement(5, 9),
			}),
			new Action({
				end_turn: 3,
			}),
		],
	},
};
