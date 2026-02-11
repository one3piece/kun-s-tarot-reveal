import { useState, useEffect, useRef, RefObject } from "react";

export type Gesture =
  | "none"
  | "open_palm"
  | "fist"
  | "ok"
  | "swipe_left"
  | "swipe_right"
  | "two_hands";

interface HandGestureState {
  gesture: Gesture;
  isReady: boolean;
  error: string | null;
}

export function useHandGesture(videoRef: RefObject<HTMLVideoElement | null>): HandGestureState {
  const [state, setState] = useState<HandGestureState>({
    gesture: "none",
    isReady: false,
    error: null,
  });

  const wristHistory = useRef<number[]>([]);
  const gestureStable = useRef<Gesture>("none");
  const stableCount = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let animFrame = 0;

    const init = async () => {
      try {
        const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");

        const fileset = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm"
        );

        let handLandmarker: any;
        try {
          handLandmarker = await HandLandmarker.createFromOptions(fileset, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numHands: 2,
          });
        } catch {
          handLandmarker = await HandLandmarker.createFromOptions(fileset, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            },
            runningMode: "VIDEO",
            numHands: 2,
          });
        }

        if (cancelled) return;
        setState((s) => ({ ...s, isReady: true }));

        let lastTs = -1;

        const detect = () => {
          if (cancelled) return;
          const video = videoRef.current;
          if (!video || video.readyState < 2) {
            animFrame = requestAnimationFrame(detect);
            return;
          }

          const now = performance.now();
          if (now <= lastTs) {
            animFrame = requestAnimationFrame(detect);
            return;
          }
          lastTs = now;

          try {
            const results = handLandmarker.detectForVideo(video, now);
            const numHands = results.landmarks?.length ?? 0;

            if (numHands > 0) {
              const landmarks = results.landmarks[0];
              const g = classifyGesture(landmarks, numHands, wristHistory);

              if (g === gestureStable.current) {
                stableCount.current++;
              } else {
                gestureStable.current = g;
                stableCount.current = 1;
              }

              if (stableCount.current >= 4) {
                setState((s) => ({ ...s, gesture: g }));
              }
            } else {
              setState((s) => ({ ...s, gesture: "none" }));
              gestureStable.current = "none";
              stableCount.current = 0;
              wristHistory.current = [];
            }
          } catch {
            // skip frame
          }

          animFrame = requestAnimationFrame(detect);
        };

        detect();
      } catch (err) {
        console.warn("MediaPipe load failed:", err);
        if (!cancelled) {
          setState({
            gesture: "none",
            isReady: true,
            error: "手势识别加载失败，请使用键盘控制",
          });
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animFrame);
    };
  }, [videoRef]);

  return state;
}

type Landmark = { x: number; y: number; z: number };

function classifyGesture(
  landmarks: Landmark[],
  numHands: number,
  wristHistory: React.MutableRefObject<number[]>
): Gesture {
  if (numHands >= 2) return "two_hands";

  // Swipe detection
  const wristX = landmarks[0].x;
  wristHistory.current.push(wristX);
  if (wristHistory.current.length > 10) wristHistory.current.shift();

  if (wristHistory.current.length >= 6) {
    const dx =
      wristHistory.current[wristHistory.current.length - 1] - wristHistory.current[0];
    if (dx > 0.13) return "swipe_left"; // mirrored
    if (dx < -0.13) return "swipe_right";
  }

  const fingerExtended = [
    isExtended(landmarks, 8, 6),
    isExtended(landmarks, 12, 10),
    isExtended(landmarks, 16, 14),
    isExtended(landmarks, 20, 18),
  ];
  const thumbOut = isThumbOut(landmarks);
  const count = fingerExtended.filter(Boolean).length + (thumbOut ? 1 : 0);

  // OK sign
  const okDist = Math.hypot(
    landmarks[4].x - landmarks[8].x,
    landmarks[4].y - landmarks[8].y
  );
  if (okDist < 0.06 && fingerExtended[1] && fingerExtended[2]) return "ok";

  if (count >= 4) return "open_palm";
  if (count <= 1) return "fist";

  return "none";
}

function isExtended(lm: Landmark[], tip: number, pip: number): boolean {
  return lm[tip].y < lm[pip].y;
}

function isThumbOut(lm: Landmark[]): boolean {
  return Math.abs(lm[4].x - lm[5].x) > Math.abs(lm[3].x - lm[5].x);
}
