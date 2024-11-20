import React, { useEffect, useState } from 'react'

export default function Clock() {
  const [time, setTime] = useState('')
  const dateObject = new Date('1970-01-01T00:00:00')

  const appendZeros = value => {
    return value < 10 ? `0${value}` : value
  }

  useEffect(() => {
    setInterval(() => {
      dateObject.setSeconds(dateObject.getSeconds() + 1)
      const hour = dateObject.getHours()
      const minute = dateObject.getMinutes()
      const second = dateObject.getSeconds()

      let currentTime = appendZeros(minute) + ':' + appendZeros(second)
      if (hour > 0) {
        currentTime = appendZeros(hour) + ':' + currentTime
      }

      setTime(currentTime)
    }, 1000)
  }, [])

  if (!time) {
    return ''
  }

  return <p>{time}</p>
}
