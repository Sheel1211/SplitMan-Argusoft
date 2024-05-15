import express from 'express';
import { downloadGroupReportPDF, downloadFriendReportPDF } from '../controllers/report.controller.js';

const reportRouter = express.Router();

reportRouter.get('/downloadGroupReport/:groupId', downloadGroupReportPDF);
reportRouter.get('/downloadFriendReport/:userId/:friendId', downloadFriendReportPDF);

export default reportRouter;
