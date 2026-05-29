window.addEventListener("storage", (e) => {
    if (!e.key) return;

    const handlers = {
        saveColor: () => renderColors(),
        theme: () => applyTheme(localStorage.getItem("theme")),
        autoGridView: () => toggleLayoutOption(localStorage.getItem("autoGridView")),
        "gradient-colors": () => renderGradientColors(),
        isSidebarLocked: () => {
            if (localStorage.getItem("isSidebarLocked") === "yes") {
                lockNavbar();
                showMenuBar();
            } else {
                unlockNavbar();
            }
        },
        "layout-type": () => setSelectedLayoutOption(),
        "screen-size": () => {
            if (localStorage.getItem("screen-size") === "full") {
                setFullScreen();
            } else {
                removeFullScreen();
            }
        },
        brightness: () => {
            if (typeof setBrightness === "function") {
                setBrightness();
            }
        },
        cursorSidebar: () => {
            if (typeof setCursorSidebarUI === "function") {
                setCursorSidebarUI();
            }
        },
        autoThemeMode: () => {
            if (typeof setAutoThemeMode === "function") {
                const isEnabled = localStorage.getItem("autoThemeMode") === "enable";
                setAutoThemeMode(isEnabled);
            }
        },
        deepDarkMode: () => {
            if (typeof setDeepDarkMode === "function") {
                setDeepDarkMode(localStorage.getItem("deepDarkMode") === "on", false);
            }
        }
    };

    const messages = {
        saveColor: 'Saved colors updated in another tab',
        theme: 'Theme updated in another tab',
        autoGridView: 'Auto grid view updated in another tab',
        "gradient-colors": 'Gradient colors updated in another tab',
        isSidebarLocked: 'Sidebar lock state updated in another tab',
        "layout-type": 'Layout type updated in another tab',
        "screen-size": 'Screen size updated in another tab',
        brightness: 'Brightness updated in another tab',
        cursorSidebar: 'Cursor sidebar mode updated in another tab',
        autoThemeMode: 'Auto theme mode updated in another tab',
        deepDarkMode: 'Deep dark mode updated in another tab'
    };

    const handler = handlers[e.key];
    if (typeof handler !== "function") return;

    handler();
    throwMessage("Update detected", $accentColor, 'alert-circle-outline', messages[e.key]);
});

console.log({ ...localStorage });