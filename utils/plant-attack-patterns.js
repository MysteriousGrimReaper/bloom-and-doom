const Action = require("../structures/action");
const Movement = require("../structures/movement");

module.exports = {
	shoot({
		action_list,
		position,
		direction,
		projectile_sprite,
		damage,
		damage_type,
		render_options,
	}) {
		const zombie_coords = action_list.zombie_list.map((z) => [
			z.position.x,
			z.position.y,
		]);
		let scan_point = [position.x, position.y];
		const isOutOfBounds = () => {
			return (
				scan_point[0] < 0 ||
				scan_point[0] >= action_list.board_width ||
				scan_point[1] < 0 ||
				scan_point[1] >= action_list.board_height
			);
		};
		let zombie_found = false;
		while (zombie_coords.indexOf(scan_point) < 0) {
			if (isOutOfBounds()) {
				return new Action({});
			}
			scan_point[0] += direction.x;
			scan_point[1] += direction.y;
		}
		action_list.zombie_list[zombie_coords.indexOf(scan_point)].damage(
			damage,
			damage_type
		);
		const render = {
			projectile: projectile_sprite,
			start_pos: position,
			end_pos: new Movement(scan_point[0], scan_point[1]),
			direction,
		};
		Object.assign(render, render_options);
		return new Action({
			render,
		});
	},
};
