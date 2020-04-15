import React from "react"
import ScratchBlocks from "../customBlocks"
import { getTopBlock } from "../utils/scratchBlocks"
type Block = ScratchBlocks.Block
interface MoveEvent extends ScratchBlocks.Events.Move
{
	oldParentId?: string,
	oldInputName: any,
	newCoordinate?: { x: number, y: number },
	newInputName: any,
	newParentId?: string
}

export interface Workspace
extends ScratchBlocks.WorkspaceSvg
{
	blockDB_:
	{
		[id: string]: Block | undefined

		blockMain: Block
		blockP1: Block
		blockP2: Block
	}
}

let id = 0
function generateId() {
	return id++
}

function isIdUnique(id: string) {
	return document.getElementById(id) === null
}

let global:
	typeof window &
	{ workspaces?: { [id: string]: Workspace } }
	= window


export interface BlockViewProps
extends React.Props<unknown>
{
	id?: string,
	onInsertion?: (block: Block, parent: Block) => void,
	onInsertionPreview?: (marker: Block, parent: Block) => void,
	getWorkspace?: (workspace: Workspace) => void
}

export class BlockView<P extends BlockViewProps = BlockViewProps, S = {}>
extends React.Component<P, S>
{
	id: string =
		this.props.id && isIdUnique(this.props.id!)
		? this.props.id!
		: "blocks" + generateId()

	workspace: Workspace | null = null

	blockMain: Block|null = null
	blockP1: Block|null = null
	blockP2: Block|null = null

	render() {
		return <div id={this.id} className="expand blocks" />
	}

	componentDidMount()
	{
		// Set up Scratch Blocks

		this.workspace = ScratchBlocks.inject(this.id, {
			horizontalLayout: false,
			media: './scratch-blocks-media/',
			comments: false,
			toolbox: document.getElementById('config-toolbox')!
		}) as Workspace

		this.workspace.getInjectionDiv().classList.add('expand')

		const workspaceConfig = document.getElementById('config-workspace')!
		ScratchBlocks.Xml.domToWorkspace(workspaceConfig, this.workspace)


		// Set up debugging hooks

		if (!global.workspaces)
			global.workspaces = {}

		global.workspaces[this.id] = this.workspace


		// Remember parents

		this.blockMain = this.workspace.getBlockById('blockMain')
		this.blockP1 = this.workspace.getBlockById('blockP1')
		this.blockP2 = this.workspace.getBlockById('blockP1')


		// Detect insertion preview

		const detectInsertionMarkers =
		(e: any) =>
		{
			const blockDB: { [id: string]: ScratchBlocks.Block } = (this.workspace as any).blockDB_
			const blocks = Object.values(blockDB)

			for (const block of blocks)
			{
				if (!block.isInsertionMarker()) continue

				let parent = getTopBlock(block)
				if (!parent) return

				let onInsertionPreview = this.props.onInsertionPreview
				if (onInsertionPreview) onInsertionPreview(block, parent)
			}
		}

		this.workspace.addChangeListener(detectInsertionMarkers)
		window.addEventListener('mousemove', detectInsertionMarkers, true)


		// Detect insertion

		this.workspace.addChangeListener(
			(e: MoveEvent) =>
			{
				if (e.type !== 'move') return
				if (e.oldParentId) return

				const block = this.workspace!.getBlockById(e.blockId)
				if (!block) return

				const parent = getTopBlock(block)
				if (!parent) return

				let onInsertion = this.props.onInsertion
				if (onInsertion) onInsertion(block, parent)
			}
		)

		if (this.props.getWorkspace)
			this.props.getWorkspace(this.workspace)
	}
}
