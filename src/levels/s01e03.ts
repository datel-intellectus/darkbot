import Level from "../level"

const level: Level =
{
	series: 1,
	level: 3,
	mainBlocks: 5,
	blueBlocks: 3,
	redBlocks: 0,

	player:
	{
		startingPosition: { x: 0, y: 1, z: 0 },
		startingDirection: 1
	},

	tiles: [
		[
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
		]
	],

	circuit: {
		scheme:
			'     ' + '\n' +
			' ┌──┐' + '\n' +
			'┌┿──┘' + '\n' +
			'└┼──┐' + '\n' +
			' └──┘'
	}
}

export default level
