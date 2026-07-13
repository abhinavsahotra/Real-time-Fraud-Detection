'use client'

import React, { useEffect, useRef, useState } from 'react'

type Option = {
  label: string
  value: string
}

type SelectProps = {
  options: Option[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', width: 200 }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: 6,
          background: 'white',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        {selected ? selected.label : placeholder}
        <span style={{ float: 'right' }}>▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            border: '1px solid #ccc',
            borderRadius: 6,
            background: 'white',
            zIndex: 10,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange?.(option.value)
                setOpen(false)
              }}
              style={{
                padding: '8px',
                cursor: 'pointer',
                background:
                  option.value === value ? '#f0f0f0' : 'transparent',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = '#f5f5f5')
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background =
                  option.value === value ? '#f0f0f0' : 'transparent')
              }
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}