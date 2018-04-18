var path = require('path');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var templatesDir = path.join(__dirname, '../templates');
var emailTemplates = require('email-templates');

var ROOT_URL = process.env.ROOT_URL;

var HACKATHON_NAME = process.env.HACKATHON_NAME;
var EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
var TWITTER_HANDLE = process.env.TWITTER_HANDLE;
var FACEBOOK_HANDLE = process.env.FACEBOOK_HANDLE;

var EMAIL_HOST = process.env.EMAIL_HOST;
var EMAIL_USER = process.env.EMAIL_USER;
var EMAIL_PASS = process.env.EMAIL_PASS;
var EMAIL_PORT = process.env.EMAIL_PORT;
var EMAIL_CONTACT = process.env.EMAIL_CONTACT;
var EMAIL_HEADER_IMAGE = process.env.EMAIL_HEADER_IMAGE;
var EMAIL_DEV = process.env.EMAIL_DEV == "true";

if(EMAIL_HEADER_IMAGE.indexOf("https") == -1){
  EMAIL_HEADER_IMAGE = ROOT_URL + EMAIL_HEADER_IMAGE;
}

var NODE_ENV = process.env.NODE_ENV;

var options = {
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
};

if (EMAIL_DEV) {
  delete options.auth;
  options.secure = false;
  options.ignoreTLS = true;
}

var transporter = nodemailer.createTransport(smtpTransport(options));

var controller = {};

controller.transporter = transporter;

function sendOne(templateName, options, data, callback){

  if (NODE_ENV === "dev") {
    console.log(templateName);
    console.log(JSON.stringify(data, "", 2));
  }

  emailTemplates(templatesDir, function(err, template){
    if (err) {
      return callback(err);
    }

    data.emailHeaderImage = EMAIL_HEADER_IMAGE;
    data.emailAddress = EMAIL_ADDRESS;
    data.hackathonName = HACKATHON_NAME;
    data.twitterHandle = TWITTER_HANDLE;
    data.facebookHandle = FACEBOOK_HANDLE;
    template(templateName, data, function(err, html, text){
      if (err) {
        return callback(err);
      }

      transporter.sendMail({
        from: EMAIL_CONTACT,
        to: options.to,
        subject: options.subject,
        html: html,
        text: text
      }, function(err, info){
        if(callback){
          callback(err, info);
        }
      });
    });
  });
}

/**
 * Send a verification email to a user, with a verification token to enter.
 * @param  {[type]}   email    [description]
 * @param  {[type]}   token    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
controller.sendVerificationEmail = function(email, token, callback) {

  var options = {
    to: email,
    subject: "["+HACKATHON_NAME+"] - Verify your email"
  };

  var locals = {
    title: "Hooray, our signup form worked!",
    message: "To make sure it's really you, we need you to verify your email address:",
    actionText: "VERIFY ME",
    actionUrl: ROOT_URL + '/verify/' + token
  };

  sendOne('email-link-action', options, locals, function(err, info){
    if (err){
      console.log(err);
    }
    if (info){
      console.log(info.message);
    }
    if (callback){
      callback(err, info);
    }
  });

};

/**
 * Send a password recovery email.
 * @param  {[type]}   email    [description]
 * @param  {[type]}   token    [description]
 * @param  {Function} callback [description]
 */
controller.sendPasswordResetEmail = function(email, token, callback) {

  var options = {
    to: email,
    subject: "["+HACKATHON_NAME+"] - Password reset requested!"
  };

  var locals = {
    title: 'Reset your password',
    message: 'Somebody (hopefully you!) has requested that your password be reset. If ' +
      'this was not you, feel free to disregard this email. This link will expire in one hour.',
    actionUrl: ROOT_URL + '/reset/' + token,
    actionText: "RESET PASSWORD"
  };

  sendOne('email-link-action', options, locals, function(err, info){
    if (err){
      console.log(err);
    }
    if (info){
      console.log(info.message);
    }
    if (callback){
      callback(err, info);
    }
  });

};

/**
 * Send a password recovery email.
 * @param  {[type]}   email    [description]
 * @param  {Function} callback [description]
 */
controller.sendPasswordChangedEmail = function(email, callback){

  var options = {
    to: email,
    subject: "["+HACKATHON_NAME+"] - Your password has been changed!"
  };

  var locals = {
    title: 'Password updated',
    message: 'Somebody (hopefully you!) has successfully changed your password.',
  };

  sendOne('email-basic', options, locals, function(err, info){
    if (err){
      console.log(err);
    }
    if (info){
      console.log(info.message);
    }
    if (callback){
      callback(err, info);
    }
  });

};

/**
 * Send a "you're admitted" email
 * @param  {[type]}   email    [description]
 * @param  {Function} callback [description]
 */
controller.sendAdmitEmail = function(email, callback){

  var options = {
    to: email,
    subject: "["+HACKATHON_NAME+"] - You're in"
  };

  var locals = {
    title: "You're in!",
    message: "We accepted your application! After receiving this email, you have 1 week to confirm that you are coming. After that, your place on Hackaburg 2018 expires.",
    actionUrl: ROOT_URL,
    actionText: "OPEN DASHBOARD"
  };

  sendOne('email-link-action', options, locals, function(err, info){
    if (err){
      console.log(err);
    }
    if (info){
      console.log(info.message);
    }
    if (callback){
      callback(err, info);
    }
  });
};

/**
 * Send a "sorry you couldn't make it" email
 * @param  {[type]}   email    [description]
 * @param  {Function} callback [description]
 */
controller.sendDeclineEmail = function(email, callback){

  var options = {
    to: email,
    subject: "["+HACKATHON_NAME+"] - You declined your place"
  };

  var locals = {
    title: "Bummer!",
    message: "We're sorry you can't make it. Maybe next year then!"
  };

  sendOne('email-basic', options, locals, function(err, info){
    if (err){
      console.log(err);
    }
    if (info){
      console.log(info.message);
    }
    if (callback){
      callback(err, info);
    }
  });
};

module.exports = controller;
