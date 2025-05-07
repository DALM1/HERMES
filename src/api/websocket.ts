import { getToken } from '../utils/auth';

export type MessageHandler = (data: any) => void;

export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number | null = null;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = getToken();
      if (!token) {
        reject(new Error('Authentification requise'));
        return;
      }

      this.socket = new WebSocket(`${window.apiConfig.wsUrl}?token=${token}`);

      this.socket.onopen = () => {
        console.log('Connexion WebSocket établie');
        this.reconnectAttempts = 0;
        resolve();
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Erreur de parsing WebSocket:', error);
        }
      };

      this.socket.onclose = (event) => {
        console.log(`Connexion WebSocket fermée: ${event.code} ${event.reason}`);
        this.socket = null;

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
          console.log(`Tentative de reconnexion dans ${delay}ms...`);

          this.reconnectTimeout = window.setTimeout(() => {
            this.reconnectAttempts++;
            this.connect().catch(console.error);
          }, delay);
        }
      };

      this.socket.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
        reject(error);
      };
    });
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  subscribe(eventType: string, handler: MessageHandler) {
    if (!this.messageHandlers.has(eventType)) {
      this.messageHandlers.set(eventType, new Set());
    }
    this.messageHandlers.get(eventType)!.add(handler);
  }

  unsubscribe(eventType: string, handler: MessageHandler) {
    const handlers = this.messageHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private handleMessage(data: any) {
    const { type, payload } = data;

    if (type && this.messageHandlers.has(type)) {
      const handlers = this.messageHandlers.get(type)!;
      handlers.forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Erreur dans le gestionnaire pour '${type}':`, error);
        }
      });
    }
  }

  send(type: string, payload: any = {}) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket non connecté');
    }

    this.socket.send(JSON.stringify({ type, payload }));
  }
}

// Singleton pour l'application
export const webSocketService = new WebSocketService();
