import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, notification, Card, Typography, Divider } from 'antd';
import { createUserApi } from '../util/apis';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        const { name, email, password } = values;
        setLoading(true);
        try {
            const res = await createUserApi(name, email, password);
            if (res && res.EC === 0) {
                notification.success({
                    message: 'CREATE USER',
                    description: 'Success'
                });
                navigate('/login');
            } else {
                notification.error({
                    message: 'CREATE USER',
                    description: res?.EM ?? 'Error'
                });
            }
        } catch (error) {
            console.error('Register error:', error);
            notification.error({
                message: 'CREATE USER',
                description: 'Network error or server error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify={"center"} style={{ padding: "40px 16px" }}>
            <Col xs={24} sm={20} md={14} lg={10} xl={8}>
                <Card
                    title={<Typography.Title level={3} style={{ margin: 0 }}>Đăng ký</Typography.Title>}
                    style={{ background: '#ffffff', border: '1px solid #f0f0f0', borderRadius: 8 }}
                >
                    <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <Input size="large" placeholder="Nguyễn Văn A" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input size="large" placeholder="you@example.com" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password size="large" placeholder="••••••••" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block size="large">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    <Divider />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/"><ArrowLeftOutlined /> Trang chủ</Link>
                        <span>Bạn đã có tài khoản? <Link to="/login">Login</Link></span>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default RegisterPage;