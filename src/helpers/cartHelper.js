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

        if (typeof product.price === 'number' && typeof product.quantity === 'number') {

            total += product.price * product.quantity;
        } else {

            console.error('Producto con precio o cantidad inválidos:', product);
        }
    });

    return parseFloat(total.toFixed(2)); 
}


module.exports = {
    generateUniqueCode,
    calculateTotalAmount
}
