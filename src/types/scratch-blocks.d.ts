declare module "scratch-blocks"
{
    export * from "blockly"
    export { default } from "blockly"

    import { Block as GoogleBlock } from "blockly"
    export interface Block extends GoogleBlock
    {
        isGlowingBlock_: boolean,
        setGlowBlock: (boolean) => void,
        initSvg: () => void,
        render: () => void
    }

    export { Workspace } from "blockly"
}

declare module "scratch-blocks/dist/vertical"
{
    export * from "scratch-blocks"
    export { default } from "scratch-blocks"
    export { Block } from "scratch-blocks"
}

declare module "scratch-blocks/dist/horizontal"
{
    export * from "scratch-blocks"
    export { default } from "scratch-blocks"
    export { Block } from "scratch-blocks"
}