
import { useState, useEffect, useRef, useCallback } from 'react';
import { Peer, DataConnection } from 'peerjs';
import { NetworkMessage } from '../lib/types';

export const usePeerJS = () => {
  const [peerId, setPeerId] = useState<string>('');
  const [remoteId, setRemoteId] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [isHost, setIsHost] = useState<boolean>(false);
  
  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  const onMessageRef = useRef<((msg: NetworkMessage) => void) | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      connRef.current?.close();
      peerRef.current?.destroy();
    };
  }, []);

  const initializePeer = useCallback(() => {
    if (peerRef.current) return Promise.resolve(peerRef.current.id);

    return new Promise<string>((resolve, reject) => {
      const peer = new Peer();
      
      peer.on('open', (id) => {
        console.log('My peer ID is: ' + id);
        setPeerId(id);
        peerRef.current = peer;
        resolve(id);
      });

      peer.on('connection', (conn) => {
        console.log('Incoming connection...');
        handleConnection(conn);
      });

      peer.on('error', (err) => {
        console.error(err);
        setConnectionStatus('error');
      });
    });
  }, []);

  const handleConnection = (conn: DataConnection) => {
    connRef.current = conn;
    setConnectionStatus('connecting');

    conn.on('open', () => {
      console.log('Connection opened');
      setConnectionStatus('connected');
    });

    conn.on('data', (data) => {
      console.log('Received data', data);
      if (onMessageRef.current) {
        onMessageRef.current(data as NetworkMessage);
      }
    });

    conn.on('close', () => {
      setConnectionStatus('idle');
      connRef.current = null;
    });
  };

  const hostGame = async () => {
    await initializePeer();
    setIsHost(true);
    setConnectionStatus('idle'); // Waiting for connection
  };

  const joinGame = async (hostId: string) => {
    if (!hostId) return;
    await initializePeer();
    setIsHost(false);
    
    const conn = peerRef.current!.connect(hostId);
    handleConnection(conn);
    setRemoteId(hostId);
  };

  const sendMessage = (type: NetworkMessage['type'], payload?: any) => {
    if (connRef.current && connectionStatus === 'connected') {
      connRef.current.send({ type, payload });
    }
  };

  const setOnMessage = (callback: (msg: NetworkMessage) => void) => {
    onMessageRef.current = callback;
  };

  return {
    peerId,
    connectionStatus,
    isHost,
    hostGame,
    joinGame,
    sendMessage,
    setOnMessage
  };
};
