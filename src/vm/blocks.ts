import { Block } from "scratch-blocks"
import { Vector3, Direction } from "../spatial"
import { VirtualMachine } from "."
import { CheckRunner } from "./check"

export class BlockRunner
{
    get check(): CheckRunner
    {
        return this.vm.check
    }

    blockMain: Block
    blockP1: Block
    blockP2: Block

    running = false
    tick = 1000

    private currentBlockStack: Generator<Block> | undefined
    private currentBlock: Block | undefined
    private currentTimeout: ReturnType<typeof setTimeout> | undefined

    constructor(public vm: VirtualMachine)
    {
        this.blockMain = vm.workspace.blockDB_.blockMain as Block
        this.blockP1 = vm.workspace.blockDB_.blockP1 as Block
        this.blockP2 = vm.workspace.blockDB_.blockP2 as Block
    }

    start()
    {
        if (this.running) return
        this.vm.resetPlayer()
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
        const vm = this.vm
        const check = this.check

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
                if (!check.canStepForward()) break

                const oldPos = vm.playerPos
                const newPos = Vector3.add( oldPos, Direction.toVector3(vm.playerDir) )
                vm.playerPos = newPos

                const posUpdate = { oldPosition: oldPos, newPosition: newPos }
                const dirUpdate = { oldDirection: vm.playerDir, newDirection: vm.playerDir }

                vm.dispatchEvent('robotMove', { ...posUpdate, ...eventSource })
                vm.dispatchEvent('robotWalk', { ...posUpdate, ...eventSource })
                vm.dispatchEvent('robotChangePosition', { ...posUpdate, ...dirUpdate, ...eventSource })

                break
            }

            case 'control_turn_right':
            case 'control_turn_left':
            {
                const oldDir = vm.playerDir
                const newDir =
                    block.type === 'control_turn_right' ?
                    Direction.turnCW(oldDir) :
                    Direction.turnCCW(oldDir)

                vm.playerDir = newDir

                const posUpdate = { oldPosition: vm.playerPos, newPosition: vm.playerPos }
                const dirUpdate = { oldDirection: oldDir, newDirection: newDir }

                vm.dispatchEvent('robotTurn', { ...dirUpdate, ...eventSource })
                vm.dispatchEvent('robotChangePosition', { ...posUpdate, ...dirUpdate, ...eventSource })

                break
            }

            case 'control_jump':
            {
                let y = 0
                if (check.canJump()) y = 1
                if (check.canDescend()) y = -1
                if (y === 0) break

                const oldPos = vm.playerPos
                const newPos = Vector3.add( oldPos, { ...Direction.toVector3(vm.playerDir), y } )
                vm.playerPos = newPos

                const posUpdate = { oldPosition: oldPos, newPosition: newPos }
                const dirUpdate = { oldDirection: vm.playerDir, newDirection: vm.playerDir }

                vm.dispatchEvent('robotMove', { ...posUpdate, ...eventSource })
                vm.dispatchEvent('robotJump', { ...posUpdate, ...eventSource })
                vm.dispatchEvent('robotChangePosition', { ...posUpdate, ...dirUpdate, ...eventSource })

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
}
