import {useState, useEffect, useRef} from 'react'
import ServerConfig from './components/ServerConfig'
import ColorPanel from './components/ColorPanel'
import LuminosityDisplay from './components/LuminosityDisplay'
import {sendCommand, getLampState} from './services/fiwareApi'

const App = () => {
  const [orionUrl, setOrionUrl] = useState('')
  const [connected, setConnected] = useState(false)
  const [currentColor, setCurrentColor] = useState('off')
  const [luminosity, setLuminosity] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const intervalRef = useRef(null)

  const handleConnect = async (url) => {
    setOrionUrl(url)
    setError('')
    try {
      const data = await getLampState(url)
      setCurrentColor(data.state)
      setLuminosity(data.luminosity)
      setConnected(true)
    } catch (err) {
      setError('Não foi possível conectar ao Orion. Verifique o IP.')
      setConnected(false)
    }
  }

  const handleColorChange = async (color) => {
    if (!orionUrl) return
    setLoading(true)
    setError('')
    try {
      const ok = await sendCommand(orionUrl, color)
      if (ok) {
        setCurrentColor(color)
      } else {
        setError(`Erro ao enviar comando "${color}"`)
      }
    } catch (err) {
      setError(`Erro de conexão com o servidor`)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (connected && orionUrl) {
      intervalRef.current = setInterval(async () => {
        try {
          const data = await getLampState(orionUrl)
          setLuminosity(data.luminosity)
          setCurrentColor(data.state)
        } catch {

        }
      }, 2000)
    }
    return () => clearInterval(intervalRef.current)
  }, [connected, orionUrl])

  return (
    <div className='min-h-screen bg-gray-900 p-4 md:p-8'>
      <div className='max-w-1g mx-auto flex flex-col gap-6'>
          <h1 className='text-white text-2xl font-bold text-center'>
            Fiware Smart Lamp
          </h1>

          <ServerConfig onConnect={handleConnect} connected={connected}/>

          {error && (
            <div className='bg-red-900/50 border border-red-500 text-red-300 rounded-x1 px-4 py-3 text-sm'>
              {error}
            </div>
          )}

          {connected && (
            <>
              <LuminosityDisplay value={luminosity} />
              <ColorPanel
                currentColor={currentColor}
                onColorChange={handleColorChange}
                loading={loading}
              />
            </>
          )}
      </div>
    </div>
  )
}

export default App