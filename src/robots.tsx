import React from "react";
import { ViewElement, Vector3 } from "./components/ViewElement";

export enum Direction
{
    NW = 3,
    NE = 4,
    SE = 1,
    SW = 2
}

export interface RobotProps
extends React.Props<any>
{
    worldPosition: Vector3,
    direction: Direction
}

export const Robots =
{
    BotA: class BotA<P extends RobotProps, S>
    extends React.Component<P, S>
    {
        render()
        {
            return <ViewElement screenOffset={{ x: -30, y: -80 }} {...this.props}>
                <img src={`media/rust-sprites/enemy_4_${this.props.direction}.png`} alt="" />
            </ViewElement>
        }
    }
}
