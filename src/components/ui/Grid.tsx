import React, { CSSProperties } from 'react'

export interface GridProps
{
    rows: number,
    cols: number,
    width: number|string,
    height: number|string,
    gap?: number
    style?: CSSProperties
}

export class Grid extends React.PureComponent<GridProps>
{
    render()
    {
        const { rows, cols, width, height, gap } = this.props

        const gridTemplateRows = Array(rows).fill(height + 'px').join(' ')
        const gridTemplateColumns = Array(cols).fill(width + 'px').join(' ')

        const defaultStyle: CSSProperties = {
            display: 'grid',
            gridTemplateRows,
            gridTemplateColumns,
            columnGap: gap ?? 0,
            rowGap: gap ?? 0
        }

        return <div style={{...defaultStyle, ...this.props.style}}>
            {this.props.children}
        </div>
    }
}
