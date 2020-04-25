import React from "react"
import { keyFor } from "../utils/keymaker"
import { VirtualMachine } from "../vm"
import { Tiles } from "./tiles"
import { WorldView } from "./WorldView"
import { Robots } from "./Robots"
import { ViewElement } from "./ViewElement"
import { Water } from "./Water"

// export namespace Render
// {
//     export interface Props
//     {
//         vm: VirtualMachine
//     }
// }
// babel pls

export interface RenderProps
{
    vm: VirtualMachine
}

interface RenderState
{
    reset: boolean
}

export class Render
extends React.Component<RenderProps, RenderState>
{

    state = { reset: false }

    render()
    {
        const vm = this.props.vm
        const tiles = []

		for (const tile of vm.allTiles())
		{
			if (!tile) continue
			tiles.push(<Tiles.Floor {...tile} key={keyFor(tile)} />)
        }

        return (
            <WorldView id="worldview">
                {tiles}
                <Robots vm={vm} />
                <Water  vm={vm} />
                <ViewElement worldPosition={{x:0,y:0,z:0}} screenOffset={{x:-200,y:-200}}>
                    {
                        this.state.reset
                        ? <button onClick={this.onReset}>Reset</button>
                        : <button onClick={this.onStart}>Start</button>
                    }
                    <button onClick={this.onStop}>Stop</button>
                </ViewElement>
            </WorldView>
        )
    }

	onStart = () =>
	{
        this.props.vm.blocks?.start()
        this.setState({ reset: true })
	}

	onStop = () =>
	{
		this.props.vm.blocks?.stop()
    }

    onReset = () =>
    {
        this.props.vm.blocks?.stop()
        this.props.vm.resetPlayer()
        this.setState({ reset: false })
    }
}