import { VirtualMachine } from "."
import { Vector3, Direction } from "../spatial"
import { makeMultidimArray } from "../utils/multidim"

export class CheckRunner
{
    vm: VirtualMachine

    constructor(vm: VirtualMachine)
    {
        this.vm = vm
    }

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

    canStepUpDown = (): boolean =>
    {
        return this.canDescend() || this.canJump()
    }
}
