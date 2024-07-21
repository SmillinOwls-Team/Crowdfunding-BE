import * as dotenv from "dotenv";
import { Sepolia, Localhost } from "@thirdweb-dev/chains";

dotenv.config();

export const APP_CONFIG = {
    appPort: process.env.PORT ? +process.env.PORT : 5001,
    logLevel: process.env.LOG_LEVEL || "debug",
    logDriver: process.env.LOG_DRIVER || "console",

    origin: process.env.ORIGIN.split(" ") || "*",
    credential: Boolean(process.env.CREDENTIAL).valueOf(),

    contractAddress: process.env.CONTRACT_ADDRESS || "",
    thirdweb: {
        privateKey: process.env.THIRDWEB_KEY || "",
    },

    chain: {
        default: process.env.DEFAULT_CHAIN || "localhost",
        sepolia: Sepolia,
        localhost: {
            ...Localhost,
            rpc: ["http://127.0.0.1:8545"],
        },
    },

    wallet: {
        privateKey: process.env.PRIVATE_KEY || "",
    },
};
