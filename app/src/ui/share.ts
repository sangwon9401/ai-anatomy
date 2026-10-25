import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { T } from "./strings";

export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

/** Native share sheet in the app, the Web Share API in browsers that have it, otherwise copy the link. */
export async function shareLink(data: { title: string; text: string; url: string }): Promise<ShareResult> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Share.share({ ...data, dialogTitle: T.shareDialog });
      return "shared";
    }
    if (navigator.share) {
      await navigator.share(data);
      return "shared";
    }
  } catch (e) {
    if (e instanceof Error && /cancel|abort/i.test(`${e.name} ${e.message}`)) return "cancelled";
  }
  try {
    await navigator.clipboard.writeText(data.url);
    return "copied";
  } catch {
    return "failed";
  }
}
