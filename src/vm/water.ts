import { EventTarget } from "@meta-utils/events"
import { VirtualMachine } from "."
import { Direction, Vector3, Vector5 } from "../spatial"
import { makeMultidimArray } from "../utils/multidim"
const { min, max } = Math

/*
Tile-based water simulation
-------
TODO disallow overfull and underfull columns
TODO fix water disappearing after being in balance for ~400 steps
TODO implement momentum transfer between tiles
TODO fix interactions with floor-less columns
*/

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
     * ~If the number is higher than `ceil`, the water is
     * pressurized inside the space.~
     */
    top?: number

    /**
     * The y coordinate of the bottom of this water column,
     * undefined if the water touches the floor.
     */
    bottom?: number

    /**
     * The pressure of this column. On a free tile it's equal
     * to `top`, but if `top == ceil`, it might be higher.
     */
    pressure: number

    /**
     * Neighbouring water columns, direction to them and
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

export interface Neighbour
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
    beforeIntegration: {}
    afterIntegration: {}
}

export class WaterRunner
extends EventTarget<WaterRunnerEvents>
{
    /**
     * The multidimensional array of columns possible to fill
     * with water, in the format `[x][z][index]`.
     */
    cols: WaterColumn[][][] = []

    tickRate = .25
    damping = .5
    fluidity = .25
    bounciness = 1

    get tick(): number {
        return this.vm.tick * this.tickRate
    }

    get gravity() : number {
        return this.vm.gravity * this.tickRate
    }


    constructor(public vm: VirtualMachine, private readonly extendBox: boolean = false)
    {
        super()
        this.generateColumns()
        this.connectNeighbours()
        this.loadFromLevel()
        this.step()
    }

    private step = () =>
    {
        setTimeout(this.step, this.tick)

        this.dispatchEvent('beforeIntegration', {})
        this.integrate()
        this.dispatchEvent('afterIntegration', {})

        this.updatePressure()
        this.computeWeights()
        this.updateVelocities()
        this.dispatchEvent('tick', {})

        // diagnostics regarding issue #1:
        // let str = ""
        // for (let x = 0; x < this.cols.length; x++)
        // {
        //     str += "\n"

        //     for (let z = 0; z < this.cols[x].length;    z++)
        //     for (let i = 0; i < this.cols[x][z].length; i++)
        //     {
        //         const col = this.cols[x][z][i]
        //         str += col.pressure.toFixed(1).padStart(5) + ', '
        //     }
        // }
        // console.log(str)
    }

    allColumns = (() =>
    {
        const self = this
        return function* columnIterator()
        {
            const cols = self.cols

            const minIndex = self.extendBox ? -1 : 0

            for (let x = minIndex; x < cols.length;    x++)
            for (let z = minIndex; z < cols[x].length; z++)
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

        let xMin = 0
        let zMin = 0
        let xMax = 0
        let zMax = 0

        for (const tile of vm.allTiles())
        {
            if (tile === undefined) continue
            const {x, z} = tile.worldPosition
            xMax = max(x, xMax)
            zMax = max(z, zMax)
        }

        if (this.extendBox)
        {
            xMin -= 1
            zMin -= 1
            xMax += 1
            zMax += 1
        }


        for (let x = xMin; x <= xMax; x++)
        for (let z = zMin; z <= zMax; z++)
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

        for (const col of this.allColumns())
        {
            const top = check.waterColumnTop(col)
            const ceil = col.ceil

            if (top !== ceil)
            {
                col.pressure = top
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

    private computeWeightOfPair = (thisCol: WaterColumn, thatCol: WaterColumn): number =>
    {
        const check = this.vm.check

        const thisBottom = check.waterColumnBottom(thisCol)
        const thisPressure = thisCol.pressure
        const thatPressure = thatCol.pressure

        if (thisPressure < thatPressure) return -this.computeWeightOfPair(thatCol, thisCol)

        const thatEffectivePressure = max(thatPressure, thisBottom)
        const weight = thatEffectivePressure - thisPressure

        return weight
    }

    private computeWeights = () =>
    {
        const check = this.vm.check

        for (const col of this.allColumns())
        for (const neighbour of col.neighbours)
        {
            const { ref } = neighbour
            const weight = this.computeWeightOfPair(col, ref)

            neighbour.weight = 0

            if (Number.isNaN(weight))
                continue

            if (weight > 0 && !check.hasAnyWater(ref))
                continue

            if (weight < 0 && !check.hasAnyWater(col))
                continue

            neighbour.weight = weight
        }
    }

    private updateVelocities = () =>
    {
        const check = this.vm.check

        for (const col of this.allColumns())
        {
            const hasWater = check.hasAnyWater(col)
            const onGround = check.isWaterOnGround(col)

            // Apply damping
            for (const dir of Direction)
            {
                const k = Vector5.keyInDirection(dir)
                col.velocity[k] *= 1 - this.damping * this.tickRate
            }

            // Apply gravitational pull
            if (hasWater && !onGround)
            {
                col.velocity.y -= this.gravity * this.tickRate
            }

            // Apply gravitational spread
            for (const neighbour of col.neighbours)
            {
                const { direction, weight, ref } = neighbour
                const k = Vector5.keyInDirection(direction)
                const refOnGround = check.isWaterOnGround(ref)

                const v = weight * this.gravity * this.fluidity / 4

                if (v > 0 && onGround)
                    col.velocity[k] += v

                if (v < 0 && refOnGround)
                    col.velocity[k] += v
            }


            // Redirect invalid velocities
            for (const dir of Direction)
            {
                const k = Vector5.keyInDirection(dir)

                if (col.neighbours.every( ({ direction, weight }) => direction !== dir || weight === 0 ))
                {
                    col.velocity.y += col.velocity[k] * this.bounciness
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

                if (flux === 0) continue

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
                else // flux > 0
                {
                    const floor = col.floor ?? -Infinity
                    let bottom: number = check.waterColumnBottom(col)

                    // if there's no water, move the bottom up from the floor
                    if (!check.hasAnyWater(col))
                    {
                        let neighbourBottom = Infinity

                        for (const { ref } of col.neighbours)
                        if (check.hasAnyWater(ref))
                        {
                            neighbourBottom = min( neighbourBottom, check.waterColumnBottom(ref) )
                        }

                        if (neighbourBottom !== Infinity) bottom = max( neighbourBottom, floor )
                    }

                    const newBottom = max( floor, bottom - flux )

                    col.bottom = newBottom === floor ? undefined : newBottom
                    flux -= bottom - newBottom

                    // in case of floor == -Infinity
                    if (Number.isNaN(flux)) flux = 0

                    const top = col.top ?? floor
                    const newTop = top + flux

                    col.top = newTop === floor ? undefined : newTop
                }
            }

            // Enforce conservation of water
            // eslint-disable-next-line
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

    computeTotalVolume = (): number =>
    {
        const check = this.vm.check

        let volume = 0
        for (const col of this.allColumns())
        {
            const bottom = check.waterColumnBottom(col)
            const top = check.waterColumnTop(col)
            const diff = top - bottom

            if (!Number.isNaN(diff))
                volume += diff
        }

        return volume
    }
}
