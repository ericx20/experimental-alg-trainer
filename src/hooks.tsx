import React from "react";

export function useMediaQuery(query: string) {
  const mediaQuery = React.useMemo(() => window.matchMedia(query), [query]);
  const [match, setMatch] = React.useState(mediaQuery.matches);

  React.useEffect(() => {
    const onChange = () => setMatch(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, [mediaQuery]);

  return match;
}
export function useSpacebar(onSpacebar: () => void, disabled?: boolean) {
  const keyDownHandler = React.useCallback(
    (e: KeyboardEvent) => {
      if (!disabled && e.key === " ") {
        onSpacebar();
      }
    },
    [onSpacebar, disabled]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    return () => document.removeEventListener("keydown", keyDownHandler);
  }, [keyDownHandler]);
}
