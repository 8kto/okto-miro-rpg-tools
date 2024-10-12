import { useBlocksRowStrategy } from "./useBlocksRowStrategy"
import { DEFAULT_STRATEGY_ID } from "../consts"
import { GroupableItem } from "@mirohq/websdk-types/stable/features/widgets/group"

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
  run: (props: StrategyProps) => Promise<GroupableItem[]>
  default?: boolean
}

const strategiesMap = {
  useBlocksRowStrategy: {
    run: useBlocksRowStrategy,
    name: "Blocks rows",
    id: "useBlocksRowStrategy",
  } as StrategyDef,
  useDamageNumberStrategy: {
    run: useBlocksRowStrategy,
    name: "Damage numbers",
    id: "useDamageNumberStrategy",
  } as StrategyDef,
}

strategiesMap[DEFAULT_STRATEGY_ID].default = true

export type StrategyId = keyof typeof strategiesMap

export default strategiesMap
