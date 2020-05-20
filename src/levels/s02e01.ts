import Level from "../level"

const level: Level =
{
	series: 2,
	episode: 1,
	mainBlocks: 5,
	blueBlocks: 3,
	redBlocks: 0,

	player:
	{
		startingPosition: { x: 0, y: 1, z: 1 },
		startingDirection: 1
	},

	tiles: [
		[
			[ undefined,       undefined,       {type: "Flower"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ]
		],
		[
			[ undefined,       undefined,       undefined,      ],
			[ undefined,       {type: "Floor"}, undefined,      ]
		]
	],

	water: {
		height: [
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
		]
	},

	circuit: {
		scheme:
			'     ' + '\n' +
			'     ' + '\n' +
			'     ' + '\n' +
			'     ' + '\n'
	}
}

export default level
