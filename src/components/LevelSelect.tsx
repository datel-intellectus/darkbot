import React from 'react'
import levels from "../levels"
import { Button, Centered, Grid } from './ui'

interface LevelSelectProps
{
    series: number,
    launchLevel: (s: number, e: number) => void,
    changeSeries: (s: number) => void
}

export default class LevelSelect extends React.Component<LevelSelectProps>
{
    render()
    {
        const series = this.props.series
        const rows = Math.min( Math.ceil(levels[series-1].length / 4), 2)

        const seriesCount = levels.length

        return <Centered dir="column">
            <h1 style={{ color: 'white' }}>
                Úroveň {series}
            </h1>
            <Grid rows={rows} cols={4} width={80} height={80} gap={20}>
                {
                    levels[series-1].map(l =>
                    {
                        const s = series
                        const e = l.episode
                        return <Button key={`s${s}e${e}`} onClick={this.selectLevel(s, e)}>{e}</Button>
                    })
                }
            </Grid>
            <Grid rows={1} cols={5} width={80} height={40} gap={20} style={{ padding: 20 }}>
                { series === 1 ? <div /> : <Button onClick={this.prevSeries}>{'<'}</Button> }
                <div/><div/><div/>
                { series === seriesCount ? <div /> : <Button onClick={this.nextSeries}>{'>'}</Button> }
            </Grid>
        </Centered>
    }

    selectLevel = (s: number, e: number) => () =>
    {
        this.props.launchLevel(s, e)
    }

    nextSeries = () =>
    {
        this.props.changeSeries(this.props.series + 1)
    }

    prevSeries = () =>
    {
        this.props.changeSeries(this.props.series - 1)
    }
}
