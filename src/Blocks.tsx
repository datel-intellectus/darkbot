import React from "react"
import ScratchBlocks from "./customBlocks"

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
            horizontalLayout: false,
            media: './media/',
            comments: false,
            toolbox: document.getElementById('config-toolbox')!
        })

        const workspaceConfig = document.getElementById('config-workspace')!
        ScratchBlocks.Xml.domToWorkspace(workspaceConfig, this.workspace)
    }
}