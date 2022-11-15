import { useEffect, useState } from 'react'

const PREFIX = 'chatt-app-'

export default function useLocalStorage(key, initialValue) {
  const prefixedKey = PREFIX + key
  const [value, setValue] = useState(() => {

    const jsonValue = localStorage.getItem(prefixedKey)
    console.log('jsonValue --> ', jsonValue);
    if (jsonValue === undefined) return 1
    else if (jsonValue != null) return JSON.parse(jsonValue)
    if (typeof initialValue === 'function') {
      return initialValue()
    } else {
      return initialValue
    }
  })

  useEffect(() => {
    console.log('prefixedKey2 --> ', prefixedKey);
    console.log('value2 --> ', value);
    if (value === undefined) localStorage.setItem(prefixedKey, 1) 
    else localStorage.setItem(prefixedKey, JSON.stringify(value))
  }, [prefixedKey, value])

  return [value, setValue]
}
