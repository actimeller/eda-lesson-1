import React, { useContext, useState } from 'react';
import {
  Button, Result, Spin, message,
} from 'antd';
import { Link } from 'react-router-dom';
import {
  ITask, createTask,
} from '../api';
import UserContext from '../context/UserContext';
import TaskForm from './TaskForm';

type TaskResponse = {
  type: string;
  message: ITask
}

const initialTask: ITask = {
  id: '',
  title: '',
  description: '',
  priority: 'low',
  date: '',
};

export default () => {
  const { sessionId } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const task = initialTask;

  const onFinish = (data: ITask) => {
    setLoading(true);
    const randomId = Math.floor(Math.random() * 100).toString();
    createTask(sessionId, { ...data, id: randomId })
      .then((response) => {
        message.success((response as TaskResponse).message);
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
