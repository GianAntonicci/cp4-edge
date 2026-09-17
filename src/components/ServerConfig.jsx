import { useState } from "react"

const ServerConfig = ({onConnect, connected}) => {
    const [ip, setIp] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        if (ip.trim()) {
            const url = ip.startsWith("http") ? ip : `http://${ip}:1026`
            onConnect(url)
        }
    }
  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-6 flex gap-3 items-end">
        <div className="flex-1">
            <label className="text-gray-400 text-sm mb-1 block">IP do servidor (Orion)</label>
            <input
                type="text"
                value={ip}
                onChange={(event) => setIp(event.target.value)}
                placeholder="100.27.187.63"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
            />
        </div>
        <button
            type="submit"
            className={`px-6 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${connected
                ? "bg-green-600 text-white"
                : "bg-cyan-600 hover:bg-cyan-500 text-white"
            }`}
        >
            {connected ? "Conectado" : "Conectar"}
        </button>
    </form>
  )
}

export default ServerConfig