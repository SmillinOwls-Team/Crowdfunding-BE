import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import moment from "moment";
import schedule from "node-schedule";
import { Logger } from "../common/utils/logger.js";
import { APP_CONFIG } from "../infrastruture/configs/index.js";

const sdk = ThirdwebSDK.fromPrivateKey(APP_CONFIG.wallet.privateKey, APP_CONFIG.chain[APP_CONFIG.chain.default], {
    secretKey: APP_CONFIG.thirdweb.privateKey,
});

const ProjectJobs = {};

/**
 *
 * @param {string} projectSlug
 * @param {Date} endsAt
 */
export function registerProjectAutomationJob(projectSlug, endsAt) {
    const job = schedule.scheduleJob(endsAt, handleRunProjectAutomationAsync.bind(this, projectSlug));
    ProjectJobs[projectSlug] = job;

    Logger.info(`Register event for project slug - ${projectSlug}`);
}

export async function runOldProjectAutomationJobAsync() {
    // load all project from contract
    try {
        Logger.info(`======> Fetching project in order to run old job`);
        const contract = await sdk.getContract(APP_CONFIG.contractAddress);

        const list = await contract.call("getProjectList");
        list.forEach((item) => {
            const endsAt = item.schedule.endsAt.toNumber();
            console.log({ slug: item.slug, isBefore: moment().isBefore(endsAt) });
            if (moment().isBefore(endsAt)) {
                registerProjectAutomationJob(item.slug, endsAt);
            } else {
                registerProjectAutomationJob(item.slug, new Date().getTime());
            }
        });
    } catch (error) {
        Logger.error(`======> Run old job failed`);
        Logger.error(error);
    }
}

/**
 *
 * @param {string} projectSlug
 */
async function handleRunProjectAutomationAsync(projectSlug) {
    try {
        Logger.info(`======> Project Automation Job Start - Slug = ${projectSlug}`);
        const contract = await sdk.getContract(APP_CONFIG.contractAddress);

        const result = await contract.call("automateDeliverMoney", [projectSlug]);
        Logger.info(`======> Project Automation Job End - Slug = ${projectSlug} - ${result}`);

        delete ProjectJobs[projectSlug];
    } catch (error) {
        Logger.error("Project Automation Job - Failed");
        Logger.error(error);
    }
}
