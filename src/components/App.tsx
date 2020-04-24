import React from 'react'
import { Direction } from '../spatial'

import { BlockView, Workspace } from './BlockView'
import { WorldView } from './WorldView'
import { ViewElement } from './ViewElement'

import levels from '../levels'
import { Tiles } from '../tiles'
import { Robots } from '../robots'
import { VirtualMachine } from '../vm'

import { keyFor } from "../utils/keymaker"



export class App<P, S> extends React.Component<P, S>
{
	vm: VirtualMachine|null = null
	level = levels[0][0]

	getWorkspace = (workspace: Workspace) =>
	{
		this.vm = new VirtualMachine(workspace, this.level)
		this.vm.addEventListener('robotChangePosition', this.onPlayerMove)
		this.forceUpdate()
	}

	render()
	{
		const tiles = []

		if (this.vm)
		for (const slice of this.vm.tiles)
		for (const column of slice)
		for (const tile of column)
		{
			if (!tile) continue
			tiles.push(<Tiles.Floor {...tile} key={keyFor(tile)} />)
		}

		const pd = this.vm ? this.vm.playerDir : Direction.NE
		const pp = this.vm ? this.vm.playerPos : {x:0,y:0,z:0}

		return (
			<div className="expand flex">
				<BlockView
					id="blocks"
					onInsertion={this.onInsertion}
					onInsertionPreview={this.onInsertionPreview}
					getWorkspace={this.getWorkspace}
				/>
				<WorldView id="worldview">
					{tiles}
					<Robots.BotA direction={pd} worldPosition={pp} />
					<ViewElement worldPosition={{x: 0,y:0,z:0}} screenOffset={{x:-200,y:-200}}>
						<button onClick={this.onStart}>Start</button>
						<button onClick={this.onStop}>Stop</button>
					</ViewElement>
				</WorldView>
			</div>
		)
	}

	onInsertion() {}
	onInsertionPreview() {}

	onStart = () =>
	{
		this.vm?.blocks?.start()
	}

	onStop = () =>
	{
		this.vm?.blocks?.stop()
	}

	onPlayerMove = () =>
	{
		this.forceUpdate()
	}
}

export default App
