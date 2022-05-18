import React from 'react';
import {
  Nav,
  Button,
  ButtonGroup,
  DropdownButton,
  Dropdown,
} from 'react-bootstrap';

function ChannelButton({ channel, isActive, onClick }) {
  const { id, name, removable } = channel;
  return (
    <Nav.Item key={id} className="w-100">
      <ButtonGroup className="w-100">
        <Button variant={isActive ? 'secondary' : 'link'} onClick={onClick} className="rounded-0 text-start text-truncate">
          {`#${name}`}
        </Button>
        {removable && (
          <DropdownButton variant={isActive ? 'secondary' : 'link'} as={ButtonGroup} title="" id="bg-nested-dropdown" className="rounded-0">
            <Dropdown.Item eventKey="1">Rename</Dropdown.Item>
            <Dropdown.Item eventKey="2">Delete</Dropdown.Item>
          </DropdownButton>
        )}
      </ButtonGroup>
    </Nav.Item>
  );
}

export default ChannelButton;
