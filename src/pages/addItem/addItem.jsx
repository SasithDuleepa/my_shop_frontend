import React from "react";

export default function AddItem() {
  return (
    <div className="col-center">
      <h1> Add Item </h1>

      <div className="">
        <p>Select Item :</p>
        <input />
      </div>

      <div className="col-center border-1">
        <p>Item Name</p>
        <div className="center">
          <p>Batch no :</p>
          <input className="input-2" />
        </div>

        <div className="center">
          <p>Purchase date:</p>
          <input className="input-2" disabled />
        </div>

        <div className="center">
          <p>Purchase price :</p>
          <input className="input-2" />
        </div>

        <div className="center">
          <p>Sale price :</p>
          <input className="input-2" />
        </div>

        <div className="center">
          <p>Exp. date :</p>
          <input className="input-2" />
        </div>

        <div className="center">
          <p>Batch no :</p>
          <input className="input-2" />
        </div>

        <div className="center">
          <p>Quantity :</p>
          <input className="input-2" />
        </div>
      </div>
    </div>
  );
}
