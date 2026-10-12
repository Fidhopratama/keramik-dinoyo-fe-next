'use client'

import { Bell, Check } from 'lucide-react'
import { useEffect, useState } from 'react'

const notifications = [
  {
    id: 1,
    type: 'workshop',
    title: 'Pendaftaran workshop baru',
    time: '5 menit',
  },
  {
    id: 2,
    type: 'ai',
    title: 'Analisis AI selesai',
    time: '45 menit',
  },
  {
    id: 3,
    type: 'system',
    title: 'Data toko diperbarui',
    time: '26 jam',
  },
]

const targetMap = {
  workshop: 'Workshop',
  ai: 'Verifikasi AI',
  system: 'Toko',
}

function readSettings() {
  if (typeof window === 'undefined') {
    return {
      notifications: true,
    }
  }

  try {
    const saved = localStorage.getItem(
      'dinoyo_admin_settings',
    )

    if (!saved) {
      return {
        notifications: true,
      }
    }

    const parsed = JSON.parse(saved)

    return {
      notifications:
        parsed.notifications !== false,
    }
  } catch {
    return {
      notifications: true,
    }
  }
}

function readReadIds() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const saved = localStorage.getItem(
      'dinoyo_notifications_read',
    )

    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function NotificationBell({
  onNavigate,
  onOpenSettings,
}) {
  const [open, setOpen] = useState(false)
  const [readIds, setReadIds] = useState([])
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    setReadIds(readReadIds())
    setEnabled(readSettings().notifications)

    const handleSettingsUpdate = () => {
      setEnabled(readSettings().notifications)
    }

    window.addEventListener(
      'dinoyo-settings-updated',
      handleSettingsUpdate,
    )

    return () => {
      window.removeEventListener(
        'dinoyo-settings-updated',
        handleSettingsUpdate,
      )
    }
  }, [])

  useEffect(() => {
    if (!open) return

    const handleOutside = (event) => {
      if (
        !event.target.closest(
          '.nb-wrapper',
        )
      ) {
        setOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutside,
    )

    document.addEventListener(
      'keydown',
      handleEscape,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutside,
      )

      document.removeEventListener(
        'keydown',
        handleEscape,
      )
    }
  }, [open])

  const unreadCount = enabled
    ? notifications.filter(
        (item) => !readIds.includes(item.id),
      ).length
    : 0

  const markAllRead = () => {
    const ids = notifications.map(
      (item) => item.id,
    )

    setReadIds(ids)

    try {
      localStorage.setItem(
        'dinoyo_notifications_read',
        JSON.stringify(ids),
      )
    } catch {}
  }

  const handleNotificationClick = (
    notification,
  ) => {
    const nextReadIds = Array.from(
      new Set([
        ...readIds,
        notification.id,
      ]),
    )

    setReadIds(nextReadIds)

    try {
      localStorage.setItem(
        'dinoyo_notifications_read',
        JSON.stringify(nextReadIds),
      )
    } catch {}

    setOpen(false)

    const target =
      targetMap[notification.type]

    if (target) {
      onNavigate?.(target)
    }
  }

  const handleSettings = () => {
    setOpen(false)
    onOpenSettings?.()
  }

  return (
    <div className="nb-wrapper">
      <button
        type="button"
        className="notification"
        aria-label="Notifikasi"
        onClick={() => setOpen((value) => !value)}
      >
        <Bell
          size={18}
          aria-hidden="true"
        />

        {enabled && unreadCount > 0 && (
          <span className="nb-badge">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="nb-panel">
          <div className="nb-header">
            <div>
              <strong>Notifikasi</strong>

              <span>
                {unreadCount > 0
                  ? `${unreadCount} belum dibaca`
                  : 'Semua sudah dibaca'}
              </span>
            </div>

            {enabled &&
              unreadCount > 0 && (
                <button
                  type="button"
                  className="nb-read-all"
                  onClick={markAllRead}
                >
                  <Check
                    size={13}
                    aria-hidden="true"
                  />
                  Tandai semua dibaca
                </button>
              )}
          </div>

          {!enabled ? (
            <div className="nb-empty">
              <strong>
                Notifikasi dinonaktifkan
              </strong>

              <p>
                Aktifkan notifikasi di
                Pengaturan.
              </p>

              <button
                type="button"
                onClick={handleSettings}
              >
                Buka Pengaturan
              </button>
            </div>
          ) : (
            <div className="nb-list">
              {notifications.map(
                (notification) => {
                  const unread =
                    !readIds.includes(
                      notification.id,
                    )

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      className={`nb-item ${
                        unread ? 'unread' : ''
                      }`}
                      onClick={() =>
                        handleNotificationClick(
                          notification,
                        )
                      }
                    >
                      <span className="nb-dot" />

                      <span className="nb-item-content">
                        <strong>
                          {
                            notification.title
                          }
                        </strong>

                        <span>
                          {notification.time}
                        </span>
                      </span>
                    </button>
                  )
                },
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .nb-wrapper {
          position: relative;
        }

        .notification {
          position: relative;
          cursor: pointer;
          background: #fff;
        }

        .nb-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          border-radius: 999px;
          background: #c97b4a;
          color: #fff;
          font-size: 8px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .nb-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 330px;
          background: #fff;
          border: 1px solid #e5ded8;
          border-radius: 14px;
          box-shadow: 0 12px 30px
            rgba(46, 39, 34, 0.12);
          z-index: 9999;
          overflow: hidden;
        }

        .nb-header {
          padding: 15px 16px;
          border-bottom: 1px solid #eee9e5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .nb-header strong,
        .nb-header span {
          display: block;
        }

        .nb-header strong {
          color: #342e2a;
          font-size: 13px;
        }

        .nb-header span {
          margin-top: 3px;
          color: #918982;
          font-size: 10px;
        }

        .nb-read-all {
          border: 0;
          background: transparent;
          color: #a85e34;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 9px;
          white-space: nowrap;
          cursor: pointer;
        }

        .nb-list {
          max-height: 330px;
          overflow-y: auto;
        }

        .nb-item {
          width: 100%;
          border: 0;
          background: #fff;
          padding: 13px 16px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          text-align: left;
          cursor: pointer;
        }

        .nb-item:hover {
          background: #faf5f0;
        }

        .nb-item.unread {
          background: #fffaf6;
        }

        .nb-dot {
          width: 7px;
          height: 7px;
          margin-top: 5px;
          flex-shrink: 0;
          border-radius: 50%;
          background: transparent;
        }

        .nb-item.unread .nb-dot {
          background: #c97b4a;
        }

        .nb-item-content {
          min-width: 0;
        }

        .nb-item-content strong,
        .nb-item-content span {
          display: block;
        }

        .nb-item-content strong {
          color: #4a423d;
          font-size: 11px;
          font-weight: 600;
        }

        .nb-item-content span {
          margin-top: 4px;
          color: #9a918a;
          font-size: 9px;
        }

        .nb-empty {
          padding: 24px 18px;
          text-align: center;
        }

        .nb-empty strong {
          display: block;
          color: #4a423d;
          font-size: 12px;
        }

        .nb-empty p {
          margin: 6px 0 14px;
          color: #918982;
          font-size: 10px;
        }

        .nb-empty button {
          border: 0;
          border-radius: 7px;
          padding: 8px 12px;
          background: #b96f42;
          color: #fff;
          font-size: 10px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default NotificationBell