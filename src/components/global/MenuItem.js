import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const MenuItemWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: ${(props) => props.isCollapsed ? '5px' : '0px 15px'};
    list-style: none;
    cursor: pointer;

    &:hover .tooltip {
        visibility: visible;
        opacity: 1;
    }
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

const Tooltip = styled.div`
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 5px;
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 100%;
    margin-left: 10px;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.3s, visibility 0.3s;
`;

const MenuItem = (props) => {
    const handleMenuItemClick = () => {
        props.setSelected(props.item.title);
        props.setHeaderTitle(props.item.title);
    };

    return (
        <MenuItemWrapper isCollapsed={props.isCollapsed} onClick={handleMenuItemClick}>
            <MenuItemLink isCollapsed={props.isCollapsed} to={props.item.path}>
                {props.item.icon}
                {!props.isCollapsed ? (
                    <MenuItemLabel>
                        {props.item.title}
                    </MenuItemLabel>
                ) : (
                    <Tooltip className="tooltip">{props.item.title}</Tooltip>
                )}
            </MenuItemLink>
        </MenuItemWrapper>
    );
};

export default MenuItem;
