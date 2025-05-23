import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import hotkeys from "hotkeys-js";

import "./pos.css";
import Select from "react-select";

export default function Pos() {
  //for hotkeys
  const [isOpenCustomerAdd, setIsOpenCustomerAdd] = useState(false);
  const [isOpenCustomerView, setIsOpenCustomerView] = useState(false);
  const [isOpenItemView, setIsOpenItemView] = useState(false);
  const [isOpenBatchSelect, setIsOpenBatchSelect] = useState(false);

  const [isBarcodeSearch, setIsBarcodeSearch] = useState(false); //if search by barcode

  const selectCustomerRef = useRef(null);
  const selectItemSearchRef = useRef(null);
  const customerSaveOkRef = useRef(null);
  const custometSaveCancelRef = useRef(null);
  const customerSelectOkRef = useRef(null);
  const custometSelectCancelRef = useRef(null);
  const itemSelectOkRef = useRef(null);
  const itemSelectCancelRef = useRef(null);

  const [customerOptions, setCustomerOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [batchers, setBatchers] = useState([]); // if have multiple batchers for an item store that batches

  const [batchId, setBatchId] = useState(null); //current selected batch id
  const [itemData, setItemData] = useState({}); //hold item data until set qty and added to bill data

  //item view batch
  const [itemBatch, setItemBatch] = useState([]);

  const dateTime =
    new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
  //bill data
  const [billData, setBillData] = useState({
    bill_id: "",
    bill_date: dateTime,
    bill_time: "",
    bill_customer: "",
    bill_total: "",
    bill_items: [
      // {
      //   item_name: "",
      //   item_id: "",
      //   batch_id: "",
      //   buy_price: "",
      //   createdAt: "",
      //   exp_date: "",
      //   manufacture_date: "",
      //   quantity: "",
      //   sell_price: "",
      //   updatedAt: "",
      // },
    ],
  });

  //current Item Data

  useEffect(() => {
    const handleKeyDown = (e) => {
      // console.log(e.key);
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
    if (isBarcodeSearch) {
      try {
        const res = await axios.get(`http://localhost:8080/batch/${input}`);
        console.log("barcode item search", res.data);

        //if have more than one item
        if (res.data.length > 1) {
          setIsOpenBatchSelect(true);
          setBatchId(res.data[1].batch_id);
          setBatchers(res.data);
          console.log("multiple batch ids found !");
        } else {
          //if have single batch
          setIsOpenItemView(true);
          console.log("single batch id found!");
          setItemData(res.data[0]);
        }
      } catch (err) {
        console.error("Item search failed", err);
      }
    } else {
      try {
        const res = await axios.get(
          `http://localhost:8080/item/search/${input}`
        );
        console.log("item Name Search data", res.data);

        const result = res.data.map((item) => ({
          value: item.item_id,
          label: item.item_name,
          data: {
            item_name: item.item_name,
            item_price: item.item_price,
            item_quantity: item.item_quantity,
            item_id: item.item_id,
          },
        }));
        setItemOptions(result); // here not data of batchers
      } catch (err) {
        console.error("Item search failed", err);
      }
    }
  };

  //if have more batchers, can select one batch by selecting an item
  const handleBatchSelect = async (selectedOption) => {
    console.log("selected item", batchers[selectedOption]);
    setItemData(batchers[selectedOption]);
  };

  const handleItemSelect = async (selectedOption) => {
    console.log("Selected item:", selectedOption);

    //set itemData to item name only
    setItemData((prevData) => ({
      ...prevData,
      Item: { item_name: selectedOption.label },
    }));
    console.log("current item data", itemData);
    setIsOpenItemView(true);

    //fetch data about an Item batch
    try {
      const res = await axios.get(
        `http://localhost:8080/batch/item/${selectedOption.value}`
      );
      console.log("called batchers", res.data);
      const result = res.data.map((batch) => ({
        value: batch.batch_id,
        label: batch.batch_id,
        data: {
          batch_id: batch.batch_id,
          buy_price: batch.buy_price,
          createdAt: batch.createdAt,
          exp_date: batch.exp_date,
          item_id: batch.item_id,
          manufacture_date: batch.manufacture_date,
          quantity: batch.quantity,
          sell_price: batch.sell_price,
          updatedAt: batch.updatedAt,
        },
      }));
      setItemBatch(result); // This sets the options for the batch dropdown

      // Add logic here:
      // 1. Check if `result` is not empty.
      // 2. If it's not empty, take `result[0]` (the first batch).
      // 3. Update the `itemData` state with the details of this first batch.
      //    This can be done by calling `setItemData` similar to how `handleBatchSelectChange` does it.
      if (result && result.length > 0) {
        const firstBatch = result[0];
        setItemData((prevData) => ({
          ...prevData, // Retains Item: { item_name: selectedOption.label }
          batch_id: firstBatch.value, // or firstBatch.data.batch_id
          buy_price: firstBatch.data.buy_price,
          exp_date: firstBatch.data.exp_date,
          manufacture_date: firstBatch.data.manufacture_date,
          sell_price: firstBatch.data.sell_price,
          qty: 1, // Default quantity
          quantity: firstBatch.data.quantity, // Available quantity for this batch
          item_id: firstBatch.data.item_id, // This should be the item_id from the batch data
          // Add any other relevant fields from firstBatch.data
          updatedAt: firstBatch.data.updatedAt,
          createdAt: firstBatch.data.createdAt,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  //batch select ok
  const handleBatchSelectOk = () => {
    setIsOpenBatchSelect(false);
    setIsOpenItemView(true);
  };

  //item qty , etc. save
  const SaveItem = () => {
    setIsOpenItemView(false);
    setBillData((prevBillData) => ({
      ...prevBillData,
      bill_items: [
        ...prevBillData.bill_items,
        {
          item_name: itemData.Item.item_name,
          item_id: itemData.item_id,
          batch_id: itemData.batch_id,
          buy_price: itemData.buy_price,
          createdAt: itemData.createdAt,
          exp_date: itemData.exp_date,
          manufacture_date: itemData.manufacture_date,
          qty: itemData.qty,
          quantity: itemData.quantity,
          sell_price: itemData.sell_price,
          updatedAt: itemData.updatedAt,
        },
      ],
    }));
    console.log("bill data", billData);

    //clear
    setItemData({});
  };

  //item view batch handle
  const handleBatchSelectChange = (selectedOption) => {
    console.log("selected batch", selectedOption);

    //set to itemData
    setItemData((prevData) => ({
      ...prevData,
      //name is already added to itemData
      batch_id: selectedOption.value,
      buy_price: selectedOption.data.buy_price,
      exp_date: selectedOption.data.exp_date,
      manufacture_date: selectedOption.data.manufacture_date,
      sell_price: selectedOption.data.sell_price,
      qty: 1,
      quantity: selectedOption.data.quantity,
      item_id: selectedOption.data.item_id,
      updatedAt: selectedOption.data.updatedAt,
      createdAt: selectedOption.data.createdAt,
    }));
  };

  //when click item in bill load again open item view
  const handleBillItemSelect = (item) => {
    setIsOpenItemView(true);
    console.log(item);
    // setItemData(item);
  };

  //customer add
  const AddCustomer = () => {
    setIsOpenCustomerAdd(false);
  };

  //enter bill
  const EnterBill = () => {
    console.log("Bill data", billData);
  };
  return (
    <div>
      <div className="pos-parent">
        <div className="pos-div1">
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
            <input
              className="input-1 pos-date-input"
              value={dateTime}
              disabled
            />
          </div>
        </div>
        <div className="pos-div2">
          <div className="pos-item-search-div">
            <p className="label-1">Search Item :</p>
            <label>Barcode search :</label>
            <input
              type="checkbox"
              value={isBarcodeSearch}
              onChange={() => setIsBarcodeSearch(!isBarcodeSearch)}
            />

            <Select
              // isClearable={true}
              // defaultValue={null}
              options={itemOptions}
              ref={selectItemSearchRef}
              placeholder="Search item"
              onInputChange={(input) => {
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
              {billData.bill_items.length > 0 &&
                billData.bill_items.map((item, index) => (
                  <tr
                    key={index}
                    onClick={(item) => handleBillItemSelect(item)}
                  >
                    <td>{item.item_name}</td>
                    <td>Rs. {item.sell_price}</td>
                    <td>{item.qty}</td>
                    <td>Rs. {item.sell_price * item.qty}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="pos-div3">
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
            <button className="pos-enter" onClick={() => EnterBill()}>
              enter
            </button>
          </div>
        </div>
      </div>

      {isOpenCustomerAdd ||
      isOpenCustomerView ||
      isOpenItemView ||
      isOpenBatchSelect ? (
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
                <button className="btn-add">save</button>
                <button
                  className="btn-cancel"
                  onClick={() => setIsOpenCustomerView(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isOpenBatchSelect && (
            <div className="pos-view-item-div">
              <p>Batch Id : {batchId}</p>
              <div className="pos-item-input-div">
                <p className="label-1">Select Item :</p>
                {/* <Select options={batchers} /> */}
                <select onChange={(e) => handleBatchSelect(e.target.value)}>
                  {batchers.map((item, index) => (
                    <option key={index} value={index}>
                      {item.Item.item_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pos-item-btn-div">
                <button
                  className="btn-add"
                  onClick={() => handleBatchSelectOk()}
                >
                  save
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => {
                    setIsOpenBatchSelect(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isOpenItemView && (
            <div className="pos-view-item-div">
              <p>Item Name : {itemData.Item.item_name}</p>
              <div className="pos-item-input-div">
                <p className="label-1">Batch Id :</p>
                <Select
                  options={itemBatch}
                  value={
                    itemBatch.find(
                      (option) => option.value === itemData.batch_id
                    ) || null
                  }
                  onChange={(selectedOption) =>
                    handleBatchSelectChange(selectedOption)
                  }
                  placeholder="Select a batch"
                />
              </div>
              <div className="pos-item-input-div">
                <p className="label-1">Item Price :</p>
                <input
                  className="pos-customer-input"
                  value={itemData.buy_price}
                  onChange={() => {}}
                  disabled
                />
              </div>
              <div className="pos-item-input-div">
                <p className="label-1">Selling Price :</p>
                <input
                  className="pos-customer-input"
                  value={itemData.sell_price}
                  onChange={(e) => {
                    setItemData({ ...itemData, sell_price: e.target.value });
                  }}
                />
              </div>
              <div className="pos-item-input-div">
                <p className="label-1">Available Qty. : {itemData.Item.sku}</p>
                <input
                  className="pos-customer-input"
                  value={itemData.quantity}
                  onChange={(e) => {
                    setItemData({ ...itemData, qty: e.target.value });
                  }}
                />
              </div>
              <div className="pos-item-input-div">
                <p className="label-1">Item Quantity : {itemData.Item.sku}</p>
                <input
                  className="pos-customer-input"
                  type="number"
                  value={itemData.qty || 1}
                  onChange={(e) => {
                    setItemData({ ...itemData, qty: e.target.value });
                  }}
                />
              </div>
              <div className="pos-item-input-div">
                <p className="label-1">Discount rate : %</p>
                <input
                  className="pos-customer-input"
                  value={itemData.discountRate}
                  onChange={(e) => {
                    setItemData({ ...itemData, discountRate: e.target.value });
                  }}
                />
              </div>
              <div className="pos-item-input-div">
                <p className="label-1">Discount Value :</p>
                <input
                  className="pos-customer-input"
                  value={itemData.discountValue}
                  onChange={(e) => {
                    setItemData({ ...itemData, discountValue: e.target.value });
                  }}
                />
              </div>
              <div className="pos-item-btn-div">
                <button className="btn-add" onClick={() => SaveItem()}>
                  Save
                </button>
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
