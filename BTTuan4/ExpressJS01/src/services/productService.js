const Product = require('../models/product');
const Category = require('../models/category');
const esClient = require('../config/elasticsearch');

const getProductsByCategoryService = async (categoryId, page = 1, limit = 12) => {
    try {
        const skip = (page - 1) * limit;

        const category = await Category.findById(categoryId);
        if (!category) {
            return { EC: 1, EM: 'Category not found' };
        }

        const products = await Product.find({
            category: categoryId,
            isActive: true
        })
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

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

const getAllProductsService = async (page = 1, limit = 12) => {
    try {
        const skip = (page - 1) * limit;
        let query = { isActive: true };

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
        const { name, description, price, originalPrice, images, categoryId, stock, tags } = productData;

        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return { EC: 1, EM: 'Category not found' };
        }

        const product = await Product.create({
            name,
            description,
            price,
            originalPrice,
            images,
            category: categoryExists,
            stock,
            tags
        });

        await product.populate('category', 'name');

        // ✅ Index vào Elasticsearch với categoryId
        await esClient.index({
            index: 'products',
            id: product._id.toString(),
            document: {
                name: product.name,
                description: product.description,
                price: product.price,
                originalPrice: product.originalPrice,
                categoryId: product.category._id.toString(),
                categoryName: product.category.name,
                stock: product.stock,
                tags: product.tags,
                isActive: product.isActive,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            }
        });
        await esClient.indices.refresh({ index: 'products' });

        return { EC: 0, EM: 'Create product successfully', DT: product };
    } catch (error) {
        console.log('Error in createProductService:', error);
        return { EC: -1, EM: 'Failed to create product' };
    }
};

const searchProductsService = async ({ search, categoryId, minPrice, maxPrice, sortBy, page = 1, limit = 12 }) => {
    try {
        const skip = (page - 1) * limit;
        let mustQuery = [];
        let filterQuery = [];

        if (search) {
            mustQuery.push({
                match: {
                    name: {
                        query: search,
                        fuzziness: 'AUTO'
                    }
                }
            });
        }

        // ✅ Filter theo categoryId
        if (categoryId) {
            filterQuery.push({ term: { categoryId: categoryId } });
        }

        if (minPrice || maxPrice) {
            let range = {};
            if (minPrice) range.gte = minPrice;
            if (maxPrice) range.lte = maxPrice;
            filterQuery.push({ range: { price: range } });
        }

        let sortQuery = [];
        switch (sortBy) {
            case 'price-low':
                sortQuery.push({ price: { order: 'asc' } });
                break;
            case 'price-high':
                sortQuery.push({ price: { order: 'desc' } });
                break;
            case 'newest':
                sortQuery.push({ createdAt: { order: 'desc' } });
                break;
            default:
                sortQuery.push({ createdAt: { order: 'asc' } });
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
            sort: sortQuery
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
