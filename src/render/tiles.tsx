import React from "react"
import { Vector3 } from "../spatial"
import { ViewElement } from "./ViewElement"


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

    export class Flower<P extends Tiles.Props>
    extends React.Component<P>
    {
        render()
        {
            const tileNo = (window as any).flowerState ?? 5
            return <ViewElement screenOffset={{ x: -64, y: -32-25 }} {...this.props}>
                <img src={`media/tile_flower_${tileNo}.svg`} alt="" />
            </ViewElement>
        }

        static readonly isSolid = true
    }

    export class Steel<P extends Tiles.Props>
    extends React.Component<P>
    {
        render()
        {
            return <ViewElement screenOffset={{ x: -64, y: -32 }} {...this.props}>
                <img src="media/tile_steel.svg" alt="" />
            </ViewElement>
        }
    }

    export class StaticWater<P extends Tiles.Props>
    extends React.PureComponent<P>
    {
        render()
        {
            return <ViewElement screenOffset={{ x: -64, y: -32 }} {...this.props}>
                <img src="media/water_full.svg" alt="" />
            </ViewElement>
        }
    }

    export class Grass<P extends Tiles.Props>
    extends React.PureComponent<P>
    {
        render()
        {
            return <ViewElement screenOffset={{ x: -64, y: -32 }} {...this.props}>
                <img src="media/NORM_NOTHING.svg" alt="" />
            </ViewElement>
        }

        static readonly isSolid = true
    }

    export class PathNESE<P extends Tiles.Props>
    extends React.PureComponent<P>
    {
        render()
        {
            return <ViewElement screenOffset={{ x: -64, y: -32 }} {...this.props}>
                <img src="media/NORM_C.svg" alt="" />
            </ViewElement>
        }

        static readonly isSolid = true
    }

    export class PathNESW<P extends Tiles.Props>
    extends React.PureComponent<P>
    {
        render()
        {
            return <ViewElement screenOffset={{ x: -64, y: -32 }} {...this.props}>
                <img src="media/NORM_PRAVOLEVA.svg" alt="" />
            </ViewElement>
        }

        static readonly isSolid = true
    }

    export class PathNENW<P extends Tiles.Props>
    extends React.PureComponent<P>
    {
        render()
        {
            return <ViewElement screenOffset={{ x: -64, y: -32 }} {...this.props}>
                <img src="media/NORM_V.svg" alt="" />
            </ViewElement>
        }

        static readonly isSolid = true
    }

    export class PathSESW<P extends Tiles.Props>
    extends React.PureComponent<P>
    {
        render()
        {
            return <ViewElement screenOffset={{ x: -64, y: -32 }} {...this.props}>
                <img src="media/NORM_A.svg" alt="" />
            </ViewElement>
        }

        static readonly isSolid = true
    }

    export class PathSENW<P extends Tiles.Props>
    extends React.PureComponent<P>
    {
        render()
        {
            return <ViewElement screenOffset={{ x: -64, y: -32 }} {...this.props}>
                <img src="media/NORM_LEVOPRAV.svg" alt="" />
            </ViewElement>
        }

        static readonly isSolid = true
    }

    export class PathSWNW<P extends Tiles.Props>
    extends React.PureComponent<P>
    {
        render()
        {
            return <ViewElement screenOffset={{ x: -64, y: -32 }} {...this.props}>
                <img src="media/NORM_D.svg" alt="" />
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
