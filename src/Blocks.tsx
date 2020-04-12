import React from "react"
import ScratchBlocks from "./customBlocks"
type Block = ScratchBlocks.Block
interface MoveEvent extends ScratchBlocks.Events.Move
{
    oldParentId?: string,
    oldInputName: any,
    newCoordinate?: { x: number, y: number },
    newInputName: any,
    newParentId?: string
}

let id = 0
function generateId() {
    return id++
}

let global:
    typeof window &
    { workspaces?: { [id: string]: ScratchBlocks.WorkspaceSvg } }
    = window


export default class Blocks<P, S> extends React.Component<P, S>
{
    id = "blocks" + generateId()
    workspace: ScratchBlocks.WorkspaceSvg | null = null

    blockMain: Block|null = null
    blockP1: Block|null = null
    blockP2: Block|null = null

    render() {
        return <div id={this.id} className="blocks" />
    }

    componentDidMount()
    {
        // Set up Scratch Blocks

        this.workspace = ScratchBlocks.inject(this.id, {
            horizontalLayout: false,
            media: './media/',
            comments: false,
            toolbox: document.getElementById('config-toolbox')!
        })

        const workspaceConfig = document.getElementById('config-workspace')!
        ScratchBlocks.Xml.domToWorkspace(workspaceConfig, this.workspace)


        // Set up debugging hooks

        if (!global.workspaces)
            global.workspaces = {}

        global.workspaces[this.id] = this.workspace


        // Remember parents

        this.blockMain = this.workspace.getBlockById('blockMain')
        this.blockP1 = this.workspace.getBlockById('blockP1')
        this.blockP2 = this.workspace.getBlockById('blockP1')


        // Detect insertion preview

        const detectInsertionMarkers =
        (e: any) =>
        {
            const blockDB: { [id: string]: ScratchBlocks.Block } = (this.workspace as any).blockDB_
            const blocks = Object.values(blockDB)

            for (const block of blocks)
            {
                if (!block.isInsertionMarker()) continue

                let parent = getTopBlock(block)
                if (!parent) return

                this.onInsertionPreview(block, parent)
            }
        }

        this.workspace.addChangeListener(detectInsertionMarkers)
        window.addEventListener('mousemove', detectInsertionMarkers, true)


        // Detect insertion

        this.workspace.addChangeListener(
            (e: MoveEvent) =>
            {
                if (e.type !== 'move') return
                if (e.oldParentId) return

                const block = this.workspace!.getBlockById(e.blockId)
                if (!block) return

                const parent = getTopBlock(block)
                if (!parent) return

                this.onInsertion(block, parent)
            }
        )
    }

    onInsertionPreview(marker: Block, parent: Block)
    {
        marker.setColour('#ff0000')
    }

    onInsertion(block: Block, parent: Block)
    {
        cancelInsertion(block)
    }


}

function getTopBlock(block: Block): Block|null
{
    let previous = block.getParent()
    let top: Block|null = null

    while (previous !== null)
    {
        top = previous
        previous = top.getParent()
    }

    return top
}

function getBottomBlock(block: Block): Block|null
{
    let next = block.getNextBlock()
    let bottom: Block|null = null

    while (next !== null)
    {
        bottom = next
        next = bottom.getNextBlock()
    }

    return bottom
}

function appendChild(parent: Block, child: Block)
{
    parent.nextConnection.connect(child.previousConnection)
}

function cancelInsertion(block: Block)
{
    const next = block.getNextBlock() as Block|null
    const prev = block.getPreviousBlock() as Block|null

    // no idea why can't we dispose now
    // blockly api is black magic
    block.unplug()

    if (prev && next)
        appendChild(prev, next)

    block.dispose(false)
}
