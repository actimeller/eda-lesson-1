import React, { useContext, useState } from 'react';
import {
  Button, Result, Spin, message,
} from 'antd';
import { Link } from 'react-router-dom';
import {
  Task, createTask,
} from '../api';
import UserContext from '../context/UserContext';
import TaskForm from './TaskForm';

const initialTask: Task = {
  id: '',
  title: '',
  description: '',
  type: 'default',
  plannedStartDate: new Date().getTime(),
  plannedEndDate: new Date().getTime(),
  startDate: new Date().getTime(),
  endDate: new Date().getTime(),
};

export default () => {
  const { sessionId } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const task = initialTask;

  const onFinish = (data: Task) => {
    setLoading(true);
    const randomId = Math.floor(Math.random() * 100).toString();
    createTask(sessionId, { ...data, id: randomId })
      .then((response) => {
        message.success(response.message);
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.toString());
        setLoading(false);
      });
  };

  if (!loading && !task) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Link to="/"><Button type="primary">Back Home</Button></Link>}
      />
    );
  }

  return (
    <Spin spinning={loading}>
      {task && (
        <TaskForm
          title="Create Task"
          onFinish={onFinish}
          task={task}
        />
      )}
    </Spin>
  );
};
