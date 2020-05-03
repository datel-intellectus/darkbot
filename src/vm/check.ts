import { VirtualMachine } from "."
import { Vector3, Direction } from "../spatial"
import { makeMultidimArray } from "../utils/multidim"
import { WaterColumn, Neighbour } from "./water"
import { Component } from "./circuits"

export class CheckRunner
{
    constructor(public vm: VirtualMachine) { }

    /** Checks whether there's a tile on this position */
    insideWall = (pos: Vector3): boolean =>
    {
        const { x, y, z } = pos
        makeMultidimArray(this.vm.tiles, x, z)
        return this.vm.tiles[x][z][y] !== undefined
    }

    /**
     * Checks whether there's no tile on this position,
     * but there is one under it.
     */
    onGround = (pos: Vector3): boolean =>
    {
        if (this.insideWall(pos)) return false
        if (this.insideWall({ ...pos, y: pos.y - 1 })) return true
        return false
    }

    /**
     * Checks whether there's a tile on this
     * position but none under it.
     */
    isCeiling = (pos: Vector3): boolean =>
    {
        if (!this.insideWall(pos)) return false
        if (this.insideWall({ ...pos, y: pos.y - 1 })) return false
        return true
    }

    /**
     * Finds the position of the highest on-ground tile
     * over/under this position, null if there's no ground.
     */
    highestGround = (pos: Vector3 | { x: number, z: number }): Vector3 | null =>
    {
        const { x, z } = pos
        let tiles = this.vm.tiles

        if (!Array.isArray(tiles[x]) || !Array.isArray(tiles[x][z])) return null

        for (let y = tiles[x][z].length + 1; y >= 0; y--)
        {
            if (this.onGround({ x, y, z }))
                return { x, y, z }
        }

        return null
    }

    /**
     * Checks whether this position is on ground
     * with at least 2 tiles of air above it
     */
    clearPosition = (pos: Vector3): boolean =>
    {
        if (!this.onGround(pos)) return false
        if (this.insideWall({ ...pos, y: pos.y + 1 })) return false
        return true
    }

    /**
     * Returns the position that is directly forwards
     * from the player's point of view
     */
    fwdPos = (): Vector3 =>
    {
        return Vector3.add( this.vm.playerPos, Direction.toVector3(this.vm.playerDir) )
    }

    /**
     * Checks whether the player can move
     * in the direction they're facing
     */
    canStepForward = (): boolean =>
    {
        return this.clearPosition(this.vm.playerPos) && this.clearPosition(this.fwdPos())
    }

    /**
     * Checks whether there is a tile in front of
     * the player that they could use to step down
     */
    canDescend = (): boolean =>
    {
        const nextPos = this.fwdPos()
        nextPos.y -= 1

        return (
            this.clearPosition(this.vm.playerPos) &&
            this.clearPosition(nextPos) &&
            !this.insideWall({ ...nextPos, y: nextPos.y + 2 })
        )
    }

    /**
     * Checks whether there is a tile in front of
     * the player that they could jump on
     */
    canJump = (): boolean =>
    {
        const playerPos = this.vm.playerPos
        const nextPos = this.fwdPos()
        nextPos.y += 1

        return (
            this.clearPosition(playerPos) &&
            this.clearPosition(nextPos) &&
            !this.insideWall({ ...playerPos, y: playerPos.y + 2 })
        )
    }

    /**
     * Can descend or jump?
     */
    canStepUpDown = (): boolean =>
    {
        return this.canDescend() || this.canJump()
    }

    /**
     * The bottom of the water on this column. If it's empty,
     * returns the floor, or `-Infinity` if the column has no floor.
     */
    waterColumnBottom = (col: WaterColumn): number =>
    {
        if (col.bottom !== undefined) return col.bottom
        if (col.floor !== undefined) return col.floor
        return -Infinity
    }

    /**
     * The top of the water column, or the floor if it's empty.
     */
    waterColumnTop = (col: WaterColumn): number =>
    {
        return col.top ?? this.waterColumnBottom(col)
    }

    /**
     * Is this position in water? (As opposed to in air or in a ground tile.)
     */
    inWater = (pos: Vector3): boolean =>
    {
        const {x, y, z} = pos

        const water = this.vm.water
        if (!water) return false

        const cols = (water.cols[x] ?? [])[z] ?? []

        for (const col of cols)
        {
            if (this.waterColumnTop(col) < y) continue
            if (this.waterColumnBottom(col) > y) return false
            return true
        }

        return false
    }

    /**
     * Is the water in this column touching the ground?
     */
    isWaterOnGround = (col: WaterColumn): boolean =>
    {
        return this.waterColumnBottom(col) === col.floor
    }

    /**
     *
     */
    hasAnyWater = (col: WaterColumn): boolean =>
    {
        return this.waterColumnTop(col) !== this.waterColumnBottom(col)
    }

    /**
     *
     */
    thisColumnAsNeighbour = (col: WaterColumn, neighbour: Neighbour): Neighbour | null =>
    {
        for (const nn of neighbour.ref.neighbours)
        {
            if (nn.ref === col) return nn
        }

        return null
    }

    /**
     * Returns the directions of connected components.
     * If this component is connected to a distant tile
     * (eg. a diagonal one), it throws an error.
     */
    connectionDirections = (comp: Component): Direction[] =>
    {
        return comp.connections.map(c => {
            const neighbour = c.components[0] === comp ? c.components[1] : c.components[0]

            const Δx = neighbour.x - comp.x
            const Δz = neighbour.z - comp.z

            if (Δx === 1 && Δz === 0)
                return Direction.SE

            if (Δx === 0 && Δz === 1)
                return Direction.SW

            if (Δx === -1 && Δz === 0)
                return Direction.NW

            if (Δx === 0 && Δz === -1)
                return Direction.NE

            throw new Error('Direction is not well-defined for connections over distance.')
        })
    }

    /**
     * Checks whether the values of two sets/arrays are
     * strictly equal, regardless of their order.
     */
    areSetsEqual = (set1: Set<any> | any[], set2: Set<any> | any[]): boolean =>
    {
        if (set1 instanceof Set) set1 = [...set1]
        if (set2 instanceof Set) set2 = [...set2]

        if (set1.length !== set2.length) return false

        for (const el of set1)
        {
            if (!set2.includes(el)) return false
        }

        return true
    }
}
