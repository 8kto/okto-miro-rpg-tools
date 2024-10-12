import { GroupableItem } from "@mirohq/websdk-types/stable/features/widgets/group"
import { getSpacing } from "../utils.getSpacing"
import { StrategyProps } from "./index"

export const useBlocksRowStrategy = async ({
  x,
  y,
  width,
  n = 8,
  tokenSize,
}: StrategyProps): Promise<GroupableItem[]> => {
  const MAGIC_BOTTOM_OFFSET = y + getSpacing(tokenSize)
  const MAGIC_LEFT_OFFSET = x - width / 2.5
  const MAGIC_OFFSET_STEP = 15

  const { board } = miro
  const hpTextPromises = Array.from({ length: n }, (_, i) =>
    board.createText({
      content: "x",
      x: MAGIC_LEFT_OFFSET + i * MAGIC_OFFSET_STEP,
      y: MAGIC_BOTTOM_OFFSET,
      width: 1,
      style: {
        textAlign: "center",
        fontSize: 14,
        fillColor: "#000",
        color: "#fff",
      },
    }),
  )

  const spaceTextPromises = Array.from({ length: n }, (_, i) =>
    board.createText({
      content: " ",
      x: MAGIC_LEFT_OFFSET + i * MAGIC_OFFSET_STEP,
      y: MAGIC_BOTTOM_OFFSET,
      width: 1,
      style: {
        textAlign: "left",
        fontSize: 14,
        fillColor: "#fff",
        color: "#000",
      },
    }),
  )

  const [hpTextBlocks, spaceTextBlocks] = await Promise.all([
    Promise.all(hpTextPromises),
    Promise.all(spaceTextPromises),
  ])

  return hpTextBlocks.concat(spaceTextBlocks)
}
