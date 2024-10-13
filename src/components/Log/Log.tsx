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
    <>
      <div
        ref={logRef}
        style={{
          height: "200px",
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
        <button className="button button-secondary w-100" onClick={handleReset}>
          Clear logs
        </button>
      </div>
    </>
  )
}

export default Log
