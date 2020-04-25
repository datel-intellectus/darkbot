import React from "react"
import { VirtualMachine } from "../vm"
import { ViewElement } from "./ViewElement"
import { clamp } from "../utils/clamp"
import { keyFor } from "../utils/keymaker"

export interface WaterProps
{
    vm: VirtualMachine
}

export class Water<P extends WaterProps>
extends React.Component<P>
{
    vm: VirtualMachine|undefined

    render()
    {
        const vm = this.props.vm

        if (this.vm !== vm)
        {
            this.onVmChange(this.vm, vm)
            this.vm = vm
        }

        const check = vm.check
        const water = vm.water
        const tiles: any[] = []

        for (const col of water.allColumns())
        {
            const { x, z } = col
            let bottom =  Math.floor(check.waterColumnBottom(col))
            let top = Math.ceil(check.waterColumnTop(col))

            bottom = clamp(bottom, -10, 10)
            top = clamp(top, -10, 10)

            for (let y = bottom; y < top; y++)
            {
                tiles.push(
                    <ViewElement worldPosition={{ x, y, z }} screenOffset={{ x: -64, y: -32 }} key={`${keyFor(col)}_${y}`}>
                        <img src="media/water_full.svg" alt="" />
                    </ViewElement>
                )
            }
        }

        return <>{tiles}</>
    }

    onVmChange = (oldVm: VirtualMachine|undefined, newVm: VirtualMachine) =>
    {

    }
}
