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

        // const floor = (n: number) => Math.floor(n * 16) / 16
        const ceil  = (n: number) => Math.ceil(n * 16) / 16

        for (const col of water.allColumns())
        {
            if (col.top === undefined) continue

            const { x, z } = col
            let bottom = check.waterColumnBottom(col)
            let top = check.waterColumnTop(col)

            bottom = clamp(bottom, -10, 10)
            top = clamp(top, -10, 10)

            for (let y = bottom; y < top; y += 1/16)
            {
                if (!check.inWater({ x:x+1, y, z }))
                {
                    tiles.push(
                        <ViewElement worldPosition={{ x, y, z }} screenOffset={{ x: -64, y: -32 }} key={`${keyFor(col)}_${y}_x`}>
                            <img src="media/water_side_x.svg" alt="" />
                        </ViewElement>
                    )
                }

                if (!check.inWater({ x, y, z:z+1 }))
                {
                    tiles.push(
                        <ViewElement worldPosition={{ x, y, z }} screenOffset={{ x: -64, y: -32 }} key={`${keyFor(col)}_${y}_z`}>
                            <img src="media/water_side_z.svg" alt="" />
                        </ViewElement>
                    )
                }
            }

            tiles.push(
                <ViewElement worldPosition={{ x, y: ceil(top), z }} screenOffset={{ x: -64, y: -32 }} key={`${keyFor(col)}_cap`}>
                    <img src="media/water_top.svg" alt="" />
                </ViewElement>
            )
        }

        return <>{tiles}</>
    }

    onVmChange = (oldVm: VirtualMachine|undefined, newVm: VirtualMachine) =>
    {
        oldVm?.water?.removeEventListener('tick', this.onTick)
        newVm.water.addEventListener('tick', this.onTick)
    }

    onTick = () =>
    {
        console.log('aaa')
        this.forceUpdate()
    }
}
