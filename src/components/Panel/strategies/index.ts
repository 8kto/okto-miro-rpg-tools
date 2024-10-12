import { useBlocksRowStrategy } from "./useBlocksRowStrategy"
import { DEFAULT_STRATEGY_ID } from "../consts"
import { GroupableItem } from "@mirohq/websdk-types/stable/features/widgets/group"
import { useDamageNumberStrategy } from "./useDamageNumberStrategy"

export type StrategyProps = {
  x: number
  y: number
  n: number
  width: number
  tokenSize: number
}

export type StrategyDef = {
  id: string
  name: string
  details: string
  run: (props: StrategyProps) => Promise<GroupableItem[]>
  default?: boolean
}

const strategiesMap = {
  useBlocksRowStrategy: {
    run: useBlocksRowStrategy,
    name: "Blocks Rows",
    details: "Double-click the bottom block (below the token) and remove blocks from the right to track hit points.",
    id: "useBlocksRowStrategy",
  } as StrategyDef,
  useDamageNumberStrategy: {
    run: useDamageNumberStrategy,
    name: "Damage Numbers",
    details:
      "Double-click the bottom text block (below the token) and remove top blocks one by one to track hit points.",
    id: "useDamageNumberStrategy",
  } as StrategyDef,
}

strategiesMap[DEFAULT_STRATEGY_ID].default = true

export type StrategyId = keyof typeof strategiesMap

export default strategiesMap
