import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/contexts/NotificationContext";
import { Bell, X } from "lucide-react";

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Close dropdown when clicking outside
  // (Optional: implement if you want, or use a UI lib's dropdown)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setDropdownOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Open notifications"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {dropdownOpen && (
        <Card className="absolute right-0 top-12 w-80 shadow-lg border border-slate-200 z-50 bg-white">
          <div className="p-4 border-b border-slate-100 font-semibold text-lg">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${!notification.isRead ? "bg-blue-50" : ""}`}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.isRead ? "bg-blue-500" : "bg-transparent"}`} />
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{notification.title}</div>
                      <div className="text-slate-600 text-sm truncate">{notification.message}</div>
                      <div className="text-xs text-slate-400 mt-1">{notification.time}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-500">No notifications</div>
            )}
          </div>
          <div className="p-2 text-center">
            <Button
              variant="link"
              className="text-sm text-primary hover:text-primary/80"
              onClick={() => {
                setDropdownOpen(false);
                setModalOpen(true);
              }}
              disabled={notifications.length === 0}
            >
              View All Notifications
            </Button>
          </div>
        </Card>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <Card className="relative w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <span className="text-lg font-semibold">Notifications</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAsRead()}
                  disabled={notifications.length === 0 || unreadCount === 0}
                >
                  Mark all as read
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close notifications"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${!notification.isRead ? "bg-blue-50" : ""}`}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.isRead ? "bg-blue-500" : "bg-transparent"}`} />
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{notification.title}</div>
                        <div className="text-slate-600 text-sm">{notification.message}</div>
                        <div className="text-xs text-slate-400 mt-1">{notification.time}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500">No notifications</div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
