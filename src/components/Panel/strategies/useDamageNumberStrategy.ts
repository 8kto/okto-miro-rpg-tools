import { GroupableItem } from "@mirohq/websdk-types/stable/features/widgets/group"
import { StrategyProps } from "./index"
import { getTitleFontSize } from "../utils"

const MAX_HP = 18

/**
 * Creates a stack of texts (Damage: 0, Damage: -1, ... Damage: -MAX_HP)
 * So that HPs can be tracked just by a removing the topmost
 */
export const useDamageNumberStrategy = async ({ x, y, tokenSize }: StrategyProps): Promise<GroupableItem[]> => {
  const { board } = miro
  const hpTextPromises = Array.from({ length: MAX_HP }, (_, i) => {
    const damage = MAX_HP - i - 1
    return board.createText({
      content: `Damage: ${damage === 0 ? "" : `-`}${damage}`,
      x,
      y: y + tokenSize / 2 + 10,
      style: {
        textAlign: "center",
        fontSize: getTitleFontSize(tokenSize),
        fillColor: "#000",
        color: "#fff",
      },
    })
  })

  return await Promise.all(hpTextPromises)
}
