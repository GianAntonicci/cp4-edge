
const CollorButton = ({ color, hex, isActive, onClick, loading}) => {
  return (    
    <button
        onClick={() => onClick(color)}
        disabled={loading}
        className={`w-16 h-16 rounded-xl border-4 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isActive ? 'border-white shadow-lg scale-105' : 'border-transparent'}`}
        style={{ backgroundColor: hex}}
        title={color}
    />
  )
}

export default CollorButton