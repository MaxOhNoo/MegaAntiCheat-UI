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
      key={68}
      title={props.message}
      Icon={getBroadcastIcon(props.importance)}
      collapsed={dismissed}
      onClick={() => setDismissed(true)}
      selected={false}
    />
  );
}

export default Broadcast;
