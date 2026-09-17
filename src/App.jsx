import React, { useState, useEffect, useRef } from 'react'
import ColorPanel from './components/ColorPanel'
import LuminosityDisplay from './components/LuminosityDisplay'
import { sendCommand, getLampState } from './services/fiwareApi'

const App = () => {
  const [connected, setConnected] = useState(false)
  const [currentColor, setCurrentColor] = useState('off')
  const [luminosity, setLuminosity] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const intervalRef = useRef(null)

  const fetchState = async () => {
    try {
      const data = await getLampState()
      setCurrentColor(data.state)
      setLuminosity(data.luminosity)
      setConnected(true)
      setError('')
    } catch {
      setError('Não foi possível conectar ao Orion.')
      setConnected(false)
    }
  }

  const handleColorChange = async (color) => {
    setLoading(true)
    setError('')
    try {
      const ok = await sendCommand(color)
      if (ok) setCurrentColor(color)
      else setError(`Erro ao enviar comando "${color}"`)
    } catch {
      setError('Erro de conexão com o servidor')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchState()
    intervalRef.current = setInterval(fetchState, 2000)
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold">FIWARE Smart Lamp</h1>
          <span className={`text-sm ${connected ? 'text-green-400' : 'text-red-400'}`}>
            {connected ? '● Conectado' : '● Desconectado'}
          </span>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-300 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <LuminosityDisplay value={luminosity} />
        <ColorPanel
          currentColor={currentColor}
          onColorChange={handleColorChange}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default App