import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import { VirtualMachine } from './vm'
import { Workspace } from './components/BlockView'
import { appendChild, createBlock, getBottomBlock, countChildren } from './utils/scratchBlocks'
import { Block } from 'blockly'
import { range } from './utils/iterable'
import { wait } from './utils/timing'
import levels from './levels'
import Level from './level'


declare let window: Window & {
	virtualMachine: VirtualMachine,
	workspaces: { blocks: Workspace },
	level: Level,
	start: () => void,
	stop: () => void,
	reset: () => void,
	forceUpdate: () => void
}

window.level = levels[1][0]

ReactDOM.render(
		<App />,
	document.getElementById('root')
)

window.addEventListener('keydown', async e =>
{
	const vm = window.virtualMachine
	const ws = window.workspaces.blocks

	const blockMain = ws.blockDB_.blockMain

	switch(e.key)
	{
		// shadow animation
		case 'm':

			let prev = getBottomBlock(blockMain) ?? blockMain
			let list: Block[] = []

			for (const i of range(5 - countChildren(blockMain)))
			{
				const shadow = createBlock(ws, "control_forward", { insertionMarker: true })
				appendChild(prev, shadow)
				list.push(shadow)
				prev = shadow
				await wait(250)
			}

			for (const shadow of list)
			{
				shadow.unplug()
				shadow.dispose(true)
				await wait(250)
			}

			break


		case 'r':
			window.reset()
			break


		case ' ':
			window.start()
			break


		case 'Escape':
			window.stop()
			break


		case '1':
			window.level = levels[1][0]
			window.forceUpdate()
			break

		case '2':
			window.level = levels[1][1]
			window.forceUpdate()
			break

		default:
			console.log(e.key)
			break
	}

})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
