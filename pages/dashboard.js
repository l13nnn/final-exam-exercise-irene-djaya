import { Layout, Card, List, Typography, Space, Spin, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function DashboardPage({ totalStudents, majorsList }) {
  const { theme, userName, toggleTheme } = useApp();
  const [randomStudent, setRandomStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRandomStudent = async () => {
    setIsLoading(true);
    try {
      const randomId = Math.floor(Math.random() * 100) + 1;
      const res = await fetch(`https://dummyjson.com/users/${randomId}`);
      const data = await res.json();
      setRandomStudent(data);
    } catch (error) {
      message.error('Failed to fetch random student');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomStudent();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', background: theme === 'dark' ? '#001529' : '#fff' }}>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>Welcome, {userName}!</Title>
        <Button onClick={toggleTheme} style={{ marginBottom: 24 }}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="Total Student">
            <Title level={1}>{totalStudents}</Title>
          </Card>
          <Card title="List of Majors">
            <List
              size="small"
              bordered
              dataSource={majorsList.map(item => (typeof item === 'string' ? item : item.name || JSON.stringify(item)))}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
          <Card
            title="Random Students"
            extra={<Button onClick={fetchRandomStudent} loading={isLoading}>Refresh</Button>}
          >
            {isLoading && <Spin />}
            {randomStudent && !isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img
                  src={randomStudent.image}
                  alt="Avatar"
                  style={{ width: 60, height: 60, borderRadius: '50%' }}
                />
                <div>
                  <Title level={4} style={{ marginBottom: 0 }}>
                    {randomStudent.firstName} {randomStudent.lastName}
                  </Title>
                  <Text>{randomStudent.university}</Text>
                  <br />
                  <Text type="secondary">{randomStudent.email}</Text>
                </div>
              </div>
            )}
          </Card>
        </Space>
      </Content>
    </Layout>
  );
}

export async function getServerSideProps() {
  const studentsRes = await fetch('https://dummyjson.com/users?limit=0');
  const studentsData = await studentsRes.json();

  const categoriesRes = await fetch('https://dummyjson.com/products/categories');
  const categoriesData = await categoriesRes.json();

  return {
    props: {
      totalStudents: studentsData.total,
      majorsList: categoriesData,
    },
  };
}