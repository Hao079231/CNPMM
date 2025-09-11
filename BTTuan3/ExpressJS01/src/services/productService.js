const Product = require('../models/product');
const Category = require('../models/category');
const esClient = require('../config/elasticsearch');

const getProductsByCategoryService = async (categoryId, page = 1, limit = 12) => {
    try {
        const skip = (page - 1) * limit;

        // Kiểm tra category có tồn tại không
        const category = await Category.findById(categoryId);
        if (!category) {
            return { EC: 1, EM: 'Category not found' };
        }

        // Lấy products với pagination
        const products = await Product.find({
            category: categoryId,
            isActive: true
        })
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Đếm tổng số products
        const totalProducts = await Product.countDocuments({
            category: categoryId,
            isActive: true
        });

        const totalPages = Math.ceil(totalProducts / limit);

        return {
            EC: 0,
            EM: 'Get products successfully',
            DT: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        };
    } catch (error) {
        console.log('Error in getProductsByCategoryService:', error);
        return { EC: -1, EM: 'Failed to get products' };
    }
};

const getAllProductsService = async (page = 1, limit = 12, search = '') => {
    try {
        const skip = (page - 1) * limit;
        let query = { isActive: true };

        // Thêm tìm kiếm theo tên sản phẩm
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query)
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        return {
            EC: 0,
            EM: 'Get products successfully',
            DT: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        };
    } catch (error) {
        console.log('Error in getAllProductsService:', error);
        return { EC: -1, EM: 'Failed to get products' };
    }
};

const getProductByIdService = async (productId) => {
    try {
        const product = await Product.findById(productId).populate('category', 'name');
        if (!product) {
            return { EC: 1, EM: 'Product not found' };
        }
        return { EC: 0, EM: 'Get product successfully', DT: product };
    } catch (error) {
        console.log('Error in getProductByIdService:', error);
        return { EC: -1, EM: 'Failed to get product' };
    }
};

const createProductService = async (productData) => {
    try {
        const { name, description, price, originalPrice, images, category, stock, tags } = productData;

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return { EC: 1, EM: 'Category not found' };
        }

        const product = await Product.create({
            name,
            description,
            price,
            originalPrice,
            images,
            category,
            stock,
            tags
        });

        await product.populate('category', 'name');

        // Index vào Elasticsearch
        await esClient.index({
            index: 'products',
            id: product._id.toString(),
            document: {
                name: product.name,
                description: product.description,
                price: product.price,
                originalPrice: product.originalPrice,
                category: product.category._id,
                categoryName: product.category.name,
                stock: product.stock,
                tags: product.tags,
                isActive: product.isActive,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            }
        });

        return { EC: 0, EM: 'Create product successfully', DT: product };
    } catch (error) {
        console.log('Error in createProductService:', error);
        return { EC: -1, EM: 'Failed to create product' };
    }
};

// services/productService.js
const searchProductsService = async ({ search, category, minPrice, maxPrice, onSale, minViews, page = 1, limit = 12 }) => {
    try {
        const skip = (page - 1) * limit;

        // Tạo query bool Elasticsearch
        let mustQuery = [];
        let filterQuery = [];

        // Fuzzy search theo name + description
        if (search) {
            mustQuery.push({
                multi_match: {
                    query: search,
                    fields: ['name^3', 'description'],
                    fuzziness: 'AUTO'
                }
            });
        }

        // Filter theo category
        if (category) {
            filterQuery.push({
                term: { category: category }
            });
        }

        // Filter theo giá
        if (minPrice || maxPrice) {
            let range = {};
            if (minPrice) range.gte = minPrice;
            if (maxPrice) range.lte = maxPrice;
            filterQuery.push({ range: { price: range } });
        }

        // Filter theo khuyến mãi (originalPrice > price)
        if (onSale) {
            filterQuery.push({
                script: {
                    script: "doc['originalPrice'].value > doc['price'].value"
                }
            });
        }

        // Filter theo lượt xem (giả sử bạn lưu views trong ES)
        if (minViews) {
            filterQuery.push({
                range: { views: { gte: minViews } }
            });
        }

        const result = await esClient.search({
            index: 'products',
            from: skip,
            size: limit,
            query: {
                bool: {
                    must: mustQuery,
                    filter: filterQuery
                }
            },
            sort: [
                { createdAt: { order: "desc" } }
            ]
        });

        const hits = result.hits.hits.map(hit => ({
            id: hit._id,
            ...hit._source
        }));

        return {
            EC: 0,
            EM: 'Search products successfully',
            DT: {
                products: hits,
                pagination: {
                    currentPage: page,
                    totalProducts: result.hits.total.value,
                    totalPages: Math.ceil(result.hits.total.value / limit),
                    hasNextPage: page * limit < result.hits.total.value,
                    hasPrevPage: page > 1
                }
            }
        };
    } catch (error) {
        console.log('Error in searchProductsService:', error);
        return { EC: -1, EM: 'Failed to search products' };
    }
};


module.exports = {
    getProductsByCategoryService,
    getAllProductsService,
    getProductByIdService,
    createProductService,
    searchProductsService
};

