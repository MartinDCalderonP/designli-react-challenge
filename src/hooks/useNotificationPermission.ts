import { useEffect, useState } from 'react'

interface UseNotificationPermissionResult {
  permission: NotificationPermission
  requestPermission: () => void
}

const useNotificationPermission = (): UseNotificationPermissionResult => {
  const [permission, setPermission] = useState(Notification.permission)

  useEffect(() => {
    const updatePermission = () => setPermission(Notification.permission)

    navigator.permissions?.query({ name: 'notifications' }).then((status) => {
      updatePermission()
      status.onchange = updatePermission
    })
  }, [])

  const requestPermission = () => {
    if (permission === 'default') {
      Notification.requestPermission().then((result) => {
        setPermission(result)
      })
    } else if (permission === 'granted') {
      setPermission('default')
    }
  }

  return { permission, requestPermission }
}

export default useNotificationPermission
