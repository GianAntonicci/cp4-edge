import ColorButton from './CollorButton'

const COLORS = [
  { color: "red", hex: "#EF4444" },
  { color: "green", hex: "#22C55E" },
  { color: "blue", hex: "#3B82F6" },
  { color: "yellow", hex: "#EAB308" },
  { color: "cyan", hex: "#06B6D4" },
  { color: "magenta", hex: "#D946EF" },
  { color: "white", hex: "#F3F4F6" },
  { color: "off", hex: "#374151" },
]

const ColorPanel = ({currentColor, onColorChange, loading}) => {
  return (
    <div className='bg-gray-800 rounded-2xl p-6'>
        <h2 className='text-white text-lg font-semibold mb-4'>Controle do LED RGB</h2>
        <div className='grid grid-cols-4 gap-4 justify-items-center'>
            {COLORS.map((c) => (
                <div key={c.color} className='flex flex-col items-center gap-1'>
                    <ColorButton
                        color={c.color}
                        hex={c.hex}
                        isActive={currentColor === c.color}
                        onClick={onColorChange}
                        loading={loading}
                    />
                    <span className='text-gray-400 text-xs capitalize'>{c.color}</span>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ColorPanel