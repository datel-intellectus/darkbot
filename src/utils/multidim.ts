
export function makeMultidimArray(arr: unknown[], ...indices: number[])
{
    for (const i of indices)
    {
        if (arr[i] === undefined)
            arr[i] = []

        if (!Array.isArray(arr))
            throw new TypeError(`There should have been an array, instead found ${arr[i]}`)

        arr = arr[i]
    }
}
