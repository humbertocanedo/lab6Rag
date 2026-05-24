import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import ModeSelector from './components/ModeSelector.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import InputBar from './components/InputBar.jsx'
import { useChat } from './hooks/useChat.js'

export default function App() {
  const chat = useChat()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar
        modeId={chat.modeId}
        onClear={chat.clearConversation}
        messageCount={chat.messageCount}
        lastModel={chat.lastModelUsed}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="app-main">
        <Header
          theme={chat.theme}
          onToggleTheme={chat.toggleTheme}
          onOpenSidebar={() => setSidebarOpen(true)}
          messageCount={chat.messageCount}
          model={chat.lastModelUsed}
        />
        <ModeSelector
          activeId={chat.modeId}
          onChange={chat.setModeId}
        />
        <ChatWindow
          messages={chat.messages}
          isLoading={chat.isLoading}
          error={chat.error}
          modeId={chat.modeId}
          onPickSuggestion={chat.sendMessage}
          onPickMode={chat.setModeId}
          onRetry={chat.retryLast}
        />
        <InputBar
          onSend={chat.sendMessage}
          onStop={chat.stop}
          isLoading={chat.isLoading}
          modeId={chat.modeId}
        />
      </main>
    </div>
  )
}
