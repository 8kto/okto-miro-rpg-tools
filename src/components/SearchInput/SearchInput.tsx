import { useState } from "preact/compat"

const Input = ({ handleInputChange }: { handleInputChange: (e: string) => void }) => {
  const [internalInputValue, setInternalInputValue] = useState("")

  return (
    <div id={"input-container"}>
      <div className="form-group">
        <input
          className="input input-small"
          type="text"
          placeholder="Search assets"
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

export default Input
