import { VirtualMachine } from "."
import { Vector3, Direction } from "../spatial"
import { makeMultidimArray } from "../utils/multidim"
import { WaterColumn } from "./water"

type Neighbour = WaterColumn['neighbours'][0]

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
}
