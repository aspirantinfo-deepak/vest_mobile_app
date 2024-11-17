import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.vestrmob5.vestr",
  appName: "Vestr",
  webDir: "dist",
  "plugins": {
    "SwipeBack": {
      "enabled": true
    }
  }
  // server: {
  //   androidScheme: "https",
  //   url: "http://192.168.29.235:3000",
  //   cleartext: true,
  // },
};

export default config;
