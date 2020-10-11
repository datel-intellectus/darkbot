import React, { CSSProperties } from 'react'

const defaultStyle: CSSProperties = {
    cursor: 'pointer',
    background: '#ccc',
    border: '2px solid #333',
    borderRadius: '5px',
    padding: '10px'
}

export interface ButtonProps
{
    onClick?: (e: React.MouseEvent) => void,
    style?: CSSProperties
}

export class Button extends React.PureComponent<ButtonProps>
{
    render()
    {
        return <div onClick={this.props.onClick} style={{...defaultStyle, ...this.props.style}}>
            {this.props.children}
        </div>
    }
}
