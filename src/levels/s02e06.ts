import Level from "../level"

const level: Level =
{
	series: 2,
	episode: 6,
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
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
		],
		[
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, undefined,       undefined,       undefined,       undefined,       {type: "Floor"} ],
			[ {type: "Floor"}, undefined,       undefined,       undefined,       undefined,       {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Steel"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ {type: "Floor"}, {type: "Floor"}, undefined, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
		],
		[
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, undefined,       undefined,       undefined,       undefined,       {type: "Floor"} ],
			[ {type: "Floor"}, undefined,       undefined,       undefined,       undefined,       {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, {type: "Flower"}, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
		],
		[
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ {type: "Floor"}, undefined,       undefined,       undefined,       undefined,       {type: "Floor"} ],
			[ {type: "Floor"}, undefined,       undefined,       undefined,       undefined,       {type: "Floor"} ],
			[ {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"}, {type: "Floor"} ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
			[ undefined, undefined, undefined, undefined, undefined, undefined, ],
		],
	],

	water: {
		height: [
			[ 0, 0, 0, 0, 0, 0 ],
			[ 0, 2.5, 2.5, 2.5, 2.5, 0],
			[ 0, 2.5, 2.5, 2.5, 2.5, 0],
			[ 0, 0, 0, 0, 0, 0 ],
		]
	},

	circuit: {
		scheme:
			'      ' + '\n' +
			'      ' + '\n' +
			'      ' + '\n' +
			'      ' + '\n' +
			'      ' + '\n' +
			'      ' + '\n' +
			'      ' + '\n' +
			' ┌c─┐ ' + '\n' +
			' └─b┘ ' + '\n' +
			'      '
	}
}

export default level
