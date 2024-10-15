import { useState } from "preact/compat"
import { debounce } from "throttle-debounce"

const SearchInput = ({ handleInputChange }: { handleInputChange: (e: string) => void }) => {
  const [internalInputValue, setInternalInputValue] = useState("")

  const handleChangeDebounced = debounce(250, (e: Event) => {
    const target = e.target as HTMLInputElement

    handleInputChange(target.value)
    setInternalInputValue(target.value)
  })

  return (
    <div id={"input-container"}>
      <div className="form-group">
        <input
          className="input input-small"
          type="text"
          placeholder="Filter"
          onChange={handleChangeDebounced}
          value={internalInputValue}
        />
      </div>
    </div>
  )
}

export default SearchInput
