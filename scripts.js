let currentOrder = [];
let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

console.log("Initialisation terminée");

function showMenu(menu) {
    console.log("showMenu appelé avec le menu:", menu);
    document.getElementById('order-menu').style.display = 'none';
    document.getElementById('cart').style.display = 'none';
    document.getElementById('history-menu').style.display = 'none';

    if (menu === 'order') {
        document.getElementById('order-menu').style.display = 'flex';
    } else if (menu === 'history') {
        document.getElementById('history-menu').style.display = 'flex';
        displayHistory();
    }
}

function showSubMenu(type) {
    console.log("showSubMenu appelé avec le type:", type);
    document.getElementById('boisson-menu').style.display = 'none';
    document.getElementById('aliment-menu').style.display = 'none';
    if (type === 'boisson') {
        document.getElementById('boisson-menu').style.display = 'block';
    } else if (type === 'aliment') {
        document.getElementById('aliment-menu').style.display = 'block';
    }
}

function promptQuantity(item, price) {
    console.log("promptQuantity appelé avec l'article:", item, "et le prix:", price);
    let quantity = prompt(`Combien de ${item} souhaitez-vous ajouter ?`);
    if (quantity !== null && !isNaN(quantity) && quantity > 0) {
        addItem(item, quantity, price);
    }
}

function addItem(item, quantity, price) {
    console.log("addItem appelé avec l'article:", item, "la quantité:", quantity, "et le prix:", price);
    currentOrder.push({ item: item, quantity: parseInt(quantity), price: parseFloat(price) });
    updateOrderList();
}
function updateOrderList() {
  console.log("updateOrderList appelé");
  let orderList = document.getElementById('order-list');
  let total = 0;
  orderList.innerHTML = '';
  currentOrder.forEach((orderItem, index) => {
      let itemTotal = (orderItem.quantity * orderItem.price).toFixed(2);
      total += parseFloat(itemTotal);
      
      let li = document.createElement('li');
      li.textContent = `${orderItem.item} x ${orderItem.quantity} - ${itemTotal} €`;
      
      let removeButton = document.createElement('button');
      removeButton.textContent = 'Supprimer';
      removeButton.className = 'remove-button'; // Ajoutez la classe CSS ici
      removeButton.onclick = () => removeItem(index);

      li.appendChild(removeButton);
      orderList.appendChild(li);
  });
  document.getElementById('order-total').textContent = total.toFixed(2);
  document.getElementById('cart').style.display = 'block';
}


function removeItem(index) {
    console.log("removeItem appelé avec l'index:", index);
    currentOrder.splice(index, 1);
    updateOrderList();
}

function submitOrder() {
    console.log("submitOrder appelé");
    if (currentOrder.length > 0) {
        orderHistory.push({
            order: currentOrder,
            total: parseFloat(document.getElementById('order-total').textContent)
        });
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        // alert('Commande soumise avec succès!');
        currentOrder = [];
        updateOrderList();
        document.getElementById('order-menu').style.display = 'none';
        document.getElementById('main-menu').style.display = 'flex';
    } else {
        alert('Votre panier est vide!');
    }
}

function displayHistory() {
    console.log("displayHistory appelé");
    let historyList = document.getElementById('history-list');
    let totalRevenue = 0;
    historyList.innerHTML = '';

    orderHistory.forEach((order, index) => {
        if (order && order.order && Array.isArray(order.order)) {
            let orderTotal = order.total || 0;
            totalRevenue += orderTotal;
            let li = document.createElement('li');
            li.textContent = `Commande ${index + 1}: ${order.order.map(orderItem => {
                let itemTotal = (orderItem.quantity * orderItem.price).toFixed(2);
                return `${orderItem.item} x ${orderItem.quantity} - ${itemTotal} €`;
            }).join(', ')} (Total: ${orderTotal.toFixed(2)} €)`;
            historyList.appendChild(li);
        } else {
            console.warn(`Structure de commande invalide pour l'index ${index}`);
        }
    });

    document.getElementById('total-revenue').textContent = totalRevenue.toFixed(2);
}

function clearHistory() {
    console.log("clearHistory appelé");
    if (confirm('Voulez-vous vraiment effacer l\'historique ?')) {
        orderHistory = [];
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        displayHistory();
    }
}

// Initial display of the main menu
console.log("Appel initial de showMenu");
showMenu('main');
