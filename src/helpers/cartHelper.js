// Función para generar un código único
function generateUniqueCode() {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 7);
    return timestamp + randomString; 
}

// Función para calcular el monto total de una lista de productos
function calculateTotalAmount(products) {
    let total = 0;
    products.forEach(product => {
        total += product.price * product.quantity;
    });
    return total;
}

module.exports = {
    generateUniqueCode,
    calculateTotalAmount
}
