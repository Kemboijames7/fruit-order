// Mock API order function for demonstration


function order(query, onSuccess, onError) {
    // Simulate API response
    const fruits = ['peach', 'oranges', 'bananas', 'peas', 'mangos', 'arrowroots', 'lime', 'watermelon'];

    let caseLower = query.variety.toLowerCase();

    if (fruits.includes(caseLower) && query.quantity <= 100) {
        onSuccess(query);
        fruits.pop();
    } else {
        onError(query);
    }
}

/**
 * Notifies the customer with a given message.
 * @param {Object} notification - The notification object containing the message.
 */
function notify(notification, query, style = {}) {
    const notificationElement = document.getElementById('notification')
    notificationElement.textContent = notification.message;

      // Display order details
      const detailsElement = document.createElement('p');
      detailsElement.textContent = `Variety: ${query.variety}, Quantity: ${query.quantity}`;
      notificationElement.appendChild(detailsElement);

    Object.assign(notificationElement.style, style);
}

/**
 * Callback function for successful orders.
 */
function onSuccess(query) {
    notify({ message: `The order was a success` }, query, {color :"black"} );
    
}

/**
 * Callback function for failed orders.
 */
function onError(query) {
    notify({ message: 'invalid' }, query, {color :"red"});
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
