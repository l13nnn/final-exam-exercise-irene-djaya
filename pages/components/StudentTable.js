import { Table, Button } from 'antd';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export default function StudentTable({ students, loading }) {
  const router = useRouter();
  const { theme } = useContext(AppContext);

  const columns = [
    { title: 'Name', dataIndex: 'firstName', key: 'name', 
      render: (_, record) => `${record.firstName} ${record.lastName}` 
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'University', dataIndex: 'university', key: 'university' },
    { title: 'Major', dataIndex: 'major', key: 'major' }, 
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => router.push(`/students/${record.id}`)} type="primary" size="small">
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={students} 
      rowKey="id" 
      loading={loading}
      pagination={{ pageSize: 10, showSizeChanger: true }} 
      {...(theme === 'dark' && { className: 'ant-table-dark' })} 
    />
  );
}