const fs = require("fs");
const path = require("path");
const plant_path = "./plants";
const plants = {};
const plant_categories = fs.readdirSync("./plants");
plant_categories.forEach((c) => {
	Object.assign(
		plants,
		require(path.join(__dirname, path.join(plant_path, c)))
	);
});
module.exports = plants;
