import { rollDiceFormula, rollDiceFormulaDetailed } from "ttrpg-lib-dice"
import { formatDiceRollResult } from "../utils/format"

export type DiceAction = {
  title: string
  action: () => [number | null, string]
  type?: "primary" | "secondary"
}

const getFormattedRoll = (formula: string): [number, string] => {
  const res = rollDiceFormulaDetailed(formula)
  return [res.total, formatDiceRollResult(res)]
}

export const dices: DiceAction[] = [
  {
    title: "d4",
    action: () => getFormattedRoll("d4"),
  },
  {
    title: "d6",
    action: () => getFormattedRoll("d6"),
  },
  {
    title: "d8",
    action: () => getFormattedRoll("d8"),
  },
  {
    title: "d10",
    action: () => getFormattedRoll("d10"),
  },
  {
    title: "d12",
    action: () => getFormattedRoll("d12"),
  },
  {
    title: "d20",
    action: () => getFormattedRoll("d20"),
  },
  {
    title: "d100",
    action: () => getFormattedRoll("d100"),
  },
  {
    title: "2d6",
    action: () => getFormattedRoll("2d6"),
    type: "secondary",
  },
  { title: "d20 + 1", action: () => getFormattedRoll("d20 + 1"), type: "secondary" },
  {
    title: "Stats",
    action: () => {
      return [
        null,
        Array.from({ length: 6 })
          .map(() => rollDiceFormula("3d6"))
          .join(", "),
      ]
    },
    type: "secondary",
  },
  {
    title: "Gold",
    action: () => {
      const res = rollDiceFormulaDetailed("3d6")
      return [res.total * 10, `(${formatDiceRollResult(res)}) * 10`]
    },
    type: "secondary",
  },
]
