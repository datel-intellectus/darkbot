import ScratchBlocks from "../customBlocks"
type Block = ScratchBlocks.Block

export function getTopBlock(block: Block): Block|null
{
	let previous = block.getParent()
	let top: Block|null = null

	while (previous !== null)
	{
		top = previous
		previous = top.getParent()
	}

	return top
}

export function getBottomBlock(block: Block): Block|null
{
	let next = block.getNextBlock()
	let bottom: Block|null = null

	while (next !== null)
	{
		bottom = next
		next = bottom.getNextBlock()
	}

	return bottom
}

export function appendChild(parent: Block, child: Block)
{
	parent.nextConnection.connect(child.previousConnection)
}

export function cancelInsertion(block: Block)
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
