import React from "react"
import { Vector2 } from "../spatial"


// WorldContext

export interface WorldContext
{
	worldDimensions: Vector2
}

export const WorldContext = React.createContext<WorldContext>({
	worldDimensions: { x: 0, y: 0 }
});


// WorldView

export interface WorldViewProps
extends React.Props<any>
{
	id?: string
}

export interface WorldViewState
{
	width: number,
	height: number
}

export class WorldView<P extends WorldViewProps = WorldViewProps>
extends React.Component<P, WorldViewState>
{
	element = React.createRef<HTMLDivElement>()

	state = {
		width: 0,
		height: 0
	}

	render()
	{
		return <div id={this.props.id} ref={this.element}>
			<WorldContext.Provider value={this.makeContext()}>
				{this.props.children}
			</WorldContext.Provider>
		</div>
	}

	makeContext = (): WorldContext =>
	{
		return {
			worldDimensions: { x: this.state.width, y: this.state.height }
		}
	}

	componentDidMount()
	{
		new ResizeObserver(this.onResize).observe(this.element.current!)
		this.onResize()
	}

	onResize = () =>
	{
		let boundingRect = this.element.current!.getBoundingClientRect()
		this.setState({ width: boundingRect.width, height: boundingRect.height })
	}
}
