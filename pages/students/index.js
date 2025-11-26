import { Table, Button, Layout as AntLayout, Select, Input, message } from 'antd';
import { useRouter } from 'next/router';
import { useState, useMemo, useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const { Content } = AntLayout;
const { Option } = Select;
const { Search } = Input;

const assignMajor = (student, categories) => {
  const categoryIndex = student.id % categories.length;
  return {
    ...student,
    major: categories[categoryIndex] || 'Unknown Major',
  };
};

export default function StudentsPage({ students, categories }) {
  const router = useRouter();
  const { selectedMajor, theme } = useContext(AppContext);
  const [searchText, setSearchText] = useState('');
  const [majorFilter, setMajorFilter] = useState(selectedMajor);

  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students) || !Array.isArray(categories)) return [];

    return students
      .filter(Boolean)
      .map(student => {
        let major = categories[student.id % categories.length];
        if (major && typeof major === 'object' && 'name' in major) {
          major = major.name;
        }
        return {
          ...student,
          major: major || 'Unknown Major',
        };
      })
      .filter(student =>
        (majorFilter === '' || student.major === majorFilter) &&
        student.firstName.toLowerCase().includes(searchText.toLowerCase())
      );
  }, [students, categories, majorFilter, searchText]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'University', dataIndex: 'university', key: 'university' },
    {
      title: 'Major',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => router.push(`/students/${record.id}`)} type="primary">
          View Details
        </Button>
      ),
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh', background: theme === 'dark' ? '#001529' : '#fff' }}>
      <Content style={{ padding: '24px' }}>
        <h2>
          All Students ({filteredStudents.length} / {students.length})
        </h2>
        <div style={{ marginBottom: 16, display: 'flex', gap: '16px' }}>
          <Select
            placeholder="Filter by Major"
            allowClear
            style={{ width: 200 }}
            value={majorFilter || undefined}
            onChange={value => setMajorFilter(value || '')}
          >
            {categories.map(cat => {
              const display = typeof cat === 'object' && cat.name ? cat.name : cat;
              return (
                <Option key={display} value={display}>
                  {display}
                </Option>
              );
            })}
          </Select>

          <Search
            placeholder="Search by Name"
            allowClear
            style={{ width: 300 }}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          {...(theme === 'dark' && { className: 'ant-table-dark' })}
        />
      </Content>
    </AntLayout>
  );
}

export async function getServerSideProps(context) {
  try {
    const studentsRes = await fetch('https://dummyjson.com/users?limit=100');
    if (!studentsRes.ok) {
      throw new Error(`Failed to fetch students, status: ${studentsRes.status}`);
    }
    const studentsData = await studentsRes.json();

    const categoriesRes = await fetch('https://dummyjson.com/products/categories');
    if (!categoriesRes.ok) {
      throw new Error(`Failed to fetch categories, status: ${categoriesRes.status}`);
    }
    const categoriesData = await categoriesRes.json();

    const users = Array.isArray(studentsData.users) ? studentsData.users : [];
    const majors = Array.isArray(categoriesData) ? categoriesData : [];

    return {
      props: {
        students: users,
        categories: majors,
      },
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      props: {
        students: [],
        categories: [],
      },
    };
  }
}