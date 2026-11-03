import { useEffect } from "react";
import type { RefObject } from "react";

function nestedScroller(target: Element | null, root: HTMLElement) {
  for (let n = target; n && n !== root; n = n.parentElement) {
    const s = getComputedStyle(n);
    if (/(auto|scroll)/.test(s.overflowY) && n.scrollHeight > n.clientHeight + 1) {
      return true;
    }
  }
  return false;
}

export function useSmoothScroll(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let target = 0;
    let raf = 0;
    let running = false;

    const step = () => {
      const diff = target - el.scrollTop;
      if (Math.abs(diff) < 0.5) {
        el.scrollTop = target;
        running = false;
        return;
      }
      el.scrollTop += diff * 0.16;
      raf = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented || e.deltaMode !== 0) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (nestedScroller(e.target as Element | null, el)) return;
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) return;
      if (!running) target = el.scrollTop;
      const next = Math.min(max, Math.max(0, target + e.deltaY));
      if (next === target && (next === 0 || next === max)) return;
      e.preventDefault();
      target = next;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(raf);
    };
  }, [ref, enabled]);
}
