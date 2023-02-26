## Controllers

- [Customer.js](#customerjs)
- [Order.js](#orderjs)
- [Vendor.js](#vendorjs)
- [Menu.js](#menujs)

# Customer.js
- CustomerRegister - <br/>
a) The customer registers by passing the  name, email, phone, address, city, state, password through req.body<br/>
b) First it is checked if there already exists an account with the same email or not. If exists then it returns an error else it proceeds<br/>
c) The password is hashed using bcrypt and then the customer is registered<br/>
d) The customer is registered and the JWT token is generated whose validity is for 30 days<br/>

- CustomerLogin - <br/>
a) The customer logs in by passing the email and password through req.body<br/>
b) First it is checked if the customer exists or not. If not then it returns an error else it proceeds<br/>
c) The password is matched with the hashed password using bcrypt and then the customer is logged in<br/>
d) After successful login, the JWT token is generated whose validity is for 30 days<br/>

- UpdateCustomerDetails - <br/>
a) The customer can update his/her details by passing the name, phone, address, city, state through req.body<br/>
b) The id of the customer is passed through req.userId<br/>
c) Only the Customer can update his/her details and nobody else has the authority to do that<br/>

- getCustomerById - <br/>
a) The customer can get his/her details by passing the id of the customer as `_id` through req.params<br/>
b) Either the Customer or the Vendor can get the details of the customer<br/>

- forgotPassword - <br/>
a) For this we can use the Nodemailer package<br/>
b) The customer passes the email through it's req.body<br/>
c) Then an OTP is generated and sent to the customer's email. The OTP is also sent to the frontend for verification. 
   **P.S - I can do it in a more secure way. Like creating a seperate Model for storing the OTP in the backend and building seperate controllers for handling the OTP requests rather than sending the OTP to the frontend which can result in a security breach, but since its just a prototype and I'm not building for a top MNC/firm, I ain't doing that :)**
<br/>

- updatePassword - <br/>
a) The OTP that has been sent to the frontend shall be checked first. If both the user entered OTP and the OTP sent from Server will be correct then only this request should be sent<br/>
b) The customer can update his/her password by passing the new password through req.body<br/>

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

# Vendor.js

- register - <br/>
a) The Vendor can register by passing the name, email, phone, address, city, state, password, description
b) The email has to be unique, so if the email is already found in the database then an error message will be sent to the frontend<br/>
c) The password is hashed using bcrypt<br/>
d) A Token is generated using JWT whose validity is 30 days and the response is sent to the user.

- login - <br/>
a) The Vendor can login by passing the email and password<br/>
b) The email is checked if it exists in the database or not<br/>
c) If the email exists then the password is checked if it matches with the password in the database or not<br/>
d) If the password matches then a token is generated using JWT whose validity is 30 days and the response is sent to the user<br/>

- UpdateVendorDetails - <br/>
a) The Vendor can update his/her details by passing the name, phone, address, city, state, password, description
b) The email has to be unique, so if the email is already found in the database then an error message will be sent to the frontend<br/>

- forgotPassword - <br/>
a) For this we can use the Nodemailer package<br/>
b) The customer passes the email through it's req.body<br/>
c) Then an OTP is generated and sent to the customer's email. The OTP is also sent to the frontend for verification. 
   **P.S - I can do it in a more secure way. Like creating a seperate Model for storing the OTP in the backend and building seperate controllers for handling the OTP requests rather than sending the OTP to the frontend which can result in a security breach, but since its just a prototype and I'm not building for a top MNC/firm, I ain't doing that :)**
<br/>

- UpdateVendorPassword - <br/>
a) The OTP that has been sent to the frontend shall be checked first. If both the user entered OTP and the OTP sent from Server will be correct then only this request should be sent<br/>
b) The customer can update his/her password by passing the new password through req.body<br/>

- GetSingleVendor - <br/>
a) This is used for fetching the details of the vendor. The id of the vendor is passed through req.params<br/>
b) For this Authentication is not required<br/>
c) The response will be sent back with the details of the vendor as requested from the client side.<br/>
d) The request sent will also have the populated data of all the menu items of the vendor<br/>

- ShowVendors - <br/>
a) This is a search function. Through the req.query, either of city or name or both is passed to the server.
b) Appropriately the response will be sent back to the frontend.<br/>
c) **For this Authentication is not required**<br/>

- MenuOfVendor - <br/>
a) This is used for fetching the menu of the vendor. The id of the vendor is passed through req.params<br/>
b) **For this Authentication is not required**<br/>
c) All the Menu items that the Vendor has set up for it's Restaurant will be sent back to the frontend.<br/>


# Menu.js

- addingDish - <br/>
a) The id of the vendor is passed through the req.params<br/>
b) After validating the vendor, the menu item is added to the database<br/>
c) The foodName, foodDescription, foodPrice, foodImage, and category is passed through the req.body<br/>
d) After that the newly created menu is pushed to the Vendor's menu array and the Vendor is saved<br/>
e) The response will be sent back to the frontend with the newly created menu item<br/>

- deletingDish - <br/>
a) The id of the vendor is passed through the req.params<br/>
b) After validating the vendor, the menu item is deleted from the database<br/>
c) After removal of the menu, it's id is also removed from the Vendor's menu array and the Vendor is saved<br/>

- updatingDish - <br/>
a) The id of the vendor is passed through the req.params<br/>
b) Through the req.body, the foodName, foodDescription, foodPrice, foodImage, category is passed. <br/>
c) After validating the vendor, the menu item is updated in the database<br/>

- gettingDish - <br/>
a) The id of the vendor is passed through the req.params<br/>
b) **This is used for fetching a single dish**<br/>
c) **No Authenication is required for this**<br/>

- gettingAllDishes - 
a) The VendorId is passed through the req.body<br/>
**P.S. - This can also be done in alternative manner. Like taking the _id from the req.userId which is added to the req from the auth.js. But anyway...... :)**<br/>
b) **This is used for fetching all the dishes of the vendor**<br/>
c) **No Authenication is required for this**<br/>

- ToggleFoodAvailability - <br/>
a) The id of the Menu is passed through the req.params<br/>
b) The availability of the menu is toggled<br/>
c) This can only be done by the Vendor that has set the menu<br/>

- getMenuByCategory - <br/>
a) This provides to get the menu of the Vendor/Restaurant by category<br/>
b) The category is passed through the req.query<br/>
c) The VendorId is passed through the req.userId<br/>
d) The response will be sent back to the frontend with the menu items of the Vendor/Restaurant that are of the category that is passed through the req.query<br/>

