import { useFakedata, VERSION_ENDPOINT } from '@api/globals';

export async function getVersion(): Promise<Version> {
  const errorResponse = {
    currentVersion: 'N/A',
    latestVersion: 'N/A',
    notify: false,
  };

  if (useFakedata)
    return {
      currentVersion: 'v1.0',
      latestVersion: 'v1.1',
      notify: true,
    };

  try {
    const version: Version = await (await fetch(VERSION_ENDPOINT)).json();
    return version;
  } catch (e) {
    console.error(e);
    return errorResponse;
  }
}
