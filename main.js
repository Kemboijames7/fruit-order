const scrollRevealOption = {
    distance: "50px",
    origin: "bottom",
    duration:1000,
};

scrollRevealOption().reveal(".member",{
    ...scrollRevealOption,
    delay:500
});





// Mock API order function for demonstration
const inventory = {
    peach: { quantity: 10, age: 3 },
    oranges: { quantity: 10, age: 5 },
    bananas: { quantity: 5, age: 10 },
    peas: { quantity: 15, age: 2 },
    mangoes: { quantity: 10, age: 6 },
    arrowroots: { quantity: 7, age: 9 },
    lime: { quantity: 16, age: 7 },
    macadamia: { quantity: 20, age: 9 },
    berry: { quantity: 6, age: 8 },
    watermelon: { quantity: 12, age: 4 }
};

// Function to determine the fruits that should be discounted
function determineDiscountedFruits() {
    let discountedFruits = [];
    for (const fruit in inventory) {
        const { quantity, age } = inventory[fruit];
        // Apply discount if the fruit is either in high quantity or has been in stock too long
        if (quantity > 5 || age > 7) {
            discountedFruits.push(fruit);
        }
    }
    return discountedFruits;
}

// Function to apply a discount to the order
function applyDiscount(variety, quantity) {
    const discountedFruits = determineDiscountedFruits();
    const caseLower = variety.toLowerCase();
    let discountAmount = 0;

    if (discountedFruits.includes(caseLower)) {
        const { age, quantity: fruitQuantity } = inventory[caseLower];
        
        // More aggressive discount for older fruits
        if (age > 7) discountAmount = 0.30;
        else if (fruitQuantity > 10) discountAmount = 0.20;
        else discountAmount = 0.10;
        
        return {
            message: `A discount of ${discountAmount * 100}% has been applied to your order of ${quantity} ${variety}(s)!`,
            discount: true,
            discountAmount
        };
    } else {
        return { message: 'No discount applied.', discount: false, discountAmount: 0 };
    }
}


function displayInventory() {
    const inventoryList = document.getElementById('inventoryList');
    inventoryList.innerHTML = ''; // Clear the list before updating
    for (let fruit in inventory) {
        const listItem = document.createElement('li');
        listItem.textContent = `${fruit}: ${inventory[fruit].quantity} available (Age: ${inventory[fruit].age} days)`;
        inventoryList.appendChild(listItem);
    }
}

function order(query, onSuccess, onError) {
    let caseLower = query.variety.toLowerCase();

    // Check if the fruit exists in the inventory
    if (inventory[caseLower] === undefined) {
        onError({ message: `Invalid fruit: ${query.variety} not in inventory` });
        return;
    }

    if (inventory[caseLower].quantity >= query.quantity) {
        inventory[caseLower].quantity -= query.quantity;
        onSuccess(query);
    } else {
        onError({ message: `Insufficient quantity: only ${inventory[caseLower].quantity} of ${query.variety} left` });
    }
}

/**
 * Notifies the customer with a given message.
 * @param {Object} notification - The notification object containing the message.
 */
function notify(notification, query, style = {}) {
    const notificationElement = document.getElementById('notification');
    notificationElement.innerHTML = '';
    
    // Apply dynamic background color based on success or error
    const backgroundColor = style.backgroundColor || "#F7DCB9";
    notificationElement.style.backgroundColor = backgroundColor;
    
    // Add transition for smooth background color change
    notificationElement.style.transition = "background-color 0.5s ease";
    
    const messageElement = document.createElement('p');
    messageElement.textContent = notification.message;
    Object.assign(messageElement.style, style);
    notificationElement.appendChild(messageElement);
    
    if (query && query.variety && query.quantity) {
        const detailsElement = document.createElement('p');
        detailsElement.textContent = `Variety: ${query.variety}, Quantity: ${query.quantity}`;
        notificationElement.appendChild(detailsElement);
    }

    // Display remaining inventory for the ordered fruit
    const remainingElement = document.createElement('p');
    remainingElement.textContent = `Remaining ${query.variety}: ${inventory[query.variety.toLowerCase()].quantity}`;
    notificationElement.appendChild(remainingElement);

    // Display discount information if applicable
    if (notification.discount) {
        const discountElement = document.createElement('p');
        discountElement.textContent = `A discount of ${notification.discountAmount * 100}% has been applied!`;
        discountElement.style.color = "green";
        notificationElement.appendChild(discountElement);
    }

    // Trigger order confirmation modal based on success flag, not the message content
    if (notification.success) {
        showOrderConfirmationModal(query);
    }

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 5000); // 5 seconds delay
}


/**
 * Callback function for successful orders.
 */
function onSuccess(query) {
    notify({ message: 'The order was successful' }, query, { color: "#1A3636" });
}

/**
 * Callback function for failed orders.
 */
function onError(notification) {
    notify(notification, null, { color: "red" });
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
    const discountInfo = applyDiscount(variety, quantity);
    const query = { variety, quantity: quantity }; // Use updated quantity if discount is applied

    if (discountInfo.discount) {
        query.quantity = Math.ceil(quantity * (1 - discountInfo.discountAmount));
    }

    orderFromGrocer(query, function(query) {
        notify({ message: 'The order was successful', ...discountInfo }, query, { color: "#1A3636" });
    }, onError);
}

// Handling form submission
document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const variety = document.getElementById('variety').value.trim();
    const quantity = parseInt(document.getElementById('quantity').value);
    postOrder(variety, quantity);
});
displayInventory();


document.getElementById('subscribeForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const emailInput = document.getElementById('emailInput').value;
    const notification = document.getElementById('subscribeNotification');

    // Here you would typically send the email to your server or an API
    // For demonstration, we'll just simulate a successful subscription

    if (emailInput) {
        notification.textContent = `Thank you for subscribing! A confirmation email has been sent to ${emailInput}.`;
        notification.style.color = 'green';
        notification.style.fontWeight = 'bold';
    } else {
        notification.textContent = 'Please enter a valid email address.';
        notification.style.color = 'red';
    }

    // Clear the input field
    document.getElementById('subscribeForm').reset();
});
