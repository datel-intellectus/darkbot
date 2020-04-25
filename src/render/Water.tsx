import React from "react"
import { VirtualMachine } from "../vm"
import { ViewElement } from "./ViewElement"

export interface WaterProps
{
    vm: VirtualMachine
}

export class Water<P extends WaterProps>
extends React.Component<P>
{
    render()
    {
        const vm = this.props.vm
        const check = vm.check
        const water = vm.water
        const tiles = []

        for (const col of water.allColumns())
        {
            const { x, z } = col
            const bottom =  Math.floor(check.waterColumnBottom(col))
            const top = Math.ceil(check.waterColumnTop(col))

            for (let y = bottom; y <= top; y++)
            {
                tiles.push(
                    <ViewElement worldPosition={{ x, y, z }} screenOffset={{ x: -64, y: -32 }}>
                        <img src="media/water_full.svg" alt="" />
                    </ViewElement>
                )
            }
        }

        return <>{tiles}</>
    }
}
