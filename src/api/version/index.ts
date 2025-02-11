import { VERSION_ENDPOINT, useFakedata } from "@api/globals";
import { BroadcastImportance } from "@components/TF2/Broadcast/Broadcast";
import { t } from "@i18n";

export async function getVersion(): Promise<Version> {

    const errorResponse = {
        currentVersion: "N/A",
        latestVersion: "N/A",
        notify: false
    };

    if (useFakedata) return {
        currentVersion: "v1.0",
        latestVersion: "v1.1",
        notify: true
    };

    try {
        const version: Version = await (await fetch(VERSION_ENDPOINT)).json();
        return version;
    } catch (e) {
        console.error(e);
        return errorResponse;
    }
}