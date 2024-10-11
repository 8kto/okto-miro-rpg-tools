import '/assets/style.css'
import tokens from './data/tokenExports'
import Panel from './components/panel/Panel'

export default function App() {
  return (
    <div id="root">
      <Panel tokens={tokens} />
    </div>
  )
}
