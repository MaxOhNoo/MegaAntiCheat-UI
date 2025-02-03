import { BROADCASTS_ENDPOINT, useFakedata } from "@api/globals";
import { BroadcastImportance } from "@components/TF2/Broadcast/Broadcast";
import { t } from "@i18n";

export async function getBroadcasts(): Promise<BroadcastResponse> {

    const errorResponse = {
        broadcasts: [
            {
                importance: BroadcastImportance.CRITICAL,
                message: t('BROADCAST_FETCH_ERROR'),
            }
        ],
        latestUpdate: "1970-01-01T00:00:00Z"
    };

    if (useFakedata) return errorResponse;

    try {
        const broadcasts: BroadcastResponse = await (await fetch(BROADCASTS_ENDPOINT)).json();
        return broadcasts;
    } catch (e) {
        console.error(e);
        return errorResponse;
    }
}