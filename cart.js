console.clear();

// Update badge if cookies exist
if (document.cookie.indexOf(',counter=') >= 0) {
    let counter = document.cookie.split(',')[1].split('=')[1];
    document.getElementById("badge").innerHTML = counter;
}

// DOM references
let cartContainer = document.getElementById('cartContainer');

// Create the cart display containers
let boxContainerDiv = document.createElement('div');
boxContainerDiv.id = 'boxContainer';

// Function to dynamically display cart items
function dynamicCartSection(ob, itemCounter) {
    let boxDiv = document.createElement('div');
    boxDiv.id = 'box';
    boxContainerDiv.appendChild(boxDiv);

    let boxImg = document.createElement('img');
    boxImg.src = ob.preview;
    boxDiv.appendChild(boxImg);

    let boxh3 = document.createElement('h3');
    let h3Text = document.createTextNode(ob.name + ' × ' + itemCounter);
    boxh3.appendChild(h3Text);
    boxDiv.appendChild(boxh3);

    let boxh4 = document.createElement('h4');
    let h4Text = document.createTextNode('Amount: Rs ' + ob.price);
    boxh4.appendChild(h4Text);
    boxDiv.appendChild(boxh4);

    cartContainer.appendChild(boxContainerDiv);
    cartContainer.appendChild(totalContainerDiv);

    return cartContainer;
}

// Total amount container
let totalContainerDiv = document.createElement('div');
totalContainerDiv.id = 'totalContainer';

let totalDiv = document.createElement('div');
totalDiv.id = 'total';
totalContainerDiv.appendChild(totalDiv);

let totalh2 = document.createElement('h2');
let h2Text = document.createTextNode('Total Amount');
totalh2.appendChild(h2Text);
totalDiv.appendChild(totalh2);

// Function to update total amount
function amountUpdate(amount) {
    totalDiv.innerHTML = ''; // Clear previous total amount
    let totalh2 = document.createElement('h2');
    let h2Text = document.createTextNode('Total Amount');
    totalh2.appendChild(h2Text);
    totalDiv.appendChild(totalh2);

    let totalh4 = document.createElement('h4');
    let totalh4Text = document.createTextNode('Amount: Rs ' + amount);
    totalh4.appendChild(totalh4Text);
    totalDiv.appendChild(totalh4);
    totalDiv.appendChild(buttonDiv);
}

let buttonDiv = document.createElement('div');
buttonDiv.id = 'button';
totalDiv.appendChild(buttonDiv);

let buttonTag = document.createElement('button');
buttonDiv.appendChild(buttonTag);

let buttonLink = document.createElement('a');
buttonLink.href = '/orderPlaced.html';
buttonTag.appendChild(buttonLink);

let buttonText = document.createTextNode('Place Order');
buttonTag.appendChild(buttonText);

// Event Listener for "Place Order"
buttonTag.onclick = function () {
    console.log("Order Placed");
    // Clear the cookies
    document.cookie = "orderId=0; counter=0";
    
    // Redirect to the order placed page
    window.location.href = "orderPlaced.html";
};


// Backend API call
let httpRequest = new XMLHttpRequest();
let totalAmount = 0;

httpRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        let contentTitle = JSON.parse(this.responseText);

        let counter = Number(document.cookie.split(',')[1].split('=')[1] || 0);
        document.getElementById("totalItem").innerHTML = 'Total Items: ' + counter;

        let item = document.cookie.split(',')[0].split('=')[1]?.split(" ") || [];
        let totalAmount = 0;

        for (let i = 0; i < counter; i++) {
            let itemCounter = 1;
            for (let j = i + 1; j < counter; j++) {
                if (Number(item[j]) === Number(item[i])) {
                    itemCounter += 1;
                }
            }
            totalAmount += Number(contentTitle[item[i] - 1].price) * itemCounter;
            dynamicCartSection(contentTitle[item[i] - 1], itemCounter);
            i += (itemCounter - 1);
        }
        amountUpdate(totalAmount);
    }
};

httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product', true);
httpRequest.send();
