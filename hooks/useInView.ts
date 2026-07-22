import { useEffect, useState, useRef } from "react";

interface UseInViewOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useInView(options?: UseInViewOptions) {
  const [inView, setInView] = useState(false);
  const ref = useRef<any>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (options?.triggerOnce) {
          hasTriggered.current = true;
          observer.disconnect();
        }
      } else if (!options?.triggerOnce) {
        setInView(false);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef && !hasTriggered.current) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { ref, inView };
}
