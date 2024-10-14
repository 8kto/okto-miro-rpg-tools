import { useState, useEffect, useRef } from "preact/compat"
import { LogService, LogStorage } from "../../services/LogService"

const Log = () => {
  const [messages, setMessages] = useState<LogStorage>([])
  const logRef = useRef<HTMLDivElement>(null)

  const handleAddLog = (messages?: LogStorage) => {
    if (messages?.length) {
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

  useEffect(() => {
    const cleanup = LogService.getInstance().onAdd(handleAddLog)

    return () => {
      void cleanup()
    }
  }, [])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        padding: "10px",
      }}
    >
      <div
        ref={logRef}
        style={{
          flexGrow: 1,
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
