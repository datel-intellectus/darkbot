import React from 'react'
import levels from "../levels"
import { Button, Centered, Grid } from './ui'

interface LevelSelectState
{
    series: number
}

export default class LevelSelect extends React.Component<{}, LevelSelectState>
{
    state = { series: 0 }

    render()
    {
        const { series } = this.state

        return <Centered>
            <Grid rows={4} cols={4} width={30} height={30}>
                {
                    levels[series].map(l => <Button>{l.episode}</Button>)
                }
            </Grid>
        </Centered>
    }
}
