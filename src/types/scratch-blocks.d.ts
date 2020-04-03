declare module "scratch-blocks/dist/horizontal"
{
    export default class
    {
        static inject(id: string, options: Partial<Options>)
    }

    export interface Options
    {
        comments: boolean,
        disable: boolean,
        collapse: boolean,
        media: string,
        readOnly: boolean,
        rtl: boolean,
        scrollbars: boolean,
        toolbox: HTMLElement,
        trashcan: boolean,
        horizontalLayout: boolean,
        toolboxPosition: 'start' | 'end',
        sounds: boolean,
        grid: {
            spacing: number,
            length: number,
            colour: string,
            snap: boolean
        },
        zoom: {
          controls: boolean,
          wheel: boolean,
          startScale: number,
          maxScale: number,
          minScale: number,
          scaleSpeed: number
        },
        colours: {
          fieldShadow: string,
          dragShadowOpacity: number
        }
    }
}