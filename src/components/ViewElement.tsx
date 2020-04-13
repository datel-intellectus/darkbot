import React from "react"
import { WorldContext } from "./WorldView"

export interface Vector3
{
    x: number,
    y: number,
    z: number
}

export interface Vector2
{
    x: number,
    y: number
}

export interface ViewElementProps
extends React.Props<any>
{
    worldPosition: Vector3,
    screenOffset: Vector2
}

export class ViewElement<P extends ViewElementProps = ViewElementProps, S = {}>
extends React.Component<P, S>
{
    static contextType = WorldContext

    render()
    {
        const ctx: WorldContext = this.context
        const props = this.props
        const style = getTransformation(ctx.worldDimensions, props.screenOffset, props.worldPosition)
        return <div style={style}>{this.props.children}</div>
    }
}


const floor = Math.floor;

function getTransformation(dimensions: Vector2, offset: Vector2, world: Vector3): { top: string, left: string }
{
	const vec: Vector2 =
	{
		x: floor(dimensions.x/2) + offset.x + (world.x - world.z)*64,
		y: floor(dimensions.y/2) + offset.y + (world.x + world.z)*32 - world.y*32
	}

	return {
		left: vec.x + 'px',
		top: vec.y + 'px'
	}
}
