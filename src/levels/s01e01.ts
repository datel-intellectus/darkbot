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
		startingPosition: { x: 0, y: 2, z: 0 },
		startingDirection: 1
	},

	tiles: [
		[
			[ undefined, undefined,       undefined,       undefined ],
			[ undefined, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ undefined, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
		],
		[
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, undefined,       undefined,       undefined ],
			[ {type: "Floor"}, undefined,       undefined,       undefined ],
		]
	],

	water: {
		height: [
			[ 0, 0, 0 ],
			[ 0, 1, 1 ],
			[ 0, 0, 0 ]
		]
	}
}

export default level
