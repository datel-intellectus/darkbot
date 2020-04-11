import ScratchBlocks from "scratch-blocks/dist/horizontal"

ScratchBlocks.Blocks['foo_bar'] = {
    /**
     * Block for repeat n times (external number).
     * https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#so57n9
     * @this Blockly.Block
     */
    init: function(this: any) {
        this.jsonInit({
            id: "foo_bar",
            message0: "%1 %2 %3",
            args0: [
                {
                    type: "input_statement",
                    name: "SUBSTACK"
                },
                {
                    type: "field_image",
                    src: "./media/icons/green-flag.svg",
                    width: 40,
                    height: 40,
                    alt: "*",
                    flip_rtl: true
                },
                {
                    type: "input_value",
                    name: "TIMES",
                    check: "Number"
                }
            ],
            inputsInline: true,
            previousStatement: null,
            nextStatement: null,
            category: (ScratchBlocks as any).Categories.control,
            colour: (ScratchBlocks as any).Colours.control.primary,
            colourSecondary: (ScratchBlocks as any).Colours.control.secondary,
            colourTertiary: (ScratchBlocks as any).Colours.control.tertiary
        })

        this.movable_ = false
    }
}

export default ScratchBlocks