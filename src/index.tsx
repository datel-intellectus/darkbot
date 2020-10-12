import React from 'react'
import ReactDOM from 'react-dom'
import TWEEN from '@tweenjs/tween.js'
import './index.css'
import { App } from './App'
import * as serviceWorker from './serviceWorker'
import { VirtualMachine } from './vm'
import { Workspace } from './components/BlockView'
import { appendChild, createBlock, getBottomBlock, countChildren } from './utils/scratchBlocks'
import { Block } from 'blockly'
import { range } from './utils/iterable'
import { wait, createPromise } from './utils/timing'
import levels from './levels'
import Level from './level'
import { Tiles, Tile_Props } from './render/tiles'
import { Vector3 } from './spatial'
import { WaterRunner } from './vm/water'
import { ViewElement } from './render/ViewElement'
const { min } = Math

type Writealso<T> = { -readonly [P in keyof T]: T[P]; }


declare let window: Window & {
	virtualMachine: VirtualMachine,
	workspaces: { blocks: Workspace },
	level: Level,
	start: () => void,
	stop: () => void,
	reset: () => void,
	forceUpdate: () => void,
	flowerState: number
}

window.level = levels[1][0]

ReactDOM.render(
	<App />,
	document.getElementById('root')
)


const animate = (time: number) =>
{
	requestAnimationFrame(animate)
	TWEEN.update(time)
}
requestAnimationFrame(animate)


window.addEventListener('keydown', async e =>
{
	let vm = window.virtualMachine
	let ws = window.workspaces.blocks

	const blockMain = ws.blockDB_.blockMain
	const writableVm = vm as Writealso<typeof vm>

	switch(e.key)
	{
		// shadow animation
		case 'm':
		{
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
		}

		case 'r':
		{
			window.reset()
			writableVm.water = new WaterRunner(vm)
			break
		}

		case ' ':
		{
			window.start()
			break
		}

		case 'Escape':
		{
			window.stop()
			break
		}

	}

})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
