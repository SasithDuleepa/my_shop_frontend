import React, { createContext, useContext, useMemo, useState } from "react";
import Test2 from "./test2";

const numberContext = createContext();

export default function Test() {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState(100);

  let memoVal = useMemo(() => {
    console.log("Calculation called!");
    let num = 0;
    for (let i = 0; i < value; i++) {
      num += i;
    }
    return num;
  }, [value]);

  const [number, setNumber] = useState(0);

  return (
    <div>
      <numberContext.Provider value={{ number, setNumber }}>
        <h1>{number}</h1>
        <Test2 />
      </numberContext.Provider>
      {/* <div>
        <div></div>
        <hr />
        <div>
          Count: {count}
          <button
            onClick={() => {
              setCount(count + 1);
            }}
          >
            +
          </button>
          <h2>Expensive Calculation</h2>
          {memoVal}
          <input
            type="number"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </div>
      </div> */}
    </div>
  );
}
