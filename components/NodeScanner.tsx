'use client';

import { useState, useRef, useCallback } from 'react';
import { Node } from '@/lib/types';
import { mockNodes } from '@/lib/mock-data';
import { X, QrCode, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { useMiniKit } from '@coinbase/onchainkit';

interface NodeScannerProps {
  onNodeFound: (node: Node) => void;
  onClose: () => void;
}

export function NodeScanner({ onNodeFound, onClose }: NodeScannerProps) {
  const [scanMode, setScanMode] = useState<'qr' | 'nfc' | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<Node | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startQRScan = useCallback(async () => {
    setScanMode('qr');
    setScanning(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simulate QR code detection (in production, use a QR library)
      setTimeout(() => {
        const randomNode = mockNodes[Math.floor(Math.random() * mockNodes.length)];
        setScanResult(randomNode);
        setScanning(false);
        stopCamera();
      }, 2000);

    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please allow camera permissions.');
      setScanning(false);
    }
  }, []);

  const startNFCScan = useCallback(async () => {
    setScanMode('nfc');
    setScanning(true);
    setError(null);

    try {
      // Check if NFC is supported
      if (!('NDEFReader' in window)) {
        throw new Error('NFC not supported on this device');
      }

      const ndef = new (window as any).NDEFReader();

      await ndef.scan();

      ndef.addEventListener('reading', ({ message }: any) => {
        // Parse NFC message (simplified)
        const record = message.records[0];
        const nodeId = new TextDecoder().decode(record.data);

        const node = mockNodes.find(n => n.id === nodeId);
        if (node) {
          setScanResult(node);
        } else {
          setError('Node not found in database');
        }
        setScanning(false);
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (scanning) {
          setScanning(false);
          setError('NFC scan timeout. Try again.');
          ndef.stop();
        }
      }, 10000);

    } catch (err) {
      console.error('NFC error:', err);
      setError(err instanceof Error ? err.message : 'NFC scan failed');
      setScanning(false);
    }
  }, [scanning]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleNodeConfirm = () => {
    if (scanResult) {
      onNodeFound(scanResult);
      onClose();
    }
  };

  const resetScan = () => {
    setScanMode(null);
    setScanning(false);
    setScanResult(null);
    setError(null);
    stopCamera();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
      <div className="glass-card rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gradient">Scan Node</h2>
            <p className="text-sm text-text-muted">
              Scan QR codes or tap NFC tags to verify nodes instantly
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Mode Selection */}
        {!scanMode && !scanResult && (
          <div className="space-y-4">
            <button
              onClick={startQRScan}
              className="w-full glass-card p-4 hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/20 rounded-lg">
                  <QrCode className="w-6 h-6 text-accent" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Scan QR Code</h3>
                  <p className="text-sm text-text-muted">
                    Point camera at node QR code
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={startNFCScan}
              className="w-full glass-card p-4 hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">NFC Tap</h3>
                  <p className="text-sm text-text-muted">
                    Tap device against NFC-enabled node
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Scanning Interface */}
        {scanning && scanMode === 'qr' && (
          <div className="space-y-4">
            <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              <div className="absolute inset-0 border-2 border-accent rounded-lg animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold">Scanning for QR Code...</p>
                </div>
              </div>
            </div>
            <button
              onClick={resetScan}
              className="w-full btn-secondary"
            >
              Cancel Scan
            </button>
          </div>
        )}

        {scanning && scanMode === 'nfc' && (
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Smartphone className="w-16 h-16 mx-auto mb-4 text-primary animate-bounce" />
                <p className="text-lg font-semibold">Tap NFC Tag</p>
                <p className="text-sm text-text-muted mt-2">
                  Hold device close to the node
                </p>
              </div>
            </div>
            <button
              onClick={resetScan}
              className="w-full btn-secondary"
            >
              Cancel Scan
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-card p-4 bg-danger/10 border-danger/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-danger" />
              <p className="text-sm text-danger">{error}</p>
            </div>
            <button
              onClick={resetScan}
              className="mt-3 w-full btn-secondary text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Scan Result */}
        {scanResult && (
          <div className="space-y-4">
            <div className="glass-card p-4 bg-success/10 border-success/20">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <p className="font-semibold text-success">Node Found!</p>
              </div>

              <div className="space-y-2">
                <p className="font-medium">{scanResult.name || `Node ${scanResult.id}`}</p>
                <p className="text-sm text-text-muted capitalize">{scanResult.network_type} Network</p>
                <p className="text-sm text-accent font-bold">
                  ${scanResult.reward_rate_usd}/hr • {scanResult.status}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleNodeConfirm}
                className="flex-1 btn-primary"
              >
                View Details
              </button>
              <button
                onClick={resetScan}
                className="btn-secondary"
              >
                Scan Another
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 p-3 bg-surface-hover rounded-lg">
          <p className="text-xs text-text-muted text-center">
            💡 Scanning helps verify node status and earns you community tokens for accurate reports.
          </p>
        </div>
      </div>
    </div>
  );
}

