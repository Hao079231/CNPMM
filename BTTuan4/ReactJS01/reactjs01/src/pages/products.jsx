import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Row,
    Col,
    Typography,
    Spin,
    Alert,
    Space,
    Input,
    Select,
    Button,
    Breadcrumb,
    InputNumber
} from 'antd';
import {
    SearchOutlined,
    HomeOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import {
    getAllProductsApi,
    getAllCategoriesApi,
    searchProductsApi
} from '../util/apis';
import ProductCard from '../components/common/ProductCard';
import LazyLoading from '../components/common/LazyLoading';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductsPage = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

    // Toggle advanced filter
    const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategoriesApi();
            if (response && response.EC === 0) {
                setCategories(response.DT || []);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchProducts = async (page = 1, reset = true, overrides = {}) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            const finalSearchTerm = Object.prototype.hasOwnProperty.call(overrides, 'searchTerm')
                ? overrides.searchTerm
                : searchTerm;
            const finalCategory = Object.prototype.hasOwnProperty.call(overrides, 'categoryId')
                ? overrides.categoryId
                : (Object.prototype.hasOwnProperty.call(overrides, 'category') ? overrides.category : selectedCategory);
            const finalMinPrice = Object.prototype.hasOwnProperty.call(overrides, 'minPrice')
                ? overrides.minPrice
                : minPrice;
            const finalMaxPrice = Object.prototype.hasOwnProperty.call(overrides, 'maxPrice')
                ? overrides.maxPrice
                : maxPrice;
            const finalSortBy = Object.prototype.hasOwnProperty.call(overrides, 'sortBy')
                ? overrides.sortBy
                : sortBy;

            const isUsingSearchApi =
                (finalSearchTerm && finalSearchTerm !== '') ||
                (finalCategory && finalCategory !== '') ||
                finalMinPrice !== null ||
                finalMaxPrice !== null ||
                finalSortBy !== 'newest';

            let response;
            if (isUsingSearchApi) {
                response = await searchProductsApi({
                    search: finalSearchTerm,
                    categoryId: finalCategory,
                    minPrice: finalMinPrice,
                    maxPrice: finalMaxPrice,
                    sortBy: finalSortBy,
                    page,
                    limit: 12
                });
            } else {
                response = await getAllProductsApi(page, 12);
            }

            if (response && response.EC === 0) {
                const { products: newProducts, pagination } = response.DT;

                if (reset) {
                    setProducts(newProducts);
                } else {
                    setProducts(prev => [...prev, ...newProducts]);
                }

                setCurrentPage(page);
                setHasMore(pagination?.hasNextPage);
            } else {
                setError(response?.EM || 'Không thể tải danh sách sản phẩm');
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Có lỗi xảy ra khi tải danh sách sản phẩm');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchProducts(currentPage + 1, false);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
        fetchProducts(1, true, { searchTerm: value });
    };

    const handleCategoryChange = (value) => {
        const nextCategory = value || '';
        setSelectedCategory(nextCategory);
        setCurrentPage(1);
        fetchProducts(1, true, { categoryId: nextCategory });
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(1);
        fetchProducts(1, true, { sortBy: value });
    };

    const handleApplyFilter = () => {
        setCurrentPage(1);
        fetchProducts(1, true, { minPrice, maxPrice });
    };

    const handleViewDetail = (product) => {
        navigate(`/product/${product._id}`);
    };

    const handleAddToCart = (product) => {
        console.log('Add to cart:', product);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '20px' }}>Đang tải sản phẩm...</div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Lỗi tải dữ liệu"
                description={error}
                type="error"
                showIcon
                style={{ margin: '20px' }}
                action={
                    <Button size="small" onClick={() => fetchProducts()}>
                        Thử lại
                    </Button>
                }
            />
        );
    }

    return (
        <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                                    <HomeOutlined /> Trang chủ
                                </span>
                            )
                        },
                        {
                            title: 'Tất cả sản phẩm'
                        }
                    ]}
                />

                {/* Header */}
                <div>
                    <Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
                        Tất cả sản phẩm
                    </Title>

                    {/* Filters */}
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={12} md={8}>
                            <Search
                                placeholder="Tìm kiếm sản phẩm..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                onSearch={handleSearch}
                                style={{ width: '100%' }}
                            />
                        </Col>

                        <Col xs={12} sm={6} md={4}>
                            <Select
                                placeholder="Danh mục"
                                size="large"
                                style={{ width: '100%' }}
                                value={selectedCategory || undefined}
                                onChange={handleCategoryChange}
                                allowClear
                            >
                                {categories.map((category) => (
                                    <Option key={category._id} value={category._id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Col>

                        <Col xs={12} sm={6} md={4}>
                            <Select
                                placeholder="Sắp xếp"
                                size="large"
                                style={{ width: '100%' }}
                                value={sortBy}
                                onChange={handleSortChange}
                            >
                                <Option value="newest">Mới nhất</Option>
                                <Option value="price-low">Giá thấp đến cao</Option>
                                <Option value="price-high">Giá cao đến thấp</Option>
                            </Select>
                        </Col>

                        <Col xs={24} sm={12} md={8}>
                            <Button
                                icon={<AppstoreOutlined />}
                                size="large"
                                onClick={() => navigate('/categories')}
                                style={{ width: '100%' }}
                            >
                                Xem theo danh mục
                            </Button>
                        </Col>

                        <Col xs={24} sm={12} md={4}>
                            <Button
                                type="default"
                                size="large"
                                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                                style={{ width: '100%' }}
                            >
                                {showAdvancedFilter ? 'Ẩn bộ lọc' : 'Bộ lọc nâng cao'}
                            </Button>
                        </Col>
                    </Row>

                    {/* Advanced Filter */}
                    {showAdvancedFilter && (
                        <Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
                            <Col xs={12} sm={6} md={4}>
                                <InputNumber
                                    placeholder="Giá tối thiểu"
                                    size="large"
                                    style={{ width: '100%' }}
                                    value={minPrice}
                                    onChange={(value) => setMinPrice(value)}
                                />
                            </Col>

                            <Col xs={12} sm={6} md={4}>
                                <InputNumber
                                    placeholder="Giá tối đa"
                                    size="large"
                                    style={{ width: '100%' }}
                                    value={maxPrice}
                                    onChange={(value) => setMaxPrice(value)}
                                />
                            </Col>

                            <Col xs={24} sm={12} md={4}>
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={handleApplyFilter}
                                    style={{ width: '100%' }}
                                >
                                    Lọc
                                </Button>
                            </Col>
                        </Row>
                    )}
                </div>

                {/* Products Grid */}
                <LazyLoading
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    loading={loadingMore}
                    error={error}
                >
                    <Row gutter={[24, 24]}>
                        {products.map((product) => (
                            <Col
                                key={product._id}
                                xs={24}
                                sm={12}
                                md={8}
                                lg={6}
                                xl={6}
                            >
                                <ProductCard
                                    product={product}
                                    onViewDetail={handleViewDetail}
                                    onAddToCart={handleAddToCart}
                                />
                            </Col>
                        ))}
                    </Row>
                </LazyLoading>

                {products.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Title level={4} type="secondary">
                            Không tìm thấy sản phẩm nào
                        </Title>
                        <Text type="secondary">
                            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                        </Text>
                    </div>
                )}
            </Space>
        </div>
    );
};

export default ProductsPage;
