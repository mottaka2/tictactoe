'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'
import confetti from 'canvas-confetti'

export default function Home() {
  const [squares, setSquares] = useState(Array(9).fill(''))
  const [xIsNext, setXIsNext] = useState(true)
  const [playerX, setPlayerX] = useState('')
  const [playerO, setPlayerO] = useState('')
  const [namesSet, setNamesSet] = useState(false)
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 })
  const [colorX, setColorX] = useState('#16a34a') // default green for Player X
  const [colorO, setColorO] = useState('#0ea5e9') // default blue for Player O

  const winner = calculateWinner(squares)
  const isDraw = !winner && squares.every(Boolean)

  const status = winner
    ? `Winner: ${winner === 'X' ? playerX : playerO}`
    : isDraw
    ? `Draw!`
    : `Next player: ${xIsNext ? playerX || 'Player X' : playerO || 'Player O'}`

  useEffect(() => {
    if (winner) {
      const updated = { ...score }
      updated[winner] += 1
      setScore(updated)

      // 🎉 Trigger confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      })
    } else if (isDraw) {
      const updated = { ...score }
      updated.draws += 1
      setScore(updated)
    }
  }, [winner, isDraw])

  const handleClick = (index: number) => {
    if (squares[index] || winner) return

    const newSquares = [...squares]
    newSquares[index] = xIsNext ? 'X' : 'O'
    setSquares(newSquares)
    setXIsNext(!xIsNext)
  }

  const handleRestart = () => {
    setSquares(Array(9).fill(''))
    setXIsNext(true)
  }

  const handleResetAll = () => {
    setScore({ X: 0, O: 0, draws: 0 })
    setSquares(Array(9).fill(''))
    setXIsNext(true)
  }

  const handleNewGame = () => {
    setPlayerX('')
    setPlayerO('')
    setSquares(Array(9).fill(''))
    setScore({ X: 0, O: 0, draws: 0 })
    setXIsNext(true)
    setNamesSet(false)
  }

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    if (playerX.trim() && playerO.trim()) {
      setNamesSet(true)
    }
  }

  return (
    <main className={styles.mainContainer}>
  <h1 className={styles.title}>Tic-Tac-Toe</h1>
    <p className={styles.description}>
      A delightful 2-player game of strategy and fun. Customize your colors, challenge a friend, and see who wins!
    </p>
  <div className={styles.container}>
    {!namesSet ? (
      <form onSubmit={handleStart} className={styles.form}>
        <label className={styles.label}>
          <input
            type="text"
            placeholder="Enter Player 1 (X)"
            value={playerX}
            onChange={(e) => setPlayerX(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="color"
            value={colorX}
            onChange={(e) => setColorX(e.target.value)}
            className={styles.colorPicker}
          />
        </label>

        <label className={styles.label}>
          <input
            type="text"
            placeholder="Enter Player 2 (O)"
            value={playerO}
            onChange={(e) => setPlayerO(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="color"
            value={colorO}
            onChange={(e) => setColorO(e.target.value)}
            className={styles.colorPicker}
          />
        </label>

        <button type="submit" className={styles.start}>
          Start Game
        </button>
      </form>
    ) : (
      <div className={styles.gameArea}>
        <div className={styles.scoreboard}>
          <h2>Scoreboard</h2>
          <p>🎮 {playerX || 'Player X'} (X): {score.X}</p>
          <p>🎮 {playerO || 'Player O'} (O): {score.O}</p>
          <p>🤝 Draws: {score.draws}</p>
        </div>

        <div className={styles.game}>
          <div
            className={styles.status}
            style={{
              backgroundColor: winner
                ? '#fef9c3' // light yellow
                : isDraw
                ? '#e0f2fe' // light blue
                : '#d1fae5', // light green
              color: winner
                ? '#92400e'
                : isDraw
                ? '#0369a1'
                : '#065f46',
            }}
          >
            {status}
          </div>
          <div className={styles.board}>
            {squares.map((value, i) => (
              <button
                key={i}
                className={styles.square}
                onClick={() => handleClick(i)}
              >
                {value && (
                  <span style={{ color: value === 'X' ? colorX : colorO }}>
                    {value}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={handleRestart}>
              🔄 Restart
            </button>
            <button className={styles.button} onClick={handleResetAll}>
              🧹 Reset All
            </button>
            <button className={styles.button} onClick={handleNewGame}>
              🆕 New Game
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</main>

  )
}

function calculateWinner(squares: string[]): 'X' | 'O' | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a] as 'X' | 'O'
    }
  }

  return null
}
