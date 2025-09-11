require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/category');
const Product = require('../models/product');

const connection = require('../config/database');

const categories = [
    {
        name: 'Điện thoại',
        description: 'Các loại điện thoại thông minh',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1TvX3_i8I2OCIxMbt5R4vDVFBDlN3Fv6lqQ&s'
    },
    {
        name: 'Laptop',
        description: 'Máy tính xách tay',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvP-WbucWxDdZwlQn8hdJU1Z0rXxPN29G4zg&s'
    },
    {
        name: 'Phụ kiện',
        description: 'Các phụ kiện điện tử',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ5h4PQsYF0QDOpNdidvq-4UgVq_Owu83gyA&s'
    },
    {
        name: 'Đồng hồ',
        description: 'Đồng hồ thông minh và đồng hồ đeo tay',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjtJQiS9ngd90uksuQVRL93VEJG8WUTN9Ayw&s'
    }
];

const products = [
    // ============== Điện thoại (6 SP) ==============
    {
        name: 'iPhone 15 Pro',
        description: 'iPhone 15 Pro với chip A17 Pro mạnh mẽ',
        price: 29990000,
        originalPrice: 32990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB4egiHZUd5dia7UdgT1ZQfT44wDQUnOxHEw&s'],
        stock: 50,
        tags: ['apple', 'premium', 'camera']
    },
    {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Galaxy S24 Ultra với camera 200MP',
        price: 26990000,
        originalPrice: 29990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSty-ol5Mgk8e_Ihilyvt6ZnzLlhbpLaeRq7Q&s'],
        stock: 30,
        tags: ['samsung', 'android', 'camera']
    },
    {
        name: 'Xiaomi 14 Pro',
        description: 'Xiaomi 14 Pro với camera Leica',
        price: 19990000,
        originalPrice: 22990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5ga61UP_sR-LSQ1jChnHtexgWf7d92MsVyg&s'],
        stock: 25,
        tags: ['xiaomi', 'android', 'value']
    },
    {
        name: 'OnePlus 12',
        description: 'OnePlus 12 với Snapdragon 8 Gen 3',
        price: 18990000,
        originalPrice: 21990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMgCllhHbYXdOLNywyeenIUJqmeIumT6JgTw&s'],
        stock: 20,
        tags: ['oneplus', 'android', 'performance']
    },
    {
        name: 'Google Pixel 8 Pro',
        description: 'Pixel 8 Pro với AI camera',
        price: 22990000,
        originalPrice: 25990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdRiMeh-JTIPkBmkc2fj38WAPuMHQfi4S70g&s'],
        stock: 15,
        tags: ['google', 'android', 'ai']
    },
    {
        name: 'Huawei P60 Pro',
        description: 'Huawei P60 Pro với camera XMAGE',
        price: 17990000,
        originalPrice: 20990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMENfgG8nWvkenBQSfrP3QZ7GzUy-P_E7nzQ&s'],
        stock: 10,
        tags: ['huawei', 'camera', 'premium']
    },

    // ============== Laptop (6 SP) ==============
    {
        name: 'MacBook Pro M3',
        description: 'MacBook Pro 14 inch với chip M3',
        price: 45990000,
        originalPrice: 49990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxBGJhX024m7dU_9jjWF9I_ToHSAKqZPFO4w&s'],
        stock: 20,
        tags: ['apple', 'laptop', 'premium']
    },
    {
        name: 'Dell XPS 13',
        description: 'Dell XPS 13 với Intel Core i7',
        price: 32990000,
        originalPrice: 35990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMOUgobYGR5HcsOtXM5xQD6DJxfWSG1o-y-w&s'],
        stock: 15,
        tags: ['dell', 'windows', 'ultrabook']
    },
    {
        name: 'ASUS ROG Zephyrus G14',
        description: 'Gaming laptop ASUS ROG với RTX 4060',
        price: 28990000,
        originalPrice: 31990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2G1D5QuRXXz2lNCb0dIx1lwhEU170gV_bLA&s'],
        stock: 12,
        tags: ['asus', 'gaming', 'rtx']
    },
    {
        name: 'Lenovo ThinkPad X1 Carbon',
        description: 'ThinkPad X1 Carbon cho doanh nhân',
        price: 35990000,
        originalPrice: 38990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmheHAEz7yAu7Da82kWviQvgC-f2qvnj1cEQ&s'],
        stock: 8,
        tags: ['lenovo', 'business', 'premium']
    },
    {
        name: 'HP Spectre x360',
        description: 'HP Spectre x360 2-in-1 convertible',
        price: 27990000,
        originalPrice: 30990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU95pK-ttRAwCjz-qSDXtWjmglSGlUcsbSwA&s'],
        stock: 10,
        tags: ['hp', '2in1', 'convertible']
    },
    {
        name: 'MSI Creator Z16',
        description: 'MSI Creator Z16 cho content creator',
        price: 31990000,
        originalPrice: 34990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTYqjOn9yMDrKnuOFXMvx_N9EcoB3B4cORAQ&s'],
        stock: 6,
        tags: ['msi', 'creator', 'rtx']
    },

    // ============== Phụ kiện (6 SP) ==============
    {
        name: 'AirPods Pro 2',
        description: 'AirPods Pro thế hệ 2 với ANC',
        price: 5990000,
        originalPrice: 6990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbJoXb7wVc9Nvu5kJrCCcdckrB9g36Xzd_Fg&s'],
        stock: 100,
        tags: ['apple', 'earbuds', 'anc']
    },
    {
        name: 'Sony WH-1000XM5',
        description: 'Headphone Sony với noise cancellation',
        price: 7990000,
        originalPrice: 8990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSofqlw9pgBSAz1o0NPPeTUU1kiGWDIS38ohg&s'],
        stock: 50,
        tags: ['sony', 'headphone', 'anc']
    },
    {
        name: 'Logitech MX Master 3S',
        description: 'Chuột không dây Logitech MX Master 3S',
        price: 2990000,
        originalPrice: 3490000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuGM0XzgURR2C8YYoZG4qG1QdE6XPIsjdWFg&s'],
        stock: 80,
        tags: ['logitech', 'mouse', 'wireless']
    },
    {
        name: 'Magic Keyboard',
        description: 'Bàn phím Magic Keyboard cho iPad',
        price: 3990000,
        originalPrice: 4490000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8tOZekSYb9L7hWaDnYRE0SyXdULEuZfpmwQ&s'],
        stock: 60,
        tags: ['apple', 'keyboard', 'ipad']
    },
    {
        name: 'Samsung T7 SSD 1TB',
        description: 'Ổ cứng SSD Samsung T7 1TB',
        price: 2490000,
        originalPrice: 2990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsAkDeNg8Nr7usCT0SW7C89w2tPhgJLtwb1w&s'],
        stock: 40,
        tags: ['samsung', 'ssd', 'storage']
    },
    {
        name: 'Anker PowerCore 20000',
        description: 'Pin sạc dự phòng Anker 20000mAh',
        price: 1290000,
        originalPrice: 1590000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-V12EB3we0QiWSoW0C3aGOhv0lfzeWnOPbg&s'],
        stock: 120,
        tags: ['anker', 'powerbank', 'portable']
    },

    // ============== Đồng hồ (6 SP) ==============
    {
        name: 'Apple Watch Series 9',
        description: 'Apple Watch Series 9 với S9 chip',
        price: 8990000,
        originalPrice: 9990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa7hBaii1UDIc0JlSyB8Y984Kbh-Kw_5JTLg&s'],
        stock: 30,
        tags: ['apple', 'smartwatch', 'health']
    },
    {
        name: 'Samsung Galaxy Watch 6',
        description: 'Galaxy Watch 6 với Wear OS',
        price: 6990000,
        originalPrice: 7990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW5aYSfjsxn9cqHgndHZnO8G3LAZMsoyeJiw&s'],
        stock: 25,
        tags: ['samsung', 'smartwatch', 'android']
    },
    {
        name: 'Garmin Fenix 7',
        description: 'Garmin Fenix 7 cho thể thao',
        price: 12990000,
        originalPrice: 14990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIkc5b19NiCHMCsriJUKXCv24RUzenwbJFnA&s'],
        stock: 15,
        tags: ['garmin', 'sports', 'gps']
    },
    {
        name: 'Fitbit Versa 4',
        description: 'Fitbit Versa 4 với health tracking',
        price: 4990000,
        originalPrice: 5990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfEGMcPxrp9gIHmMhoE6GMgQiIhRSJBP1uCQ&s'],
        stock: 35,
        tags: ['fitbit', 'fitness', 'health']
    },
    {
        name: 'Huawei Watch GT 4',
        description: 'Huawei Watch GT 4 với battery 14 ngày',
        price: 3990000,
        originalPrice: 4990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_Mm6dj-Du-46xsqKoA9PCkSgcwtaK6xoSKw&s'],
        stock: 20,
        tags: ['huawei', 'smartwatch', 'battery']
    },
    {
        name: 'Amazfit GTR 4',
        description: 'Amazfit GTR 4 với GPS và heart rate',
        price: 2990000,
        originalPrice: 3990000,
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRynXqXS24dEUI8fTQO6quFnbPvfVU--QnBUA&s'],
        stock: 45,
        tags: ['amazfit', 'smartwatch', 'value']
    }
];

const seedData = async () => {
    try {
        await connection();

        // Xóa dữ liệu cũ
        await Category.deleteMany({});
        await Product.deleteMany({});

        // Tạo categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`Created ${createdCategories.length} categories`);

        // Mapping product -> category
        const phoneCategory = createdCategories.find(cat => cat.name === 'Điện thoại');
        const laptopCategory = createdCategories.find(cat => cat.name === 'Laptop');
        const accessoryCategory = createdCategories.find(cat => cat.name === 'Phụ kiện');
        const watchCategory = createdCategories.find(cat => cat.name === 'Đồng hồ');

        const productsWithCategories = products.map((product, index) => {
            let category;
            if (index < 6) category = phoneCategory._id;
            else if (index < 12) category = laptopCategory._id;
            else if (index < 18) category = accessoryCategory._id;
            else category = watchCategory._id;

            return { ...product, category };
        });

        const createdProducts = await Product.insertMany(productsWithCategories);
        console.log(`Created ${createdProducts.length} products`);

        console.log('Seed data completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
