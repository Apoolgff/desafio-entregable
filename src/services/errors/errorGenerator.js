const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
        list of require properties:
        *first_name: needs to be a String. received ${user.first_name}
        *last_name: needs to be a String. received ${user.last_name}
        *email: needs to be a String. received ${user.email}
        *age: needs to be a Number. received ${user.age}
    `
}


const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid. 
        list of require properties:
        *title: needs to be a String. received ${product.title}
        *description: needs to be a String. received ${product.description}
        *price: needs to be a Number. received ${product.price}
        *code: needs to be a String. received ${product.code}
        *stock: needs to be a Number. received ${product.stock}
        *category: needs to be a String. received ${product.category}
    `
}


const generatePurchaseCartErrorInfo = (product, stock, quantity) => {
    return `Error processing cart purchase. Please check the following:
        *Product: ${product}
        *Quantity to purchase: ${quantity}
        *Stock: ${stock}
    `
}


module.exports = {
    generateUserErrorInfo,
    generateProductErrorInfo,
    generatePurchaseCartErrorInfo
}