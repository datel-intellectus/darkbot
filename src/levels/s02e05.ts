import Level from "../level"

const level: Level =
{
	series: 2,
	episode: 5,
	mainBlocks: 5,
	blueBlocks: 3,
	redBlocks: 0,

	player:
	{
		startingPosition: { x: 0, y: 1, z: 4 },
		startingDirection: 1
	},

	tiles: [
		[
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
		],
		[
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, {type: "Steel"}, undefined, undefined, ],
		],
	],

	water: {
		height: [[]]
	},

	circuit: {
		scheme:
			'      ' + '\n' +
			'┌b───┐' + '\n' +
			'└──c─┘' + '\n' +
			'      ' + '\n' +
			'      ' + '\n'
	}
}

export default level
