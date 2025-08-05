import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"

import "/assets/style.css"
import TokenPanel from "./components/Panel/TokenPanel"
import DiceRoller from "./components/DiceRoller/DiceRoller"
import { dices } from "./data/dices"
import Log from "./components/Log/Log"
import About from "./components/About/About"
import PhasedCombat from "./components/PhasedCombat/PhasedCombat"

export default function App() {
  return (
    <div id="root">
      <Tabs defaultIndex={2}>
        <TabList className="tablist--header">
          <Tab>Tokens</Tab>
          <Tab>Dice roller</Tab>
          <Tab>Combat</Tab>
          <Tab>About</Tab>
        </TabList>

        <TabPanel forceRender>
          <TokenPanel />
        </TabPanel>
        <TabPanel forceRender>
          <DiceRoller dices={dices} />
          <Log />
        </TabPanel>
        <TabPanel forceRender>
          <PhasedCombat />
        </TabPanel>
        <TabPanel>
          <About />
        </TabPanel>
      </Tabs>
    </div>
  )
}
