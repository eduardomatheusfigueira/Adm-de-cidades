import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ title, items, activeItem, onItemClick }) => {
    return (
        <aside className="sidebar">
            {title && <div className="sidebar-header">
                <h3>{title}</h3>
            </div>}
            <nav className="sidebar-nav">
                {items.map((item) => (
                    <button
                        key={item.id}
                        className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
                        onClick={() => onItemClick(item.id)}
                    >
                        {item.icon && <i className={`fas ${item.icon} sidebar-icon`}></i>}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
