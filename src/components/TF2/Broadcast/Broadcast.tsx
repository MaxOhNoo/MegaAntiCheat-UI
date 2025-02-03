import { t } from '@i18n';
import { AlertCircle, AlertOctagon, AlertTriangle, Download, Info } from 'lucide-react';
import { SideMenuItem } from '@components/General';
import { PAGES } from '../../../constants/menuConstants';
import React from 'react';

export enum BroadcastImportance {
    INFO,
    UPDATE,
    WARNING,
    CRITICAL
}

export type BroadcastProps = {
    collapsed: boolean;
    key: string;
    broadcast: Broadcast;
    onClick?: () => void;
}

function Broadcast(props: BroadcastProps) {

    const [dismissed, setDismissed] = React.useState<boolean>(false);

    function getBroadcastIcon(importance: BroadcastImportance) {
        switch (importance) {
            case BroadcastImportance.INFO:
                return <Info color="lime" className="bounce"/>;
            case BroadcastImportance.UPDATE:
                return <Download color="lime" className="bounce"/>;
            case BroadcastImportance.WARNING:
                return <AlertTriangle color="yellow" className="bounce"/>;
            case BroadcastImportance.CRITICAL:
                return <AlertOctagon color="red" className="bounce"/>;
        }
    }

  return (
    <SideMenuItem
      key={props.key}
      title={props.broadcast.message}
      Icon={getBroadcastIcon(props.broadcast.importance)}
      collapsed={props.collapsed}
      onClick={props.onClick ?? (() => setDismissed(true))}
      selected={false}
    />
  );
}

export default Broadcast;
