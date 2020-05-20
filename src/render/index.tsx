import React from "react"
import { keyFor } from "../utils/keymaker"
import { VirtualMachine } from "../vm"
import { WorldView } from "./WorldView"
import { Robots } from "./Robots"
import { ViewElement } from "./ViewElement"
import { Water } from "./Water"
import { Circuit } from "./Circuit"
import { wait } from "../utils/timing"

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
            const Tile = tile.type
			tiles.push(<Tile {...tile} key={keyFor(tile)} />)
        }

        return (
            <WorldView id="worldview">
                {tiles}
                {vm.entities.list}
                <Robots  vm={vm} />
                <Water   vm={vm} />
                <Circuit vm={vm} />

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

    componentDidMount = () =>
    {
        let w = window as any
        w.start = this.onStart
        w.stop = this.onStop
        w.reset = this.onReset

        this.props.vm.addEventListener('robotChangePosition', async () => {
            await wait(0)
            this.forceUpdate()
        })
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
