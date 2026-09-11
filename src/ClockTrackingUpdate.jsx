import React from "react";
import { useState, useEffect } from "react";

export default function ClockTrackingUpdate({ lastUpdateTime }) {
  const [time, setTime]=useState('');

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 2000);

    return () => clearInterval(timerId);
  }, []);

  const formattedTimeSec=Math.floor((time - lastUpdateTime) / 1000);

  return (
    <>
      Updated {formattedTimeSec}s ago{" "}
      <span class="dot">•</span> Next update in ~
      {Math.ceil((180-formattedTimeSec) /60)} minutes
    </>
  );
}
