import React, { useRef, useEffect } from "react";
import "./pos.css";
import PosData from "../../utils/posdata";
import Select from "react-select";

export default function Pos() {
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const InventoryItems = [
    {
      _id: 0,
      Item_id: "item-001",
      item_name: "test item",
      sku: "unit",
      batch_id: "batch-004",
      sell_price: 100,
      buy_price: 80,
      manufacture_date: "2025-01-02",
      exp_date: "2025-09-02 ",
      quantity: 50,
    },
  ];
  const itemOptions = InventoryItems.map((item) => ({
    value: item.Item_id,
    label: item.item_name,
    data: item, // optional: to pass the whole item object
  }));

  const selectRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        // Focus react-select input
        selectRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
      <div class="pos-parent">
        <div class="pos-div1">
          <div className="pos-customer-div">
            <div className="pos-customer-input-div">
              <p className="label-1"> Customer :</p>
              <Select options={options} className="customer-search" />
            </div>
            <button className="btn-1">ADD</button>
            <button className="btn-1">REMOVE</button>
          </div>
          <div className="pos-date-div">
            <p className="label-1"> Date :</p>
            <input className="input-1 pos-date-input" />
          </div>
        </div>
        <div class="pos-div2">
          <div className="pos-item-search-div">
            <p className="label-1">Search Item :</p>
            <Select
              options={itemOptions}
              ref={selectRef}
              placeholder="Search item"
              onChange={(selectedOption) =>
                console.log("Selected item:", selectedOption.data)
              }
            />
          </div>
          <table className="pos-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {PosData.map((item, index) => (
                <tr key={index}>
                  <td>{item.item_name}</td>
                  <td>Rs. {item.item_price}</td>
                  <td>{item.item_quantity}</td>
                  <td>Rs. {item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div class="pos-div3">
          <div>
            <p className="label-1">Net Total :</p>
            <input className="pos-div3-inputs" value={100000.0} />
          </div>
          <div>
            <p className="label-1">Payment Type :</p>
            <div className="pos-payment-method-btn-div">
              <button className="btn-1">Credit</button>
              <button className="btn-1">Cash</button>
            </div>
          </div>
          <div>
            <p className="label-1">Payment Amount :</p>
            <input className="pos-div3-inputs" />
          </div>
          <div>
            <p className="label-1">Credit Amount :</p>
            <input className="pos-div3-inputs" />
          </div>
          <div>
            <p className="label-1">Change :</p>
            <input className="pos-div3-inputs" />
          </div>
          <div>
            <button className="pos-enter">enter</button>
          </div>
        </div>
      </div>
    </div>
  );
}
