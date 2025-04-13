import { useEffect, useState } from 'react'

export const Options = () => {
  const [openaiKey, setOpenaiKey] = useState('')
  const [braveKey, setBraveKey] = useState('')

  useEffect(() => {
    chrome.storage.sync.get(['openaiKey', 'braveKey'], (result) => {
      if (result.openaiKey) setOpenaiKey(result.openaiKey)
      if (result.braveKey) setBraveKey(result.braveKey)
    })
  }, [])

  const saveKeys = () => {
    chrome.storage.sync.set({ openaiKey, braveKey }, () => {
      alert('API keys saved!')
    })
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>Sidewise Search Settings</h2>
      <label>OpenAI API Key:</label>
      <input
        style={{ width: '100%', marginBottom: 10 }}
        value={openaiKey}
        onChange={(e) => setOpenaiKey(e.target.value)}
      />
      <label>Brave Search API Key:</label>
      <input
        style={{ width: '100%', marginBottom: 10 }}
        value={braveKey}
        onChange={(e) => setBraveKey(e.target.value)}
      />
      <button onClick={saveKeys}>Save</button>
    </div>
  )
}

export default Options
