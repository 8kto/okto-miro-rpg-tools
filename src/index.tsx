import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"

import "/assets/style.css"
import TokenPanel from "./components/Panel/TokenPanel"
import DiceRoller from "./components/DiceRoller/DiceRoller"
import { dices } from "./data/dices"
import Log from "./components/Log/Log"
import About from "./components/About/About"

export default function App() {
  return (
    <div id="root">
      <Tabs selectedIndex={1}>
        <TabList>
          <Tab>Tokens</Tab>
          <Tab>Dice roller</Tab>
          <Tab>About</Tab>
        </TabList>

        <TabPanel forceRender>
          <TokenPanel />
        </TabPanel>
        <TabPanel forceRender>
          <DiceRoller dices={dices} />
          <Log />
        </TabPanel>
        <TabPanel>
          <About />
        </TabPanel>
      </Tabs>
    </div>
  )
}
