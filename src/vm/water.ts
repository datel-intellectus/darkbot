import { EventTarget } from "@meta-utils/events"
import { VirtualMachine } from "."
import { Direction, Vector3, Vector5 } from "../spatial"
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
     * If the number is higher than `ceil`, the water is
     * pressurized inside the space.
     */
    top?: number

    /**
     * The y coordinate of the bottom of this water column,
     * undefined if the water touches the floor.
     */
    bottom?: number

    /**
     *
     */
    pressure: number

    /**
     * Neighbourng water columns, direction to them and
     * a weight that quantifies how easily water flows there.
     */
    neighbours: Neighbour[]

    /**
     * The rate of flow of the water in various directions
     */
    velocity: Vector5
}

const defaultColumn = (): WaterColumn => ({
    x: 0, z: 0, floor: 0, ceil: 0,
    pressure: 0, neighbours: [],
    velocity: Vector5.zero()
})

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

    tickRate = .5
    damping = .5
    fluidity = .25

    get tick(): number {
        return this.vm.tick * this.tickRate
    }

    get gravity() : number {
        return this.vm.gravity * this.tickRate
    }


    constructor(public vm: VirtualMachine)
    {
        super()
        this.generateColumns()
        this.connectNeighbours()
        this.loadFromLevel()
        this.step()
    }

    private step = () =>
    {
        //setTimeout(this.step, this.tick)
        this.integrate()
        this.updatePressure()
        //this.updateNeighbourWeights()
        this.updateVelocities()
        this.dispatchEvent('tick', {})
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
                        ...defaultColumn(),
                        x, z, floor, ceil
                    })
                }

                if (ceil !== undefined && check.onGround({ x, y, z }))
                {
                    ceil = undefined
                    floor = y
                }
            }

            this.cols[x][z].push({
                ...defaultColumn(),
                x, z, floor, ceil
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
            col.pressure = col.top
        }
    }

    private updatePressure = () =>
    {
        const check = this.vm.check
        const { max } = Math

        for (const col of this.allColumns())
        {
            const ceil = col.ceil ?? check.waterColumnBottom(col)
            const top = check.waterColumnTop(col)

            if (top !== ceil)
            {
                col.pressure = ceil
            }
            else
            {
                let pressure = -Infinity

                for (const { ref } of col.neighbours)
                    pressure = max(pressure, ref.pressure)

                col.pressure = pressure
            }
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

    private updateVelocities = () =>
    {
        const check = this.vm.check

        for (const col of this.allColumns())
        {
            // Apply damping
            for (const dir of Direction)
            {
                const k = Vector5.keyInDirection(dir)
                col.velocity[k] *= 1 - this.damping
            }

            // Apply gravity
            if (!check.isWaterOnGround(col))
            {
                // Gravitational pull
                col.velocity.y -= this.gravity
            }
            else
            {
                // Gravitational spread
                for (const neighbour of col.neighbours)
                {
                    const { direction, ref } = neighbour
                    const k = Vector5.keyInDirection(direction)

                    const thisTop = check.waterColumnTop(col)
                    const thatTop = check.waterColumnTop(ref)
                    const diff = thisTop - thatTop

                    col.velocity[k] += diff * this.gravity * this.fluidity / 4
                }
            }

            // Redirect invalid velocities
            for (const dir of Direction)
            {
                const k = Vector5.keyInDirection(dir)

                if (col.neighbours.every( ({ direction }) => direction !== dir ))
                {
                    col.velocity.y += col.velocity[k]
                    col.velocity[k] = 0
                }
            }
        }
    }

    private integrate = (() =>
    {
        const newVelocities = new WeakMap<WaterColumn, Vector5>()

        return () =>
        {
            const check = this.vm.check
            const { max } = Math

            // Calculate updated velocities
            for (const col of this.allColumns())
            {
                // TODO
                newVelocities.set(col, col.velocity)
            }

            // Update the height of water on each tile
            for (const col of this.allColumns())
            {
                let flux = 0

                for (const k of Vector5.keys())
                    flux += col.velocity[k]

                if (flux < 0)
                {
                    const floor = col.floor
                    const bottom = check.waterColumnBottom(col)
                    const top = col.top ?? 0
                    let newTop = max( bottom, top + flux )

                    flux += top - newTop

                    if (col.bottom !== undefined && floor !== undefined && newTop === bottom)
                    {
                        newTop = floor
                        col.bottom = undefined
                    }

                    newTop += flux
                    col.top = newTop === floor ? undefined : newTop
                }
                else
                {
                    const floor = col.floor ?? -Infinity
                    const bottom = check.waterColumnBottom(col)
                    const newBottom = max( floor, bottom - flux )

                    console.log(floor, bottom, newBottom)

                    col.bottom = newBottom === floor ? undefined : newBottom
                    flux -= bottom - newBottom

                    // in case of floor == -Infinity
                    if (Number.isNaN(flux)) flux = 0

                    const top = col.top ?? 0
                    const newTop = top + flux

                    col.top = newTop === 0 ? undefined : newTop
                }
            }

            // Enforce conservation of water
            for (const col of this.allColumns())
            {
                // TODO
            }

            // Use the updated velocities
            for (const col of this.allColumns())
            {
                col.velocity = newVelocities.get(col)!
            }
        }
    })()
}
