import { Config } from "@remotion/cli/config";

// narration audio lives with the app's assets so Vite and Remotion share one copy
Config.setPublicDir("./src/assets");
