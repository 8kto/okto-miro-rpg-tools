import "/assets/style.css"
import Panel from "./components/Panel/Panel"
import DiceRoller from "./components/DiceRoller/DiceRoller"
import { dices } from "./data/dices"

export default function App() {
  return (
    <div id="root">
      <DiceRoller dices={dices} />
      <Panel />
    </div>
  )
}
