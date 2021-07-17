module.exports.capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports.lowercase = function(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
};