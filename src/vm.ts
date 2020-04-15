import Level from "./level";
import { Vector3 } from "./components/ViewElement";
import { Direction } from "./robots";
import { Workspace } from "./components/BlockView";
import { Block } from "scratch-blocks";

export class VirtualMachine
{
    workspace: Workspace
    blockMain: Block
    blockP1: Block
    blockP2: Block

    level: Level
    tiles: Vector3[] = []
    playerPos: Vector3
    playerDir: Direction

    running = false
    tick = 1000
    currentBlockStack: Generator<Block> | undefined
    currentBlock: Block | undefined


    constructor(workspace: Workspace, level: Level)
    {
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

        const player = level.player
        this.playerDir = player.startingDirection
        this.playerPos = { x: player.startingPosition.x, z: player.startingPosition.y, y: 0 }
        const pp = this.playerPos

        if (level.tiles[pp.x] && level.tiles[pp.x][pp.z])
            this.playerPos.y = level.tiles[pp.x][pp.z]!.height

        this.blockMain = workspace.blockDB_.blockMain as Block
        this.blockP1 = workspace.blockDB_.blockP1 as Block
        this.blockP2 = workspace.blockDB_.blockP2 as Block
    }

    start()
    {
        if (this.running) return
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
    }

    private step = () =>
    {
        if (!this.running) return
        setTimeout(this.step, this.tick)

        const next = this.currentBlockStack!.next()

        if (next.done)
            return this.stop()

        const block = next.value
        this.currentBlock?.setGlowBlock(false)
        this.currentBlock = block
        block.setGlowBlock(true)

        switch (block.type)
        {
            case 'control_forward':
                console.log('forward')
                break

            case 'control_turn_right':
                console.log('turn right')
                break

            case 'control_turn_left':
                console.log('turn left')
                break

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

}

