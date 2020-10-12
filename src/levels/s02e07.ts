import Level from "../level"

const level: Level =
{
	series: 2,
	episode: 8,
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
			[ {type: "Grass"}, {type: "Grass"}, {type: "Grass"}, {type: "PathNESW"} ],
			[ {type: "PathSESW"}, {type: "Grass"}, {type: "Grass"}, {type: "Grass"} ],
			[ {type: "Grass"}, {type: "Grass"}, {type: "Grass"}, {type: "Grass"} ],
			[ {type: "Grass"}, {type: "Grass"}, {type: "Grass"}, {type: "Grass"} ]
		]
	]
}

export default level
