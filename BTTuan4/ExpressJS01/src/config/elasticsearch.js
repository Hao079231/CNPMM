const { Client } = require('@elastic/elasticsearch');
const Product = require('../models/product');

require('dotenv').config();

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    apiKey: process.env.API_KEY
  }
});

// ✅ Hàm reindex toàn bộ product từ MongoDB vào Elasticsearch
async function reindexProducts() {
  try {
    console.log('🔄 Reindexing products into Elasticsearch...');

    const products = await Product.find().populate('category', 'name');

    for (const product of products) {
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
        },
      });
    }

    await esClient.indices.refresh({ index: 'products' });
    console.log('✅ Reindex completed');
  } catch (err) {
    console.error('❌ Reindex failed:', err);
  }
}

module.exports = esClient;
module.exports.reindexProducts = reindexProducts;
