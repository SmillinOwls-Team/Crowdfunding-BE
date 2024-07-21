import express from "express";
import { asyncRouteHandler } from "../common/middlewares/async-route.handler.js";
import { createProjectAutomationJob } from "../controllers/jobs.controller.js";

export const jobRouter = express.Router();

jobRouter.post("/jobs", asyncRouteHandler(createProjectAutomationJob));
