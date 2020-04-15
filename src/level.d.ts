import { Direction } from "./robots";
import { Vector2 } from "./components/ViewElement";

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
