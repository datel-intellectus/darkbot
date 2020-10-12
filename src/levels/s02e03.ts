import Level from "../level"

const level: Level =
{
	series: 2,
	episode: 3,
	mainBlocks: 5,
	blueBlocks: 3,
	redBlocks: 0,

	player:
	{
		startingPosition: { x: 2, y: 2, z: 4 },
		startingDirection: 1
	},

	tiles: [
		[
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ]
		],
		[
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Flower"}, undefined,      {type: "Floor"} ],
			[ {type: "Flower"}, undefined,      {type: "Floor"} ],
			[ {type: "Flower"}, undefined,      {type: "Floor"} ],
			[ {type: "Flower"}, undefined,      {type: "Floor"} ]
		],
	],

	water: {
		height: [[]]
	},

	circuit: {
		scheme:
			' ? '
	}
}

export default level
