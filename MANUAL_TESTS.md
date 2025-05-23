# Manual Test Cases for Item Batch Selection

## Test Case: POS_TC1 - Verify Initial Batch Loading and Subsequent Batch Selection

**Objective:** To verify that when an item with multiple batches is selected, the item view automatically loads and displays the details of the first batch, and that the user can subsequently select a different batch, with the view updating accordingly.

**Prerequisites:**
1.  The application is running.
2.  There is at least one item in the system that has multiple batches associated with it. Let's call this `Item_With_Multiple_Batches`.
    *   Batch 1 details: e.g., Batch ID: `B001`, Sell Price: `$10`, Quantity: `50`, EXP Date: `2024-12-31`
    *   Batch 2 details: e.g., Batch ID: `B002`, Sell Price: `$12`, Quantity: `30`, EXP Date: `2025-06-30`
    *   Batch 3 details: e.g., Batch ID: `B003`, Sell Price: `$9`,  Quantity: `100`, EXP Date: `2024-10-31`
3.  The API endpoints for item search (`/item/search/:input`) and batch fetching (`/batch/item/:itemId`) are functioning correctly.

**Test Steps:**

1.  **Navigate to the POS Interface:** Open the POS page in the application.
2.  **Search and Select Item:**
    *   In the "Search Item" input field, type the name of `Item_With_Multiple_Batches`.
    *   Select `Item_With_Multiple_Batches` from the search results.
3.  **Observe Item View (Initial Load):**
    *   **Expected Result:** The "Item View" modal/panel should open.
    *   **Expected Result:** The details displayed in the "Item View" (e.g., Batch ID, Item Price, Selling Price, Available Qty.) should correspond to the *first batch* (`B001`) of `Item_With_Multiple_Batches`. For example, Selling Price should be `$10`, Available Qty. should be `50`.
    *   **Expected Result:** The "Batch Id" dropdown/select field in the "Item View" should be populated with all available batch IDs for `Item_With_Multiple_Batches` (e.g., `B001`, `B002`, `B003`).
    *   **Expected Result:** The "Batch Id" dropdown should show the first batch (`B001`) as the currently selected value.
4.  **Change Batch Selection:**
    *   Click on the "Batch Id" dropdown.
    *   Select a different batch from the list (e.g., `B002`).
5.  **Observe Item View (After Batch Change):**
    *   **Expected Result:** The details displayed in the "Item View" should update to reflect the selected batch (`B002`). For example, Selling Price should now be `$12`, Available Qty. should be `30`.
    *   **Expected Result:** The "Batch Id" dropdown should show the newly selected batch (`B002`) as the current value.
6.  **Change Batch Selection Again:**
    *   Click on the "Batch Id" dropdown.
    *   Select another batch (e.g., `B003`).
7.  **Observe Item View (After Second Batch Change):**
    *   **Expected Result:** The details displayed in the "Item View" should update to reflect the selected batch (`B003`). For example, Selling Price should now be `$9`, Available Qty. should be `100`.
    *   **Expected Result:** The "Batch Id" dropdown should show the newly selected batch (`B003`) as the current value.
8.  **Add Item to Bill (Optional):**
    *   Enter a quantity for the item (e.g., 1).
    *   Click the "Save" or "Add to Bill" button in the item view.
    *   **Expected Result:** The item should be added to the bill with the details (especially price and batch ID) corresponding to the last selected batch (`B003`).

**Pass/Fail Criteria:**
*   **Pass:** All expected results in steps 3, 5, 7, and 8 (if performed) are met.
*   **Fail:** Any of the expected results are not met.
