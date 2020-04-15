import { Vector2, Direction } from "./spatial";

export default interface Level
{
	series: number
	level: number
	mainBlocks: number
	blueBlocks: number
	redBlocks: number

	player: Player
	tiles: (Tile|undefined)[][]
}

interface Player
{
	startingDirection: Direction
	startingPosition: Vector2
}

interface Tile
{
	height: number
}
