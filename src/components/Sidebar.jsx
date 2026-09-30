import React from 'react';
import '../styles/Sidebar.css';

// Navegação lateral das ferramentas (Indicadores, ETL). Cada item pode trazer um ícone
// lucide (`Icon`) ou, nos itens antigos, uma classe do Font Awesome (`icon`).
const Sidebar = ({ title, items, activeItem, onItemClick, footer }) => {
    return (
        <aside className="sidebar">
            {title && <div className="sidebar-header"><h2>{title}</h2></div>}
            <nav className="sidebar-nav" aria-label={title || 'Seções'}>
                {items.map((item, i) => {
                    const active = activeItem === item.id;
                    const { Icon } = item;
                    const novoGrupo = item.grupo && item.grupo !== items[i - 1]?.grupo;
                    return (
                        <React.Fragment key={item.id}>
                        {novoGrupo && <span className="sidebar-grupo">{item.grupo}</span>}
                        <button
                            type="button"
                            className={`sidebar-item ${active ? 'active' : ''}`}
                            aria-current={active ? 'page' : undefined}
                            onClick={() => onItemClick(item.id)}
                        >
                            {Icon
                                ? <Icon className="sidebar-icon" size={19} strokeWidth={1.75} aria-hidden="true" />
                                : item.icon && <i className={`fas ${item.icon} sidebar-icon`} aria-hidden="true"></i>}
                            <span className="sidebar-label">{item.label}</span>
                            {item.hint && <span className="sidebar-hint">{item.hint}</span>}
                        </button>
                        </React.Fragment>
                    );
                })}
            </nav>
            {footer && <div className="sidebar-footer">{footer}</div>}
        </aside>
    );
};

export default Sidebar;
