# Order.js

- PlaceOrder - <br/>
a) Placing the order - The order is placed by the customer. <br/>
b) first check if the vendor exists and then check if the customer exists or not<br/>
c) then it is checked if the value of orders for the particular vendor is less than 10 or not<br/>
d) if the value of orders is less than 10 then only place the order if the value of orders is 10 or greater than 10 then return a message that the vendor is busy<br/>
e) It will get Customer id from req.userId and the id of the vendor is passed through req.body<br/>
f) The 'menuItems' is an array of objects which contains the id of the FoodItem and the quantity of the FoodItem. This is also passed through req.body<br/>

- getOrderById - <br/>
a) Either the customer or the vendor can get the order by the id of the order<br/>
b) The id of the order is passed through req.params<br/>
c) The id of the customer/vendor is passed through req.userId<br/>

- getOrdersByVendor - <br/>
a) The vendor can get all the orders placed by the customers<br/>
b) The id of the vendor is passed through req.userId<br/>
c) This also includes the pagination features which means that the vendor can get the orders in batches of 15<br/>
d) The vendor needs to send the page number through req.query<br/>

- getOrdersByCustomer - <br/>
a) The customer can get all the orders placed by him/her<br/>
b) The id of the customer is passed through req.userId<br/>
c) This also includes the pagination features which means that the customer can get the orders in batches of 15<br/>
d) The customer needs to send the page number through req.query<br/>

- updateOrderStatus - <br/>
a) Only the vendor from whom the user has requested can update the order status<br/>
b) The id of the order is passed through req.params<br/>
c) The id of the vendor is passed through req.userId<br/>
d) The status of the order is passed through req.body<br/>
e) The response sent back will largely depend on the status of the order<br/>
   * If the status is 'Accepted', the status will change to 'accepted', +1 will be added to Vendor's Orders & response will be sent that the order is accepted<br/>
   * If the status is 'Rejected' then no value will be added to the Vendor's Orders and at the frontend side the Customer cannot perform any operation <br/>
   * If the status is 'Preparing' or 'Ready' then the status will change to the status passed through req.body<br/>
   * If the status is 'Delivered', then the staus is changed to 'Delivered', from the Vendor's Orders -1 will be subtracted and the response will be sent that the order is delivered<br/>

- CancelOrder - <br/>
a) The customer can delete the order<br/>
b) The id of the order is passed through req.params<br/>
c) The id of the customer is passed through req.userId<br/>
d) The order can only be deleted when the status is 'Accepted' or 'Preparing' else an error message will be given to the Customer<br/>
e) The status will be changed to Cancelled and the response will be sent that the order is Cancelled<br/>
f) This can only be performed by the customer who has placed the order<br/>
g) The vendor nor any other customer cannot cancel the order<br/>

- getLiveOrders - <br/>
a) The vendor can get all the live orders<br/>
b) The vendor can access to all live orders (i.e., orders that are currently being prepared or are ready for delivery).
c) The vendor ID should be included in the request, and the answer should include the order information as well as the status. The number of active orders should not be more than ten.

- getOrderByStatus - <br/>
a) The vendor can get all the orders by the status<br/>
b) The vendor can access to all orders by the status (i.e., orders that are currently being prepared or are ready for delivery).
c) The vendor can see the orders by it's status. The present status include 'Accepted', 'Preparing', 'Ready', 'Delivered', 'Cancelled'.
d) Only the vendor who is authorized to, can perform this action
e) In the req.body, the status of the order that is desired to be seen is passed.

- ViewIncomingOrders - <br/>
a) The vendor can view all the incoming orders<br/>
b) The vendor can access to all the orders whose status is 'Placed', and perform the action on it.
c) The vendor's id is passed through req.userId. Along with that the user will also send page and limit through the req.query to implement the pagination feature.


