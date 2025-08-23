import { Dice, roll, rollDiceFormula } from "ttrpg-lib-dice"

export type DiceAction = {
  title: string
  action: () => number | string
  type?: "primary" | "secondary"
}

export const dices: DiceAction[] = [
  { title: "d4", action: () => roll(Dice.d4) },
  { title: "d6", action: () => roll(Dice.d6) },
  { title: "d8", action: () => roll(Dice.d8) },
  { title: "d10", action: () => roll(Dice.d10) },
  { title: "d12", action: () => roll(Dice.d12) },
  { title: "d20", action: () => roll(Dice.d20) },
  { title: "d100", action: () => roll(Dice.d100) },
  { title: "2d6", action: () => rollDiceFormula("2d6"), type: "secondary" },
  { title: "d20 + 1", action: () => rollDiceFormula("d20 + 1"), type: "secondary" },
  {
    title: "Stats",
    action: () => {
      return Array.from({ length: 6 })
        .map(() => rollDiceFormula("3d6"))
        .join(", ")
    },
    type: "secondary",
  },
  { title: "Gold", action: () => rollDiceFormula("3d6") * 10, type: "secondary" },
]
