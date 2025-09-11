import { useContext, useEffect } from 'react';
import { Layout, Spin } from 'antd';
import AppHeader from './components/layout/header.jsx';
import { AuthContext } from './components/context/auth.context';
import { Outlet } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

function App() {
  const { appLoading } = useContext(AuthContext);

  useEffect(() => {
    // fetchUser đã được gọi trong AuthWrapper, không cần gọi lại ở đây
  }, []);

  return (
    <>
      {appLoading === true ? (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          <Spin />
        </div>
      ) : (
        <Layout>
          <Header style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
            <div className="container">
              <AppHeader />
            </div>
          </Header>
          <Content>
            <div className="container page">
              <Outlet />
            </div>
          </Content>
          <Footer style={{ background: 'transparent', color: 'var(--color-text-muted)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingBottom: 8 }}>
              <span>© {new Date().getFullYear()} MyShop. All rights reserved.</span>
              <span style={{ opacity: 0.8 }}>Built with React & Ant Design</span>
            </div>
          </Footer>
        </Layout>
      )}
    </>
  );
}

export default App;