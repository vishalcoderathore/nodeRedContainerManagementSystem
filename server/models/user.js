var User = [{
    username: 'user',
    password: 'user'
}];

module.exports.getUserByUsername = function(username, callback) {
    var found = null;
    console.log("searching....");
    for (var i = 0; i < User.length; i++) {
        var element = User[i];

        if (element.Key == username) {
            found = element;
        }
    }

    return found;

}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    if (candidatePassword === hash) {
        callback(null, isMatch);
    } else {
        throw err;
    }

}
