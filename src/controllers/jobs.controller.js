import moment from "moment/moment.js";
import { HTTP_CODE } from "../common/constants/response-code.const.js";
import { RequestValidationException } from "../common/exceptions/common.exception.js";
import { ResponseBuilder } from "../common/utils/builders/response.builder.js";
import { registerProjectAutomationJob } from "../events/product-scheduler.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createProjectAutomationJob(req, res) {
    const { body } = req;

    let { slug, endsAt } = body;

    if (!slug || !slug.trim()) {
        throw new RequestValidationException("Project slug is required");
    }

    endsAt = parseInt(endsAt);
    if (isNaN(endsAt) || !moment(endsAt).isValid()) {
        throw new RequestValidationException("Invalid funding end date");
    }

    // const redisKey = `projects_automation:${slug}`;
    // const client = RedisClient.getRedisClient();
    // check key
    // const oldValue = await client.get(redisKey);

    // if (!oldValue) {
    // save key
    // await client.set(redisKey, JSON.stringify({ endsAt }));
    // create job
    // }
    registerProjectAutomationJob(slug, new Date(endsAt));

    res.status(HTTP_CODE.created).json(new ResponseBuilder().withCode(HTTP_CODE.created).withData({}).build());
}
