import React, { CSSProperties } from 'react'

const defaultStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0',
    padding: '0',
    height: '100%',
    width: '100%'
}

export interface CenteredProps { style?: CSSProperties }

export class Centered extends React.PureComponent<CenteredProps>
{
    render()
    {
        return <div style={{...defaultStyle, ...this.props.style}}>
            {this.props.children}
        </div>
    }
}
