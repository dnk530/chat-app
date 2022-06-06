import React from 'react';
import {
  Button,
  ButtonGroup,
  Dropdown,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function ChannelButton({
  channel, isActive, handleSelect, handleRename, handleDelete,
}) {
  const { name, removable } = channel;
  const { t } = useTranslation();
  return (removable
    ? (
      <Dropdown as={ButtonGroup} className="d-flex">
        <Button
          variant={isActive ? 'secondary' : 'light'}
          onClick={handleSelect}
          className="w-100 rounded-0 text-start text-truncate"
        >
          {`# ${name}`}
        </Button>
        <Dropdown.Toggle
          split
          variant={isActive ? 'secondary' : 'light'}
          id="dropdown-split-basic"
          aria-label={t('manageChannel')}
        />
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleRename}>
            {t('rename')}
          </Dropdown.Item>
          <Dropdown.Item onClick={handleDelete}>
            {t('delete')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
    : (
      <Button
        variant={isActive ? 'secondary' : 'light'}
        onClick={handleSelect}
        className="w-100 rounded-0 text-start text-truncate"
      >
        {`# ${name}`}
      </Button>
    )
  );
}

export default ChannelButton;
