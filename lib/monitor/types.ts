export type MonitorCameraConfig = {
  label: string;
  /** HLS playlist URL (.m3u8) — from Wyze RTSP bridge or home relay */
  streamUrl: string;
  cameraType: 'wyze' | 'onvif' | 'other';
  updatedAt: number;
};

export const MONITOR_STORAGE_KEY = 'freedom-paws-monitor-camera';
