import { useState } from "preact/compat"

const SearchInput = ({ handleInputChange }: { handleInputChange: (e: string) => void }) => {
  const [internalInputValue, setInternalInputValue] = useState("")

  return (
    <div id={"input-container"}>
      <div className="form-group">
        <input
          className="input input-small"
          type="text"
          placeholder="Filter"
          onChange={(e) => {
            const target = e.target as HTMLInputElement

            handleInputChange(target.value)
            setInternalInputValue(target.value)
          }}
          value={internalInputValue}
        />
      </div>
    </div>
  )
}

export default SearchInput
