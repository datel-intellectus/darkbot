import Level from "../level"

const level: Level =
{
	series: 1,
	level: 1,
	mainBlocks: 5,
	blueBlocks: 3,
	redBlocks: 0,

	player:
	{
		startingPosition: { x: 0, y: 0 },
		startingDirection: 1
	},

	tiles: [
		[ { height: 1 }, { height: 1 }, { height: 1 } ],
		[ { height: 1 }, { height: 0 }, { height: 0 } ],
		[ { height: 1 }, { height: 0 }, { height: 0 } ],
	]
}

export default level
