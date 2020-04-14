import React from 'react';
import { BlockView } from './BlockView';
import { WorldView } from './WorldView';
import { Tiles } from '../tiles';


export class App<P, S> extends React.Component<P, S>
{
	render()
	{
		return (
			<div className="expand flex">
				<BlockView
					id="blocks"
					onInsertion={this.onInsertion}
					onInsertionPreview={this.onInsertionPreview}
				/>
				<WorldView id="worldview">
					<Tiles.Floor worldPosition={{ x: 0, y: 1, z: 0 }} />
					<Tiles.Floor worldPosition={{ x: 1, y: 0, z: 0 }} />
					<Tiles.Floor worldPosition={{ x: 2, y: 0, z: 0 }} />
					<Tiles.Floor worldPosition={{ x: 0, y: 0, z: 1 }} />
					<Tiles.Floor worldPosition={{ x: 0, y: 0, z: 2 }} />
				</WorldView>
			</div>
		);
	}

	onInsertion() {}
	onInsertionPreview() {}
}

export default App;
