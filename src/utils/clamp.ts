
export function clamp(n: number, min: number, max: number): number
{
    if (min > max) return NaN
    if (min > n) return min
    if (n > max) return max
    return n
}
