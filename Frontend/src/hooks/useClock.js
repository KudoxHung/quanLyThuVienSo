import { useEffect } from "react";
import { useState } from "react";
const moment = require("moment");

export function useClock() {
  const [time, setTime] = useState({
    Day: moment().format("dd, DD-MM-YYYY"),
    timer: moment().format("HH:mm:ss"),
    house: moment().format("HH"),
    minute: moment().format("mm"),
    second: moment().format("ss")
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => ({ ...prev, Day: moment().format("dd, DD-MM-YYYY") }));
      setTime((prev) => ({ ...prev, timer: moment().format("HH:mm:ss") }));
      setTime((prev) => ({ ...prev, house: moment().format("HH") }));
      setTime((prev) => ({ ...prev, minute: moment().format("mm") }));
      setTime((prev) => ({ ...prev, second: moment().format("ss") }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
}
