import React, { Component } from 'react'
import { connect } from 'react-redux'

import { INITAL, MOVE_TOP_DOWN, MOVE_LEFT_RIGHT } from '../Redux/action'

class Body extends Component {
	state = {
		game: [],
		firstX: 0,
		firstY: 0,
		endX: 0,
		endY: 0,
		moveX: 0,
		moveY: 0
	}

	changeColor = (eachNum) => {
		switch (eachNum) {
			case 2: {
				return 'eachGameBox eachGameBoxActiveDefault'
			}
			case 4: {
				return 'eachGameBox eachGameBoxActiveDefault eachGameBoxActive1'
			}
			case 8: {
				return 'eachGameBox eachGameBoxActiveDefault eachGameBoxActive2'
			}
			case 16: {
				return 'eachGameBox eachGameBoxActiveDefault eachGameBoxActive3'
			}
			case 32: {
				return 'eachGameBox eachGameBoxActiveDefault eachGameBoxActive4'
			}
			case 64: {
				return 'eachGameBox eachGameBoxActiveDefault eachGameBoxActive5'
			}
			case 128: {
				return 'eachGameBox eachGameBoxActiveDefault eachGameBoxActive6'
			}
			case 256: {
				return 'eachGameBox eachGameBoxActiveDefault eachGameBoxActive7'
			}
			case 512: {
				return 'eachGameBox eachGameBoxActiveDefault eachGameBoxActive8'
			}
			case 1024: {
				return 'eachGameBox eachGameBoxActiveDefault eachGameBoxActive9'
			}
			case 2048: {
				return 'eachGameBox eachGameBoxActiveDefault eachGameBoxActive10'
			}
			case 4096: {
				return 'eachGameBox eachGameBoxActiveDefault eachGameBoxActive11'
			}
			case 8192: {
				return 'eachGameBox eachGameBoxActiveDefault eachGameBoxActive12'
			}
			default: {
				return 'eachGameBox eachGameBoxActiveDefault eachGameBoxActive13'
			}
		}
	}

	newPositionAnimation = (index, newPosition) => {
		if (newPosition instanceof Array) {
			if (index === newPosition[0] || index === newPosition[1]) {
				return 'newPosition'
			}
		}
		if (index === newPosition) {
			return 'newPosition'
		} else {
			return
		}
	}

	combineAnimation = (index, combine) => {
		if (combine[index] === true) {
			return 'combine'
		} else {
			return
		}
	}

	keyUp = (e) => {
		if (e.keyCode === 38) {
			this.props.moveTopDown('top')
		}
		if (e.keyCode === 40) {
			this.props.moveTopDown('down')
		}
		if (e.keyCode === 37) {
			this.props.moveLeftRight('left')
		}
		if (e.keyCode === 39) {
			this.props.moveLeftRight('right')
		}
	}

	updateState = (game) => {
		setTimeout(() => this.setState({ game }), 70)
	}

	NavonTouchStart = (e) => {
		this.setState({
			firstX: e.targetTouches[0].clientX,
			firstY: e.targetTouches[0].clientY
		})
	}

	NavonTouchMove = (e) => {
		this.setState({
			endX: e.changedTouches[0].clientX,
			endY: e.changedTouches[0].clientY
		})
	}

	touchEnd = () => {
		var moveX = this.state.endX - this.state.firstX
		var moveY = this.state.endY - this.state.firstY
		if (Math.abs(moveX) > 100 || Math.abs(moveY) > 100) {
			if (Math.abs(moveX) > Math.abs(moveY)) {
				moveX > 0 ? this.props.moveLeftRight('right') : this.props.moveLeftRight('left')
			} else {
				moveY > 0 ? this.props.moveTopDown('down') : this.props.moveTopDown('top')
			}
		}
	}

	componentDidMount() {
		document.addEventListener('keyup', this.keyUp)
	}

	render() {
		if (this.props.newGame === true) {
			this.props.inital()
		}
		const { game, transition, combine, newPosition, lose } = this.props
		if (game !== this.state.game) {
			this.updateState(game)
		}
		//const arr = [ 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 5, '' ]
		return (
			<section className="body">
				<div
					className="gameContainer"
					onTouchStart={this.NavonTouchStart.bind(this)}
					onTouchMove={this.NavonTouchMove.bind(this)}
					onTouchEnd={() => this.touchEnd()}
				>
					{this.state.game.map(
						(eachNum, index) =>
							eachNum === 0 ? (
								<div className="eachGame" key={index}>
									<div className={`eachGameBox ${transition[index]}`} />
								</div>
							) : (
								<div className="eachGame" key={index}>
									<div
										className={`${this.changeColor(eachNum)}  ${this.newPositionAnimation(
											index,
											newPosition
										)} ${this.combineAnimation(index, combine)}  ${transition[index]}`}
									>
										{eachNum}
									</div>
								</div>
							)
					)}
					{lose === 1 ? (
						<div className="lose">
							<div className="loseBox">
								<p className="headerTitle loseTitle">You Lose</p>
								<button
									className="newGame loseNewGame"
									onClick={() => {
										this.props.inital()
									}}
								>
									Try Again
								</button>
							</div>
						</div>
					) : null}
				</div>
			</section>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		newGame: state.newGame,
		game: state.game,
		transition: state.transition,
		combine: state.combine,
		newPosition: state.newPosition,
		lose: state.lose
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		inital: () => dispatch({ type: INITAL }),
		moveTopDown: (toggle) => dispatch({ type: MOVE_TOP_DOWN, payload: { toggle } }),
		moveLeftRight: (toggle) => dispatch({ type: MOVE_LEFT_RIGHT, payload: { toggle } })
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Body)
