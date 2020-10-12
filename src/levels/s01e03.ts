import Level from "../level"

const level: Level =
{
	series: 1,
	episode: 3,
	mainBlocks: 5,
	blueBlocks: 3,
	redBlocks: 0,

	player:
	{
		startingPosition: { x: 0, y: 1, z: 3 },
		startingDirection: 3
	},

	tiles: [
		[
			[ undefined,       undefined,       undefined,       {type: "Flower"}],
			[ undefined,       undefined,       undefined,       {type: "Floor"} ],
			[ undefined,       undefined,       undefined,       {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ]
		]
	],
}

export default level
