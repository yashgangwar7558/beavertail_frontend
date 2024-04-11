    import React from 'react'
    import { NavLink } from 'react-router-dom'
    import styled from 'styled-components'

    const MenuItemWrapper = styled.div`
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: ${(props) => props.isCollapsed ? '5px' : '0px 15px'};
        list-style: none;
        cursor: pointer;
    `
    const MenuItemLink= styled(NavLink)`
        display: flex;
        align-items: center;
        justify-content: ${(props) => props.isCollapsed ? 'center' : 'flex-start'};
        padding: 10px;
        width: 100%;
        color: #e1e9fc;
        text-decoration: none;

        &:hover {
            color: #9CFCD8;
        }

        &.active {
            background: #ffffff;
            color: #121B28;
            border-radius: ${(props) => props.isCollapsed ? '5px' : '12px'};
        }
    `
    const MenuItemLabel = styled.span`
        font-size: 19px;
        padding-left: 5px;
    `

    const MenuItem = (props) => {
        const handleMenuItemClick = () => {
            props.setSelected(props.item.title) 
            props.setHeaderTitle(props.item.title)
        }

        return (
            <>
                <MenuItemWrapper isCollapsed={props.isCollapsed} onClick={handleMenuItemClick}>
                    <MenuItemLink isCollapsed={props.isCollapsed} to={props.item.path}>
                        {props.item.icon}
                        {!props.isCollapsed ? (
                                <MenuItemLabel>
                                    {props.item.title}
                                </MenuItemLabel>
                            )
                            : null
                        }
                    </MenuItemLink>
                </MenuItemWrapper>
            </>
        )
    }

export default MenuItem