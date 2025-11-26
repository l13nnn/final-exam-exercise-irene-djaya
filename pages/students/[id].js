import { Card, Descriptions, Button, Layout as AntLayout, Skeleton, Modal, Form, Input, message } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const { Content } = AntLayout;

export default function StudentDetailPage({ student }) {
  const router = useRouter();
  const { theme } = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [studentData, setStudentData] = useState(student);

  if (router.isFallback) {
    return <Skeleton active avatar paragraph={{ rows: 5 }} style={{ padding: 24 }} />;
  }

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentData && router.query.id) {
        try {
          const res = await fetch(`https://dummyjson.com/users/${router.query.id}`);
          if (res.ok) {
            const data = await res.json();
            setStudentData(data);
          } else {
            message.error('Student not found.');
            router.push('/students');
          }
        } catch (error) {
          message.error('Failed to fetch student data.');
          router.push('/students');
        }
      }
    };
    fetchStudent();
  }, [studentData, router]);

  if (!studentData) {
    return <Skeleton active avatar paragraph={{ rows: 5 }} style={{ padding: 24 }} />;
  }

  const handleDelete = () => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete ${studentData.firstName} ${studentData.lastName}?`,
      onOk: () => {
        message.success(`Student ${studentData.id} deleted successfully.`);
        router.push('/students'); 
      },
    });
  };

  const onFinish = (values) => {
    message.success(`Student ${studentData.firstName} updated with: ${JSON.stringify(values)}`);
    setIsModalVisible(false);
  };

  return (
    <AntLayout style={{ minHeight: '100vh', background: theme === 'dark' ? '#001529' : '#fff' }}>
      <Content style={{ padding: '24px' }}>
        <Card
          title={`Student Details: ${studentData.firstName} ${studentData.lastName}`}
          extra={
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={() => router.push('/students')}>Back</Button>
              <Button type="primary" onClick={() => setIsModalVisible(true)}>Edit Student</Button>
              <Button type="danger" onClick={handleDelete}>Delete Student</Button>
            </div>
          }
          cover={<img alt={`${studentData.firstName}'s avatar`} src={studentData.image} style={{ height: 200, objectFit: 'none' }} />}
        >
          <Descriptions bordered column={1} size="small" title="Student Info">
            <Descriptions.Item label="Full Name">{`${studentData.firstName} ${studentData.lastName}`}</Descriptions.Item>
            <Descriptions.Item label="Email">{studentData.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{studentData.phone}</Descriptions.Item>
            <Descriptions.Item label="Age">{studentData.age}</Descriptions.Item>
            <Descriptions.Item label="University">{studentData.university}</Descriptions.Item>
            <Descriptions.Item label="Company">{studentData.company?.name}</Descriptions.Item>
            <Descriptions.Item label="Address">{`${studentData.address?.address}, ${studentData.address?.city}`}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Modal
          title={`Edit ${studentData.firstName}`}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            initialValues={{
              email: studentData.email,
              phone: studentData.phone
            }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </AntLayout>
  );
}

export async function getStaticPaths() {
  const studentsRes = await fetch('https://dummyjson.com/users?limit=10');
  const studentsData = await studentsRes.json();

  const paths = studentsData.users.map(student => ({
    params: { id: student.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;

  const studentRes = await fetch(`https://dummyjson.com/users/${id}`);

  if (!studentRes.ok) {
    return { notFound: true };
  }

  const student = await studentRes.json();

  return {
    props: {
      student,
    },
    revalidate: 60,
  };
}