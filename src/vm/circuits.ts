import { VirtualMachine } from "."
import { EventTarget } from "@meta-utils/events"
import { Direction, Vector3 } from "../spatial"
import { makeMultidimArray } from "../utils/multidim"
const { NW, NE, SE, SW } = Direction

export type ComponentType = 'wire' | 'unknown'

export interface Component
{
    x: number
    z: number
    type: ComponentType
    connections: Connection[]
    directions?: Direction[]
}

export interface Connection
{
    potential: number
    components: [Component, Component]
}


export interface CircuitRunnerEvents
{
    tick: {}
}

export class CircuitRunner
extends EventTarget<CircuitRunnerEvents>
{
    tickRate = .5

    /**
     * The multidimensional array of columns possible to fill
     * with water, in the format `[x][z][index]`.
     */
    comps: Component[][][] = []

    get tick(): number {
        return this.vm.tick * this.tickRate
    }


    constructor(public vm: VirtualMachine)
    {
        super()
        this.loadFromLevel()
        this.makeConnections()
    }

    allComponents = (() =>
    {
        const self = this
        return function* columnIterator()
        {
            const cols = self.comps

            for (let x = 0; x < cols.length;    x++)
            for (let z = 0; z < cols[x].length; z++)
            for (const col of cols[x][z])
            {
                yield col
            }
        }
    })()

    private loadFromLevel = () =>
    {
        const circuit = this.vm.level.circuit
        if (!circuit) return

        const scheme = circuit.scheme.split(/[\n\r]|(?:\r\n)/)

        for (let z = 0; z < scheme.length;    z++)
        for (let x = 0; x < scheme[z].length; x++)
        {
            makeMultidimArray(this.comps, x, z)

            const ch = scheme[z][x]
            this.comps[x][z].push(...this.parseComponent(ch, x, z))
        }
    }

    private makeConnections = () =>
    {
        // ☠️ ☠️ ☠️ ☠️ ☠️ ☠️ ☠️ ☠️ ☠️ ☠️ ☠️ ☠️ ☠️
        // haha needs a massive refactoring
        // ☠️ ☠️ ☠️ ☠️ ☠️ ☠️ ☠️ ☠️ ☠️ ☠️ ☠️ ☠️ ☠️

        for (const thisComponent of this.allComponents())
        {
            const { x, z, directions } = thisComponent
            const pos = { x, z, y: 0 }

            if (!directions) continue

            // iterate through all the connections that should be made
            componentDirectionsLoop:
            while (directions.length !== 0)
            {
                const nDir = directions.pop()!

                const nPos = Vector3.stepInDirection(pos, nDir)
                const neighbours = this.comps[nPos.x][nPos.z]

                // loop through all the components in this direction
                for (const neighbour of neighbours)
                {
                    if (!neighbour.directions) continue

                    for (const nnDir of neighbour.directions)
                    {
                        const nnPos = Vector3.stepInDirection(nPos, nnDir)

                        // neighbour connects back to `thisComponent`
                        if (nnPos.x === pos.x && nnPos.z === pos.z)
                        {
                            const connection: Connection = {
                                components: [thisComponent, neighbour],
                                potential: 0
                            }

                            thisComponent.connections.push(connection)
                            neighbour.connections.push(connection)

                            // from `neighbour.directions` remove `nnDir`
                            neighbour.directions.splice( neighbour.directions.indexOf(nnDir), 1 )

                            // this direction is connected, let's move on!
                            continue componentDirectionsLoop
                        }
                    }
                }

                // neither of the components connected back to `thisComponent`
                console.error("Couldn't connect the component ", thisComponent, " in this direction:", nDir)
            }
        }
    }

    private parseComponent = (ch: string, x: number, z: number): Component[] =>
    {
        switch (ch)
        {
            case ' ':
                return []

            case '│':
                return [{
                    x, z,
                    type: 'wire',
                    directions: [NE, SW],
                    connections: []
                }]

            case '─':
                return [{
                    x, z,
                    type: 'wire',
                    directions: [NW, SE],
                    connections: []
                }]

            case '┌':
                return [{
                    x, z,
                    type: 'wire',
                    directions: [SW, SE],
                    connections: []
                }]

            case '┐':
                return [{
                    x, z,
                    type: 'wire',
                    directions: [SW, NW],
                    connections: []
                }]

            case '└':
                return [{
                    x, z,
                    type: 'wire',
                    directions: [NE, SE],
                    connections: []
                }]

            case '┘':
                return [{
                    x, z,
                    type: 'wire',
                    directions: [NE, NW],
                    connections: []
                }]

            case '┼':
                return [{
                    x, z,
                    type: 'wire',
                    directions: [NE, NW, SW, SE],
                    connections: []
                }]

            case '┿':
                return [{
                    x, z,
                    type: 'wire',
                    directions: [NE, SW],
                    connections: []
                },
                {
                    x, z,
                    type: 'wire',
                    directions: [SE, NW],
                    connections: []
                }]

            default:
                return [{
                    x, z,
                    type: 'unknown',
                    directions: [],
                    connections: []
                }]
        }
    }
}
