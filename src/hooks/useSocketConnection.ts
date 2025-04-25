import { useEffect, useState } from 'react'
import socketService from '@/services/socketService'

const useSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(socketService.getIsConnected())

  const handleConnectionChange = (connected: boolean) => {
    setIsConnected(connected)
  }
  
  useEffect(() => {
    socketService.onConnectionChange(handleConnectionChange)
    setIsConnected(socketService.getIsConnected())
  }, [])

  return isConnected
}

export default useSocketConnection
