import React from 'react'
import ReactDOM from 'react-dom'
import TWEEN from '@tweenjs/tween.js'
import './index.css'
import App from './components/App'
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

		case 'i':
		{
			window.flowerState = 0
			window.forceUpdate()
			break
		}

		case 'o':
		{
			const col = vm.water.cols[1][1][1]
			let top = vm.check.waterColumnTop(col)

			const animate = () =>
			{
				if (vm === window.virtualMachine) requestAnimationFrame(animate)
				top = min(top + 0.005, 1.5)
				col.top = top
			}

			animate()
			break
		}

		case 'p':
		{
			for (const i of range(6))
			{
				window.flowerState = i
				window.forceUpdate()
				await wait(500)
			}
			break
		}


		case 'l':
		{
			const steel = Array.from(vm.allTiles()).filter(t => t.type === Tiles.Steel)[0]
			if (!steel) return

			const coords = steel.worldPosition
			let oldCoords = {...coords}
			let newCoords: Vector3 | undefined

			if (window.level.episode === 5) newCoords = {x: 3, y: 1, z: 3}
			if (window.level.episode === 6) newCoords = {x: 2, y: 1, z: 6}
			if (!newCoords) return

			const animationCompleted = createPromise()

			new TWEEN.Tween(coords)
			.to(newCoords, 1000)
			.easing(TWEEN.Easing.Exponential.In)
			.onUpdate(window.forceUpdate)
			.onComplete(animationCompleted.resolve)
			.start()

			await animationCompleted.promise

			vm.tiles[newCoords.x][newCoords.z][newCoords.y] = steel
			writableVm.water = new WaterRunner(vm)

			if (window.level.episode === 6)
			{
				const waterTile: Tile_Props = {
					worldPosition: oldCoords,
					type: Tiles.StaticWater
				}
				vm.tiles[oldCoords.x][oldCoords.z][oldCoords.y] = waterTile

				window.forceUpdate()

				const col = vm.water.cols[oldCoords.x][oldCoords.z+1][1]
				let top = vm.check.waterColumnTop(col)

				const animate = () =>
				{
					if (vm === window.virtualMachine) requestAnimationFrame(animate)
					top = min(top + 0.02, 2)
					col.top = top
				}

				animate()
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

		case '1':
		{
			window.level = levels[1][0]
			window.forceUpdate()
			break
		}

		case '2':
			window.level = levels[1][1]
			window.forceUpdate()
			break

		case '3':
			window.level = levels[1][2]
			window.forceUpdate()
			break

		case '4':
			window.level = levels[1][3]
			window.flowerState = 0
			window.forceUpdate()
			break


		case '5':
			window.level = levels[1][4]
			window.forceUpdate()
			break

		case '6':
			window.level = levels[1][5]
			window.flowerState = 0
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
