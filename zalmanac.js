const fs = require("fs");
const path = require("path");
const zombie_path = "./zombies";
const zombies = {};
const zombie_categories = fs.readdirSync("./zombies");
zombie_categories.forEach((c) => {
	Object.assign(
		zombies,
		require(path.join(__dirname, path.join(zombie_path, c)))
	);
});
module.exports = zombies;
