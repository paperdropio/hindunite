const express = require('express');
const router = express.Router();
const logger = require('../common/logger');
const { expressYupMiddleware } = require('express-yup-middleware');
const Yup = require('yup');
const { createCampaign, joinCampaign, getCampaign, updateCampaign } = require('../campaigns')
const GenericResponse = require('../common/response');
const { authenticatedSessionMiddleware } = require('../auth/sessionMiddleware');
const campaignType = require('../enums/campaignTypes');
const session = require('express-session');

const createCampaignValidator = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        campaignType: Yup.number()
          .typeError("Must be a number")
          .required("required").test("valid campaign type", "campaign type", value => {
            const result = Object.keys(campaignType).some((key) => campaignType[key] == value);
            return result;
          }).required('campaignType'),
        name: Yup.string().max(255).required('name'),
        description: Yup.string().max(1000).label('description'),
        steps: Yup.array().label('steps'),
        tags: Yup.array().required('tags'),
        totalUsersRequired: Yup.number().required('totalUsersRequired'),
      }),
      validateOptions: {
        abortEarly: false,
      },
    },
  },
};

router.post('/createCampaign', [authenticatedSessionMiddleware,
  expressYupMiddleware({ schemaValidator: createCampaignValidator })],
  async (req, res, next) => {
    try {
      const { campaignType, name, description, steps, tags, totalUsersRequired } = req.body;

      const result = await createCampaign({ userId: req.session.userId, campaignType, name, description, steps, tags, totalUsersRequired });

      res.send(result);
    } catch (e) {
      logger.error(e);
      res.send(GenericResponse.failed('Failed'));
      //log error
    }
  });



const updateCampaignValidator = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        campaignType: Yup.number()
          .typeError("Must be a number")
          .required("required").test("valid campaign type", "campaign type", value => {
            const result = Object.keys(campaignType).some((key) => campaignType[key] == value);
            return result;
          }).required('campaignType'),
        name: Yup.string().max(255).required('name'),
        description: Yup.string().max(1000).label('description'),
        steps: Yup.array().label('steps'),
        tags: Yup.array().required('tags'),
        totalUsersRequired: Yup.number().required('totalUsersRequired'),
        campaignId: Yup.string().uuid().required("campaignId"),
      }),
      validateOptions: {
        abortEarly: false,
      },
    },
  },
};


router.post('/updateCampaign', [authenticatedSessionMiddleware,
  expressYupMiddleware({ schemaValidator: updateCampaignValidator })],
  async (req, res, next) => {
    try {
      const { campaignId, campaignType, name, description, steps, tags, totalUsersRequired } = req.body;

      const result = await updateCampaign({ campaignId, userId: req.session.userId, campaignType, name, description, steps, tags, totalUsersRequired });

      res.send(result);
    } catch (e) {
      logger.error(e);
      res.send(GenericResponse.failed('Failed'));
      //log error
    }
  });


const addCampaignValidator = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        campaignId: Yup.string().uuid().required('campaignId'),
      }),
      validateOptions: {
        abortEarly: false,
      },
    },
  },
};


router.post('/getCampaign', [authenticatedSessionMiddleware,
  expressYupMiddleware({ schemaValidator: addCampaignValidator })],
  async (req, res, next) => {
    try {
      const { campaignId } = req.body;

      const result = await getCampaign({ campaignId, userId: req.session.userId });

      res.send(result);
    } catch (e) {
      logger.error(e);
      res.send(GenericResponse.failed('Failed'));
      //log error
    }
  });

router.post('/joinCampaign', [authenticatedSessionMiddleware,
  expressYupMiddleware({ schemaValidator: addCampaignValidator })],
  async (req, res, next) => {
    try {
      const { campaignId } = req.body;

      const result = await joinCampaign({ campaignId, userId: req.session.userId });

      res.send(result);
    } catch (e) {
      logger.error(e);
      res.send(GenericResponse.failed('Failed'));
      //log error
    }
  });

router.post('/getCampaign', [authenticatedSessionMiddleware,
  expressYupMiddleware({ schemaValidator: addCampaignValidator })],
  async (req, res, next) => {
    try {
      const { campaignId } = req.body;

      const result = await getCampaign({ campaignId });

      res.send(result);
    } catch (e) {
      logger.error(e);
      res.send(GenericResponse.failed('Failed'));
      //log error
    }
  });

module.exports = router;
