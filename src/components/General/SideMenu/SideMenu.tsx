import React, { Dispatch, SetStateAction } from 'react';
import { Divider, SideMenuItem } from '@components/General';
import MenuHeader from './MenuHeader';

import { t } from '@i18n';
import './SideMenu.css';
import { MENU_ITEMS, PAGES } from '../../../constants/menuConstants';
import Broadcast, {
  BroadcastImportance,
  BroadcastProps,
} from '@components/TF2/Broadcast/Broadcast';
import { getBroadcasts } from '@api/broadcasts';
import { getVersion } from '@api/version';

interface SideMenuProps {
  setCurrentPage: Dispatch<SetStateAction<PAGES>>;
  currentPage: PAGES;
  showTosSuggestions?: boolean;
}

const SideMenu = ({
  setCurrentPage,
  currentPage,
  showTosSuggestions,
}: SideMenuProps) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const menuItemsToShow = MENU_ITEMS.map(({ titleKey, icon, page }) => (
    <SideMenuItem
      key={page}
      title={t(titleKey)}
      Icon={icon}
      collapsed={collapsed}
      onClick={() => setCurrentPage(page)}
      selected={currentPage === page}
    />
  ));
  const [broadcasts, setBroadcasts] = React.useState<BroadcastProps[]>([]);

  const MenuRef = React.useRef<HTMLDivElement>(null);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (!MenuRef.current?.contains(event.target as Node)) {
      setCollapsed(true);
    }
  };

  const handleToggleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleToggleCollapse();
  };

  const handleEscapePress = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;

    setCollapsed(true);
  };

  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapePress);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapePress);
    };
  }, []);

  React.useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const versionResponsePromise = getVersion();
        const bcastResponse = await getBroadcasts();
        let i = 0;
        const bcasts: BroadcastProps[] = bcastResponse.broadcasts.map((bc) => ({
          key: `broadcast_${i++}`,
          collapsed: collapsed,
          broadcast: {
            message: bc.message,
            postDate: bc.postDate,
            importance: bc.importance,
          },
          onClick: undefined,
        }));
        if (showTosSuggestions) {
          bcasts.push({
            key: 'broadcast_tos',
            collapsed: collapsed,
            broadcast: {
              message: t('TOS_HINT'),
              postDate: new Date().toISOString(),
              importance: BroadcastImportance.WARNING,
            },
            onClick: () => {
              setCurrentPage(PAGES.PREFERENCES);
            },
          });
        }
        const version = await versionResponsePromise;
        if (version.notify) {
          bcasts.push({
            key: 'broadcast_update',
            collapsed: collapsed,
            broadcast: {
              message: `${t('UPDATE_AVAILABLE')}\n(${
                version.currentVersion
              } -> ${version.latestVersion})`,
              postDate: new Date().toISOString(), // I cbf populating this with the actual release date.
              importance: BroadcastImportance.UPDATE,
            },
            onClick: () =>
              open('https://github.com/MegaAntiCheat/client-backend/releases'),
          });
        }
        // Sort by most important, then most recent.
        const order = Object.values(BroadcastImportance);
        setBroadcasts(
          bcasts.sort((a, b) => {
            if (
              order.indexOf(a.broadcast.importance) >
              order.indexOf(b.broadcast.importance)
            )
              return -1;
            if (
              order.indexOf(a.broadcast.importance) <
              order.indexOf(b.broadcast.importance)
            )
              return 1;
            if (a.broadcast.postDate > b.broadcast.postDate) return -1;
            if (a.broadcast.postDate < b.broadcast.postDate) return 1;
            return 0;
          }),
        );
      } catch (error) {
        console.error('Error fetching broadcasts:', error);
      }
    };
    fetchBroadcasts();
    const interval = setInterval(() => {
      fetchBroadcasts();
      return;
    }, 15 * 1000);
    return () => clearInterval(interval);
  }, [showTosSuggestions]);

  return (
    <>
      <div
        className={`side-menu fixed left-0 top-0 h-screen z-50 bg-secondary outline-outline/30 outline-1 outline w-full sm:w-2/4 max-w-sm transition-all ease-in-out ${
          collapsed ? 'collapsed' : ''
        }`}
        ref={MenuRef}
      >
        <MenuHeader
          collapsed={collapsed}
          handleSymbolClick={handleToggleClick}
        />
        <div>
          <Divider size={2} />
          {[...menuItemsToShow, ...broadcasts.map((b) => <Broadcast {...b} />)]}
        </div>
      </div>
      <div
        className={`w-[100vw] h-[100vh] z-40 ${
          !collapsed ? ' bg-black/10' : ''
        }`}
      />
    </>
  );
};

export default SideMenu;
