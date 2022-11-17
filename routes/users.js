const express = require('express');
const router = express.Router();
const logger = require('../common/logger');
const { expressYupMiddleware } = require('express-yup-middleware');
const Yup = require('yup');
const { seq: { models: { users } } } = require('../utility/orm')
const { createUser, sendVerificationEmail, loginUser, verifyEmail, logoutUser } = require('../auth')
const GenericResponse = require('../common/response');
const { authenticatedSessionMiddleware } = require('../auth/sessionMiddleware');

const createUserValidator = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        email: Yup.string().email().required('email'),
        password: Yup.string().required('password'),
        name: Yup.string().required('name'),
      }),
      validateOptions: {
        abortEarly: false,
      },
    },
  },
};

router.post('/createUser', expressYupMiddleware({ schemaValidator: createUserValidator }), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const result = await createUser({ email, name, password});
    if ( result.success ){
      sendVerificationEmail({id: result.id, email});
    }

    res.send(result);
  } catch(e) {
    logger.error(e);
    res.send(GenericResponse.failed('Failed'));
    //log error
  }
});

const loginUserValidator = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        email: Yup.string().email().required('email'),
        password: Yup.string().required('password'),
      }),
      validateOptions: {
        abortEarly: false,
      },
    },
  },
};

router.post('/loginUser', expressYupMiddleware({ schemaValidator: loginUserValidator }),  async (req, res, next) => {
  try{
    const { email, password} = req.body;

    const result = await loginUser({ email, password});
    if ( result.success ){
      req.session.userId = result.id;
      req.session.isAuthenticated = true;
      req.session.email = email;
      res.send("Logged in");
      return;
    }

    res.send(result);

  } catch(e) {
    logger.error(e);
    res.send(GenericResponse.failed('Failed'));
  }
});

const verifyEmailValidator = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        verificationCode: Yup.string().required('verificationCode'),
      }),
    },
  },
};

router.post('/verifyEmail', expressYupMiddleware({ schemaValidator: verifyEmailValidator }),  async (req, res, next) => {
  try{
    const { verificationCode } = req.body;
    
    const result = await verifyEmail({ verificationCode});

    res.send(result);

  } catch(e) {
    logger.error(e);
    res.send(GenericResponse.failed('Failed'));
  }
});

const sendVerificationEmailValidator = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        email: Yup.string().email().required('email'),
      }),
    },
  },
};

router.post('/sendVerificationEmail', expressYupMiddleware({ schemaValidator: sendVerificationEmailValidator }),  async (req, res, next) => {
  try{
    const { email } = req.body;

    const result = await sendVerificationEmail({email});

    res.send(result);

  } catch(e) {
    logger.error(e);
    res.send(GenericResponse.failed('Failed'));
    //log error
  }
});

router.post('/logout', authenticatedSessionMiddleware, async (req, res, next) => {

  try{ 
    await logoutUser({id: req.session.userId});
  } catch (e) {
    logger.error(e);
  }

  req.session.destroy();
  res.redirect('/');
});


module.exports = router;
