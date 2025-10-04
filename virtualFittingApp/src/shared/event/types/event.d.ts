// * For Event Type
type EventCallback<T = any> = (data: T) => void;

// * Event Name, Callback Function
type EventListeners = Record<string, EventCallback[]>;

class EventBus {
  private listeners: EventListeners;

  on<T>(eventName: string, callback: EventCallback<T>): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback as EventCallback);
  }

  emit<T>(eventName: string, data?: T): void {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((callback) => {
        callback(data);
      });
    }
  }

  off<T>(eventName: string, callback: EventCallback<T>): void {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(
        (cb) => cb !== callback,
      );
    }
  }
}

export const globalEventBus = new EventBus();
