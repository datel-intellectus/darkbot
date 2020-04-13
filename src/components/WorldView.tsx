import React from "react"

export interface WorldViewProps
extends React.Props<unknown>
{
	id?: string,
	children?: JSX.Element | JSX.Element[]
}

export class WorldView<P extends WorldViewProps = WorldViewProps, S = {}>
extends React.Component<P, S>
{
	element = React.createRef<HTMLDivElement>()

	width = 0
	height = 0

	render()
	{
		console.log(this.props.children)

		let children: WorldViewProps['children'] = this.props.children
		if (!children) children = []
		if (!Array.isArray(children)) children = [children]

		children = children.map(this.mapChildren)

		return <div id={this.props.id} ref={this.element}>{children}</div>
	}

	mapChildren = (ch: JSX.Element) =>
	{
		return <div style={{top: '20px', left: '10px'}}>{ch}</div>
	}

	componentDidMount()
	{
		new ResizeObserver(this.onResize).observe(this.element.current!)
		this.onResize()
	}

	onResize = () =>
	{
		let boundingRect = this.element.current!.getBoundingClientRect()
		this.width = boundingRect.width
		this.height = boundingRect.height
		this.forceUpdate()
	}
}
