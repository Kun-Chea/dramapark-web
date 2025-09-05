import { useState } from "react";

export default () => {
    /** 主题色 */
    const [themeColor, setThemeColor] = useState<string>('light');

    /** 默认设置 */
    const [defaultSettings, setDefaultSettings] = useState<any>(null);

    return { themeColor, setThemeColor, defaultSettings, setDefaultSettings };
};