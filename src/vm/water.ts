import { EventTarget } from "@meta-utils/events"
import { VirtualMachine } from "."
import { Direction, Vector3 } from "../spatial"
import { makeMultidimArray } from "../utils/multidim"


export interface WaterColumn
{
    x: number,
    z: number,

    /**
     * The y coordinate of the topmost on-ground tile
     * under this column, undefined if there's none.
     */
    floor?: number

    /**
     * The y coordinate of the bottommost ceiling tile
     * above this column, undefined if there's none.
     */
    ceil?: number

    /**
     * The y coordinate of the top of the water column,
     * undefined if there's no water in this column.
     */
    top?: number

    /**
     * The y coordinate of the bottom of this water column,
     * undefined if the water touches the floor.
     */
    bottom?: number

    /**
     * Neighbourng water columns, direction to them and
     * a weight that quantifies how easily water flows there.
     */
    neighbours: Neighbour[]
}

interface Neighbour
{
    /**
     * The number of free tiles touching the neighbouring water column.
     */
    weight: number
    direction: Direction
    ref: WaterColumn
}

export interface WaterRunnerEvents
{
    tick: {}
}

export class WaterRunner
extends EventTarget<WaterRunnerEvents>
{
    /**
     * The multidimensional array of columns possible to fill
     * with water, in the format `[x][z][index]`.
     */
    cols: WaterColumn[][][] = []

    tick = 500

    constructor(public vm: VirtualMachine)
    {
        super()
        this.generateColumns()
        this.connectNeighbours()
        this.loadFromLevel()
    }

    private step = () =>
    {
        setTimeout(this.step, this.tick)
        this.updateNeighbourWeights()
    }

    allColumns = (() =>
    {
        const self = this
        return function* columnIterator()
        {
            const cols = self.cols

            for (let x = -1; x < cols.length;    x++)
            for (let z = -1; z < cols[x].length; z++)
            for (const col of cols[x][z])
            {
                yield col
            }
        }
    })()

    private generateColumns = () =>
    {
        const vm = this.vm
        const tiles = vm.tiles
        const check = vm.check

        // extend tiles, so that we have at least one
        // water column past the edge of the world

        let xMax = 0
        let zMax = 0

        for (const tile of vm.allTiles())
        {
            if (tile === undefined) continue
            const {x, z} = tile.worldPosition
            xMax = Math.max(x, xMax)
            zMax = Math.max(z, zMax)
        }

        xMax += 1
        zMax += 1


        for (let x = -1; x < xMax; x++)
        for (let z = -1; z < zMax; z++)
        {
            makeMultidimArray(tiles, x, z)
            makeMultidimArray(this.cols, x, z)

            let floor: number|undefined
            let ceil: number|undefined

            for (let y = -1; y < tiles[x][z].length + 1; y++)
            {
                if (ceil === undefined && check.isCeiling({ x, y ,z }))
                {
                    ceil = y
                    this.cols[x][z].push({
                        x, z, floor, ceil, neighbours: []
                    })
                }

                if (ceil !== undefined && check.onGround({ x, y, z }))
                {
                    ceil = undefined
                    floor = y
                }
            }

            this.cols[x][z].push({
                x, z, floor, ceil, neighbours: []
            })
        }
    }

    private connectNeighbours = () =>
    {
        const cols = this.cols

        for (const col of this.allColumns())
        for (const direction of Direction)
        {
            const { x, z } = col
            const { x: x_, z: z_ } = Vector3.add( { x, y:0, z }, Direction.toVector3(direction) )

            if (cols[x_] === undefined || cols[x_][z_] === undefined) continue

            for (const col_ of cols[x_][z_])
            {
                const floor = Math.max(col.floor ?? -Infinity, col_.floor ?? -Infinity)
                const ceil  = Math.min(col.ceil  ??  Infinity, col_.ceil  ??  Infinity)
                const commonTiles = ceil - floor

                if (commonTiles > 0)
                    col.neighbours.push({ direction, weight: 0, ref: col_ })
            }
        }
    }

    private loadFromLevel = () =>
    {
        const vm = this.vm
        const check = vm.check
        const tiles = vm.level.water?.height
        if (!tiles) return

        for (let z = 0; z < tiles.length;    z++)
        for (let x = 0; x < tiles[z].length; x++)
        {
            const height = tiles[z][x]
            if (height === 0) continue

            const cols = this.cols[x][z]
            const col = cols[cols.length - 1]

            col.top = check.waterColumnBottom(col) + height
        }
    }

    private updateNeighbourWeights = () =>
    {
        const check = this.vm.check

        for (const col of this.allColumns())
        for (const neighbour of col.neighbours)
        {
            const col_ = neighbour.ref
            const bottom = Math.max( check.waterColumnBottom(col), check.waterColumnBottom(col_) )
            const top    = Math.min( check.waterColumnTop(col),    check.waterColumnTop(col_)    )
            const weight = Math.max( 0, top - bottom )

            neighbour.weight = weight
        }
    }
}
