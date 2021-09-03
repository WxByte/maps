import React, { useState, useEffect } from 'react'
import { useMapbox } from '../../mapbox'
import CircleRenderer from './circle-renderer'

const RegionPicker = ({
  backgroundColor,
  center,
  color,
  fontFamily,
  radius,
  onIdle,
  onDrag,
  units,
}) => {
  const { map } = useMapbox()
  const [renderer, setRenderer] = useState(null)

  useEffect(() => {
    const renderer = CircleRenderer({
      map,
      onIdle,
      onDrag,
      initialCenter: center,
      initialRadius: radius,
      units,
    })

    setRenderer(renderer)

    return function cleanup() {
      // need to check load state for fast-refresh purposes
      if (map.loaded()) renderer.remove()
    }
  }, [])

  return (
    <svg
      id='circle-picker'
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <path
        id='circle'
        stroke={color}
        strokeWidth={1}
        fill='transparent'
        cursor='move'
      />
      <mask id='circle-mask'>
        <rect x='0' y='0' width='100%' height='100%' fill='#FFFFFF' />
        <path id='circle-mask-cutout' fill='#000000' />
      </mask>
      <rect
        x='0'
        y='0'
        width='100%'
        height='100%'
        mask='url(#circle-mask)'
        fill={backgroundColor}
        fillOpacity={0.8}
      />
      <circle id='handle' r={8} fill={color} cursor='ew-resize' />
      <line
        id='radius-guideline'
        stroke={color}
        strokeOpacity={0}
        strokeWidth={1}
        strokeDasharray='3,2'
      />
      <g id='radius-text-container'>
        <text
          id='radius-text'
          textAnchor='middle'
          fontFamily={fontFamily}
          fill={color}
        />
      </g>
    </svg>
  )
}

export default RegionPicker
