const express = require('express');
const router = express.Router();
const { expressYupMiddleware } = require('express-yup-middleware');
const Yup = require('yup');
const { seq: { models: { users } } } = require('../utility/orm')
const { createUser } = require('../auth')

const createUserValidator = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        email: Yup.string().email().required('email'),
        password: Yup.string().required('password'),
        name: Yup.string().required('name'),
      }),
    },
  },
};

router.post('/createUser', expressYupMiddleware({ schemaValidator: createUserValidator }), async (req, res, next) => {
  const { name, email, password } = req.body;

  const result = await createUser({ email, name, password});

  res.send(result);
});

router.get('/sendVerificationEmail', function (req, res, next) {
  res.send('respond with a resource');
});

const loginUserValidator = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        email: Yup.string().email().required('email'),
        password: Yup.string().required('password'),
      }),
    },
  },
};

router.post('/loginUser', function (req, res, next) {
  req.session.userId = 1000;
  req.session.isAuthenticated = true;
  req.session.email = req.body.email;
  res.send("Logged in");
});

router.post('/loggedInUser', function (req, res, next) {
  res.send(`Logged in as ${JSON.stringify(req.session)}`);
});

router.get('/logoutUser', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});


module.exports = router;
