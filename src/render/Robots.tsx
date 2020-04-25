import React from "react"
import { Direction } from "../spatial"
import { ViewElement } from "./ViewElement"
import { VirtualMachine } from "../vm"

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
    vm: VirtualMachine
}

export class Robots<P extends RobotProps>
extends React.Component<P>
{
    vm: VirtualMachine|undefined

    render()
    {
        const vm = this.props.vm
        const direction = dirNum(vm.playerDir)

        if (this.vm !== vm)
        {
            this.onVmChange(this.vm, vm)
            this.vm = vm
        }

        return <ViewElement worldPosition={vm.playerPos} screenOffset={{ x: -30, y: -80+32 }}>
            <img src={`media/rust-sprites/enemy_4_${direction}.png`} alt="" />
        </ViewElement>
    }

    onVmChange = (oldVm: VirtualMachine|undefined, newVm: VirtualMachine) =>
    {
        oldVm?.removeEventListener('robotChangePosition', this.onPlayerMove)
		newVm.addEventListener('robotChangePosition', this.onPlayerMove)
    }

	onPlayerMove = () =>
	{
		this.forceUpdate()
	}
}
