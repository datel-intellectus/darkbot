import React from "react";
import { ViewElement, Vector3 } from "./components/ViewElement";

export interface TileProps
extends React.Props<any>
{
    worldPosition: Vector3
}

export const Tiles =
{
    Floor: class Floor<P extends TileProps, S>
    extends React.Component<P, S>
    {
        render()
        {
            return <ViewElement screenOffset={{ x: -64, y: -32 }} {...this.props}>
                <img src="media/tile.svg" alt="" />
            </ViewElement>
        }
    }
}
