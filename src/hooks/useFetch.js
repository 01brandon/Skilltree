// custom data fetching hook - handles loading, error, and data states
import { useState, useEffect, useRef } from 'react'

// useFetch - generic fetch hook for external apis
export function useFetch(url, options) {
  var [data, setData]       = useState(null)
  var [loading, setLoading] = useState(false)
  var [error, setError]     = useState(null)
  var controllerRef         = useRef(null)

  useEffect(function () {
    if (!url) return

    // abort any in-flight request when url changes
    controllerRef.current = new AbortController()
    setLoading(true)
    setError(null)

    fetch(url, { ...options, signal: controllerRef.current.signal })
      .then(function (res) {
        if (!res.ok) throw new Error('request failed: ' + res.status)
        return res.json()
      })
      .then(function (json) {
        setData(json)
        setLoading(false)
      })
      .catch(function (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
          setLoading(false)
        }
      })

    return function () {
      if (controllerRef.current) controllerRef.current.abort()
    }
  }, [url])

  return { data, loading, error }
}

// useFirestoreFetch - wraps a firestore query promise
export function useFirestoreFetch(queryFn, deps) {
  var [data, setData]       = useState(null)
  var [loading, setLoading] = useState(true)
  var [error, setError]     = useState(null)

  useEffect(function () {
    var cancelled = false
    setLoading(true)

    queryFn()
      .then(function (result) {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch(function (err) {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return function () { cancelled = true }
  }, deps || [])

  return { data, loading, error, setData }
}