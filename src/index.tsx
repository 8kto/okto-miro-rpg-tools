import "/assets/style.css"
import Panel from "./components/Panel/Panel"
import DiceRoller from "./components/DiceRoller/DiceRoller"
import { dices } from "./data/dices"
import Log from "./components/Log/Log"

export default function App() {
  return (
    <div id="root">
      <DiceRoller dices={dices} />
      <Log />
      <hr />
      <Panel />
    </div>
  )
}
