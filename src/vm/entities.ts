import { VirtualMachine } from "."
import { CheckRunner } from "./check"

export class EntityManager
{
    get check(): CheckRunner
    {
        return this.vm.check
    }

    list: JSX.Element[] = []

    constructor(public vm: VirtualMachine) {}
}
