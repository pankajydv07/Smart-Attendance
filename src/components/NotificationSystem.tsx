import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const NotificationSystem = ({ notifications, onDismiss }: NotificationSystemProps) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications.slice(0, 3)); // Show only latest 3
  }, [notifications]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'info':
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getCardClass = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-success/20 bg-success-light/20';
      case 'error':
        return 'border-destructive/20 bg-destructive/5';
      case 'info':
        return 'border-primary/20 bg-primary/5';
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {visibleNotifications.map((notification) => (
        <Card 
          key={notification.id} 
          className={`${getCardClass(notification.type)} animate-in slide-in-from-right-full duration-300`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground">{notification.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => onDismiss(notification.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationSystem;