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

const baseCampaignValidations = {
  campaignType: Yup.number()
    .typeError()
    .required().test("valid campaign type", "campaign type", value => {
      const result = Object.keys(campaignType).some((key) => campaignType[key] == value);
      return result;
    }),
  name: Yup.string().max(255).required(),
  description: Yup.string().max(1000),
  steps: Yup.array().of(Yup.string()),
  tags: Yup.array().of(Yup.string()).required(),
  location: Yup.string().required(),
  totalUsersRequired: Yup.number().required(),
  dueDate: Yup.date().required().test("DueDateInTheFuture", "due date should be in the future", value => {
    return value > Date.now()
  }),
}

const createCampaignValidator = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        ...baseCampaignValidations
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
      const result = await createCampaign({...req.body, userId: req.session.userId });

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
        ...baseCampaignValidations,
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
      const result = await updateCampaign({...req.body});

      res.send(result);
    } catch (e) {
      logger.error(e);
      res.send(GenericResponse.failed('Failed'));
      //log error
    }
  });


const campaignRequestValidator = {
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
  expressYupMiddleware({ schemaValidator: campaignRequestValidator })],
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
  expressYupMiddleware({ schemaValidator: campaignRequestValidator })],
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

module.exports = router;
