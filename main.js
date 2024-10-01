 // JavaScript for theme toggle 
 const dropdownContainer = document.querySelector('.dropdown-container');
 const dropdownButton = document.querySelector('.dropdown-button');
 const lightModeLink = document.getElementById('lightMode');
 const darkModeLink = document.getElementById('darkMode');
 const body = document.body;
 
 // Toggle dropdown visibility
 dropdownButton.addEventListener('click', () => {
     dropdownContainer.classList.toggle('active');
    
 });
 
 // Change theme to light mode
 lightModeLink.addEventListener('click', (event) => {
     event.preventDefault(); 
     body.classList.remove('dark-mode'); 
     localStorage.setItem('theme', 'light'); 
 
 });
 
 // Change theme to dark mode
 darkModeLink.addEventListener('click', (event) => {
     event.preventDefault(); 
     body.classList.add('dark-mode'); 
     localStorage.setItem('theme', 'dark'); 
     console.log('Theme changed to Dark Mode');
 });
 
 // Apply saved theme on page load
 if (localStorage.getItem('theme') === 'dark') {
     body.classList.add('dark-mode');
 } else {
     body.classList.remove('dark-mode'); 
 }
 



const scrollRevealOption = {
    distance: "30px",
    origin: "top",
    duration:650,
};

const sr = ScrollReveal();

// Apply the reveal effect
sr.reveal(".member", {
    ...scrollRevealOption,
    delay: 400,
});

// feature container
ScrollReveal().reveal(".feature__card", {
    ...scrollRevealOption,
    interval: 400,
  });



// Modal and form elements
const memberIcon = document.querySelector('.member');
const authModal = document.getElementById('authModal');
const userForm = document.getElementById('userForm');
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const userAction = document.getElementById('userAction');
const actionCode = document.getElementById('actionCode'); 


memberIcon.addEventListener('click', function() {
    authModal.style.display = 'inline-block';
});

// Handle the Sign In button click
signInBtn.addEventListener('click', function() {
    userAction.value = 'login';  
    userForm.style.display = 'block';  
    authModal.style.display = 'none';  
    actionCode.textContent = 'Login';  
});

// Handle the Sign Up button click
signUpBtn.addEventListener('click', function() {
    userAction.value = 'register';  
    userForm.style.display = 'block';  
    authModal.style.display = 'none';  
    actionCode.textContent = 'Register';  
});

 
authModal.addEventListener('click', function(event) {
    event.stopPropagation();  
});

 
authModal.addEventListener('click', function(event) {
    if (event.target === authModal) {
        authModal.style.display = 'none';  
    }
});


document.getElementById('searchInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      
        const inputText = document.getElementById('searchInput').value;

        const words = inputText.split(' ');

        const firstTwoWords = words.slice(0, 2).join(' ');

        document.getElementById('result').textContent = firstTwoWords;
    }
});




const inventory = {
    peach: { quantity: 10, age: 3, description: "Juicy and sweet, rich in vitamins A and C." },
    oranges: { quantity: 10, age: 5, description: "Packed with vitamin C, boosts the immune system." },
    bananas: { quantity: 5, age: 10, description: "High in potassium and vitamin B6, provides quick energy." },
    peas: { quantity: 15, age: 2, description: "Rich in protein, fiber, and vitamins A and C." },
    mangoes: { quantity: 10, age: 6, description: "High in vitamins A and C, supports immune function." },
    arrowroots: { quantity: 7, age: 9, description: "Rich in fiber and carbohydrates, aids in digestive health." },
    lime: { quantity: 16, age: 7, description: "Great source of vitamin C, enhances immune function." },
    macadamia: { quantity: 20, age: 9, description: "High in healthy fats, supports heart health." },
    berry: { quantity: 6, age: 8, description: "Rich in antioxidants and vitamins, improves heart health." },
    watermelon: { quantity: 12, age: 4, description: "Hydrating and rich in vitamins A and C." }
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
    inventoryList.innerHTML = '';  
    for (let fruit in inventory) {
        const { quantity, age, description } = inventory[fruit];
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${fruit.charAt(0).toUpperCase() + fruit.slice(1)}</strong>: ${quantity} available (Age: ${age} days) - ${description}`;
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
    if (query && query.variety && inventory[query.variety.toLowerCase()]) {
        const remainingElement = document.createElement('p');
        remainingElement.textContent = `Remaining ${query.variety}: ${inventory[query.variety.toLowerCase()].quantity}`;
        notificationElement.appendChild(remainingElement);
    }

    // Display discount information if applicable
    if (notification.discount) {
        const discountElement = document.createElement('p');
        discountElement.textContent = `A discount of ${notification.discountAmount * 100}% has been applied!`;
        discountElement.style.color = "green";
        notificationElement.appendChild(discountElement);
    }

    // Trigger order confirmation modal based on success flag
    if (notification.success) {
        showOrderConfirmationModal(query);
    }

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 10000); //10 seconds delay
}



/**
 * Callback function for successful orders.
 */
function onSuccess(query) {
    notify({ message: 'The order was successful' }, query, { color: "#1A3636" });
}

 
function onError(notification) {
    notify(notification, null, { color: "red" });
}

 
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
 
function postOrder(variety, quantity) {
    const discountInfo = applyDiscount(variety, quantity);
    const query = { variety, quantity: quantity }; 

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


const subscribedEmails = new Set(); // Set to store unique emails

document.getElementById('subscribeForm').addEventListener('submit', function(event) {
    event.preventDefault();  

    const emailInput = document.getElementById('emailInput').value.trim();  
    const notification = document.getElementById('subscribeNotification');

    if (emailInput) {
        if (subscribedEmails.has(emailInput)) {
            
            // If the email already exists in the Set
            notification.textContent = `You are already subscribed with the email: ${emailInput}.`;
            notification.style.color = '#B80000';
            notification.style.fontWeight = 'bold';
        } else {
            // If it's a new email, add it to the Set
            subscribedEmails.add(emailInput);
            notification.textContent = `Thank you for subscribing! A confirmation email has been sent to ${emailInput}.`;
            notification.style.color = 'green';
            notification.style.fontWeight = 'bold';
        }
    } else {
        notification.textContent = 'Please enter a valid email address.';
        notification.style.color = 'red';
    }

    // Clear the input field after submission
    document.getElementById('subscribeForm').reset();

    setTimeout(() => {
        notification.textContent = '';  
    }, 10000);


});

if (!document.body.classList.contains('light-mode') && !document.body.classList.contains('dark-mode')) {
    
}
