/**
 * Shared BroadcastChannel utility for cross-tab communication
 * Implements singleton pattern to ensure single channel instance per channel name
 */

type MessageHandler = (event: MessageEvent) => void;

class BroadcastChannelManager {
  private channels: Map<string, BroadcastChannel> = new Map();
  private handlers: Map<string, Set<MessageHandler>> = new Map();

  /**
   * Get or create a BroadcastChannel instance
   * @param channelName - Name of the channel
   * @returns BroadcastChannel instance or null if not supported
   */
  private getChannel(channelName: string): BroadcastChannel | null {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
      return null;
    }

    if (!this.channels.has(channelName)) {
      const channel = new BroadcastChannel(channelName);
      this.channels.set(channelName, channel);
      this.handlers.set(channelName, new Set());

      // Set up message dispatcher
      channel.onmessage = (event) => {
        const handlers = this.handlers.get(channelName);
        if (handlers) {
          handlers.forEach(handler => handler(event));
        }
      };
    }

    return this.channels.get(channelName) || null;
  }

  /**
   * Subscribe to messages on a channel
   * @param channelName - Name of the channel
   * @param handler - Message handler function
   * @returns Unsubscribe function
   */
  subscribe(channelName: string, handler: MessageHandler): () => void {
    const channel = this.getChannel(channelName);
    if (!channel) {
      return () => {}; // No-op if channel not supported
    }

    const handlers = this.handlers.get(channelName);
    if (handlers) {
      handlers.add(handler);
    }

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(channelName);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  /**
   * Post a message to a channel
   * @param channelName - Name of the channel
   * @param message - Message to send
   */
  postMessage(channelName: string, message: unknown): void {
    const channel = this.getChannel(channelName);
    if (channel) {
      channel.postMessage(message);
    }
  }

  /**
   * Close a specific channel
   * @param channelName - Name of the channel to close
   */
  closeChannel(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.close();
      this.channels.delete(channelName);
      this.handlers.delete(channelName);
    }
  }

  /**
   * Close all channels
   */
  closeAll(): void {
    this.channels.forEach(channel => channel.close());
    this.channels.clear();
    this.handlers.clear();
  }
}

// Singleton instance
const broadcastManager = new BroadcastChannelManager();

export default broadcastManager;
