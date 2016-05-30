var config = require('./config'),
    mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

//MongoDB Connection
mongoose.connect(config.mongodb.uri, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to MongoDB');
    }
});

//User Collection Schema
var userSchema = mongoose.Schema({
  usr: String,
  pwd: String,
  email: String,
  firstname: String,
  lastname: String,
  avatar: String,
  status: String,
	onMobile: String,
	onPc: String,
	signedDate: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  }
});

//Message Collection Schema
var chatMessageSchema = mongoose.Schema({
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  msg: String,
  created: {
    type: Date,
    default: Date.now
  }
});

//Webm Collection Schema
var webmsSchema = mongoose.Schema({
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  link: String,
	thumblink: String,
  shortcut: String,
	type: String,
	height: String,
	width: String,
	order: Number,
  created: {
    type: Date,
    default: Date.now
  }
});

//Sound Collection Schema
var soundsSchema = mongoose.Schema({
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  link: String,
	title: String,
  format: String,
	type: String,
  created: {
    type: Date,
    default: Date.now
  }
});

var mongoMessage = mongoose.model('Message', chatMessageSchema);
var mongoUser = mongoose.model('User', userSchema);
var mongoWebm = mongoose.model('Webm', webmsSchema);
var mongoSound = mongoose.model('Sound', soundsSchema);

/**
 * Create New User
 * @method createNewChatUser
 * @param {} username
 * @param {} password
 * @param {} firstname
 * @param {} lastname
 * @param {} email
 * @param {} avatar
 * @param {} callback
 * @return
 */
function createNewChatUser(username, password, firstname, lastname, email, avatar, callback) {
    var newUser = new mongoUser({
        usr: username,
        pwd: password,
        firstname: firstname,
        lastname: lastname,
        email: email,
        avatar: avatar,
        status: "online",
        lastseen: Date()
    });
    //Save user
    newUser.save(function (err, user) {
        if (err) return handleError(err);
        callback(true);
    });
}

/**
 * Get objectId for user
 * @method getObjectIdbyUsername
 * @param {} username
 * @param {} callback
 * @return
 */
function getObjectIdbyUsername(username, callback) {
    mongoUser.findOne({
        usr: username
    })
        .select('_id')
        .exec(function (err, user) {
            if (err) return handleError(err);
            callback(user._id);
        });
}

/**
 * Export Get objectId for user
 * @method getObjectIdbyUsername
 * @param {} username
 * @param {} callback
 * @return
 */
exports.exGetObjectIdbyUsername = function(username, callback) {
    mongoUser.findOne({
        usr: username
    })
        .select('_id')
        .exec(function (err, user) {
            if (err) return handleError(err);
            callback(String(user._id));
        });
}

/**
 * Check if User Exists
 * @method usernameExists
 * @param {} username
 * @param {} callback
 * @return
 */
function usernameExists(username, callback) {
    mongoUser.count({
        usr: username
    }, function (err, count) {
        if (err) return handleError(err);
        if (count > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

/**
 * get full user
 * @method getFullUserByUsername
 * @param {} username
 * @param {user} callback
 * @return
 */
exports.getFullUserByUsername = function (username, callback) {
    mongoUser.findOne({
        usr: username
    })
        .select('-pwd -created')
        .exec(function (err, user) {
            if (err) return handleError(err);
            callback(user);
        });
}

/**
 * Authenticate User
 * @method userAuthenticate
 * @param {} username
 * @param {} password
 * @param {boolean} callback
 * @return
 */
exports.userAuthenticate = function (username, password, callback) {
    console.log(username);
    mongoUser.findOne({
        usr: username
    })
        .exec(function (err, user) {
            if (err) return handleError(err);
            if (!user) return callback(false);
            bcrypt.compare(password, user.pwd, function (err, res) {
                callback(res);
            });
        });
}

/**
 * Register new User prozess
 * @method registerUserProzess
 * @param {} username
 * @param {} password
 * @param {} firstname
 * @param {} lastname
 * @param {} email
 * @param {} avatar
 * @param {boolean} callback
 * @return
 */
exports.registerUserProzess = function (username, password, firstname, lastname, email, avatar, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            usernameExists(username, function (exists) {
                if (!exists) {
                    createNewChatUser(username, hash, firstname, lastname, email, avatar, function (done) {
                        callback(done);
                    });
                } else {
                    callback(false);
                }
            });
        });
    });
}


//Update user status
exports.updateUserStatus = function (username, status, signedDate, callback) {
	mongoUser.findOne({ usr: username }, function (err, user){
    user.status = status;
		user.signedDate = signedDate;
		user.save(function (err) {
			if (err) return handleError(err);
			callback();
		});
	});
}

/**
 * get all user
 * @method getFullUserByUsername
 * @param {users} callback
 * @return
 */
exports.getAllUser = function (callback) {
    mongoUser.find({
    })
        .select('-pwd -created')
        .exec(function (err, users) {
            if (err) return handleError(err);
            callback(users);
        });
}

/**
 * Create New Message
 * @method createNewMessage
 * @param {} creator
 * @param {} message
 * @param {} callback
 * @return
 */
exports.createNewMessage = function (creator, message, callback) {
    var newMessage = new mongoMessage({
        _creator: creator,
        msg: message
    });
    //Save message
    newMessage.save(function (err, user) {
        if (err) return handleError(err);
        callback(true);
    });
}

/**
 * Get last messages
 * @method getLastMessages
 * @param {} limit
 * @param {} callback
 * @return
 */
exports.getLastMessages = function (limit, callback) {
    mongoMessage.find().sort({'created': -1}).limit(limit).populate('_creator').exec(function(err, messages){
		if(err) return handleError(err);
		callback(messages)
	});
}

/**
 * Create New Webm
 * @method createNewWebm
 * @param {} creator
 * @param {} link
 * @param {} shortcut
 * @param {} type
 * @param {} callback
 * @return
 */
exports.createNewWebm = function (creator, link, thumblink, shortcut, type, height, width, callback) {
    var newWebm = new mongoWebm({
      _creator: creator,
      link: link,
  		thumblink: thumblink,
  		shortcut: shortcut,
  		type: type,
  		height: height,
  		width: width
    });
    //Save Webm
    newWebm.save(function (err, user) {
        if (err) return handleError(err);
        callback(true);
    });
}

/**
 * Get all Webms
 * @method getAllWebms
 * @param {} callback
 * @return
 */
exports.getAllWebms = function (callback) {
    mongoWebm.find({type: 1}).sort({created: 1}).exec(function(err, webms){
		if(err) return handleError(err);
		callback(webms)
	});
}

/**
 * Check if shortcut exists
 * @method shortcutExists
 * @param {} checkShortcut
 * @param {} callback
 * @return
 */
exports.shortcutExists = function (checkShortcut, callback) {
    mongoWebm.count({shortcut: checkShortcut}, function(err, count){
		if(count > 0) {
			callback(true)
		} else {
			callback(false);
		}
	});
}

//Update Webm order
exports.updateWebmOrder = function (webms, callback) {
	mongoWebm.findOne({ shortcut: webms.shortcut }, function (err, webm){
	  webm.order = webms.order;
	  webm.save(function (err) {
        if (err) return handleError(err);
		callback();
	  });
	});
}

//Gets webm by ID
exports.getwebmById = function (webmId, callback) {
	mongoWebm.findOne({ _id: webmId }, function (err, webm){
	  callback(webm);
	});
}

//Remove webm by ID
exports.removeWebmById = function (webmId, callback) {
	mongoWebm.findByIdAndRemove(webmId, function (err){
	  if (err) return handleError(err);
	  callback();
	});
}

//Deactivate webm by ID
exports.deactivateWebmById = function (webmId, callback) {
  mongoWebm.findOne({ _id: webmId }, function (err, webm){
	  webm.type = 0;
	  webm.save(function (err) {
        if (err) return handleError(err);
		callback();
	  });
	});
}

/**
 * Create New Sound
 * @method createNewSound
 * @param {} creator
 * @param {} link
 * @param {} title
 * @param {} format
 * @param {} type
 * @param {} callback
 * @return
 */
exports.createNewSound = function (creator, link, title, format, type, callback) {
    var newSound = new mongoSound({
      _creator: creator,
      link: link,
  		title: title,
  		format: format,
  		type: type
    });
    //Save Webm
    newSound.save(function (err, user) {
        if (err) return handleError(err);
        callback(true);
    });
}

/**
 * Get all Sounds
 * @method getAllSounds
 * @param {} callback
 * @return
 */
exports.getAllSounds = function (callback) {
    mongoSound.find({type: 1}).sort({created: 1}).exec(function(err, sounds){
		if(err) return handleError(err);
		callback(sounds)
	});
}

//Deactivate sound by ID
exports.deactivateSoundById = function (soundId, callback) {
  mongoSound.findOne({ _id: soundId }, function (err, sound){
	  sound.type = 0;
	  sound.save(function (err) {
        if (err) return handleError(err);
		callback();
	  });
	});
}

/**
 * Error Handler
 * @method handleError
 * @param {} error
 * @return
 */
function handleError(error) {
    console.log(error);
}
