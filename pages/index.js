import { Layout, Menu, Typography, Button, Space, message } from 'antd';
import { useRouter } from 'next/router';
import { UserOutlined, DashboardOutlined, HomeOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Link from 'next/link';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function HomePage() {
  const router = useRouter();
  const { theme, userName, isLoggedIn, toggleTheme } = useContext(AppContext);

  const layoutStyle = {
    minHeight: '100vh',
    background: theme === 'dark' ? '#001529' : '#f0f2f5',
    color: theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.85)',
    transition: 'background 0.3s',
  };

  const contentStyle = {
    padding: '50px',
    textAlign: 'center',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme === 'dark' ? '#001529' : '#fff',
    padding: '0 50px',
  };

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <Title level={3} style={{ color: theme === 'dark' ? '#fff' : '#000000ff', margin: 0 }}>
          Student List
        </Title>
        <Menu 
          theme={theme} 
          mode="horizontal" 
          defaultSelectedKeys={['home']}
          style={{ flexGrow: 1, borderBottom: 'none', background: 'transparent', marginLeft: 40 }}
        >
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link href="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link href="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="students" icon={<UserOutlined />}>
            <Link href="/students">Students List</Link>
          </Menu.Item>
        </Menu>

        <Space>
            <Button onClick={toggleTheme}>
                Switch to {theme === 'light' ? 'Dark' : 'Light'}
            </Button>
            <Button type="default" onClick={() => message.info(`Logged in as: ${userName}`)}>
                {isLoggedIn ? `Hello, ${userName}` : 'Login'}
            </Button>
        </Space>
      </Header>

      <Content style={contentStyle}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Title level={2} style={{ color: theme === 'dark' ? '#fff' : '#000000ff', margin: 0 }}>Welcome to Student List!</Title>
          <Paragraph style={{ marginTop: 40 }}>
            <Space size="large">
              <Button 
                type="primary" 
                size="large" 
                icon={<DashboardOutlined />}
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard
              </Button>
              <Button 
                type="default" 
                size="large" 
                icon={<UserOutlined />}
                onClick={() => router.push('/students')}
              >
                View Students List
              </Button>
            </Space>
          </Paragraph>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: theme === 'dark' ? '#001529' : '#fff', color: theme === 'dark' ? '#ccc' : 'rgba(0, 0, 0, 0.65)' }}>
        ©2025 Created by Irene Djaya
      </Footer>
    </Layout>
  );
}