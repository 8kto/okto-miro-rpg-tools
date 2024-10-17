import { useState, useEffect, useRef } from "preact/compat"
import { LogRecord, LogService, LogStorage } from "../../services/LogService"

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("en-GB", {
    // 'en-GB' uses 24-hour format
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

const Log = () => {
  const [messages, setMessages] = useState<LogStorage>([])
  const logRef = useRef<HTMLDivElement>(null)

  const handleAddLog = (message?: LogRecord) => {
    if (message) {
      setMessages((messages) => messages.concat(message))
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
    <div className="log-records-wrapper">
      <div ref={logRef} className="log-records-list">
        {messages.map((log) => (
          <div key={log.timestamp} className="log-record">
            <div className="log-record--timestamp">⏱️ {formatTimestamp(log.timestamp)}</div>
            <span className="log-record--user">{log.user}</span>: <span className="log-record--title">{log.title}</span>
            : <span className="log-record--text">{log.text}</span>
          </div>
        ))}
      </div>
      <div className="grid-full-width">
        <button className="button button-tertiary w-100" onClick={handleReset}>
          <span className="icon icon-trash"></span>
          Clear logs
        </button>
      </div>
    </div>
  )
}

export default Log
