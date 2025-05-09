import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import hotkeys from "hotkeys-js";

import "./pos.css";
import PosData from "../../utils/posdata";
import Select from "react-select";

export default function Pos() {
  const [isOpenCustomerAdd, setIsOpenCustomerAdd] = useState(false);
  const [isOpenCustomerView, setIsOpenCustomerView] = useState(false);
  const [isOpenItemView, setIsOpenItemView] = useState(false);

  const selectCustomerRef = useRef(null);
  const selectItemSearchRef = useRef(null);

  const customerSaveOkRef = useRef(null);
  const custometSaveCancelRef = useRef(null);
  const customerSelectOkRef = useRef(null);
  const custometSelectCancelRef = useRef(null);
  const itemSelectOkRef = useRef(null);
  const itemSelectCancelRef = useRef(null);

  const [itemList, setItemList] = useState([]);

  const [customerOptions, setCustomerOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log(e.key);
      if (e.key === "F4") {
        e.preventDefault();
        setIsOpenCustomerAdd(true);
      }
      if (e.ctrlKey && e.key === "F1") {
        e.preventDefault();
        selectCustomerRef.current?.focus(); // ✅ works
      }

      if (e.ctrlKey && e.key === "F2") {
        e.preventDefault();
        selectItemSearchRef.current?.focus(); // ✅ works
      }

      if (e.key === "Shift") {
        console.log("shift clicked!");
        e.preventDefault();
        if (isOpenCustomerAdd) customerSaveOkRef.current?.click();
        else if (isOpenCustomerView) customerSelectOkRef.current?.click();
        else if (isOpenItemView) itemSelectOkRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const SearchCustomer = async (input) => {
    if (!input) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/customer/search/${input}`
      );
      const result = res.data.map((cust) => ({
        value: cust._id,
        label: cust.customer_name, // change based on your API data
        data: cust,
      }));
      setCustomerOptions(result);
    } catch (err) {
      console.error("Customer search failed", err);
    }
  };
  const handleCustomerSelect = (selectedOption) => {
    setIsOpenCustomerView(true);
    console.log("Selected customer:", selectedOption.data);
  };

  const [itemOptions, setItemOptions] = useState();
  const SearchItem = async (input) => {
    if (!input) return;
    try {
      const res = await axios.get(`http://localhost:8080/item/search/${input}`);
      const result = res.data.map((item) => ({
        value: item.Item_id,
        label: item.item_name, // change based on your API data
        data: {
          item_name: item.item_name,
          item_price: item.item_price,
          item_quantity: item.item_quantity,
          item_id: item.Item_id,
        },
      }));
      setItemOptions(result);
    } catch (err) {
      console.error("Item search failed", err);
    }
  };
  const handleItemSelect = (selectedOption) => {
    console.log("Selected item:", selectedOption.data);
    setIsOpenItemView(true);
  };

  //customer add
  const AddCustomer = () => {
    setIsOpenCustomerAdd(false);
  };
  return (
    <div>
      <div class="pos-parent">
        <div class="pos-div1">
          <div className="pos-customer-div">
            <div className="pos-customer-input-div">
              <p className="label-1"> Customer :</p>
              <Select
                ref={selectCustomerRef}
                className="customer-search"
                onInputChange={(input) => {
                  setInputValue(input);
                  SearchCustomer(input);
                }}
                options={customerOptions}
                placeholder="Search customer"
                menuIsOpen={undefined}
                onChange={(selectedOption) =>
                  handleCustomerSelect(selectedOption)
                }
              />
            </div>
            <button
              className="btn-1"
              onClick={() => setIsOpenCustomerAdd(true)}
            >
              ADD
            </button>
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
              ref={selectItemSearchRef}
              placeholder="Search item"
              onInputChange={(input) => {
                setInputValue(input);
                SearchItem(input);
              }}
              onChange={(selectedOption) => handleItemSelect(selectedOption)}
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

      {isOpenCustomerAdd || isOpenCustomerView || isOpenItemView ? (
        <div className="pos-over-panel">
          {isOpenCustomerAdd && (
            <div className="pos-add-customer-div">
              <p>Add Customer</p>
              <div className="pos-customer-input-div">
                <p className="label-1">Customer Id :</p>
                <input className="pos-customer-input" disabled />
              </div>
              <div className="pos-customer-input-div">
                <p className="label-1">Customer Name :</p>
                <input className="pos-customer-input" />
              </div>
              <div className="pos-customer-input-div">
                <p className="label-1">Customer NIC :</p>
                <input className="pos-customer-input" />
              </div>
              <div className="pos-customer-input-div">
                <p className="label-1">Customer Phone :</p>
                <input className="pos-customer-input" />
              </div>
              <div className="pos-customer-input-div">
                <p className="label-1">Customer Address :</p>
                <input className="pos-customer-input" />
              </div>

              <div className="pos-customer-btn-div">
                <button
                  ref={customerSaveOkRef}
                  className="btn-add"
                  onClick={() => AddCustomer()}
                >
                  Save
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setIsOpenCustomerAdd(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isOpenCustomerView && (
            <div className="pos-view-customer-div">
              <p>Customer</p>
              <div className="pos-customer-view-div">
                <p className="label-1">Customer Id :</p>
                <input className="pos-customer-view-input" disabled />
              </div>
              <div className="pos-customer-view-div">
                <p className="label-1">Customer Name :</p>
                <input className="pos-customer-view-input" disabled />
              </div>
              <div className="pos-customer-view-div">
                <p className="label-1">Customer NIC :</p>
                <input className="pos-customer-view-input" disabled />
              </div>
              <div className="pos-customer-view-div">
                <p className="label-1">Customer Phone :</p>
                <input className="pos-customer-view-input" disabled />
              </div>
              <div className="pos-customer-view-div">
                <p className="label-1">Customer Address :</p>
                <input className="pos-customer-view-input" disabled />
              </div>
              <div className="pos-customer-view-div">
                <p className="label-1">Customer Type :</p>
                <input className="pos-customer-view-input" disabled />
              </div>
              <div className="pos-customer-view-div">
                <p className="label-1">Total Credit Payable :</p>
                <input className="pos-customer-view-input" disabled />
              </div>
              <div className="pos-customer-btn-div">
                <button className="btn-add">Conform</button>
                <button
                  className="btn-cancel"
                  onClick={() => setIsOpenCustomerView(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isOpenItemView && (
            <div className="pos-view-item-div">
              <p>Item</p>
              <div className="pos-item-input-div">
                <p className="label-1">Item Id :</p>
                <input className="pos-customer-input" disabled />
              </div>
              <div className="pos-item-input-div">
                <p className="label-1">Item Name :</p>
                <input className="pos-customer-input" />
              </div>
              <div className="pos-item-input-div">
                <p className="label-1">Item Price :</p>
                <input className="pos-customer-input" />
              </div>
              <div className="pos-item-input-div">
                <p className="label-1">Item Quantity :</p>
                <input className="pos-customer-input" />
              </div>
              <div className="pos-item-btn-div">
                <button className="btn-add">Save</button>
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setIsOpenItemView(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
