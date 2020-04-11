import React from "react"
import ScratchBlocks from "./customBlocks"
type Block = ScratchBlocks.Block

let id = 0
function generateId() {
    return id++
}


export default class Blocks<P, S> extends React.Component<P, S>
{
    id = "blocks-" + generateId()
    workspace: ScratchBlocks.WorkspaceSvg | null = null

    blockMain: Block|null = null
    blockP1: Block|null = null
    blockP2: Block|null = null

    render() {
        return <div id={this.id} className="blocks" />
    }

    componentDidMount() {
        this.workspace = ScratchBlocks.inject(this.id, {
            horizontalLayout: false,
            media: './media/',
            comments: false,
            toolbox: document.getElementById('config-toolbox')!
        })

        const workspaceConfig = document.getElementById('config-workspace')!
        ScratchBlocks.Xml.domToWorkspace(workspaceConfig, this.workspace)

        this.blockMain = this.workspace.getBlockById('blockMain')
        this.blockP1 = this.workspace.getBlockById('blockP1')
        this.blockP2 = this.workspace.getBlockById('blockP1')

        const detectInsertionMarkers =
        (e: any) =>
        {
            const blockDB: { [id: string]: ScratchBlocks.Block } = (this.workspace as any).blockDB_
            const blocks = Object.values(blockDB)

            for (const block of blocks)
            {
                if (!block.isInsertionMarker()) continue

                let parent = getTopStackBlock(block)
                if (!parent) return

                this.onInsertionPreview(block, parent)
            }
        }

        this.workspace!.addChangeListener(detectInsertionMarkers)
        window.addEventListener('mousemove', detectInsertionMarkers, true)

    }

    onInsertionPreview(marker: Block, parent: Block)
    {
        marker.setColour('#ff0000')
        console.log(parent.id)
    }


}

function getTopStackBlock(block: Block): Block|null
{
    let previous = block.getParent()
    let parent: Block|null = null

    while (previous !== null)
    {
        parent = previous
        previous = parent.getParent()
    }

    return parent
}