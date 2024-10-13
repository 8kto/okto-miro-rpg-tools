import { Dice, roll, rollDiceFormula } from "../services/diceUtils"

export type DiceAction = {
  title: string
  action: () => number
}

export const dices: DiceAction[] = [
  { title: "d4", action: () => roll(Dice.d4) },
  { title: "d6", action: () => roll(Dice.d6) },
  { title: "d8", action: () => roll(Dice.d8) },
  { title: "d10", action: () => roll(Dice.d10) },
  { title: "d12", action: () => roll(Dice.d12) },
  { title: "d20", action: () => roll(Dice.d20) },
  { title: "d100", action: () => roll(Dice.d100) },
  { title: "2d20", action: () => rollDiceFormula("2d20") },
  { title: "2d6", action: () => rollDiceFormula("2d6") },
]
