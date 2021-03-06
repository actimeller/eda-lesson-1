import { useContext, useEffect, useState } from 'react';
import { message, Spin, Tag } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFilteredTasks, Task } from '../api';
import UserContext from '../context/UserContext';
import { setTodayTasks } from '../store/tasks/actions';
import { getStatusColor } from '../utils';

const ITEM_HEIGHT = 30;
const dayDuration = +moment().startOf('day') - +moment().endOf('day');

const TaskItem = ({ task }: {task: Task}) => {
  const taskDuration = (task.plannedStartDate - task.plannedEndDate) / dayDuration;
  const taskOffset = (+moment().startOf('day') - task.plannedStartDate) / dayDuration;
  return (
    <Link to={`/task-edit/${task.id}`}>
      <Tag
        color={getStatusColor(task.status)}
        className={`TaskTodayWidget-item ${task.status}`}
        style={{
          width: `${taskDuration * 100}%`,
          left: `${taskOffset * 100}%`,
        }}
      >
        {task.title}
      </Tag>
    </Link>
  );
};

export default () => {
  const dispatch = useDispatch();
  const { todayTasks, tasks } = useSelector((state) => state.tasks);

  const { sessionId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const grid = [];
  for (let i = 0; i < 24; i += 1) {
    grid.push(`${i < 10 ? '0' : ''}${i}:00`);
  }

  const fetchTodayTasks = async () => {
    setLoading(true);
    const filterTodayTasks = {
      plannedStartDate: +moment().startOf('day'),
      plannedEndDate: +moment().endOf('day'),
    };
    try {
      const response = await getFilteredTasks(sessionId, filterTodayTasks);
      dispatch(setTodayTasks(response.data));
      setLoading(false);
    } catch (error) {
      message.error(error.toString());
    }
  };

  const updateTodayTasks = () => {
    dispatch(setTodayTasks(tasks));
  };

  useEffect(() => {
    fetchTodayTasks();
  }, []);

  useEffect(() => {
    updateTodayTasks();
  }, [tasks]);

  return (
    <Spin spinning={loading}>
      <div className="TaskTodayWidget">
        <div className="TaskTodayWidget-grid">
          {grid.map((item) => <span key={item}>{item}</span>)}
        </div>
        Tasks for today
        <div
          className="TaskTodayWidget-list"
          style={{
            height: todayTasks.length * ITEM_HEIGHT,
          }}
        >
          {todayTasks.map((task) => <TaskItem key={task.id} task={task} />)}
        </div>

      </div>
    </Spin>
  );
};
