import Level from "../level"
import { Vector2, Vector3, Direction } from "../spatial"
import { makeMultidimArray } from "../utils/multidim"
import { Workspace } from "../components/BlockView"
import { EventTarget } from "@meta-utils/events"
import { Tiles, Tile_Props } from "../render/tiles"
import { BlockRunner } from "./blocks"
import { WaterRunner } from "./water"
import { CheckRunner } from "./check"


// Events

export interface TranslationEvent
{
    oldPosition: Vector2
    newPosition: Vector2
}

export interface RotationEvent
{
    oldDirection: Direction
    newDirection: Direction
}

export interface VirtualMachineEvents
{
    robotMove: TranslationEvent
    robotTurn: RotationEvent
    robotChangePosition: TranslationEvent & RotationEvent

    robotWalk: TranslationEvent
    robotJump: TranslationEvent
}



// Class

export class VirtualMachine extends EventTarget<VirtualMachineEvents>
{
    playerPos: Vector3 = { x: 0, y: 0, z: 0 }
    playerDir: Direction = Direction.NE

    /** 3-dim array in the format `[x][z][y]` */
    tiles: (Tile_Props | undefined)[][][] = []

    readonly check: CheckRunner
    readonly blocks: BlockRunner
    readonly water: WaterRunner

    constructor(public workspace: Workspace, public level: Level)
    {
        super()

        for (let y = 0; y < level.tiles.length;       y++)
        for (let z = 0; z < level.tiles[y].length;    z++)
        for (let x = 0; x < level.tiles[y][z].length; x++)
        {
            makeMultidimArray(this.tiles, x, z)

            const el = level.tiles[y][z][x]
            if (!el) continue

            this.tiles[x][z][y] = {
                type: Tiles[el.type],
                worldPosition: { x, y, z }
            }
        }

        this.resetPlayer()

        this.check = new CheckRunner(this)
        this.blocks = new BlockRunner(this)
        this.water = new WaterRunner(this)

        ;(window as any).virtualMachine = this
    }

    allTiles = (() =>
    {
        const self = this
        return function* tileIterator()
        {
            for (const slice of self.tiles)
            for (const column of slice)
            for (const tile of column)
            {
                if (tile === undefined) continue
                yield tile
            }
        }
    })()

    resetPlayer = () =>
    {
        this.playerDir = this.level.player.startingDirection
        this.playerPos = { ...this.level.player.startingPosition }
    }

}
