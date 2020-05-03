import React from "react"
import { VirtualMachine } from "../vm"
import { Component as CircuitComponent } from "../vm/circuits"
import { ViewElement } from "./ViewElement"
import { keyFor } from "../utils/keymaker"
import { Direction } from "../spatial"
const { NW, NE, SW, SE } = Direction

export interface CircuitProps
{
    vm: VirtualMachine
}

export class Circuit<P extends CircuitProps>
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

        const circuits = vm.circuits
        const tiles: any[] = []

        for (const component of circuits.allComponents())
        {
            const check = this.vm.check
            const { x, z } = component
            const y = check.highestGround({ x, z })?.y

            if (y === undefined)
            {
                console.error("There's no tile to place this component: ", component)
                continue
            }

            const fileName = this.componentToFileName(component)

            tiles.push(
                <ViewElement
                    worldPosition={{ x, y, z }}
                    screenOffset={{ x: -64, y: -32 }}
                    key={keyFor(component)}
                >
                    <img src={`media/circuit_${fileName}.svg`} alt="" />
                </ViewElement>
            )
        }

        return <>{tiles}</>
    }

    componentToFileName = (comp: CircuitComponent): string =>
    {
        const check = this.props.vm.check

        switch (comp.type)
        {
            case 'wire':
                const dirs = check.connectionDirections(comp)

                if (check.areSetsEqual( dirs, [NW, NE] ))
                    return 'wire_01'

                if (check.areSetsEqual( dirs, [NW, SE] ))
                    return 'wire_02'

                if (check.areSetsEqual( dirs, [NW, SW] ))
                    return 'wire_03'

                if (check.areSetsEqual( dirs, [NE, SE] ))
                    return 'wire_12'

                if (check.areSetsEqual( dirs, [NE, SW] ))
                    return 'wire_13'

                if (check.areSetsEqual( dirs, [SE, SW] ))
                    return 'wire_23'

                if (check.areSetsEqual( dirs, [NE, NW, SE, SW] ))
                    return 'wire_junction'

                // eslint-disable-next-line no-fallthrough

            default:
                return 'unknown'
        }
    }

    onVmChange = (oldVm: VirtualMachine|undefined, newVm: VirtualMachine) =>
    {
        oldVm?.circuits?.removeEventListener('tick', this.onTick)
        newVm.circuits.addEventListener('tick', this.onTick)
    }

    onTick = () =>
    {
        this.forceUpdate()
    }
}
