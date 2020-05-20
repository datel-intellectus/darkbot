import { VirtualMachine } from "."
import { CheckRunner } from "./check"
import { ViewElement } from "../render/ViewElement"

export class EntityManager
{
    get check(): CheckRunner
    {
        return this.vm.check
    }

    list: ViewElement[] = []

    constructor(public vm: VirtualMachine) {}
}
