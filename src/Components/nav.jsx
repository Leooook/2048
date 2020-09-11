import React, { Component } from 'react'
import { connect } from 'react-redux'
import shortid from 'shortid'

import { INITAL } from '../Redux/action'

class Nav extends Component {
	getId = () => {
		const id = shortid.generate()
		console.log(id)
		return id
	}

	render() {
		const { currScore, currScorePlus, maxScore, maxScorePlus, inital } = this.props

		return (
			<header className="header">
				<div className="headerMainPart">
					<h1 className="headerTitle">2048</h1>
					<div className="score">
						<div className="scoreContainer">
							<p className="scoreTitle">SCORE</p>
							{currScorePlus !== 0 ? (
								<p key={this.getId()} className="currScorePlus scoreNumber scoreAnimation">
									+{currScorePlus}
								</p>
							) : null}
							<p className="scoreNumber">{currScore}</p>
						</div>
						<div className="scoreContainer scoreContainer2">
							<p className="scoreTitle">BEST</p>
							{maxScorePlus !== 0 ? (
								<p key={this.getId()} className="maxScorePlus scoreNumber scoreAnimation">
									+{maxScorePlus}
								</p>
							) : null}
							<p className="scoreNumber">{maxScore}</p>
						</div>
					</div>
				</div>
				<div className="headerLastPart">
					<p className="headerInfo">
						Join the numbers and get to the <strong>2048 tile!</strong>
					</p>
					<button className="newGame" onClick={() => inital()}>
						New Game
					</button>
				</div>
			</header>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		currScore: state.currScore,
		currScorePlus: state.currScorePlus,
		maxScore: state.maxScore,
		maxScorePlus: state.maxScorePlus
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		inital: () => dispatch({ type: INITAL })
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
