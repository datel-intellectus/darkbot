import { Vector3, Direction } from "./spatial"
import { Tiles } from "./render/tiles"

export default interface Level
{
	series: number
	episode: number
	mainBlocks: number
	blueBlocks: number
	redBlocks: number

	player: Player
	/** 3-dim array in the format `[y][z][x]` */
	tiles: (Tile|undefined)[][][]

	water?: Water
	circuit?: Circuit
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

interface Circuit
{
	/**
	 * Multiline “unicode art” string, where each character
	 * corresponds to a tile, line number is translated to
	 * `z` coordinate, column to `x`.
	 *
	 * ```
	 *   NE
	 * NW    SE
	 *   SW
	 * ```
	 *
	 * * ` ` empty tile
	 *
	 * * `│` NE-SW wire
	 * * `─` NW-SE wire
	 * * `┌` SW-SE wire
	 * * `┐` SW-NW wire
	 * * `└` NE-SE wire
	 * * `┘` NE-NW wire
	 *
	 * * `┼` wire junction (connects all four tiles)
	 * * `┿` wire crossing (connects NE-SW and NW-SE)
	 */
	scheme: string
}
