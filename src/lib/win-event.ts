export class WinEvent {
    private static keys: Set<string> = new Set();

    static init() {
        window.addEventListener("keydown", (e) => {
            WinEvent.keys.add(e.key.toLowerCase());
        });

        window.addEventListener("keyup", (e) => {
            WinEvent.keys.delete(e.key.toLowerCase());
        });
    }

    static has(key: string) {
        return WinEvent.keys.has(key);
    }

    private constructor() {}
}
