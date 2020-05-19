import { Block } from "scratch-blocks"
import ScratchBlocks from "../customBlocks"
type WeakBlock = ScratchBlocks.Block
type Workspace = ScratchBlocks.Workspace

export function getTopBlock(block: WeakBlock): Block|null
{
	let previous = block.getParent()
	let top: WeakBlock|null = null

	while (previous !== null)
	{
		top = previous
		previous = top.getParent()
	}

	return top as Block
}

export function getBottomBlock(block: WeakBlock): Block|null
{
	let next = block.getNextBlock()
	let bottom: WeakBlock|null = null

	while (next !== null)
	{
		bottom = next
		next = bottom.getNextBlock()
	}

	return bottom as Block
}

export function countChildren(block: WeakBlock): number
{
	let next = block.getNextBlock()
	let count = 0

	while (next !== null)
	{
		count++
		next = next.getNextBlock()
	}

	return count
}

export function appendChild(parent: WeakBlock, child: WeakBlock)
{
	parent.nextConnection.connect(child.previousConnection)
}

export function cancelInsertion(block: WeakBlock)
{
	const next = block.getNextBlock() as Block|null
	const prev = block.getPreviousBlock() as Block|null

	// no idea why can't we dispose now
	// blockly api is black magic
	block.unplug()

	if (prev && next)
		appendChild(prev, next)

	block.dispose(false)
}


export function createBlock(
	workspace: Workspace,
	prototypeName: string,
	options: Partial<{
		id: string,
		insertionMarker: boolean
	}> = {}): Block
{
	// https://stackoverflow.com/questions/56234377/how-to-render-a-block-in-blockly

	const block = workspace.newBlock(prototypeName, options.id) as Block

	if (options.insertionMarker) block.setInsertionMarker(true)

	block.initSvg()
	block.render()
	return block
}
