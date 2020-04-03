import React from "react"
import ScratchBlocks from "scratch-blocks/dist/horizontal"

let id = 0
function generateId() {
    return id++
}

export default class Blocks<P, S> extends React.Component<P, S>
{
    id = "blocks-" + generateId()
    workspace: any

    render() {
        return <div id={this.id} className="blocks" />
    }

    componentDidMount() {
        this.workspace = ScratchBlocks.inject(this.id, {
            horizontalLayout: true,
            media: './media/'
        })
    }
}