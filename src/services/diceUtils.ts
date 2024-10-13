export enum Dice {
  d4 = 4,
  d6 = 6,
  d8 = 8,
  d10 = 10,
  d12 = 12,
  d20 = 20,
  d100 = 100,
}

/**
 * Generates a cryptographically secure random integer between min (inclusive) and max (inclusive)
 */
export const secureRandomInteger = (min: number, max: number): number => {
  const range = max - min + 1
  const maxUint32 = 0xffffffff
  const limit = maxUint32 - (maxUint32 % range)
  let randomValue

  do {
    randomValue = crypto.getRandomValues(new Uint32Array(1))[0]
  } while (randomValue >= limit)

  return min + (randomValue % range)
}

export const roll = (dice = Dice.d100): number => secureRandomInteger(1, dice)

export const rollDiceFormula = (formula: string): number => {
  const [numDice, numSides] = formula.split("d").map(Number)

  if (isNaN(numDice) || isNaN(numSides)) {
    throw new Error("Invalid dice formula")
  }

  let total = 0

  for (let i = 0; i < numDice; i++) {
    total += roll(numSides)
  }

  return total
}

export const getRandomArrayItem = <T = unknown>(arr: Array<T>): T => {
  if (!arr.length) {
    throw new Error("Empty array")
  }

  return arr[secureRandomInteger(0, arr.length - 1)]
}

export const getRandomArrayItems = <T = unknown>(arr: Array<T>, count: number): Array<T> => {
  if (count > arr.length) {
    throw new Error("Requested more elements than are present in the array")
  }
  if (!count) {
    throw new Error("Count should be more than 0")
  }

  const result: Array<T> = []
  const usedIndices = new Set<number>()

  while (result.length < count) {
    const index = secureRandomInteger(0, arr.length - 1)
    if (!usedIndices.has(index)) {
      usedIndices.add(index)
      result.push(arr[index])
    }
  }

  return result
}
