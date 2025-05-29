import React from 'react';
import { Input, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/pro-solid-svg-icons';

const SecondaryHeader = ({
  title,
  icon,
  searchValue,
  setSearchValue,
  debouncedSearch,
  onAdd,
  addButtonText
}) => (
  <div className="flex justify-between items-center px-3 p-1 bg-darkBlueText h-[48px]">
    <div className="flex items-center space-x-1 text-sm text-white font-semibold">
      <FontAwesomeIcon icon={icon} style={{ fontSize: '20px' }} className="mr-2" />
      <span className="text-lg">{title}</span>
    </div>
    <div className="flex space-x-1">
      <div className="relative">
        <Input
          placeholder="Search"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            if (debouncedSearch) debouncedSearch(e.target.value);
          }}
          suffix={<FontAwesomeIcon icon={faSearch} style={{ fontSize: '12px' }} className="text-gray-400" />}
          className="rounded"
          size="small"
        />
      </div>
      <Button
        icon={<FontAwesomeIcon icon={faPlus} style={{ fontSize: '12px' }} className="mr-1" />}
        onClick={onAdd}
        className="bg-[#0D4F8B] text-white border-none hover:bg-[#0B3E6F]"
        size="middle"
      >
        {addButtonText}
      </Button>
    </div>
  </div>
);

export default SecondaryHeader;
