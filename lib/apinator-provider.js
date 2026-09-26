import * as Y from 'yjs';
import { Apinator } from '@apinator/client';

export class ApinatorProvider {
  constructor(roomName, ydoc, userInfo, options = {}) {
    this.roomName = roomName;
    this.ydoc = ydoc;
    this.userInfo = userInfo;
    this.options = options;
    this.connected = false;

    this.client = new Apinator({
      appKey: process.env.NEXT_PUBLIC_APINATOR_KEY,
      cluster: process.env.NEXT_PUBLIC_APINATOR_CLUSTER || 'eu',
    });

    this.channelName = `presence-${roomName}`;
    this.channel = this.client.subscribe(this.channelName);

    this.ydoc.on('update', this.handleLocalUpdate);

    // Client events MUST be prefixed with "client-"
    this.channel.bind('client-yjs-update', this.handleRemoteUpdate);

    this.channel.bind('member_added', (member) => {
      if (options.onPresenceChange) {
        options.onPresenceChange({ type: 'join', user: member.info || member });
      }
    });

    this.channel.bind('member_removed', (member) => {
      if (options.onPresenceChange) {
        options.onPresenceChange({ type: 'leave', user: member.info || member });
      }
    });

    this.channel.bind('subscribed', () => {
      this.connected = true;
      if (options.onConnected) options.onConnected();

      this.channel.trigger('client-yjs-state-request', {
        from: this.userInfo.id,
      });
    });

    this.channel.bind('client-yjs-state-request', (data) => {
      if (data.from === this.userInfo.id) return;
      const state = Y.encodeStateAsUpdate(this.ydoc);
      const updateBase64 = Buffer.from(state).toString('base64');
      this.channel.trigger('client-yjs-update', {
        update: updateBase64,
        senderId: this.userInfo.id,
      });
    });
  }

  handleLocalUpdate = (update, origin) => {
    if (origin === this) return;
    const updateBase64 = Buffer.from(update).toString('base64');
    this.channel.trigger('client-yjs-update', {
      update: updateBase64,
      senderId: this.userInfo.id,
    });
  };

  handleRemoteUpdate = (data) => {
    if (data.senderId === this.userInfo.id) return;
    try {
      const update = new Uint8Array(Buffer.from(data.update, 'base64'));
      Y.applyUpdate(this.ydoc, update, this);
    } catch (error) {
      console.error('Failed to apply remote update:', error);
    }
  };

  destroy() {
    this.ydoc.off('update', this.handleLocalUpdate);

    if (this.channel) {
      this.channel.unbind('client-yjs-update');
      this.channel.unbind('member_added');
      this.channel.unbind('member_removed');
      this.channel.unbind('subscribed');
      this.channel.unbind('client-yjs-state-request');
    }

    if (this.client) {
      this.client.disconnect();
    }

    this.connected = false;
  }

  awareness = {
    setLocalStateField: () => {},
    on: () => {},
    off: () => {},
    getStates: () => new Map(),
  };
}