import React from 'react'
import LevelSelect from "./components/LevelSelect"
import Ingame from "./components/Ingame"


interface AppState
{
    location: typeof LevelSelect | typeof Ingame
    series: number
    episode: number
}

export class App extends React.Component<{}, AppState>
{
    state: AppState = {
        location: LevelSelect,
        series: 1,
        episode: 1
    }

    render()
    {
        const { location } = this.state

        switch (location)
        {
            case LevelSelect:
                return <LevelSelect
                    series={this.state.series}
                    launchLevel={this.launchLevel}
                    changeSeries={this.changeSeries}
                />

            case Ingame:
                return <Ingame
                    series={this.state.series}
                    episode={this.state.episode}
                    launchLevel={this.launchLevel}
                    goToLevelSelect={this.goToLevelSelect}
                />

            default:
                throw new Error('Unknown application location.')
        }
    }

    launchLevel = (series: number, episode: number) =>
    {
        this.setState({
            series,
            episode,
            location: Ingame
        })
    }

    changeSeries = (series: number) =>
    {
        this.setState({
            series,
            location: LevelSelect
        })
    }

    goToLevelSelect = () =>
    {
        this.setState({
            location: LevelSelect
        })
    }
}
