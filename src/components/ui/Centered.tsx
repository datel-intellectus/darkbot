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

export interface CenteredProps
{
    style?: CSSProperties
    dir?: CSSProperties['flexDirection']
}

export class Centered extends React.PureComponent<CenteredProps>
{
    render()
    {
        const { style, dir } = this.props
        return <div style={{...defaultStyle, flexDirection: dir,  ...style}}>
            {this.props.children}
        </div>
    }
}
