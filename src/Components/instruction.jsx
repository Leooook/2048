import React from 'react'

function Instruction(props) {
	return (
		<section>
			<p className="instructionInfo">
				<strong>HOW TO PLAY:</strong> Use your <strong>arrow keys</strong> to move the tiles. When two tiles
				with the same number touch, they <strong>merge into one!</strong>
			</p>
		</section>
	)
}

export default Instruction
