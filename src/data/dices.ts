import { Dice, roll } from "../services/DiceRoller"

export type DiceAction = {
  dice: Dice;
  action: () => number;
};

export const dices: DiceAction[] = [
  {dice: Dice.d4, action: () => roll(Dice.d4)},
  {dice: Dice.d6, action: () => roll(Dice.d6)},
  {dice: Dice.d8, action: () => roll(Dice.d8)},
  {dice: Dice.d10, action: () => roll(Dice.d10)},
  {dice: Dice.d12, action: () => roll(Dice.d12)},
  {dice: Dice.d20, action: () => roll(Dice.d20)},
]