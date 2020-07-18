import React from "react";
import "./App.css";
import { format, startOfMonth, addDays, subDays } from "date-fns";
import domToImage from "dom-to-image";
import { saveAs } from "file-saver";

const SIZES = {
  A4: {
    width: 1754,
    height: 1240,
  },
};

function scaleTo(el, size) {
  const currentSize = el.getBoundingClientRect();
  const xScale = size.width / currentSize.width;
  const yScale = size.height / currentSize.height;
  return `scale(${xScale.toFixed(2)}, ${yScale.toFixed(2)})`;
}

function App() {
  const [date, setDate] = React.useState(null);
  const [days, setDays] = React.useState([]);
  const calendarRef = React.useRef(null);

  const setSelectedDate = React.useCallback((e) => {
    const date = e.target.value;
    try {
      const parsed = new Date(date);
      setDate(parsed);
      let start = startOfMonth(parsed);
      start = subDays(start, start.getDay() - 1);
      const rows = Array(5)
        .fill(Array(7).fill(0))
        .map((row) =>
          row.map(() => {
            const currentDate = start;
            start = addDays(start, 1);
            return currentDate;
          })
        );
      setDays(rows.flat());
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveCalendarAsPng = React.useCallback(async () => {
    const node = calendarRef.current;
    const image = await domToImage.toPng(node, {
      ...SIZES.A4,
      style: {
        transform: scaleTo(node, SIZES.A4),
        "transform-origin": "top left",
      },
    });
    saveAs(image, `Calendar ${format(date, "MMMM-Y")}.png`);
  }, [date]);

  const weekDays = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Generate your calendar</h1>
        <input type="date" onChange={setSelectedDate}></input>
        {days.length > 0 && (
          <>
            <div className="controls">
              <button onClick={saveCalendarAsPng}>save as png</button>
            </div>
            <div ref={calendarRef}>
              <div className="container">
                <h2 className="monthName">
                  {format(date, "MMMM Y").toLowerCase()}
                </h2>
                <div className="calendar">
                  {weekDays.map((day) => (
                    <span className="dayName" key={day}>
                      {day}
                    </span>
                  ))}
                  {days.map((day) => (
                    <span
                      className={`day ${
                        day.getMonth() !== date.getMonth() ? "disabled" : ""
                      }`}
                      key={day.getTime()}
                    >
                      {day.getDate()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
