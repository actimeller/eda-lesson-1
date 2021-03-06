import React from 'react';
import {
  Typography, Form, Input, Button, Select, DatePicker, Space, Radio,
} from 'antd';
import moment, { Moment } from 'moment';
import { Task } from '../api';

type CustomInputProps = {
  value?: string;
  id?: string;
  onChange?: (event: React.ChangeEvent | string | number) => void
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

const { Title } = Typography;

export const CustomInput = ({ value, id, onChange = () => {} }: CustomInputProps) => {
  switch (id) {
    case 'description': return <Input.TextArea value={value} onChange={onChange} rows={4} />;
    case 'plannedStartDate':
    case 'plannedEndDate':
    case 'startDate':
    case 'endDate': return (
      <DatePicker
        value={moment(value)}
        format="DD.MM.YYYY HH:mm"
        allowClear={false}
        showTime
        onChange={(newValue: Moment | null) => onChange(+moment(newValue))}
      />
    );
    case 'type': return (
      <Select
        value={value}
        placeholder={id}
        onChange={(newValue: string) => onChange(newValue)}
      >
        <Select.Option value="default">Default</Select.Option>
        <Select.Option value="urgent">Urgent</Select.Option>
        <Select.Option value="outdated">Outdated</Select.Option>
      </Select>
    );
    case 'status':
      return (
        <Radio.Group
          options={[
            { label: 'Planned', value: 'planned' },
            { label: 'Active', value: 'active' },
            { label: 'Finished', value: 'finished' },
          ]}
          optionType="button"
          buttonStyle="solid"
          onChange={(event) => onChange(event.target.value)}
          value={value}
        />
      );

    default: return <Input value={value} onChange={onChange} />;
  }
};

interface IProps {
  title: string,
  task: Task,
  onFinish: (data: Task) => void
  onTaskRemove?: (data: Task) => void
}

export default ({
  title, onFinish, task, onTaskRemove,
}: IProps) => (
  <div className="TaskForm">
    <Title level={2}>{title}</Title>
    <Form
      {...layout}
      onFinish={onFinish}
    >
      {task && Object.entries(task)
        .filter(([key]) => key !== 'id')
        .map(([key, value]) => (
          <Form.Item
            name={key}
            label={key}
            key={key}
            initialValue={value}
            rules={[
              {
                required: key === 'title',
                message: `Please input ${key}`,
              },
            ]}
          >
            <CustomInput />
          </Form.Item>
        ))}
      <Form.Item {...tailLayout}>
        <Space>
          {onTaskRemove && (
            <Button
              type="default"
              htmlType="button"
              className="ant-btn-danger"
              onClick={() => onTaskRemove(task)}
            >
              Delete
            </Button>
          )}
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Space>
      </Form.Item>
    </Form>
  </div>
);
