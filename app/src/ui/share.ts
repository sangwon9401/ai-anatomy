import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";

export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

/** Native share sheet in the app, the Web Share API in browsers that have it, otherwise copy the link. */
export async function shareLink(data: { title: string; text: string; url: string }): Promise<ShareResult> {
  try {
    if (Capacitor.isNativePlatform()) {
      await Share.share({ ...data, dialogTitle: "공유하기" });
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
