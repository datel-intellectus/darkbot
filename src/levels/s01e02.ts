import Level from "../level"

const level: Level =
{
	series: 1,
	episode: 2,
	mainBlocks: 5,
	blueBlocks: 3,
	redBlocks: 0,

	player:
	{
		startingPosition: { x: 0, y: 1, z: 0 },
		startingDirection: 3
	},

	tiles: [
		[
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Flower"} ]
		]
	],
}

export default level
