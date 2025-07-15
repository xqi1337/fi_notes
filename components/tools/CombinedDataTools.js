import { useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { DATA_UNITS, SPEED_UNITS } from "@/utils/units";

const formatTime = (seconds) => {
  const rounded = Math.ceil(seconds);
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  const hrs = Math.floor(mins / 60);
  const minsLeft = mins % 60;

  return {
    seconds: `${rounded} Sekunden`,
    minSec: `${mins}:${secs.toString().padStart(2, "0")}`,
    hourMinSec: `${hrs}:${minsLeft.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
  };
};

const CombinedDataTools = ({ mode }) => {
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("GiB");
  const [toUnit, setToUnit] = useState("MB");
  const [speedValue, setSpeedValue] = useState("50");
  const [speedUnit, setSpeedUnit] = useState("Mbps");

  const renderConverter = () => {
    const from = DATA_UNITS[fromUnit];
    const to = DATA_UNITS[toUnit];
    const valueInBytes = parseFloat(inputValue) * from.factor;
    const convertedValue = (valueInBytes / to.factor).toLocaleString("de-DE", {
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    });

    const fromPrefix = from.type === "binary" ? "1024" : "1000";
    const toPrefix = to.type === "binary" ? "1024" : "1000";
    const fromPower = Math.round(Math.log(from.factor) / Math.log(from.type === "binary" ? 1024 : 1000));
    const toPower = Math.round(Math.log(to.factor) / Math.log(to.type === "binary" ? 1024 : 1000));

    const conceptual = `\\text{Formel:}\\ (\\text{Dateigröße} \\times \\text{${fromPrefix}}^${fromPower}) \\div \\text{${toPrefix}}^${toPower} \\\\`;
    const symbolic = `(${inputValue}\\times${fromPrefix}^{${fromPower}})\\div${toPrefix}^{${toPower}}=${convertedValue}\\ \\text{${toUnit}}`;
    console.log(symbolic);

    return {
      result: `${convertedValue} ${toUnit}`,
      formula: katex.renderToString(`${conceptual} ${symbolic}`, { throwOnError: false }),
    };
  };

  const renderDownloadTime = () => {
    const sizeFactor = DATA_UNITS[fromUnit].factor;
    const speedFactor = SPEED_UNITS[speedUnit].factor;
    const sizeInBits = parseFloat(inputValue) * sizeFactor * 8;
    const speedInBitsPerSec = parseFloat(speedValue) * speedFactor;
    const timeInSeconds = sizeInBits / speedInBitsPerSec;
    const timeFormatted = formatTime(timeInSeconds);

    const sizePrefix = DATA_UNITS[fromUnit].type === "binary" ? "1024" : "1000";
    const sizePower = Math.round(Math.log(sizeFactor) / Math.log(DATA_UNITS[fromUnit].type === "binary" ? 1024 : 1000));
    const speedPrefix = SPEED_UNITS[speedUnit].type === "binary" ? "1024" : "1000";
    const speedPower = Math.round(
      Math.log(SPEED_UNITS[speedUnit].factor / 8) / Math.log(SPEED_UNITS[speedUnit].type === "binary" ? 1024 : 1000),
    );

    const conceptual = `\\text{Formel:}\\ (\\text{Dateigröße} \\times 8) \\div \\text{Geschwindigkeit} \\\\`;
    const symbolic = `(${inputValue}\\times${sizePrefix}^{${sizePower}}\\times8)\\div(${speedValue}\\times${speedPrefix}^{${speedPower}})`;
    const result = `= ${Math.ceil(timeInSeconds)}\\ \\text{ Sekunden}`;

    return {
      result: timeFormatted,
      formula: katex.renderToString(`${conceptual} ${symbolic} ${result}`, { throwOnError: false }),
    };
  };

  const { result, formula } = mode === "download" ? renderDownloadTime() : renderConverter();

  return (
    <div className="flex flex-col gap-4">
      {mode === "download" ? (
        <>
          <div className="flex w-full gap-4">
            <div className="flex flex-col gap-2 w-1/2">
              <label className="font-medium">Dateigröße</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="p-2 border rounded w-full"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="p-2 rounded-md border border-neutral-600 bg-neutral-800 text-white"
                >
                  {Object.entries(DATA_UNITS).map(([key, unit]) => (
                    <option key={key} value={key}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-1/2">
              <label className="font-medium">Übertragungsgeschwindigkeit</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={speedValue}
                  onChange={(e) => setSpeedValue(e.target.value)}
                  className="p-2 border rounded w-full"
                />
                <select
                  value={speedUnit}
                  onChange={(e) => setSpeedUnit(e.target.value)}
                  className="p-2 rounded-md border border-neutral-600 bg-neutral-800 text-white"
                >
                  {Object.entries(SPEED_UNITS).map(([key, unit]) => (
                    <option key={key} value={key}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="text-stone-300">
            <h3 className="font-medium">Ergebnis:</h3>
            <span className="text-xl block mb-2">{result.seconds}</span>
            <span className="text-xl block mb-2">{result.minSec} Minuten</span>
            <span className="text-xl block mb-2">{result.hourMinSec} Stunden</span>
            <span className="text-base block">Alle Werte sind auf die letzte Sekunde aufgerundet.</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Dateigröße</label>
            <div className="w-full flex gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="p-2 border rounded w-1/3"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="p-2 rounded-md border border-neutral-600 bg-neutral-800 text-white w-1/2"
              >
                {Object.entries(DATA_UNITS).map(([key, unit]) => (
                  <option key={key} value={key}>
                    {unit.name}
                  </option>
                ))}
              </select>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="p-2 rounded-md border border-neutral-600 bg-neutral-800 text-white w-1/2"
              >
                {Object.entries(DATA_UNITS).map(([key, unit]) => (
                  <option key={key} value={key}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-stone-300">
            <h3 className="font-medium">Ergebnis:</h3>
            <span className="text-xl block mb-2">{result}</span>
          </div>
        </>
      )}

      <div className="text-stone-300">
        <h3 className="font-medium">Rechenweg:</h3>
        <div className="prose text-neutral-300" dangerouslySetInnerHTML={{ __html: formula }} />
      </div>
    </div>
  );
};

export default CombinedDataTools;
