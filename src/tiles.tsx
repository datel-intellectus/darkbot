import React from "react"
import { Vector3 } from "./spatial"
import { ViewElement } from "./components/ViewElement"


export namespace Tiles
{
    export interface Props
    extends React.Props<any>
    {
        worldPosition: Vector3
    }

    export class Floor<P extends Tiles.Props>
    extends React.PureComponent<P>
    {
        render()
        {
            return <ViewElement screenOffset={{ x: -64, y: -32 }} {...this.props}>
                <img src="media/tile.svg" alt="" />
            </ViewElement>
        }

        static readonly isSolid = true
    }
}


type TileType = typeof Tiles[keyof typeof Tiles]

// export namespace Tile
// {
//     export interface Props
//     extends Tiles.Props
//     {
//         type: TileType
//     }
// }
// pls babel

export interface Tile_Props
extends Tiles.Props
{
    type: TileType
}

export class Tile<P extends Tile_Props>
extends React.PureComponent<P>
{
    render()
    {
        const T: TileType = this.props.type
        return <T {...this.props} />
    }
}
