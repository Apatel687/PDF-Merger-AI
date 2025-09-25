import { useTheme } from '../contexts/ThemeContext'

export default function ThemeTest() {
  const { isDarkMode, themeMode, setTheme } = useTheme()
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      left: '10px', 
      background: isDarkMode ? '#333' : '#fff',
      color: isDarkMode ? '#fff' : '#333',
      padding: '10px',
      border: '1px solid',
      borderRadius: '5px',
      zIndex: 9999
    }}>
      <div>Current Mode: {themeMode}</div>
      <div>Is Dark: {isDarkMode ? 'Yes' : 'No'}</div>
      <div>
        <button onClick={() => setTheme('light')}>Light</button>
        <button onClick={() => setTheme('dark')}>Dark</button>
        <button onClick={() => setTheme('system')}>System</button>
      </div>
    </div>
  )
}