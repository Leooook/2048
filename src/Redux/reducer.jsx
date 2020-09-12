import { INITAL, MOVE_TOP_DOWN, MOVE_LEFT_RIGHT } from './action'

let myState = {
	newGame: true,
	game: [], // game box
	currScore: 0,
	currScorePlus: 0,
	maxScore: 0,
	maxScorePlus: 0,
	lose: 0,

	// using for css move animation
	transition: [], // move length of each number in every round
	combine: [], // record the position of new combined number
	newPosition: [] // record the position of new occured number
}

// Possibility occur new number of 2 or 4, when max number larger, the possibility of 4 occured will increase.
function probably_2_or_4(maxNumber) {
	const probably = Math.round(Math.log(maxNumber) / Math.log(2))
	const num = Math.floor(Math.random() * 20) + 1

	if (probably / 4 >= num) {
		return 4
	} else {
		return 2
	}
}

// Process the move action of each line
function process_each_line(eachLine) {
	let oldEachLine = eachLine.map((eachOne) => {
		return eachOne
	})
	let score = 0
	let tmpTransition = [ '', '', '', '' ]
	let tmpCombine = [ false, false, false, false ]
	// Combine the same number of each line
	for (let i = 0; i < 4; i++) {
		if (eachLine[i] !== 0) {
			for (let j = i + 1; j < 4; j++) {
				if (eachLine[j] !== eachLine[i] && eachLine[j] !== 0) {
					break
				}
				// when two number are same, combine and record them.
				if (eachLine[j] === eachLine[i]) {
					eachLine[i] *= 2
					score += eachLine[i]
					eachLine[j] = 0
					tmpTransition[i] = 'combine1'
					tmpTransition[j] = 'combine2'
					i += j
					break
				}
			}
		}
	}
	// Remove the space of each line
	eachLine = eachLine.filter((eachOne) => eachOne !== 0)
	for (let i = eachLine.length; i < 4; i++) {
		eachLine.push(0)
	}
	// Calculate the move length of each number (using for move animation)
	for (let i = 0; i < 4; i++) {
		if (eachLine[i] === 0) {
			break
		}
		for (let j = i; j < 4; j++) {
			if (eachLine[i] === oldEachLine[j]) {
				tmpTransition[j] = j - i
				break
			}
			if (tmpTransition[j] === 'combine1') {
				for (let k = j + 1; k < 4; k++) {
					if (
						tmpTransition[k] === 'combine2' &&
						oldEachLine[j] === oldEachLine[k] &&
						eachLine[i] === 2 * oldEachLine[j]
					) {
						tmpTransition[j] = j - i
						tmpTransition[k] = k - i
						tmpCombine[i] = true
						break
					}
				}
			}
		}
	}

	return { eachLine: eachLine, tmpTransition: tmpTransition, tmpCombine: tmpCombine, score: score }
}

// Add a random number
function add_random_num(game) {
	const maxNum = Math.max(...game)
	let tmpNewPosition
	while (game.filter((eachOne) => eachOne === 0).length !== 0) {
		let num = Math.floor(Math.random() * 16)
		if (game[num] === 0) {
			game[num] = probably_2_or_4(maxNum)
			tmpNewPosition = num
			break
		}
	}

	return { game: game, tmpNewPosition: tmpNewPosition }
}

// Judge the game lose or not in each round
function Lose(game) {
	// Judge the game box has spave or not
	if (game.filter((eachOne) => eachOne === 0).length !== 0) {
		return 1
	}
	// Judge each number's round has same number or not
	for (let i = 0; i < 16; i++) {
		if (i - 4 >= 0) {
			if (game[i] === game[i - 4]) {
				return 1
			}
		}
		if (i + 4 <= 15) {
			if (game[i] === game[i + 4]) {
				return 1
			}
		}
		if (i !== 0 && i !== 4 && i !== 8 && i !== 12) {
			if (game[i] === game[i - 1]) {
				return 1
			}
		}
		if (i !== 3 && i !== 7 && i !== 11 && i !== 15) {
			if (game[i] === game[i + 1]) {
				return 1
			}
		}
	}
	return 0
}

function Reducers(state = myState, action) {
	switch (action.type) {
		// inital game
		case INITAL: {
			let tmpGame = []
			let tmpTransition = []
			let tmpCombine = []
			let tmpNewPosition = []
			for (let i = 0; i < 16; i++) {
				tmpGame.push(0)
				tmpTransition.push('')
				tmpCombine.push(false)
			}
			let num1 = Math.floor(Math.random() * 16)
			let num2 = Math.floor(Math.random() * 16)

			while (num1 === num2) {
				num2 = Math.floor(Math.random() * 16)
			}

			tmpNewPosition.push(num1)
			tmpNewPosition.push(num2)
			tmpGame[num1] = probably_2_or_4(1)
			tmpGame[num2] = probably_2_or_4(1)

			state = {
				newGame: false,
				game: tmpGame,
				transition: tmpTransition,
				combine: tmpCombine,
				newPosition: tmpNewPosition,
				currScore: 0,
				currScorePlus: 0,
				maxScore: state.maxScore,
				maxScorePlus: 0,
				lose: 0
			}

			return state
		}

		// when action move 'top' or 'down'
		case MOVE_TOP_DOWN: {
			let tmpGame = state.game.map((eachOne) => {
				return eachOne
			})
			let tmpTransition = []
			let tmpCombine = []
			for (let i = 0; i < 16; i++) {
				tmpTransition.push('')
				tmpCombine.push(false)
			}
			let add_score = 0

			// Seperate the game box to 4 line and calculate each line.
			for (let i = 0; i < 4; i++) {
				let eachLine = [ tmpGame[i], tmpGame[i + 4], tmpGame[i + 8], tmpGame[i + 12] ]
				let tmpTransitionLine
				let tmpCombineLine

				// 'top'
				if (action.payload.toggle === 'top') {
					const result = process_each_line(eachLine)
					eachLine = result.eachLine
					tmpTransitionLine = result.tmpTransition
					add_score += result.score
					tmpCombineLine = result.tmpCombine
					tmpTransitionLine = tmpTransitionLine.map((eachOne) => {
						if (eachOne === 1) {
							eachOne = 'top1'
							return eachOne
						}
						if (eachOne === 2) {
							eachOne = 'top2'
							return eachOne
						}
						if (eachOne === 3) {
							eachOne = 'top3'
							return eachOne
						} else {
							eachOne = ''
							return eachOne
						}
					})
				}
				// 'down'
				if (action.payload.toggle === 'down') {
					eachLine = eachLine.reverse()
					const result = process_each_line(eachLine)
					eachLine = result.eachLine.reverse()
					tmpTransitionLine = result.tmpTransition.reverse()
					add_score += result.score
					tmpCombineLine = result.tmpCombine.reverse()
					tmpTransitionLine = tmpTransitionLine.map((eachOne) => {
						if (eachOne === 1) {
							eachOne = 'bot1'
							return eachOne
						}
						if (eachOne === 2) {
							eachOne = 'bot2'
							return eachOne
						}
						if (eachOne === 3) {
							eachOne = 'bot3'
							return eachOne
						} else {
							eachOne = ''
							return eachOne
						}
					})
				}

				tmpGame[i] = eachLine[0]
				tmpGame[i + 4] = eachLine[1]
				tmpGame[i + 8] = eachLine[2]
				tmpGame[i + 12] = eachLine[3]
				tmpTransition[i] = tmpTransitionLine[0]
				tmpTransition[i + 4] = tmpTransitionLine[1]
				tmpTransition[i + 8] = tmpTransitionLine[2]
				tmpTransition[i + 12] = tmpTransitionLine[3]
				tmpCombine[i] = tmpCombineLine[0]
				tmpCombine[i + 4] = tmpCombineLine[1]
				tmpCombine[i + 8] = tmpCombineLine[2]
				tmpCombine[i + 12] = tmpCombineLine[3]
			}

			// add new number (not add if game was not change)
			let tmpNewPosition
			if (tmpTransition.filter((eachOne) => eachOne !== '').length !== 0) {
				const gameResult = add_random_num(tmpGame)
				tmpGame = gameResult.game
				tmpNewPosition = gameResult.tmpNewPosition
			}

			// juage lose or win
			let lose = 0
			if (Math.max(...tmpGame) >= 2048) {
				lose = -1
			}
			if (Lose(tmpGame) === 0) {
				lose = 1
			}

			state = {
				...state,
				game: tmpGame,
				transition: tmpTransition,
				combine: tmpCombine,
				newPosition: tmpNewPosition,
				currScore: state.currScore + add_score,
				currScorePlus: add_score,
				maxScorePlus: 0,
				lose
			}

			if (state.currScore > state.maxScore) {
				state = { ...state, maxScorePlus: state.currScore - state.maxScore, maxScore: state.currScore }
			}

			return state
		}

		// when move 'left' or 'right'
		case MOVE_LEFT_RIGHT: {
			let tmpGame = state.game.map((eachOne) => {
				return eachOne
			})
			let tmpTransition = []
			let tmpCombine = []
			for (let i = 0; i < 16; i++) {
				tmpTransition.push('')
				tmpCombine.push(false)
			}
			let eachLine = []
			let add_score = 0

			for (let i = 0; i < 13; i += 4) {
				eachLine = [ tmpGame[i], tmpGame[i + 1], tmpGame[i + 2], tmpGame[i + 3] ]
				let tmpTransitionLine
				let tmpCombineLine
				// 'left'
				if (action.payload.toggle === 'left') {
					const result = process_each_line(eachLine)
					eachLine = result.eachLine
					tmpTransitionLine = result.tmpTransition
					tmpCombineLine = result.tmpCombine
					add_score += result.score
					tmpTransitionLine = tmpTransitionLine.map((eachOne) => {
						if (eachOne === 1) {
							eachOne = 'left1'
							return eachOne
						}
						if (eachOne === 2) {
							eachOne = 'left2'
							return eachOne
						}
						if (eachOne === 3) {
							eachOne = 'left3'
							return eachOne
						} else {
							eachOne = ''
							return eachOne
						}
					})
				}
				// 'right'
				if (action.payload.toggle === 'right') {
					eachLine = eachLine.reverse()
					const result = process_each_line(eachLine)
					eachLine = result.eachLine.reverse()
					tmpTransitionLine = result.tmpTransition.reverse()
					tmpCombineLine = result.tmpCombine.reverse()
					add_score += result.score
					tmpTransitionLine = tmpTransitionLine.map((eachOne) => {
						if (eachOne === 1) {
							eachOne = 'right1'
							return eachOne
						}
						if (eachOne === 2) {
							eachOne = 'right2'
							return eachOne
						}
						if (eachOne === 3) {
							eachOne = 'right3'
							return eachOne
						} else {
							eachOne = ''
							return eachOne
						}
					})
				}

				tmpGame[i] = eachLine[0]
				tmpGame[i + 1] = eachLine[1]
				tmpGame[i + 2] = eachLine[2]
				tmpGame[i + 3] = eachLine[3]
				tmpTransition[i] = tmpTransitionLine[0]
				tmpTransition[i + 1] = tmpTransitionLine[1]
				tmpTransition[i + 2] = tmpTransitionLine[2]
				tmpTransition[i + 3] = tmpTransitionLine[3]
				tmpCombine[i] = tmpCombineLine[0]
				tmpCombine[i + 1] = tmpCombineLine[1]
				tmpCombine[i + 2] = tmpCombineLine[2]
				tmpCombine[i + 3] = tmpCombineLine[3]
			}

			// add new number (not add if game was not change)
			let tmpNewPosition
			if (tmpTransition.filter((eachOne) => eachOne !== '').length !== 0) {
				const gameResult = add_random_num(tmpGame)
				tmpGame = gameResult.game
				tmpNewPosition = gameResult.tmpNewPosition
			}

			// judge lose or win
			let lose = 0
			if (Math.max(...tmpGame) >= 2048) {
				lose = -1
			}
			if (Lose(tmpGame) === 0) {
				lose = 1
			}

			state = {
				...state,
				game: tmpGame,
				transition: tmpTransition,
				combine: tmpCombine,
				newPosition: tmpNewPosition,
				currScore: state.currScore + add_score,
				currScorePlus: add_score,
				maxScorePlus: 0,
				lose
			}

			if (state.currScore > state.maxScore) {
				state = { ...state, maxScorePlus: state.currScore - state.maxScore, maxScore: state.currScore }
			}

			return state
		}

		// default
		default:
			return state
	}
}

export default Reducers
