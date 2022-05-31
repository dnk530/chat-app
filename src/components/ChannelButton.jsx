import React from 'react';
import {
  Nav,
  Button,
  ButtonGroup,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function ChannelButton({
  channel, isActive, handleSelect, handleRename, handleDelete,
}) {
  const { id, name, removable } = channel;
  const { t } = useTranslation();
  return (
    <Nav.Item key={id} className="w-100">
      <ButtonGroup className="w-100">
        <Button
          variant={isActive ? 'secondary' : 'light'}
          onClick={handleSelect}
          className="rounded-0 text-start text-truncate"
        >
          {`#${name}`}
        </Button>
        {removable && (
          <DropdownButton
            variant={isActive ? 'secondary' : 'light'}
            as={ButtonGroup}
            title=""
            id="bg-nested-dropdown"
            className="rounded-0"
            aria-labelledby={t('manageChannel')}
          >
            <Dropdown.Item onClick={handleRename}>{t('rename')}</Dropdown.Item>
            <Dropdown.Item onClick={handleDelete}>{t('delete')}</Dropdown.Item>
          </DropdownButton>
        )}
      </ButtonGroup>
    </Nav.Item>
  );
}

export default ChannelButton;
