//bill data
const [billData, setBillData] = useState({
bill_id: "",
bill_date: dateTime,
bill_time: "",
bill_customer: "",
bill_total: "",
bill_items: [
// {
// item_name: "",
// item_id: "",
// batch_id: "",
// buy_price: "",
// createdAt: "",
// exp_date: "",
// manufacture_date: "",
// quantity: "",
// sell_price: "",
// updatedAt: "",
// },
],
});

const [itemData, setItemData] = useState({}); //hold item data until set qty and added to bill data

itemData =
{
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
}
