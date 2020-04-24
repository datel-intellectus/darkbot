const keys = new WeakMap<object, number>()
let key = 0

export function keyFor(obj: object)
{
    if (keys.has(obj))
        return keys.get(obj)

    if (typeof obj !== "object")
        throw new TypeError(`Expected an object, instead got ${obj}`)

    keys.set(obj, key)
    return key++
}
