const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const image_path = path.join(__dirname, "/assets/effects");
const images = fs.readdirSync(image_path);
images.forEach(async (i) => {
	if (i.endsWith(`.png`)) {
		const image = await loadImage(path.join(image_path, i));
		const dimension = Math.max(image.width, image.height);
		const canvas = createCanvas(dimension, dimension);
		const ctx = canvas.getContext("2d");
		await ctx.drawImage(
			image,
			dimension / 2 - image.width / 2,
			dimension / 2 - image.height / 2
		);
		const out = await fs.createWriteStream(path.join(image_path, i));
		const stream = await canvas.createPNGStream();
		await stream.pipe(out);
		await out.on("finish", () => console.log("The PNG file was created."));
	}
});
