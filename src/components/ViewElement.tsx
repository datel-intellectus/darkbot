import React from "react"

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
extends React.Props<unknown>
{
    worldPosition: Vector3,
    screenOffset: Vector2
}

export class ViewElement<P extends ViewElementProps = ViewElementProps, S = {}>
extends React.Component<P, S>
{
    render()
    {
        return <>{this.props.children}</>
    }
}
