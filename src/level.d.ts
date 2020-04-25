import { Vector3, Direction } from "./spatial"
import { Tiles } from "./render/tiles"

export default interface Level
{
	series: number
	level: number
	mainBlocks: number
	blueBlocks: number
	redBlocks: number

	player: Player
	/** 3-dim array in the format `[y][z][x]` */
	tiles: (Tile|undefined)[][][]

	water?: Water
}

interface Player
{
	startingDirection: Direction
	startingPosition: Vector3
}

interface Tile
{
	type: keyof typeof Tiles
}

interface Water
{
	/** 2-dim array in the format `[z][x]` */
	height: number[][]
}
