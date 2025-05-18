import { useEffect } from "react";
import { useState } from "react";

export function useMagicColor(timeRandom = 1000) {
  const [color, setColor] = useState("transparent");
  useEffect(() => {
    const colorInterval = setInterval(() => {
      const newColor = getRandomColorRGBA();
      setColor(newColor);
    }, timeRandom);
    return () => {
      clearInterval(colorInterval);
    };
  }, [timeRandom]);
  return color;
}

function getRandomColorRGBA() {
  const r = Math.trunc(Math.random() * 255);
  const g = Math.trunc(Math.random() * 255);
  const b = Math.trunc(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b})`;
}
