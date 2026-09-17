
const LuminosityDisplay = ({value}) => {
    const getBarColor = () => {
        if (value < 30) return "bg-red-500"
        if (value < 60) return "bg-yellow-500" 
        return "bg-green-500"
    }
  return (
    <div className="bg-gray-800 rounded-2x1 p-6">
        <h2 className="text-white text-lg font-semibold mb-4">Luminosidade</h2>
        <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
                    style={{width: `${value}%`}}
                />
            </div>
            <span className="text-white text-2xl font-bold min-w-15 text-right">
                {value}%
            </span>
        </div>
    </div>
  )
}

export default LuminosityDisplay