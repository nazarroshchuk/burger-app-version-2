import React from "react";

import classes from './NavigationItem.module.css'
export const NavigationItem = (props) => (
    <li className={classes.NavigationItem}>
        <a href={props.link} className={props.active ? classes.active : null }>{props.children}</a>
    </li>
)