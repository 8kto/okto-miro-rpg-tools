import { Dice } from "../../services/diceUtils"

const DiceIcons = {
  [Dice.d4]: (
    <svg viewBox="0 0 100 100" width="16" height="16" aria-label="d4">
      <polygon points="50,10 90,90 10,90" fill="#444" stroke="#fff" strokeWidth="5" />
    </svg>
  ),

  [Dice.d6]: (
    <svg viewBox="0 0 100 100" width="16" height="16" aria-label="d6">
      <rect x="10" y="10" width="80" height="80" rx="10" fill="#444" stroke="#fff" strokeWidth="5" />
    </svg>
  ),

  [Dice.d8]: (
    <svg viewBox="0 0 100 100" width="16" height="16" aria-label="d8">
      <polygon points="50,5 95,50 50,95 5,50" fill="#444" stroke="#fff" strokeWidth="5" />
    </svg>
  ),

  [Dice.d10]: (
    <svg viewBox="0 0 100 100" width="16" height="16" aria-label="d10">
      <polygon points="50,5 90,30 75,95 25,95 10,30" fill="#444" stroke="#fff" strokeWidth="5" />
    </svg>
  ),

  [Dice.d12]: (
    <svg viewBox="0 0 100 100" width="16" height="16" aria-label="d12">
      <polygon
        points="50,5 80,15 95,40 90,70 70,90 50,95 30,90 10,70 5,40 20,15"
        fill="#444"
        stroke="#fff"
        strokeWidth="5"
      />
    </svg>
  ),

  [Dice.d20]: (
    <svg viewBox="0 0 100 100" width="16" height="16" aria-label="d20">
      <circle cx="50" cy="50" r="45" fill="#444" stroke="#fff" strokeWidth="5" />
      <text x="50" y="60" textAnchor="middle" fontSize="30" fill="#fff" fontFamily="sans-serif">
        20
      </text>
    </svg>
  ),

  [Dice.d100]: (
    <svg viewBox="0 0 100 100" width="16" height="16" aria-label="d100">
      <circle cx="50" cy="50" r="45" fill="#444" stroke="#fff" strokeWidth="5" />
      <text x="50" y="60" textAnchor="middle" fontSize="26" fill="#fff" fontFamily="sans-serif">
        100
      </text>
    </svg>
  ),
}

/*
        {DiceIcons[Dice.d4]}
        {DiceIcons[Dice.d6]}
        {DiceIcons[Dice.d8]}
        {DiceIcons[Dice.d10]}
        {DiceIcons[Dice.d12]}
        {DiceIcons[Dice.d20]}
        {DiceIcons[Dice.d100]}
 */

export default DiceIcons
