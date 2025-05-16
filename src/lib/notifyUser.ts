//under alert user logic taking user permission to notify him
export async function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.warn("This browser does not support desktop notification");
        return;
    }
    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }
}
