const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
        list of require properties:
        *first_name: needs to be a String. recived ${user.first_name}
        *last_name: needs to be a String. recived ${user.last_name}
        *email: needs to be a String. recived ${user.email}
        *age: needs to be a Number. recived ${user.age}
    `
}

const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
        list of require properties:
        *title: needs to be a String. recived ${product.title}
        *description: needs to be a String. recived ${product.description}
        *price: needs to be a Number. recived ${product.price}
        *code: needs to be a String. recived ${product.code}
        *stock: needs to be a Number. recived ${product.stock}
        *category: needs to be a String. recived ${product.category}
    `
}

const generatePurchaseCartErrorInfo = (product, stock, quantity) => {
    return `Error processing cart purchase. Please check the following:
        *Product: ${product}
        *Quantity to purchase: ${quantity}
        *Stock: ${stock}
    `;
}


module.exports = {
    generateUserErrorInfo,
    generateProductErrorInfo,
    generatePurchaseCartErrorInfo
}