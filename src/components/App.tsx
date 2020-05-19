import React from 'react'
import { BlockView, Workspace } from './BlockView'
import { VirtualMachine } from '../vm'
import { Render } from '../render'



export class App<P, S> extends React.Component<P, S>
{
	vm: VirtualMachine|undefined = undefined
	level = (window as any).level

	getWorkspace = (workspace: Workspace) =>
	{
		this.vm = new VirtualMachine(workspace, this.level)
		this.forceUpdate()
	}

	render()
	{
		console.log('a')

		if (this.level !== (window as any).level)
		{
			console.log('aaa')
			this.level = (window as any).level
			this.vm = new VirtualMachine(this.vm!.workspace, this.level)
		}

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

	componentDidMount = () =>
	{
		const w = window as any
        w.forceUpdate = () => this.forceUpdate()
	}

	onInsertion() {}
	onInsertionPreview() {}

}

export default App
