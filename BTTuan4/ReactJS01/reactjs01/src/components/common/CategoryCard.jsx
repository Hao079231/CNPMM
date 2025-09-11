import React from 'react';
import { Card, Image, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();

    const handleCategoryClick = () => {
        navigate(`/category/${category._id}`);
    };

    return (
        <Card
            hoverable
            className="elevated"
            cover={
                <div style={{ position: 'relative' }}>
                    <Image
                        alt={category.name}
                        src={category.image || 'https://via.placeholder.com/600x360?text=Category'}
                        style={{ height: 180, objectFit: 'cover' }}
                        preview={false}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,18,32,0.7), rgba(11,18,32,0.0) 50%)' }} />
                </div>
            }
            onClick={handleCategoryClick}
            style={{ cursor: 'pointer', overflow: 'hidden' }}
        >
            <div style={{ textAlign: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>{category.name}</Title>
                {category.description && (
                    <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                        {category.description}
                    </Text>
                )}
            </div>
        </Card>
    );
};

export default CategoryCard;

