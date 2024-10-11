import { DEFAULT_SPACING, DEFAULT_TOKEN_SIZE } from './consts'

export const getSpacing = (input: number): number => {
  const ratio = DEFAULT_SPACING / DEFAULT_TOKEN_SIZE;
  return Math.round(input * ratio) + 5;
}