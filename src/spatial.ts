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

export namespace Vector2
{
    export function toVector3(vec: Vector2): Vector3
    {
        return { x: vec.x, y: 0, z: vec.y }
    }

    export function opposite(vec: Vector2)
    {
        return { x: -vec.x, y: -vec.y }
    }

    export function add(u: Vector2, v: Vector2): Vector2
    {
        return { x: u.x + v.x, y: u.y + v.y }
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

    export function opposite(vec: Vector3): Vector3
    {
        return { x: -vec.x, y: -vec.y, z: -vec.z }
    }

    export function add(u: Vector3, v: Vector3): Vector3
    {
        return { x: u.x + v.x, y: u.y + v.y, z: u.z + v.z }
    }
}


export enum Direction_
{
    NW, NE, SE, SW
}

export const { NW, NE, SE, SW } = Direction_

export type Direction = Direction_
export const Direction =
{
    NW: Direction_.NW as const,
    NE: Direction_.NE as const,
    SE: Direction_.SE as const,
    SW: Direction_.SW as const,

    [Symbol.iterator]: function* ()
    {
        yield Direction.NW
        yield Direction.NE
        yield Direction.SE
        yield Direction.SW
    },

    toVector2: (dir: Direction): Vector2 =>
    {
        switch (dir)
        {
            case Direction.NW:
                return { x: -1, y: 0 }

            case Direction.NE:
                return { x: 0, y: -1 }

            case Direction.SE:
                return { x: 1, y: 0 }

            case Direction.SW:
                return { x: 0, y: 1 }
        }
    },

    toVector3: (dir: Direction): Vector3 =>
    {
        return Vector2.toVector3( Direction.toVector2(dir) )
    },

    turnCW: (dir: Direction, amount: number = 1): Direction =>
    {
        return ( (dir + amount) % 4 + 4 ) % 4
    },

    turnCCW: (dir: Direction, amount: number = 1): Direction =>
    {
        return Direction.turnCW(dir, -amount)
    }
}


export interface Vector5
{
    y: number
    'x+': number
    'x-': number
    'z+': number
    'z-': number
}

export namespace Vector5
{
    export function componentInDirection(vec: Vector5, dir: Direction): number
    {
        switch(dir)
        {
            case Direction.NW:
                return vec['x-']

            case Direction.NE:
                return vec['z-']

            case Direction.SE:
                return vec['x+']

            case Direction.SW:
                return vec['z+']
        }
    }
}
