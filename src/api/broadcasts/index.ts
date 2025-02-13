import { BROADCASTS_ENDPOINT, useFakedata } from '@api/globals';
import { BroadcastImportance } from '@components/TF2/Broadcast/Broadcast';
import { t } from '@i18n';

export async function getBroadcasts(): Promise<BroadcastResponse> {
  const errorResponse = {
    broadcasts: [
      {
        importance: BroadcastImportance.CRITICAL,
        postDate: '1970-01-01T00:00:00Z',
        message: t('BROADCAST_FETCH_ERROR'),
      },
    ],
    latestUpdate: '1970-01-01T00:00:00Z',
  };

  if (useFakedata)
    return {
      broadcasts: [
        {
          importance: BroadcastImportance.INFO,
          postDate: '1970-01-01T00:00:00Z',
          message: 'This is an INFO broadcast.',
        },
        //          Handled by /version
        //          {
        //              importance: BroadcastImportance.UPDATE,
        //              postDate: "1970-01-01T00:00:00Z",
        //              message: "This is what appears when a new build is available.",
        //          },
        {
          importance: BroadcastImportance.WARNING,
          postDate: '1970-01-01T00:00:00Z',
          message: 'This is a WARNING broadcast.',
        },
        {
          importance: BroadcastImportance.CRITICAL,
          postDate: '1970-01-01T00:00:00Z',
          message: 'This is a CRITICAL broadcast.',
        },
      ],
      latestUpdate: '1970-01-01T00:00:00Z',
    };

  try {
    const broadcasts: BroadcastResponse = await (
      await fetch(BROADCASTS_ENDPOINT)
    ).json();
    return broadcasts;
  } catch (e) {
    console.error(e);
    return errorResponse;
  }
}
