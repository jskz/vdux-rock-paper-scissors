import vdux from 'vdux/dom'
import element from 'vdux/element'
import ready from 'domready'

const choices = [
    { name: 'Rock', class: 'rock', beats: ['scissors'] },
    { name: 'Paper', class: 'paper', beats: ['rock']},
    { name: 'Scissors', class: 'scissors', beats: ['paper'] }
]

const initialState = {
    rounds:       []
}

function reducer(state, action) {
    switch(action.type) {
        case 'RESET_GAME':
            return initialState

        case 'USER_CHOICE':
            let computerChoice = parseInt(Math.random() * choices.length),
                winner = 'user'

            if(choices[computerChoice].name === action.data) {
                winner = null
            } else {
                if(choices[computerChoice].beats.includes(action.data.toLowerCase()))
                    winner = 'computer'
            }

            return {
                ...state,
                rounds: [...state.rounds, {
                    userChoice:     action.data,
                    computerChoice: computerChoice,
                    winner:         winner
                }]
            }
    }

    return state
}

const Choice = {
    onClick(option) {
        return {
            type: 'USER_CHOICE',
            data: option
        }
    },

    render({ props }) {
        return <button onClick={() => this.onClick(props.name)} className={props.name}>{props.name}</button>
    }
}

const Score = {
    render({ props }) {
        return (
            <div class="score">
                {props.data.map(round =>
                    <div class="result">
                        <div class="result-datum result-datum-user">
                            User choice: {round.userChoice}
                        </div>

                        <div class="result-datum result-datum-computer">
                            Computer choice: {choices[round.computerChoice].name}
                        </div>

                        <div class="result-datum result-datum-winner">
                            Winner: {round.winner === null ? 'none' : round.winner}
                        </div>

                        <hr />
                    </div>
                )}
            </div>
        )
    }
}

const Game = {
    resetGame() {
        return {
            type: 'RESET_GAME'
        }
    },

    render({ props }) {
        return (
            <main class="game">
                <h1>
                    Rock Paper Scissors

                </h1>

                <button onClick={() => this.resetGame()}>
                    Reset Game State
                </button>

                <h3>
                    User - {props.state.rounds.filter(round => round.winner === 'user').length}
                </h3>

                <h3>
                    Computer - {props.state.rounds.filter(round => round.winner === 'computer').length}
                </h3>

                <hr />

                <div class="playing-area">
                    {choices.map(choice =>
                        <Choice {...choice} />
                    )}
                </div>

                <hr />

                <Score data={props.state.rounds.reverse()} />
            </main>
        )
    }
}

ready(() => vdux({
    reducer,
    initialState,
    app: state => <Game state={state} />
}))
