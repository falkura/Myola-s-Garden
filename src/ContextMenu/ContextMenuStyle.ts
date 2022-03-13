export const CMStyle = `
#context-menu {
    position: fixed;
    z-index: 10000;
    width: 150px;
    background: #c39b77;
    border-radius: 5px;
    transform: scale(0);
    transform-origin: top left;
}

#context-menu.visible {
    transform: scale(1);
    transition: transform 200ms ease-in-out;
}

#context-menu .item {
    padding: 8px 10px;
    font-size: 15px;
    color: #eee;
    cursor: pointer;
    border-radius: inherit;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

#context-menu .item:hover {
    background: #C4A484;
    cursor: pointer; 
}
`;
