import ScratchBlocks from "scratch-blocks/dist/horizontal"


ScratchBlocks.Blocks['event_main'] = {
	/**
	 * Block for when the main program is executed.
	 * @this Blockly.Block
	 */
	init: function(this: any) {
		this.jsonInit({
			"id": "event_main",
			"message0": "%1",
			"args0": [
				{
					"type": "field_image",
					"src": "./scratch-blocks-media/icons/event_whenflagclicked.svg",
					"width": 40,
					"height": 40,
					"alt": "When main program is executed",
					"flip_rtl": true
				}
			],
			"inputsInline": true,
			"nextStatement": null,
			"category": (ScratchBlocks as any).Categories.event,
			"colour": (ScratchBlocks as any).Colours.event.primary,
			"colourSecondary": (ScratchBlocks as any).Colours.event.secondary,
			"colourTertiary": (ScratchBlocks as any).Colours.event.tertiary,
			"tooltip": "The main program"
		});
	}
};


ScratchBlocks.Blocks['event_p1'] = {
	/**
	 * Block for when the subprogram P1 is executed.
	 * @this Blockly.Block
	 */
	init: function(this: any) {
		this.jsonInit({
			"id": "event_p1",
			"message0": "%1",
			"args0": [
				{
					"type": "field_image",
					"src": "./scratch-blocks-media/icons/event_when-broadcast-received_blue.svg",
					"width": 40,
					"height": 40,
					"alt": "When blue subprogram is executed"
				}
			],
			"inputsInline": true,
			"nextStatement": null,
			"category": (ScratchBlocks as any).Categories.event,
			"colour": (ScratchBlocks as any).Colours.event.primary,
			"colourSecondary": (ScratchBlocks as any).Colours.event.secondary,
			"colourTertiary": (ScratchBlocks as any).Colours.event.tertiary,
			"tooltip": "The blue subprogram"
		});
	}
};


ScratchBlocks.Blocks['event_p2'] = {
	/**
	 * Block for when the subprogram P2 is executed.
	 * @this Blockly.Block
	 */
	init: function(this: any) {
		this.jsonInit({
			"id": "event_p2",
			"message0": "%1",
			"args0": [
				{
					"type": "field_image",
					"src": "./scratch-blocks-media/icons/event_when-broadcast-received_coral.svg",
					"width": 40,
					"height": 40,
					"alt": "When red subprogram is executed"
				}
			],
			"inputsInline": true,
			"nextStatement": null,
			"category": (ScratchBlocks as any).Categories.event,
			"colour": (ScratchBlocks as any).Colours.event.primary,
			"colourSecondary": (ScratchBlocks as any).Colours.event.secondary,
			"colourTertiary": (ScratchBlocks as any).Colours.event.tertiary,
			"tooltip": "The red subprogram"
		});
	}
};


ScratchBlocks.Blocks['control_p1'] = {
	/**
	 * Block to execute the subprogram P1
	 * @this Blockly.Block
	 */
	init: function(this: any) {
		this.jsonInit({
			"id": "control_p1",
			"message0": "%1",
			"args0": [
				{
					"type": "field_image",
					"src": "./scratch-blocks-media/icons/event_broadcast_blue.svg",
					"width": 40,
					"height": 40,
					"alt": "Execute the blue subprogram"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"category": (ScratchBlocks as any).Categories.control,
			"colour": (ScratchBlocks as any).Colours.control.primary,
			"colourSecondary": (ScratchBlocks as any).Colours.control.secondary,
			"colourTertiary": (ScratchBlocks as any).Colours.control.tertiary,
			"tooltip": "Execute the blue subprogram"
		});
	}
};


ScratchBlocks.Blocks['control_p2'] = {
	/**
	 * Block to execute the subprogram P2
	 * @this Blockly.Block
	 */
	init: function(this: any) {
		this.jsonInit({
			"id": "control_p2",
			"message0": "%1",
			"args0": [
				{
					"type": "field_image",
					"src": "./scratch-blocks-media/icons/event_broadcast_coral.svg",
					"width": 40,
					"height": 40,
					"alt": "Execute the red subprogram"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"category": (ScratchBlocks as any).Categories.control,
			"colour": (ScratchBlocks as any).Colours.control.primary,
			"colourSecondary": (ScratchBlocks as any).Colours.control.secondary,
			"colourTertiary": (ScratchBlocks as any).Colours.control.tertiary,
			"tooltip": "Execute the red subprogram"
		});
	}
};


ScratchBlocks.Blocks['control_forward'] = {
	/**
	 * Block to move forward
	 * @this Blockly.Block
	 */
	init: function(this: any) {
		this.jsonInit({
			"id": "control_forward",
			"message0": "%1",
			"args0": [
				{
					"type": "field_image",
					"src": "./media/arrow_forward.svg",
					"width": 40,
					"height": 40,
					"alt": "Forward"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"category": (ScratchBlocks as any).Categories.control,
			"colour": (ScratchBlocks as any).Colours.control.primary,
			"colourSecondary": (ScratchBlocks as any).Colours.control.secondary,
			"colourTertiary": (ScratchBlocks as any).Colours.control.tertiary,
			"tooltip": "Move forward"
		});
	}
};


ScratchBlocks.Blocks['control_turn_right'] = {
	/**
	 * Block to turn right
	 * @this Blockly.Block
	 */
	init: function(this: any) {
		this.jsonInit({
			"id": "control_turn_right",
			"message0": "%1",
			"args0": [
				{
					"type": "field_image",
					"src": "./media/arrow_cw.svg",
					"width": 40,
					"height": 40,
					"alt": "Turn right"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"category": (ScratchBlocks as any).Categories.control,
			"colour": (ScratchBlocks as any).Colours.control.primary,
			"colourSecondary": (ScratchBlocks as any).Colours.control.secondary,
			"colourTertiary": (ScratchBlocks as any).Colours.control.tertiary,
			"tooltip": "Turn right"
		});
	}
};


ScratchBlocks.Blocks['control_turn_left'] = {
	/**
	 * Block to turn left
	 * @this Blockly.Block
	 */
	init: function(this: any) {
		this.jsonInit({
			"id": "control_turn_left",
			"message0": "%1",
			"args0": [
				{
					"type": "field_image",
					"src": "./media/arrow_ccw.svg",
					"width": 40,
					"height": 40,
					"alt": "Turn left"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"category": (ScratchBlocks as any).Categories.control,
			"colour": (ScratchBlocks as any).Colours.control.primary,
			"colourSecondary": (ScratchBlocks as any).Colours.control.secondary,
			"colourTertiary": (ScratchBlocks as any).Colours.control.tertiary,
			"tooltip": "Turn left"
		});
	}
};


ScratchBlocks.Blocks['control_jump'] = {
	/**
	 * Block to turn left
	 * @this Blockly.Block
	 */
	init: function(this: any) {
		this.jsonInit({
			"id": "control_jump",
			"message0": "%1",
			"args0": [
				{
					"type": "field_image",
					"src": "./media/arrow_jump.svg",
					"width": 40,
					"height": 40,
					"alt": "Jump up and forward"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"category": (ScratchBlocks as any).Categories.control,
			"colour": (ScratchBlocks as any).Colours.control.primary,
			"colourSecondary": (ScratchBlocks as any).Colours.control.secondary,
			"colourTertiary": (ScratchBlocks as any).Colours.control.tertiary,
			"tooltip": "Turn left"
		});
	}
};


ScratchBlocks.Blocks['control_toggle_light'] = {
	/**
	 * Block to turn on/off lights on a light block
	 * @this Blockly.Block
	 */
	init: function(this: any) {
		this.jsonInit({
			"id": "control_toggle_light",
			"message0": "%1",
			"args0": [
				{
					"type": "field_image",
					"src": "./scratch-blocks-media/icons/set-led_white.svg",
					"width": 40,
					"height": 40,
					"alt": "Toggle light"
				}
			],
			"inputsInline": true,
			"previousStatement": null,
			"nextStatement": null,
			"category": (ScratchBlocks as any).Categories.control,
			"colour": (ScratchBlocks as any).Colours.control.primary,
			"colourSecondary": (ScratchBlocks as any).Colours.control.secondary,
			"colourTertiary": (ScratchBlocks as any).Colours.control.tertiary,
			"tooltip": "Turn the light on this block on/off"
		});
	}
};

export default ScratchBlocks