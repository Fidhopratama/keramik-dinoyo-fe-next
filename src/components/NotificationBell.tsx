'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, Check, Package, Shapes, Sparkles, Store } from 'lucide-react'

import useNotifications from '../hooks/useNotifications'
import { MENU_OF, timeAgo } from '../lib/notification'
import type { AppNotification } from '../types/notification'

const ICON = { shop: Store, product: Package, workshop: Shapes, ai: Sparkles }

const css = `
.nb { position: relative; }
.nb-btn { position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border: 1px solid #e5ded8; border-radius: 10px; background: #fff; color: #786d64; cursor: pointer; }
.nb-btn:hover { background: #faf8f6; }
.nb-btn:focus-visible { outline: 2px solid #c9562e; outline-offset: 2px; }
.nb-badge { position: absolute; top: -6px; right: -6px; display: flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px; background: #c9562e; color: #fff; font-size: 11px; font-weight: 700; }
.nb-menu { position: absolute; top: calc(100% + 10px); right: 0; z-index: 9999; width: 340px; overflow: hidden; border: 1px solid #e5ded8; border-radius: 14px; background: #fff; box-shadow: 0 12px 30px rgba(46, 39, 34, 0.12); }
.nb-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #f1ece7; }
.nb-head strong { display: block; font-size: 15px; }
.nb-head span { display: block; margin-top: 2px; color: #8b827b; font-size: 12px; }
.nb-all { display: inline-flex; align-items: center; gap: 4px; padding: 0; border: 0; background: transparent; color: #c9562e; font-size: 12px; cursor: pointer; }
.nb-all:hover { text-decoration: underline; }
.nb-list { max-height: 340px; overflow-y: auto; }
.nb-item { display: flex; align-items: flex-start; gap: 12px; width: 100%; padding: 12px 16px; border: 0; border-bottom: 1px solid #f7f3ef; background: #fff; text-align: left; font: inherit; color: inherit; cursor: pointer; }
.nb-item:hover { background: #fdfbf9; }
.nb-item.unread { background: #fff9f4; }
.nb-ico { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 10px; background: #fbeee4; color: #c9562e; }
.nb-body { flex: 1; min-width: 0; }
.nb-body strong { display: block; font-size: 13px; font-weight: 600; }
.nb-body p { margin: 2px 0 0; overflow: hidden; color: #6f665f; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
.nb-body small { display: block; margin-top: 3px; color: #a59c95; font-size: 11px; }
.nb-dot { flex-shrink: 0; width: 8px; height: 8px; margin-top: 6px; border-radius: 50%; background: #c9562e; }
.nb-empty { padding: 28px 16px; color: #8b827b; font-size: 13px; line-height: 1.5; text-align: center; }
.nb-foot { padding: 10px 16px; border-top: 1px solid #f1ece7; text-align: center; }
`

type Props = {
  onNavigate?: (menu: string) => void
  onOpenSettings?: () => void
}

export default function NotificationBell({ onNavigate, onOpenSettings }: Props) {
  const { visible, unread, readIds, prefsOn, markRead, refreshPrefs } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = () => {
    refreshPrefs()
    setOpen((value) => !value)
  }

  const openItem = (item: AppNotification) => {
    markRead([item.id])
    setOpen(false)
    onNavigate?.(MENU_OF[item.kind])
  }

  return (
    <div className="nb" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <button
        type="button"
        className="nb-btn"
        onClick={toggle}
        aria-label="Notifikasi"
        aria-expanded={open}
      >
        <Bell size={18} aria-hidden="true" />
        {unread.length > 0 && <span className="nb-badge">{unread.length}</span>}
      </button>

      {open && (
        <div className="nb-menu" role="dialog" aria-label="Notifikasi">
          <div className="nb-head">
            <div>
              <strong>Notifikasi</strong>
              <span>
                {unread.length > 0 ? `${unread.length} belum dibaca` : 'Semua sudah dibaca'}
              </span>
            </div>

            {unread.length > 0 && (
              <button
                type="button"
                className="nb-all"
                onClick={() => markRead(visible.map((item) => item.id))}
              >
                <Check size={14} aria-hidden="true" />
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="nb-list">
            {!prefsOn ? (
              <div className="nb-empty">Notifikasi dimatikan di Pengaturan.</div>
            ) : visible.length === 0 ? (
              <div className="nb-empty">Belum ada aktivitas baru dalam 14 hari terakhir.</div>
            ) : (
              visible.map((item) => {
                const Icon = ICON[item.kind]
                const isUnread = !readIds.includes(item.id)

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`nb-item ${isUnread ? 'unread' : ''}`}
                    onClick={() => openItem(item)}
                  >
                    <span className="nb-ico">
                      <Icon size={16} aria-hidden="true" />
                    </span>

                    <span className="nb-body">
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                      <small>{timeAgo(item.time)}</small>
                    </span>

                    {isUnread && <i className="nb-dot" />}
                  </button>
                )
              })
            )}
          </div>

          <div className="nb-foot">
            <button
              type="button"
              className="nb-all"
              onClick={() => {
                setOpen(false)
                onOpenSettings?.()
              }}
            >
              Atur notifikasi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
