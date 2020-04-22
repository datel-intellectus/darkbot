import React from "react";
import { Vector3, Direction } from "./spatial"
import { ViewElement } from "./components/ViewElement";

function dirNum(dir: Direction): number
{
    switch (dir)
    {
        case Direction.NW:
            return 3

        case Direction.NE:
            return 4

        case Direction.SE:
            return 1

        case Direction.SW:
            return 2
    }
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
            const direction = dirNum(this.props.direction)

            return <ViewElement screenOffset={{ x: -30, y: -80+32 }} {...this.props}>
                <img src={`media/rust-sprites/enemy_4_${direction}.png`} alt="" />
            </ViewElement>
        }
    }
}
