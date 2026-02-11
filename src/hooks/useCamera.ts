import { useState, useEffect, RefObject } from "react";

export function useCamera(videoRef: RefObject<HTMLVideoElement | null>) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch {
        setError("摄像头无法访问，请使用键盘控制");
      }
    };

    start();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [videoRef]);

  return { isStreaming, error };
}
