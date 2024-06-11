import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Tooltip, {tooltipClasses } from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom'

const MenuItemWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: ${(props) => props.isCollapsed ? '5px' : '0px 15px'};
    list-style: none;
    cursor: pointer;
`;

const MenuItemLink = styled(NavLink)`
    display: flex;
    align-items: center;
    justify-content: ${(props) => props.isCollapsed ? 'center' : 'flex-start'};
    padding: 10px;
    width: 100%;
    color: #e1e9fc;
    text-decoration: none;

    &:hover {
        color: #5fe3b3;
    }

    &.active {
        background: #5fe3b3;
        color: #121B28;
        border-radius: ${(props) => props.isCollapsed ? '5px' : '12px'};
    }
`;

const MenuItemLabel = styled.span`
    font-size: 19px;
    padding-left: 5px;
`;

const MenuItem = (props) => {
    const handleMenuItemClick = () => {
        props.setSelected(props.item.title);
        props.setHeaderTitle(props.item.title);
    };

    return (
        <MenuItemWrapper isCollapsed={props.isCollapsed} onClick={handleMenuItemClick}>
            {props.isCollapsed ? (
                <Tooltip title={props.item.title}
                    arrow
                    placement="right"
                    TransitionComponent={Zoom}
                    TransitionProps={{ timeout: 300 }}
                    slotProps={{
                        popper: {
                          sx: {
                            [`& .${tooltipClasses.tooltip}`]:
                              {
                                fontSize: '0.8rem',
                              },
                          },
                        },
                      }}
                >
                    <MenuItemLink isCollapsed={props.isCollapsed} to={props.item.path}>
                        {props.item.icon}
                    </MenuItemLink>
                </Tooltip>
            ) : (
                <MenuItemLink isCollapsed={props.isCollapsed} to={props.item.path}>
                    {props.item.icon}
                    <MenuItemLabel>
                        {props.item.title}
                    </MenuItemLabel>
                </MenuItemLink>
            )}
        </MenuItemWrapper>
    );
};

export default MenuItem;
