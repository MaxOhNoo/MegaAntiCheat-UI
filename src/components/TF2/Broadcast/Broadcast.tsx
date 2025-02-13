import {
  AlertOctagon,
  AlertTriangle,
  Download,
  HelpCircle,
  Info,
} from 'lucide-react';
import { SideMenuItem } from '@components/General';
import React from 'react';

export enum BroadcastImportance {
  INFO = 'INFO',
  UPDATE = 'UPDATE',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export type BroadcastProps = {
  collapsed: boolean;
  key: string;
  broadcast: Broadcast;
  onClick?: () => void;
};

function Broadcast(props: BroadcastProps) {
  const [dismissed] = React.useState<boolean>(false);

  function getBroadcastIcon(importance: BroadcastImportance) {
    switch (importance) {
      case BroadcastImportance.INFO:
        return <Info color="lime" className="bounce" />;
      case BroadcastImportance.UPDATE:
        return <Download color="lime" className="bounce" />;
      case BroadcastImportance.WARNING:
        return <AlertTriangle color="yellow" className="bounce" />;
      case BroadcastImportance.CRITICAL:
        return <AlertOctagon color="red" className="bounce" />;
      default:
        return <HelpCircle color="yellow" className="bounce" />;
    }
  }

  return dismissed ? (
    <></>
  ) : (
    <SideMenuItem
      key={props.key}
      title={props.broadcast.message}
      Icon={getBroadcastIcon(props.broadcast.importance)}
      collapsed={props.collapsed}
      onClick={props.onClick ?? (() => {})}
      selected={false}
    />
  );
}

export default Broadcast;
