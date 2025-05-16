import React, { useContext } from "react";
import numberContext from "./test";
export default function Test2() {
  const Number = useContext(numberContext);
  console.log(Number);

  return (
    <div>
      <p>this is test 2 </p>
      <h3>{Number.number}</h3>
      {/* <input
        type="number"
        value={Number.number}
        onChange={(e) => {
          Number.setNumber(e.target.value);
        }}
      /> */}
    </div>
  );
}
