var blueprints = require("./blueprints");

function descriptify(object) {
    if (object === undefined || object === null)
        throw new TypeError("Expected instance of Object, but got undefined.");
    var properties = Object.keys(object);
    for (var i = 0; i < properties.length; i++) {
        var property = properties[i];
        var descriptor = getDescriptorFor(object[property]);
        if (descriptor === undefined)
            continue;
        Object.defineProperty(object, property, descriptor);
    }
}

Object.defineProperties(descriptify, {
    map: { value: blueprints.map },
    remove: { value: blueprints.remove }
});

var getDescriptorFor = function(object) {
    if (object === undefined || object === null || !(object instanceof Object))
        return undefined;
    var numOfProperties = Object.getOwnPropertyNames(object);
    if (numOfProperties === 0 || numOfProperties > 2)
        return undefined;
    var descriptor = {};

    var properties = Object.keys(object);
    for (var i = 0; i < properties.length; i++) {
        var property = properties[i];
        var blueprint = blueprints.getFor(property);
        if (blueprint === undefined)
            return undefined;
        blueprint(descriptor, object[property]);
    }
    return descriptor;
};

module.exports = descriptify;
