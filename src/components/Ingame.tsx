import React from 'react'
import { BlockView, Workspace } from './BlockView'
import { VirtualMachine } from '../vm'
import { Render } from '../render'
import Level from '../level'
import levels from "../levels"

export interface IngameProps
{
	series: number
	episode: number
	launchLevel: (s: number, e: number) => void
	goToLevelSelect: () => void
}

interface IngameState
{
	vm?: VirtualMachine
	level: Level
}

export class Ingame extends React.Component<IngameProps, IngameState>
{
	state: IngameState = {
		vm: undefined,
		level: levels[this.props.series-1][this.props.episode-1]
	}

	componentDidUpdate(prevProps: IngameProps, prevState: IngameState)
	{
		const { series, episode } = this.props
		if (prevProps.series !== series || prevProps.episode !== episode)
		{
			const level = levels[series-1][episode-1]
			this.setState({ level })

			if (this.state.vm)
			{
				const { workspace } = this.state.vm
				const vm = new VirtualMachine(workspace, level)
				this.setState({ vm })

				const w = window as any
				w.vm = vm
			}
		}
	}

	getWorkspace = (workspace: Workspace) =>
	{
		const vm = new VirtualMachine(workspace, this.state.level)
		this.setState({ vm })

		const w = window as any
		w.vm = vm
	}

	render()
	{
		const w = window as any
		w.forceUpdate = () => this.forceUpdate()

		const { vm } = this.state
		const { goToLevelSelect } = this.props

		return (
			<div className="expand flex">
				<BlockView
					id="blocks"
					onInsertion={this.onInsertion}
					onInsertionPreview={this.onInsertionPreview}
					getWorkspace={this.getWorkspace}
				/>
				{ vm && <Render vm={vm} goToLevelSelect={goToLevelSelect} /> }
			</div>
		)
	}

	onInsertion() {}
	onInsertionPreview() {}

}

export default Ingame
