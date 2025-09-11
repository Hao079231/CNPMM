import React, { useContext, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button, Col, Divider, Form, Input, notification, Row, Card, Typography } from 'antd';
import { loginApi } from '../util/apis';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { AuthContext } from '../components/context/auth.context';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await loginApi(values.email, values.password);
            if (res && res.EC === 0) {
                localStorage.setItem('access_token', res.access_token);
                setAuth({
                    isAuthenticated: true,
                    user: {
                        email: res.user?.email || res.email,
                        name: res.user?.name || res.name
                    }
                });
                notification.success({
                    message: 'LOGIN USER',
                    description: 'Success'
                });
                // Redirect to the page they were trying to access, or home
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
            } else {
                notification.error({
                    message: 'LOGIN USER',
                    description: res?.EM ?? 'Error'
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            notification.error({
                message: 'LOGIN USER',
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
                    title={<Typography.Title level={3} style={{ margin: 0 }}>Đăng nhập</Typography.Title>}
                    style={{ background: '#ffffff', border: '1px solid #f0f0f0', borderRadius: 8 }}
                >
                    <Form name="basic" onFinish={onFinish} autoComplete="off" layout="vertical">
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
                                Login
                            </Button>
                        </Form.Item>

                        <Divider plain>Hoặc</Divider>
                        <div style={{ textAlign: "center" }}>
                            <span>Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link></span>
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginPage;