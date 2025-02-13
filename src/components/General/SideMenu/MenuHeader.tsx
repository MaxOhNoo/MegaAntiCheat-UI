import React from 'react';

interface MenuHeaderProps {
  collapsed: boolean;
  handleSymbolClick: (e: React.MouseEvent) => void;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({
  collapsed,
  handleSymbolClick, //eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  const menuIcon = (
    <a
      className={`menu-icon ml-[5%] top-1 relative ${
        collapsed ? 'collapsed' : ''
      }`}
      href="https://github.com/MegaAntiCheat"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className="rounded-lg"
        height={32}
        width={32}
        src="./mac_logo.webp"
        alt="Logo"
      />
    </a>
  );

  return (
    <span
      className={`menu-header relative flex min-h-[32px] h-[64px] flex-col justify-center transition-all delay-200 ease-in-out ${
        collapsed ? 'collapsed' : ''
      }`}
    >
      {collapsed && menuIcon}
      <div className="menu-header-flex flex items-center justify-start">
        {!collapsed && menuIcon}
        {!collapsed && (
          <span
            className={`menu-title mr-[5%] ml-[3%] text-xl flex-grow transition-opacity opacity-1 overflow-hidden ${
              collapsed ? 'collapsed' : ''
            }`}
          >
            MegaAntiCheat
          </span>
        )}
        {/* TODO: Reenable this once collapsible broadcasts are implemented.
          * Also remember to set the height of the root element back to 88px.
          <span
            className={`menu-toggle w-8 h-8 absolute top-[50%] -translate-y-2/4 cursor-pointer right-5 ${
              collapsed ? 'collapsed' : ''
            }`}
            onClick={handleSymbolClick}
          >
            {collapsed ? (
              <Menu width={32} height={32} />
            ) : (
              <X width={32} height={32} />
            )}
          </span>
        */}
      </div>
    </span>
  );
};

export default MenuHeader;
