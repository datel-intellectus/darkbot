export interface Vector2
{
    x: number,
    y: number
}

export interface Vector3
{
    x: number,
    y: number,
    z: number
}

export enum Direction
{
    NW, NE, SE, SW
}

export namespace Vector2
{
    export function toVector3(vec: Vector2): Vector3
    {
        return { x: vec.x, y: 0, z: vec.y }
    }
}

export namespace Vector3
{
    export function projectToVector2(vec: Vector3): Vector2
    {
        return { x: vec.x, y: vec.z }
    }

    export function toVector2AndHeight(vec: Vector3): [Vector2, number]
    {
        return [ { x: vec.x, y: vec.z }, vec.y ]
    }
}

export namespace Direction
{
    export function toVector2(dir: Direction): Vector2
    {
        switch (dir)
        {
            case Direction.NW:
                return { x: -1, y: -1 }

            case Direction.NE:
                return { x: 1, y: -1 }

            case Direction.SE:
                return { x: 1, y: 1 }

            case Direction.SW:
                return { x: -1, y: 1 }
        }
    }

    export function toVector3(dir: Direction): Vector3
    {
        return Vector2.toVector3( toVector2(dir) )
    }

    export function turnCW(dir: Direction, amount: number): Direction
    {
        return ( (dir + amount) % 4 + 4 ) % 4
    }

    export function turnCCW(dir: Direction, amount: number): Direction
    {
        return turnCW(dir, -amount)
    }
}
