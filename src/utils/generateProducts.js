const { fakerES } = require('@faker-js/faker');


const generateMockProducts = () => {
    return {
        title: fakerES.commerce.productName(),
        description: fakerES.commerce.productDescription(),
        code: fakerES.string.alphanumeric({ length: 7, exclude: ["a"] }),
        price: parseFloat(fakerES.commerce.price()),
        status: fakerES.datatype.boolean(),
        stock: fakerES.number.int(100),
        category: fakerES.commerce.department(),
        thumbnails: fakerES.image.url()
    }
};

module.exports = { generateMockProducts };

