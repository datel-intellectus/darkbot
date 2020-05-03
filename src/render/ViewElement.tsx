import React from "react"
import { WorldContext } from "./WorldView"
import { Vector2, Vector3 } from "../spatial"
const { floor } = Math


export interface ViewElementProps
extends React.Props<any>
{
    worldPosition: Vector3,
    screenOffset: Vector2,
    opacity?: number
}

export class ViewElement<P extends ViewElementProps = ViewElementProps, S = {}>
extends React.Component<P, S>
{
    static contextType = WorldContext

    render()
    {
        const ctx: WorldContext = this.context
        const props = this.props
        const style = getTransformation(ctx.worldDimensions, props)
        return <div style={style}>{this.props.children}</div>
    }
}


function getTransformation(dimensions: Vector2, props: ViewElementProps)
{
    const { worldPosition: world, screenOffset: offset } = props

	const vec: Vector2 =
	{
		x: floor(dimensions.x/2) + offset.x + (world.x - world.z)*64,
		y: floor(dimensions.y/2) + offset.y + (world.x + world.z)*32 - world.y*32
    }

    const zIndex = floor(world.x + world.z + world.y)
    const opacity = props.opacity ?? 1

	return {
		left: vec.x + 'px',
        top: vec.y + 'px',
        zIndex, opacity
	}
}
