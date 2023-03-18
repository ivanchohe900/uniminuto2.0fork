import React, { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";

type Props = {
  Time: any;
};

const Temporizador = ({ Time }: Props) => {
  const [Tardanza, setTardanza] = useState(false);

  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });
  console.log("Time", Time);

  useEffect(() => {
    if (Time?.Hora || Time?.Minutos) {
      reset();
    }
  }, [Time?.Hora, Time?.Minutos]);

  useEffect(() => {
    if (Time?.Hora <= hours && Time?.Minutos <= minutes) {
      setTardanza(true);
    }
  }, [hours, minutes]);

  return (
    <>
      {" "}
      <div style={{ textAlign: "center" }}>
        <div
          style={{ fontSize: "100px" }}
          className={`${Tardanza && "text-red-900"}`}
        >
          <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </div>
      </div>
    </>
  );
};

export default Temporizador;
