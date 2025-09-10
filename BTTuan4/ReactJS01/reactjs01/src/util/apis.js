import axios from './axios.customize';
import { config } from '../config/config.js';

const createUserApi = (name, email, password) => {
    const data = {
        name, email, password
    }
    return axios.post(config.API_ENDPOINTS.REGISTER, data);
}

const loginApi = (email, password) => {
    const data = {
        email, password
    }
    return axios.post(config.API_ENDPOINTS.LOGIN, data);
}

const getUserApi = () => {
    return axios.get(config.API_ENDPOINTS.USER);
}

// Category APIs
const getAllCategoriesApi = () => {
    return axios.get(config.API_ENDPOINTS.CATEGORIES);
}

const getCategoryByIdApi = (categoryId) => {
    return axios.get(`${config.API_ENDPOINTS.CATEGORIES}/${categoryId}`);
}

// Product APIs
const getAllProductsApi = (page = 1, limit = 12) => {
    return axios.get(config.API_ENDPOINTS.PRODUCTS, {
        params: {
            page,
            limit
        }
    });
}

const getProductByIdApi = (productId) => {
    return axios.get(`${config.API_ENDPOINTS.PRODUCTS}/${productId}`);
}

const getProductsByCategoryApi = (categoryId, page = 1, limit = 12) => {
    return axios.get(`${config.API_ENDPOINTS.CATEGORY_PRODUCTS}/${categoryId}/products`, {
        params: { page, limit }
    });
}

const searchProductsApi = async (params) => {
    const query = {
        search: params.search && params.search.trim() !== '' ? params.search.trim() : undefined,
        categoryId: params.categoryId || params.category || undefined,
        minPrice: params.minPrice != null ? params.minPrice : undefined,
        maxPrice: params.maxPrice != null ? params.maxPrice : undefined,
        sortBy: params.sortBy || undefined,
        page: params.page || 1,
        limit: params.limit || 12,
    };

    return axios.get(`${config.BACKEND_URL}${config.API_ENDPOINTS.PRODUCTS}/search`, {
        params: query,
    });
};


export {
    createUserApi,
    loginApi,
    getUserApi,
    getAllCategoriesApi,
    getCategoryByIdApi,
    getAllProductsApi,
    getProductByIdApi,
    getProductsByCategoryApi,
    searchProductsApi
}