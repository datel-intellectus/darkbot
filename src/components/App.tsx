import React from 'react';
import '../App.css';
import { Blocks } from './Blocks';
import { WorldView } from './WorldView';
import { ViewElement } from './ViewElement';


export class App<P, S> extends React.Component<P, S>
{
	render()
	{
		return (
			<div className="expand flex">
				<Blocks
					id="blocks"
					onInsertion={this.onInsertion}
					onInsertionPreview={this.onInsertionPreview}
				/>
				<WorldView id="worldview">
					<ViewElement worldPosition={{ x: 0, y: 0, z: 0 }} screenOffset={{ x: 0, y: 0 }}>
						<img src="media/tile.svg" alt="" />
					</ViewElement>
				</WorldView>
			</div>
		);
	}

	onInsertion() {}
	onInsertionPreview() {}
}

export default App;
