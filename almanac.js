const fs = require("fs");
const path = require("path");
const plant_path = "./plants";
const plants = {};
const plant_categories = fs.readdirSync("./plants");
plant_categories.forEach((c) => {
	const plant = require(path.join(__dirname, path.join(plant_path, c)))
	Object.keys(plant).forEach((p) => {
		if (new plant[p]().hidden) {
			delete plant[p]
		}
	})
	console.log(plant)
	Object.assign(
		plants,
		plant
	);
});
module.exports = plants;
