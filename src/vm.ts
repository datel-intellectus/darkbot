import Level from "./level"
import { Vector2, Vector3, Direction } from "./spatial"
import { Workspace } from "./components/BlockView"
import { Block } from "scratch-blocks"
import { EventTarget } from "@meta-utils/events"


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

export class VirtualMachine extends EventTarget<VirtualMachineEvents>
{
    workspace: Workspace
    blockMain: Block
    blockP1: Block
    blockP2: Block

    level: Level
    tiles: Vector3[] = []
    playerPos: Vector3 = { x: 0, y: 0, z: 0 }
    playerDir: Direction = Direction.NE

    running = false
    tick = 1000

    private currentBlockStack: Generator<Block> | undefined
    private currentBlock: Block | undefined
    private currentTimeout: ReturnType<typeof setTimeout> | undefined


    constructor(workspace: Workspace, level: Level)
    {
        super()

        this.workspace = workspace
        this.level = level

        for (let x = 0; x < level.tiles.length;    x++)
        for (let z = 0; z < level.tiles[x].length; z++)
        {
            const el = level.tiles[x][z]
            if (!el) continue
            const y = el.height
            this.tiles.push({ x, y, z })
        }

        this.resetPlayer()

        this.blockMain = workspace.blockDB_.blockMain as Block
        this.blockP1 = workspace.blockDB_.blockP1 as Block
        this.blockP2 = workspace.blockDB_.blockP2 as Block

        (window as any).virtualMachine = this
    }

    private resetPlayer = () =>
    {
        const level = this.level
        const player = level.player
        this.playerDir = player.startingDirection
        this.playerPos = Vector2.toVector3(player.startingPosition)
        const pp = this.playerPos

        if (level.tiles[pp.x] && level.tiles[pp.x][pp.z])
            this.playerPos.y = level.tiles[pp.x][pp.z]!.height + 1
    }

    start()
    {
        if (this.running) return
        this.resetPlayer()
        this.running = true
        this.currentBlockStack = this.blockGenerator(this.blockMain)
        this.step()
    }

    stop()
    {
        this.currentBlock?.setGlowBlock(false)
        this.currentBlock = undefined
        this.currentBlockStack = undefined
        this.running = false
        clearTimeout(this.currentTimeout!)
    }

    private step = () =>
    {
        if (!this.running) return
        this.currentTimeout = setTimeout(this.step, this.tick)

        const next = this.currentBlockStack!.next()

        if (next.done)
            return this.stop()

        const block = next.value
        this.currentBlock?.setGlowBlock(false)
        this.currentBlock = block
        block.setGlowBlock(true)

        const eventSource = { source: this }

        switch (block.type)
        {
            case 'control_forward':
            {
                if (!this.canStepForward()) break

                const oldPos = this.playerPos
                const newPos = Vector3.add( oldPos, Direction.toVector3(this.playerDir) )
                this.playerPos = newPos

                const posUpdate = { oldPosition: oldPos, newPosition: newPos }
                const dirUpdate = { oldDirection: this.playerDir, newDirection: this.playerDir }

                this.dispatchEvent('robotMove', { ...posUpdate, ...eventSource })
                this.dispatchEvent('robotWalk', { ...posUpdate, ...eventSource })
                this.dispatchEvent('robotChangePosition', { ...posUpdate, ...dirUpdate, ...eventSource })

                break
            }

            case 'control_turn_right':
            case 'control_turn_left':
            {
                const oldDir = this.playerDir
                const newDir =
                    block.type === 'control_turn_right' ?
                    Direction.turnCW(oldDir) :
                    Direction.turnCCW(oldDir)

                this.playerDir = newDir

                const posUpdate = { oldPosition: this.playerPos, newPosition: this.playerPos }
                const dirUpdate = { oldDirection: oldDir, newDirection: newDir }

                this.dispatchEvent('robotTurn', { ...dirUpdate, ...eventSource })
                this.dispatchEvent('robotChangePosition', { ...posUpdate, ...dirUpdate, ...eventSource })

                break
            }

            case 'control_jump':
            {
                let y = 0
                if (this.canJump()) y = 1
                if (this.canDescend()) y = -1
                if (y === 0) break

                const oldPos = this.playerPos
                const newPos = Vector3.add( oldPos, { ...Direction.toVector3(this.playerDir), y } )
                this.playerPos = newPos

                const posUpdate = { oldPosition: oldPos, newPosition: newPos }
                const dirUpdate = { oldDirection: this.playerDir, newDirection: this.playerDir }

                this.dispatchEvent('robotMove', { ...posUpdate, ...eventSource })
                this.dispatchEvent('robotJump', { ...posUpdate, ...eventSource })
                this.dispatchEvent('robotChangePosition', { ...posUpdate, ...dirUpdate, ...eventSource })

                break
            }

            default:
                console.log('unknown command')
        }
    }

    private blockGenerator = (() =>
    {
        const self = this
        return function* blockGenerator(block: Block): Generator<Block, void, unknown>
        {
            while (block = block.getNextBlock() as Block)
            {
                switch (block.type)
                {
                    case 'control_p1':
                        yield* blockGenerator(self.blockP1)
                        break

                    case 'control_p2':
                        yield* blockGenerator(self.blockP2)
                        break

                    default:
                        yield block
                }
            }
        }
    })()




    /** Checks whether there's a tile on this position */
    private insideWall = (pos: Vector3): boolean =>
    {
        const coords = ['x', 'y', 'z'] as const

        for (const tile of this.tiles)
            if (coords.every(_ => tile[_] === pos[_]))
                return true

        return false
    }

    /**
     * Checks whether there's no tile on this position,
     * but there is one under it.
     */
    private onGround = (pos: Vector3): boolean =>
    {
        if (this.insideWall(pos)) return false
        if (this.insideWall({ ...pos, y: pos.y - 1 })) return true
        return false
    }

    /**
     * Checks whether this position is on ground
     * with at least 2 tiles of air above it
     */
    private clearPosition = (pos: Vector3): boolean =>
    {
        if (!this.onGround(pos)) return false
        if (this.insideWall({ ...pos, y: pos.y + 1 })) return false
        return true
    }

    /**
     * Returns the position that is directly forwards
     * from the player's point of view
     */
    private fwdPos = (): Vector3 =>
    {
        return Vector3.add( this.playerPos, Direction.toVector3(this.playerDir) )
    }

    /**
     * Checks whether the player can move
     * in the direction they're facing
     */
    private canStepForward = (): boolean =>
    {
        return this.clearPosition(this.playerPos) && this.clearPosition(this.fwdPos())
    }

    /**
     * Checks whether there is a tile in front of
     * the player that they could use to step down
     */
    private canDescend = (): boolean =>
    {
        const nextPos = this.fwdPos()
        nextPos.y -= 1

        return (
            this.clearPosition(this.playerPos) &&
            this.clearPosition(nextPos) &&
            !this.insideWall({ ...nextPos, y: nextPos.y + 2 })
        )
    }

    /**
     * Checks whether there is a tile in front of
     * the player that they could jump on
     */
    private canJump = (): boolean =>
    {
        const playerPos = this.playerPos
        const nextPos = this.fwdPos()
        nextPos.y += 1

        return (
            this.clearPosition(playerPos) &&
            this.clearPosition(nextPos) &&
            !this.insideWall({ ...playerPos, y: playerPos.y + 2 })
        )
    }

    private canStepUpDown = (): boolean =>
    {
        return this.canDescend() || this.canJump()
    }

}

