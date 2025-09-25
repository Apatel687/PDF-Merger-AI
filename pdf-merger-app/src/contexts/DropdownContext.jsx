import { createContext, useContext, useState, useEffect } from 'react'

const DropdownContext = createContext()

export const useDropdown = () => {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error('useDropdown must be used within a DropdownProvider')
  }
  return context
}

export const DropdownProvider = ({ children }) => {
  const [openDropdown, setOpenDropdown] = useState(null)

  const toggleDropdown = (dropdownId) => {
    setOpenDropdown(prev => prev === dropdownId ? null : dropdownId)
  }

  const closeDropdown = () => {
    setOpenDropdown(null)
  }

  const isOpen = (dropdownId) => {
    return openDropdown === dropdownId
  }

  // Global click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.language-switcher') && !event.target.closest('.theme-switcher')) {
        closeDropdown()
      }
    }

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  return (
    <DropdownContext.Provider value={{ toggleDropdown, closeDropdown, isOpen }}>
      {children}
    </DropdownContext.Provider>
  )
}