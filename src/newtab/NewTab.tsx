import { useState, useEffect } from 'react'
import './Newtab.css'
import SearchIcon from '@mui/icons-material/Search'
import CircularProgress from '@mui/material/CircularProgress'

const extractHostname = (url: string) => {
  try {
    const { hostname } = new URL(url)
    return hostname.replace('www.', '')
  } catch {
    return url
  }
}

export const NewTab = () => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [chatGptAnswer, setChatGptAnswer] = useState('')
  const [chatContextUsed, setChatContextUsed] = useState('')
  const [braveResults, setBraveResults] = useState<any[]>([])

  const [openaiKey, setOpenaiKey] = useState('')
  const [braveKey, setBraveKey] = useState('')

  // Load keys from chrome.storage
  useEffect(() => {
    chrome.storage.sync.get(['openaiKey', 'braveKey'], (result) => {
      if (result.openaiKey) setOpenaiKey(result.openaiKey)
      if (result.braveKey) setBraveKey(result.braveKey)
    })
  }, [])

  const handleSearch = async () => {
    if (!query.trim() || loading || !openaiKey || !braveKey) return

    setLoading(true)

    try {
      const braveData = await fetchBraveResults(query, braveKey)

      const contextSnippet = braveData?.[0]?.description || ''
      setChatContextUsed(contextSnippet)

      const chatData = await fetchChatGpt(query, contextSnippet, openaiKey)

      setBraveResults(braveData)
      setChatGptAnswer(chatData)
      setSubmitted(true)
    } catch (err) {
      console.error('Search error:', err)
      setChatGptAnswer('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const fetchBraveResults = async (q: string, key: string) => {
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${key}`,
          'x-subscription-token': key,
        },
      },
    )

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Brave API error ${res.status}: ${errText}`)
    }

    const data = await res.json()
    return data.web?.results || []
  }

  const fetchChatGpt = async (q: string, context: string, key: string) => {
    const systemPrompt = context
      ? `You are a helpful assistant. Here's some real-time info: ${context}`
      : 'You are a helpful assistant.'

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: q },
        ],
      }),
    })

    const data = await res.json()
    return data.choices?.[0]?.message?.content || 'No response from ChatGPT.'
  }

  if (submitted) {
    return (
      <div className="split-view">
        <div className="split-column">
          <h2>ChatGPT</h2>
          <div className="chatgpt-content">
            {loading ? (
              'Loading...'
            ) : (
              <>
                <p>{chatGptAnswer}</p>
                {chatContextUsed && (
                  <div className="chat-context">
                    <label>Used source:</label>
                    <blockquote dangerouslySetInnerHTML={{ __html: chatContextUsed }} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="split-column">
          <h2>Google</h2>
          <div className="brave-results">
            {braveResults.map((r, i) => (
              <div key={i} className="result-item">
                <div className="source-line">
                  {r.profile?.image && <img src={r.profile.image} alt="" className="favicon" />}
                  <span className="source-name">{r.profile?.name || extractHostname(r.url)}</span>
                </div>

                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="result-title"
                  dangerouslySetInnerHTML={{ __html: r.title }}
                />

                <div className="source-url">{extractHostname(r.url)}</div>

                <p className="result-snippet" dangerouslySetInnerHTML={{ __html: r.description }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`center-page ${loading ? 'fade-out' : ''}`}>
      <h1 className="title">Sidewise Search</h1>
      <div className="search-box">
        {loading ? (
          <CircularProgress size={20} color="inherit" className="spinner" />
        ) : (
          <SearchIcon className="search-icon" />
        )}
        <input
          type="text"
          placeholder="Search something..."
          value={query}
          disabled={loading}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
    </div>
  )
}
