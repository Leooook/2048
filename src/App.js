import React from 'react'

import './App.css'
import Nav from './Components/nav.jsx'
import Body from './Components/body.jsx'
import Instruction from './Components/instruction.jsx'

function App() {
	return (
		<div className="app">
			<div className="appContainer">
				<Nav />
				<Body />
				<Instruction />
			</div>
		</div>
	)
}

export default App
