export type MonitorCameraConfig = {
  label: string;
  /** go2rtc stream.html, mjpeg, or HLS — http:// home or https:// tunnel */
  streamUrl: string;
  cameraType: 'wyze' | 'onvif' | 'other';
  updatedAt: number;
};

export const MONITOR_STORAGE_KEY = 'freedom-paws-monitor-camera';
