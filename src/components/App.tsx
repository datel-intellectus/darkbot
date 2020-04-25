import React from 'react'
import { BlockView, Workspace } from './BlockView'
import levels from '../levels'
import { VirtualMachine } from '../vm'
import { Render } from '../render'



export class App<P, S> extends React.Component<P, S>
{
	vm: VirtualMachine|undefined = undefined
	level = levels[0][0]

	getWorkspace = (workspace: Workspace) =>
	{
		this.vm = new VirtualMachine(workspace, this.level)
		this.forceUpdate()
	}

	render()
	{

		return (
			<div className="expand flex">
				<BlockView
					id="blocks"
					onInsertion={this.onInsertion}
					onInsertionPreview={this.onInsertionPreview}
					getWorkspace={this.getWorkspace}
				/>
				{ this.vm === undefined ? [] : <Render vm={this.vm} /> }
			</div>
		)
	}

	onInsertion() {}
	onInsertionPreview() {}

}

export default App
