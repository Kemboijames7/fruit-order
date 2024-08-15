// Mock API order function for demonstration
const inventory = {
    peach: 10,
    oranges: 10,
    bananas: 10,
    peas: 10,
    mangoes: 10,
    arrowroots: 10,
    lime: 10,
    watermelon: 10
};

function displayInventory() {
    const inventoryList = document.getElementById('inventoryList');
    inventoryList.innerHTML = ''; // Clear the list before updating
    for (let fruit in inventory) {
        const listItem = document.createElement('li');
        listItem.textContent = `${fruit}: ${inventory[fruit]} available`;
        inventoryList.appendChild(listItem);
    }
}

function order(query, onSuccess, onError) {
    // Simulate API response
    // const fruits = ['peach', 'oranges', 'bananas', 'peas', 'mangos', 'arrowroots', 'lime', 'watermelon'];

    let caseLower = query.variety.toLowerCase();

      // Check if the fruit exists in the inventory
    if (inventory[caseLower] === undefined) {
        onError({ message: `Invalid fruit: ${query.variety} not in inventory` });
        return;
    }

    if (inventory[caseLower] >= query.quantity) {
        inventory[caseLower] -= query.quantity;
        onSuccess(query);
        
    } else {
        onError({ message: `Insufficient quantity: only ${inventory[caseLower]} of ${query.variety} left` });
    }
}

/**
 * Notifies the customer with a given message.
 * @param {Object} notification - The notification object containing the message.
 */
function notify(notification, query, style = {}) {
    const notificationElement = document.getElementById('notification')
    notificationElement.innerHTML = '';

    // Apply dynamic background color based on success or error
    const backgroundColor = style.backgroundColor || "#F7DCB9";
    notificationElement.style.backgroundColor = backgroundColor;

    // Add transition for smooth background color change
    notificationElement.style.transition = "background-color 0.5s ease"; 

// Display the notification message
const messageElement = document.createElement('p');
 messageElement.textContent = notification.message;   
 Object.assign(messageElement.style, style);
 notificationElement.appendChild(messageElement);

      // Display order details
      const detailsElement = document.createElement('p');
      detailsElement.textContent = `Variety: ${query.variety}, Quantity: ${query.quantity}`;
      notificationElement.appendChild(detailsElement);

        // Display remaining inventory  for the ordered fruit
    const remainingElement = document.createElement('p');
    remainingElement.textContent = `Remaining ${query.variety}: ${inventory[query.variety.toLowerCase()]}`;
    notificationElement.appendChild(remainingElement);


   // Show order confirmation modal for successful orders
   if (notification.message.toLowerCase().includes("successful")) {
    showOrderConfirmationModal(query);
}
}


/**
 * Callback function for successful orders.
 */
function onSuccess(query) {
    notify({ message: 'The order was successful' }, query, {color : "#1A3636" });
    
}

/**
 * Callback function for failed orders.
 */
function onError(notification) {
    notify(notification, null, {color :"red"});
}

/**
 * Wraps the grocer's order function.
 * @param {Object} query - The query object containing variety and quantity.
 * @param {Function} onSuccess - The success callback.
 * @param {Function} onError - The error callback.
 */
function orderFromGrocer(query, onSuccess, onError) {
    order(query, onSuccess, onError);
}

// Show order confirmation modal
function showOrderConfirmationModal(query) {
    const modal = document.getElementById("orderModal");
    const closeButton = document.querySelector(".close-button");

    // Display order details in the modal
    document.getElementById("orderConfirmationMessage").textContent = `Thank you for your order of ${query.quantity} ${query.variety}(s).`;
    document.getElementById("estimatedDeliveryTime").textContent = "Estimated delivery time: 2-3 days.";

    modal.style.display = "block";

    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}

/**
 * Helper function to place an order by just passing variety and quantity.
 * @param {string} variety - The type of fruit to order.
 * @param {number} quantity - The quantity of fruit to order.
 */
function postOrder(variety, quantity) {
    const query = { variety, quantity };
    orderFromGrocer(query, onSuccess, onError);
}

// Handling form submission
document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const variety = document.getElementById('variety').value.trim();
    const quantity = parseInt(document.getElementById('quantity').value);
    postOrder(variety, quantity);
});
displayInventory();
