var mongoose   = require('mongoose'),
    bcrypt     = require('bcrypt-nodejs'),
    validator  = require('validator'),
    jwt        = require('jsonwebtoken');
    JWT_SECRET = process.env.JWT_SECRET;

// Only after confirmed
var confirmation = {
  phoneNumber: String,
  dietaryRestrictions: [String],
  shirtSize: {
    type: String,
    enum: {
      values: 'XS S M L XL XXL WXS WS WM WL WXL WXXL'.split(' ')
    }
  },
  wantsHardware: Boolean,
  hardware: String,

  address: {
    name: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  receipt: String,

  notes: String,
};

var status = {
  /**
   * Whether or not the user's profile has been completed.
   * @type {Object}
   */
  completedProfile: {
    type: Boolean,
    required: true,
    default: false,
  },
  admitted: {
    type: Boolean,
    required: true,
    default: false,
  },
  admittedBy: {
    type: String,
    validate: [
      validator.isEmail,
      'Invalid Email',
    ],
    select: false
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
  declined: {
    type: Boolean,
    required: true,
    default: false,
  },
  checkedIn: {
    type: Boolean,
    required: true,
    default: false,
  },
  checkInTime: {
    type: Number,
  },
  confirmBy: {
    type: Number
  },
  reimbursementGiven: {
    type: Boolean,
    default: false
  }
};

// define the schema for our admin model
var schema = new mongoose.Schema({

  email: {
      type: String,
      required: true,
      unique: true,
      validate: [
        validator.isEmail,
        'Invalid Email',
      ]
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  admin: {
    type: Boolean,
    required: true,
    default: false,
  },

  timestamp: {
    type: Number,
    required: true,
    default: Date.now(),
  },

  lastUpdated: {
    type: Number,
    default: Date.now(),
  },

  teamCode: {
    type: String,
    min: 0,
    max: 140,
  },

  verified: {
    type: Boolean,
    required: true,
    default: false
  },

  salt: {
    type: Number,
    required: true,
    default: Date.now(),
    select: false
  },

  /**
   * User Profile.
   *
   * This is the only part of the user that the user can edit.
   *
   * Profile validation will exist here.
   */
  profile: {
    name: {
      type: String,
      min: 1,
      max: 100,
    },

    age: {
      type: Number,
    },
  
    gender: {
      type: String,
      enum : {
        values: 'M F O N'.split(' ')
      },
    },

    nationality: {
      type: String,
      min: 1,
      max: 100,
    },

    city: {
      type: String,
      min: 1,
      max: 200,
    },

    profession: {
      type: String,
      enum: {
        values: [
          "W",
          "S",
        ]
      },
    },

    study: {
      school: {
        type: String,
        min: 1,
        max: 150,
      },

      subject: {
        type: String,
      },

      yearOfStudies: {
        type: String,
      },

      graduationYear: {
        type: String
      },
    },

    work: {
      experience: {
        type: Number,
      },
    },

    travelReimbursement: {
      type: String,
      enum: {
        values: [
          "Y",
          "N"
        ]
      },
    },

    travelReimbursementType: {
      type: String,
      enum: {
        values: [
          "B",
          "G",
          "E",
        ],
      },
    },

    github: {
      type: String,
    },

    linkedin: {
      type: String,
    },

    description: {
      type: String,
      min: 0,
      max: 300
    },

    idea: {
      type: String,
      enum: {
        values: [
          "Y",
          "N",
          "S",
        ],
      },
    },

    ideaTracks: [String],
  
    legal: {
      mlh: {
        terms: {
          type: Boolean,
          default: false,
        },

        coc: {
          type: Boolean,
          default: false,
        },
      }
    }
  },

  /**
   * Confirmation information
   *
   * Extension of the user model, but can only be edited after acceptance.
   */
  confirmation: confirmation,

  status: status,

});

schema.set('toJSON', {
  virtuals: true
});

schema.set('toObject', {
  virtuals: true
});

//=========================================
// Instance Methods
//=========================================

// checking if this password matches
schema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// Token stuff
schema.methods.generateEmailVerificationToken = function(){
  return jwt.sign(this.email, JWT_SECRET);
};

schema.methods.generateAuthToken = function(){
  return jwt.sign(this._id, JWT_SECRET);
};

/**
 * Generate a temporary authentication token (for changing passwords)
 * @return JWT
 * payload: {
 *   id: userId
 *   iat: issued at ms
 *   exp: expiration ms
 * }
 */
schema.methods.generateTempAuthToken = function(){
  return jwt.sign({
    id: this._id
  }, JWT_SECRET, {
    expiresInMinutes: 60,
  });
};

//=========================================
// Static Methods
//=========================================

schema.statics.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * Verify an an email verification token.
 * @param  {[type]}   token token
 * @param  {Function} cb    args(err, email)
 */
schema.statics.verifyEmailVerificationToken = function(token, callback){
  jwt.verify(token, JWT_SECRET, function(err, email){
    return callback(err, email);
  });
};

/**
 * Verify a temporary authentication token.
 * @param  {[type]}   token    temporary auth token
 * @param  {Function} callback args(err, id)
 */
schema.statics.verifyTempAuthToken = function(token, callback){
  jwt.verify(token, JWT_SECRET, function(err, payload){

    if (err || !payload){
      return callback(err);
    }

    if (!payload.exp || Date.now() >= payload.exp * 1000){
      return callback({
        message: 'Token has expired.'
      });
    }

    return callback(null, payload.id);
  });
};

schema.statics.findOneByEmail = function(email){
  return this.findOne({
    email: email.toLowerCase()
  });
};

/**
 * Get a single user using a signed token.
 * @param  {String}   token    User's authentication token.
 * @param  {Function} callback args(err, user)
 */
schema.statics.getByToken = function(token, callback){
  jwt.verify(token, JWT_SECRET, function(err, id){
    if (err) {
      return callback(err);
    }
    this.findOne({_id: id}, callback);
  }.bind(this));
};

schema.statics.validateProfile = function(profile, cb){
  var currentYear = new Date().getFullYear();

  return cb(!(
    profile.name.length > 0 &&
    profile.age > 0 &&
    ['M', 'F', 'O', 'N'].indexOf(profile.gender) > -1 &&
    profile.nationality.length > 0 &&
    (
      (
        profile.profession == "S" &&
        profile.study.school.length > 0 &&
        profile.study.graduationYear >= (currentYear - 1) &&
        profile.study.graduationYear <= (currentYear + 10) &&
        profile.study.subject.length > 0
      ) ||
      (
        profile.profession == "W" &&
        profile.work.experience >= 0
      )
    ) &&
    ["Y", "N"].includes(profile.travelReimbursement) &&
    profile.description.length > 0 &&
    ["Y", "N", "S"].includes(profile.idea) &&
    profile.legal.mlh.terms &&
    profile.legal.mlh.coc
  ));
};

//=========================================
// Virtuals
//=========================================

/**
 * Has the user completed their profile?
 * This provides a verbose explanation of their furthest state.
 */
schema.virtual('status.name').get(function(){

  if (this.status.checkedIn) {
    return 'checked in';
  }

  if (this.status.declined) {
    return "declined";
  }

  if (this.status.confirmed) {
    return "confirmed";
  }

  if (this.status.admitted) {
    return "admitted";
  }

  if (this.status.completedProfile){
    return "submitted";
  }

  if (!this.verified){
    return "unverified";
  }

  return "incomplete";

});

module.exports = mongoose.model('User', schema);
