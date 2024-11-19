// src/services/PusherService.ts

import {
    Pusher,
    PusherMember,
    PusherChannel,
    PusherEvent,
  } from '@pusher/pusher-websocket-react-native';
  import { Alert } from 'react-native';
  
  interface NotificationData {
    message?: string;
    title?: string;
    [key: string]: any;
  }
  
  class PusherService {
    private static instance: PusherService;
    private pusher: Pusher;
    private isInitialized: boolean = false;
    private activeChannels: Set<string> = new Set();
  
    private constructor() {
      this.pusher = Pusher.getInstance();
    }
  
    public static getInstance(): PusherService {
      if (!PusherService.instance) {
        PusherService.instance = new PusherService();
      }
      return PusherService.instance;
    }
  
    public async initialize(): Promise<void> {
      if (this.isInitialized) return;
  
      try {
        await this.pusher.init({
          apiKey: "45155196bf0ccbd4013a",
          cluster: "us2",
          onConnectionStateChange: (currentState, previousState) => {
            console.log('Connection state changed:', previousState, '->', currentState);
          },
          onError: (error) => {
            console.error('Pusher connection error:', error);
          }
        });
  
        await this.pusher.connect();
        this.isInitialized = true;
        console.log('Pusher initialized successfully');
      } catch (error) {
        console.error('Error initializing Pusher:', error);
        this.isInitialized = false;
        throw error;
      }
    }
  
    public async subscribeToChannel(
      channelName: string,
      eventName: string,
      customHandler?: (event: PusherEvent) => void
    ): Promise<void> {
      if (this.activeChannels.has(channelName)) {
        console.log(`Already subscribed to channel: ${channelName}`);
        return;
      }
  
      try {
        if (!this.isInitialized) {
          await this.initialize();
        }
  
        await this.pusher.subscribe({
          channelName,
          onEvent: (event: PusherEvent) => {
            if (event.eventName === eventName) {
              if (customHandler) {
                customHandler(event);
                return;
              }
  
              this.handleDefaultNotification(event);
            }
          },
          onSubscriptionSucceeded: (data: any) => {
            console.log(`Successfully subscribed to ${channelName}`);
            this.activeChannels.add(channelName);
          },
          onSubscriptionError: (error: any) => {
            console.error(`Error subscribing to ${channelName}:`, error);
          },
          onMemberAdded: (member: PusherMember) => {
            console.log('Member added to channel:', member);
          },
          onMemberRemoved: (member: PusherMember) => {
            console.log('Member removed from channel:', member);
          }
        });
      } catch (error) {
        console.error(`Error subscribing to channel ${channelName}:`, error);
        throw error;
      }
    }
  
    private handleDefaultNotification(event: PusherEvent): void {
      let notificationData: NotificationData = { message: 'Nueva notificación recibida' };
      
      try {
        if (event.data) {
          notificationData = typeof event.data === 'string' ? 
            JSON.parse(event.data) : event.data;
        }
      } catch (error) {
        console.warn('Error parsing notification data:', error);
      }
  
      Alert.alert(
        notificationData.title || '📬 Nueva Notificación',
        notificationData.message || 'Has recibido una nueva notificación',
        [
          {
            text: 'OK',
            style: 'default'
          }
        ],
        {
          cancelable: true
        }
      );
    }
  
    public async unsubscribeFromChannel(channelName: string): Promise<void> {
      try {
        if (this.activeChannels.has(channelName)) {
          await this.pusher.unsubscribe({ channelName });
          this.activeChannels.delete(channelName);
          console.log(`Unsubscribed from channel: ${channelName}`);
        }
      } catch (error) {
        console.error(`Error unsubscribing from channel ${channelName}:`, error);
        throw error;
      }
    }
  
    public async disconnect(): Promise<void> {
      try {
        await this.pusher.disconnect();
        this.isInitialized = false;
        this.activeChannels.clear();
        console.log('Disconnected from Pusher');
      } catch (error) {
        console.error('Error disconnecting from Pusher:', error);
        throw error;
      }
    }
  
    public isConnected(): boolean {
      return this.isInitialized;
    }
  }
  
  export default PusherService;