import React from 'react'
import { BlockView, Workspace } from './BlockView'
import { WorldView } from './WorldView'
import { Tiles } from '../tiles'
import { Robots, Direction } from '../robots'
import { VirtualMachine } from '../vm'
import levels from '../levels'
import { ViewElement } from './ViewElement'



export class App<P, S> extends React.Component<P, S>
{
	vm: VirtualMachine|null = null
	level = levels[0][0]

	getWorkspace = (workspace: Workspace) =>
	{
		this.vm = new VirtualMachine(workspace, this.level)
		this.forceUpdate()
	}

	render()
	{
		let key = 0
		const tiles = []
		if (this.vm) for (const t of this.vm.tiles)
		{
			tiles.push(<Tiles.Floor worldPosition={t} key={key++} />)
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
		);
	}

	onInsertion() {}
	onInsertionPreview() {}

	onStart = () =>
	{
		this.vm?.start()
	}

	onStop = () =>
	{
		this.vm?.stop()
	}
}

export default App;
