import { GroupableItem } from "@mirohq/websdk-types/stable/features/widgets/group"
import { getSpacing } from "../utils.getSpacing"
import { StrategyProps } from "./index"
import { getTitleFontSize } from "../utils"

const { board } = miro

const MAX_HP = 18

/**
 * Creates a stack of texts (Damage: 0, Damage: -1, ... Damage: -MAX_HP)
 * So that HPs can be tracked just by a removing the topmost
 */
export const useDamageNumberStrategy = async ({ x, y, tokenSize }: StrategyProps): Promise<GroupableItem[]> => {
  const hpTextPromises = Array.from({ length: MAX_HP }, (_, i) => {
    const damage = MAX_HP - i - 1
    return board.createText({
      content: `Damage: ${damage === 0 ? "" : `-`}${damage}`,
      x,
      y: y + getSpacing(tokenSize),
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
