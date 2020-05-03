import Level from "../level"

const level: Level =
{
	series: 1,
	level: 2,
	mainBlocks: 5,
	blueBlocks: 3,
	redBlocks: 0,

	player:
	{
		startingPosition: { x: 0, y: 4, z: 0 },
		startingDirection: 1
	},

	tiles: [
		[
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ]
		],
		[
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, undefined,       undefined,       undefined,       {type: "Floor"} ]
		],
		[
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, undefined,       {type: "Floor"}, undefined,       {type: "Floor"} ]
		],
		[
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, undefined,       {type: "Floor"}, undefined,       {type: "Floor"} ]
		],
		[
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, undefined,       {type: "Floor"}, undefined,       {type: "Floor"} ]
		]
	],

	water: {
		height: [
			[ 0, 0, 0, 0, 0 ],
			[ 0, 5, 0, 0, 0 ]
		]
	}
}

export default level