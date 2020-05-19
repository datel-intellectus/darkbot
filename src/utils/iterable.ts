export function range(count: number): Generator<number>
export function range(start: number, end: number): Generator<number>

export function* range(a: number, b?: number): Generator<number>
{
    const start = b === undefined ? 0 : a
    const end = b === undefined ? a : b

    for (let i = start; i < end; i++) yield i
}
