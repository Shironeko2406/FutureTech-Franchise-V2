import React from 'react';
import { Input, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Option } = Select;

const FilterContainer = styled(Space)`
  width: 100%;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterItem = styled.div`
  flex: 1;
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const filters = [
  {
    key: 'searchText',
    type: 'search',
    placeholder: 'Tìm kiếm công việc',
  },
  {
    key: 'levelFilter',
    type: 'select',
    placeholder: 'Mức độ',
    options: [
      { value: 'Compulsory', label: 'Bắt buộc' },
      { value: 'Optional', label: 'Không bắt buộc' },
    ],
  },
  {
    key: 'statusFilter',
    type: 'select',
    placeholder: 'Trạng thái',
    options: [
      { value: 'None', label: 'Chưa xử lý' },
      { value: 'Approved', label: 'Đã duyệt' },
      { value: 'Rejected', label: 'Từ chối' },
    ],
  },
  {
    key: 'submitFilter',
    type: 'select',
    placeholder: 'Trạng thái nộp',
    options: [
      { value: 'None', label: 'Chưa nộp' },
      { value: 'Submited', label: 'Đã nộp' },
    ],
  },
];

const DynamicFilter = ({ onFilterChange, defaultFilters  }) => {
  return (
    <FilterContainer>
      {filters.map((filter) => (
        <FilterItem key={filter.key}>
          {filter.type === 'search' ? (
            <Input
              placeholder={filter.placeholder}
              prefix={<SearchOutlined />}
              onPressEnter={(e) => onFilterChange(filter.key, e.target.value)}
              style={{ width: '100%' }}
              allowClear
            />
          ) : (
            <Select
            style={{ width: '100%' }}
            placeholder={filter.placeholder}
            defaultValue={defaultFilters[filter.key] || undefined}
            allowClear
            onChange={(value) => onFilterChange(filter.key, value)}
          >
            {filter.options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          )}
        </FilterItem>
      ))}
    </FilterContainer>
  );
};

export default DynamicFilter;

