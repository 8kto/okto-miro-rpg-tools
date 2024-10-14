import { useState, useEffect, useRef } from "preact/compat"
import { LogService, LogStorage } from "../../services/LogService"

const Log = () => {
  const [messages, setMessages] = useState<LogStorage>([])
  const logRef = useRef<HTMLDivElement>(null)

  // Function to handle broadcast messages and update the log
  const handleAddLog = (messages?: string) => {
    if (messages?.length) {
      // FIXME types
      // @ts-ignore
      setMessages(messages)
    }
  }

  const handleReset = () => {
    void LogService.getInstance().reset()
    setMessages([])
  }

  // Scroll the log to the bottom when a new message is added
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [messages])

  // Listen for new messages from the board
  useEffect(() => {
    LogService.getInstance().onAdd(handleAddLog)

    // Cleanup on component unmount
    return () => {
      LogService.getInstance().offAdd(handleAddLog)
    }
  }, [])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "80vh", // Occupies full height of the viewport
        padding: "10px",
      }}
    >
      <div
        ref={logRef}
        style={{
          flexGrow: 1, // Allows the log area to grow and take up available space
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
          margin: "10px 0",
          fontSize: "18px",
        }}
      >
        {messages.map((message, index) => (
          <div key={index}>{message.text}</div>
        ))}
      </div>
      <div className="grid-full-width">
        <button className="button button-tertiary w-100" onClick={handleReset}>
          <span class="icon icon-trash"></span>
          Clear logs
        </button>
      </div>
    </div>
  )
}

export default Log
