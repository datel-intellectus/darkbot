export function wait(ms: number): Promise<void>
{
    return new Promise(res => {
        setTimeout(res, ms)
    })
}

export function waitUntil(condition: () => boolean): Promise<void>
{
    return new Promise(res => {
        const check = () =>
        {
            if (condition()) res()
            requestAnimationFrame(check)
        }
        check()
    })
}

export function createPromise<T = void>(): { promise: Promise<T>, resolve: (v?: T | PromiseLike<T> | undefined) => void, refuse: (v: any) => void }
{
    let resolve: undefined | ((v?: T | PromiseLike<T> | undefined) => void)
    let refuse: undefined | ((v?: any) => void)

    let promise = new Promise<T>( (res, ref) => {
        resolve = res
        refuse = ref
    })

    if (!resolve || !refuse) throw new Error("Unknown error has occured during promise initialization.")

    return { promise, resolve, refuse }
}
