const Action = require("./structures/action.js");
const ActionList = require("./structures/action_list.js");
const Movement = require("./structures/movement.js");
const Player = require("./structures/player.js");
const PlayerList = require("./structures/player_list.js");
function spawnZombies(positions) {
	return new Action({
		actions: positions.map((p) => {
			// console.log(p[0]);
			return new Action({
				new_zombie: p[0],
				position: new Movement(p[1], p[2]),
			});
		}),
	});
}
function spawnPlants(positions) {
	return new Action({
		actions: positions.map((p) => {
			const action = new Action({
				new_plant: p[0],
				position: new Movement(p[1], p[2]),
			});
			if (p[3] != undefined) {
				action.direction = new Movement(p[3], p[4]);
			}
			if (p[5] != undefined) {
				action.act = p[5];
			}
			return action;
		}),
	});
}
function movePlayers(movements) {
	return new Action({
		actions: movements.map((p) => {
			return new Action({
				player: p[0],
				act: p[0],
				movement: new Movement(p[1], p[2], p[3] ?? true),
			});
		}),
	});
}
function hasMoved(players) {
	return new Action({
		actions: players.map((p) => {
			return new Action({
				act: p,
			});
		}),
	});
}
const end_turn = (times = 1) => {
	return new Action({
		end_turn: times,
	});
};
console.log();
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
				health: 8,
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
			new Action({
				end_turn: true,
			}),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(14, 0),
			}),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(1, 0),
			}),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(2, 1),
			}),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(3, 1),
			}),
			new Action({
				player: `The CAACN`,
				movement: new Movement(0, 1),
			}),
			new Action({
				new_plant: `Sunflower`,
				position: new Movement(5, 0),
			}),
			new Action({
				player: `Lillith Lazuli`,
				movement: new Movement(0, 3),
			}),
			new Action({
				end_turn: 1,
			}),
			spawnZombies([
				[`Basic`, 0, 10],
				[`Basic`, 1, 15],
				[`Basic`, 8, 15],
				[`Basic`, 14, 15],
			]),
			spawnPlants([
				[`Peashooter`, 11, 4, 0, 1],
				[`Sunflower`, 1, 1],
				[`Sunflower`, 12, 0],
				[`WallNut`, 11, 5],
			]),
			new Action({
				player: `arno`,
				movement: new Movement(1, 2, false),
			}),
			new Action({
				player: `Lillith Lazuli`,
				movement: new Movement(10, 4, false),
			}),
			new Action({
				player: `AMS`,
				movement: new Movement(-1, 1),
			}),
			new Action({
				player: `Tatters`,
				movement: new Movement(0, 1),
			}),
			new Action({
				player: `CT`,
				movement: new Movement(7, 1, false),
			}),
			new Action({
				end_turn: true,
			}),
			movePlayers([
				[`Lillith Lazuli`, 9, 4, false],
				[`CT`, 6, 2, false],
			]),
			spawnPlants([[`Peashooter`, 8, 4, 0, 1]]),
			hasMoved([`Lillith Lazuli`, `arno`, `The CAACN`, `CT`]),
			new Action({
				end_turn: true,
			}),
			movePlayers([
				[`CT`, 5, 3, false],
				[`Bradicus`, 14, 1, false],
				[`AMS`, 1, 0],
				[`The CAACN`, 0, 0],
				[`arno`, 0, 3, false],
			]),
			spawnPlants([
				[`TwinSunflower`, 15, 0, , , `Bradicus`],
				[`Sunflower`, 4, 0, , , `Cube492`],
				[`IcebergLettuce`, 9, 5, , , `Lillith Lazuli`],
			]),
			new Action({
				show_seed: `CherryBomb`,
			}),
			new Action({
				end_turn: true,
			}),
			spawnZombies([
				[`Basic`, 2, 15],
				[`Basic`, 15, 14],
			]),
			new Action({
				set_tiles: `................................................................w..............www............wwwww..........wwwwwwww......wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww`,
			}),
			movePlayers([
				[`AMS`, 1, 1],
				[`Cube492`, 0, 1],
				[`Lillith Lazuli`, 10, 5, false],
				[`Bradicus`, 0, 1],
				[`CT`, 4, 4, false],
				[`The CAACN`, 0, 3],
			]),
			spawnPlants([
				[`Peashooter`, 14, 2, 0, 1, `Bradicus`],
				[`Sunflower`, 4, 1, , , `Cube492`],
			]),
			new Action({
				show_seed: `Lilypad`,
			}),
			new Action({
				player: `Lillith Lazuli`,
				exhaust: 2,
			}),
			new Action({
				show_seed: `Infinut`,
				set_timer: {
					zombie: 1,
					plant: 1,
				},
			}),
			end_turn(),
			new Action({
				show_seed: `SnowPea`,
			}),
			spawnZombies([
				[`Basic`, 0, 10],
				[`Basic`, 0, 15],
				[`Basic`, 5, 15],
				[`Basic`, 10, 15],
				[`Basic`, 14, 15],
				[`Basic`, 15, 8],
				[`Basic`, 15, 8],
			]),
			new Action({
				set_timer: {
					tide: 1,
					plant: 3,
					zombie: 5,
				},
			}),
			new Action({
				sun_cost: 2100,
			}),
			spawnPlants([
				[`Peashooter`, 3, 5, 0, 1, `CT`],
				[`Lilypad`, 0, 4, , , `arno`],
			]),
			movePlayers([
				[`AMS`, 1, 0],
				[`The CAACN`, -1, 1],
				[`arno`, 0, 1],
			]),
			end_turn(),
			new Action({
				set_tiles: `................................................................ww............wwwww..........wwwwwww........wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww`,
			}),
			new Action({
				attack_zombie: { x: 0, y: 5, damage: 5 },
			}),
			spawnPlants([
				[`Lilypad`, 3, 5, , , `CT`],
				[`SnowPea`, 14, 1, 0, 1, `Bradicus`],
			]),
			movePlayers([
				[`AMS`, 1, -1],
				[`Cube492`, 0, 1],
			]),
			end_turn(),
			spawnPlants([
				[`Lilypad`, 10, 6, , , `Lillith Lazuli`],
				[`Infinut`, 5, 3, , , `CT`],
				[`Peashooter`, 13, 1, 0, 1, `AMS`],
				[`WallNut`, 14, 3, , , `Bradicus`],
				[`TwinSunflower`, 4, 2],
			]),
			hasMoved([`arno`]),
			end_turn(),
			new Action({
				sun_cost: 50,
				notes: `cube mystery box`,
			}),
			spawnPlants([
				[`Peashooter`, 10, 6, 0, 1, `Lillith Lazuli`],
				[`LightningReed`, 5, 2, , , `Cube492`],
				[`Lilypad`, 14, 3, , , `Bradicus`],
			]),
			movePlayers([
				[`Bradicus`, 0, 1],
				[`Tatters`, 0, 1],
			]),
			new Action({
				set_timer: {
					plant: 3,
				},
				notes: `PLANT MUTATION`,
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
				show_seed: `all`,
			}),
			end_turn(),
			spawnPlants([[`LightningReed`, 6, 6]]),
			end_turn(3),
			spawnPlants([[`LightningReed`, 6, 7]]),
			end_turn(3),
			spawnPlants([[`LightningReed`, 6, 5]]),
			end_turn(),
			spawnZombies([
				[`Basic`, 10, 6],
				[`Basic`, 11, 6],
				[`Basic`, 12, 6],
			]),
			end_turn(4),
			new Action({
				attack_player: { x: 0, y: 0, damage: 2 },
			}),
			spawnPlants([[`HeavenlyPeach`, 1, 1]]),
			end_turn(10),
		],
	},
	m: {
		players: [
			new Player({
				name: `bopduwopyop`,
				position: new Movement(15, 15),
			}),
		],
		actions: [
			new Action({
				begin_turn: true,
			}),
			movePlayers([[`bopduwopyop`, -1, -1]]),
			spawnPlants([[`IcebergLettuce`, 13, 14]]),
			new Action({
				show_seed: `Rotobaga`,
			}),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, -1, -1]]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, -1, -1]]),
			new Action({
				end_turn: true,
			}),
			spawnPlants([[`PotatoMine`, 11, 12]]),
			movePlayers([[`bopduwopyop`, -1, -1]]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, -1, -1]]),
			spawnPlants([
				[`Sunflower`, 9, 9],
				[`Sunflower`, 10, 9],
				[`Rotobaga`, 9, 10],
			]),
			new Action({
				end_turn: true,
			}),
			spawnZombies([
				[`Basic`, 0, 14],
				[`Basic`, 0, 2],
				[`Basic`, 4, 0],
				[`Basic`, 15, 14],
				[`Basic`, 0, 15],
				[`Basic`, 5, 15],
			]),
			movePlayers([[`bopduwopyop`, -1, -1]]),
			spawnPlants([
				[`IcebergLettuce`, 8, 10],
				[`Sunflower`, 8, 9],
				[`Sunflower`, 9, 8],
				[`Sunflower`, 10, 8],
			]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, -1, -1]]),
			spawnPlants([
				[`Sunflower`, 7, 9],
				[`Sunflower`, 9, 7],
				[`WallNut`, 7, 7],
			]),
			new Action({
				end_turn: true,
			}),
			new Action({
				show_seed: `HomingThistle`,
			}),
			spawnPlants([[`Rotobaga`, 8, 7]]),
			new Action({
				end_turn: true,
			}),
			spawnPlants([
				[`Sunflower`, 8, 8],
				[`Sunflower`, 6, 8],
				[`Peashooter`, 6, 9, 0, 1],
			]),
			movePlayers([[`bopduwopyop`, -1, 0]]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, -1, 0]]),
			spawnPlants([
				[`Peashooter`, 5, 9, 0, -1],
				[`HomingThistle`, 7, 8],
			]),

			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, 0, -1]]),
			spawnPlants([
				[`HomingThistle`, 5, 8],
				[`IcebergLettuce`, 7, 6],
			]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, 5, 8, false]]),
			spawnPlants([
				[`Peashooter`, 4, 8, 0, 1],
				[`Sunflower`, 4, 7],
				[`Sunflower`, 5, 7],
				[`Sunflower`, 6, 7],
				[`Sunflower`, 4, 9],
			]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, 5, 9, false]]),
			spawnPlants([
				[`WallNut`, 4, 10],
				[`HomingThistle`, 5, 10],
				[`Sunflower`, 6, 10],
			]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, 6, 10, false]]),
			spawnPlants([
				[`Sunflower`, 7, 10],
				[`Sunflower`, 7, 11],
				[`Sunflower`, 6, 11],
			]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, 7, 11, false]]),
			new Action({
				dig: { x: 8, y: 10 },
			}),
			spawnPlants([
				[`HomingThistle`, 7, 12],
				[`Rotobaga`, 8, 10],
				[`Sunflower`, 8, 11],
				[`Sunflower`, 8, 12],
			]),
			new Action({
				end_turn: true,
			}),
			spawnZombies([
				[`Conehead`, 0, 8],
				[`Conehead`, 1, 15],
				[`Conehead`, 15, 8],
				[`Conehead`, 4, 0],
				[`Conehead`, 7, 15],
				[`Basic`, 0, 14],
				[`Basic`, 0, 2],
				[`Basic`, 4, 0],
				[`Basic`, 15, 14],
				[`Basic`, 0, 15],
				[`Basic`, 5, 15],
			]),
			movePlayers([[`bopduwopyop`, 6, 12, false]]),
			spawnPlants([
				[`HomingThistle`, 5, 11],
				[`IcebergLettuce`, 7, 13],
			]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, 5, 12, false]]),
			spawnPlants([
				[`HomingThistle`, 4, 11],
				[`Rotobaga`, 4, 12],
				[`Peashooter`, 6, 12, 0, 1],
			]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, 0, 1]]),
			spawnPlants([
				[`HomingThistle`, 5, 12],
				[`Rotobaga`, 6, 13],
			]),
			new Action({
				end_turn: true,
			}),
			spawnPlants([
				[`Rotobaga`, 6, 14],
				[`WallNut`, 6, 15],
				[`Peashooter`, 6, 14, -1, 0],
			]),
			movePlayers([[`bopduwopyop`, 6, 14, false]]),
			new Action({
				end_turn: true,
			}),
			spawnPlants([
				[`Sunflower`, 7, 13],
				[`Sunflower`, 5, 13],
				[`Sunflower`, 5, 14],
				[`HomingThistle`, 7, 14],
			]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, 7, 13, false]]),
			spawnPlants([
				[`Rotobaga`, 8, 13],
				[`HomingThistle`, 8, 14],
			]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, 8, 13, false]]),
			spawnPlants([
				[`Rotobaga`, 9, 13],
				[`HomingThistle`, 9, 14],
			]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, 8, 12, false]]),
			spawnPlants([
				[`Rotobaga`, 9, 12],
				[`HomingThistle`, 9, 11],
			]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, 9, 13, false]]),
			spawnPlants([
				[`HomingThistle`, 10, 14],
				[`Sunflower`, 10, 12],
				[`Sunflower`, 10, 13],
			]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, 10, 14, false]]),
			spawnPlants([
				[`HomingThistle`, 11, 13],
				[`WallNut`, 9, 15],
			]),
			new Action({
				end_turn: true,
			}),
			spawnZombies([
				[`Buckethead`, 0, 12],
				[`Buckethead`, 4, 15],
				[`Buckethead`, 15, 3],
				[`Buckethead`, 6, 0],
				[`Conehead`, 9, 15],
				[`Conehead`, 0, 8],
				[`Conehead`, 1, 15],
				[`Conehead`, 15, 8],
				[`Conehead`, 4, 0],
				[`Conehead`, 7, 15],
				[`Basic`, 0, 14],
				[`Basic`, 0, 2],
				[`Basic`, 4, 0],
				[`Basic`, 15, 14],
				[`Basic`, 0, 15],
				[`Basic`, 5, 15],
			]),
			new Action({
				show_seed: `Jalapeno`,
			}),
			new Action({
				dig: {
					x: 11,
					y: 12,
				},
			}),
			spawnPlants([
				[`Jalapeno`, 10, 15],
				[`HomingThistle`, 11, 14],
				[`Rotobaga`, 11, 12],
			]),
			movePlayers([[`bopduwopyop`, 11, 13, false]]),
			new Action({
				end_turn: true,
			}),
			spawnPlants([
				[`Peashooter`, 12, 12, -1, 0],
				[`HomingThistle`, 12, 14],
				[`Sunflower`, 12, 13],
			]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, 12, 13, false]]),
			spawnPlants([
				[`HomingThistle`, 13, 14],
				[`Rotobaga`, 13, 13],
				[`Sunflower`, 13, 12],
			]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, 13, 14, false]]),
			spawnPlants([
				[`HomingThistle`, 14, 14],
				[`Rotobaga`, 14, 13],
				[`IcebergLettuce`, 14, 15],
			]),
			new Action({
				end_turn: true,
			}),
			spawnPlants([
				[`HomingThistle`, 14, 12],
				[`WallNut`, 12, 15],
			]),
			movePlayers([[`bopduwopyop`, 1, -1]]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, -1, -1]]),
			spawnPlants([
				[`Rotobaga`, 12, 11],
				[`HomingThistle`, 13, 11],
			]),
			new Action({
				end_turn: true,
			}),
			new Action({
				show_seed: `Starfruit`,
			}),
			movePlayers([[`bopduwopyop`, -1, -1]]),
			new Action({
				end_turn: true,
			}),
			movePlayers([[`bopduwopyop`, -1, -1]]),
			spawnPlants([
				[`Starfruit`, 10, 10],
				[`Rotobaga`, 11, 11],
				[`HomingThistle`, 10, 11],
			]),
		],
	},
};
