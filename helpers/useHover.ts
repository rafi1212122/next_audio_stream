import { useState, useRef, useCallback, useEffect, MutableRefObject } from 'react';

export default function useHover():[MutableRefObject<HTMLDivElement>, Boolean] {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => setHovered(false), []);
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("mouseenter", onMouseEnter);
      ref.current.addEventListener("mouseleave", onMouseLeave);
      return () => {
        var _a, _b;
        (_a = ref.current) == null ? void 0 : _a.removeEventListener("mouseenter", onMouseEnter);
        (_b = ref.current) == null ? void 0 : _b.removeEventListener("mouseleave", onMouseLeave);
      };
    }
    return void 0;
  }, []);
  return [ref, hovered];
}