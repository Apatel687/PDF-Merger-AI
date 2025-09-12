import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext({ notify: () => {} })

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), [])

  const notify = useCallback((message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, message, type }])
    if (duration > 0) setTimeout(() => remove(id), duration)
  }, [remove])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', right: 16, bottom: 16, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} role="status" aria-live="polite" onClick={() => remove(t.id)}
               style={{ cursor: 'pointer', padding: '10px 14px', borderRadius: 8, color: t.type==='error'?'#991b1b':'#0f5132', background: t.type==='error'?'#fde2e2':'#def7ec', border: `1px solid ${t.type==='error'?'#fecaca':'#a7f3d0'}`, boxShadow:'0 6px 16px rgba(0,0,0,0.12)', minWidth: 220 }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}


