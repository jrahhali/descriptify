module.exports.map = function(key, value) {
    if (internalExtensions.hasOwnProperty(value)) {
        externalExtensions[key] = internalExtensions[value];
    }
    else if (base.hasOwnProperty(value)) {
        externalExtensions[key] = base[value];
    }
    else {
        throw new Error("No mapping exists for " + value);
    }
};

module.exports.remove = function(key) {
    delete externalExtensions[key];
};

module.exports.getFor = function(key) {
    var value = externalExtensions[key];
    if (value !== undefined)
        return value;

    value = internalExtensions[key];
    if (value !== undefined)
        return value;

    // rearrange the key alphabetically before looking for it
    return base[key.split("").sort().join("")];
};

var base = {
    "_": function(descriptor, value) {
        createDescriptor(descriptor, false, false, false, value);
    },
    c: function(descriptor, value) {
        createDescriptor(descriptor, true, false, false, value);
    },
    e: function(descriptor, value) {
        createDescriptor(descriptor, false, true, false, value);
    },
    w: function(descriptor, value) {
        createDescriptor(descriptor, false, false, true, value);
    },
    ce: function(descriptor, value) {
        createDescriptor(descriptor, true, true, false, value);
    },
    cw: function(descriptor, value) {
        createDescriptor(descriptor, true, false, true, value);
    },
    ew: function(descriptor, value) {
        createDescriptor(descriptor, false, true, true, value);
    },
    cew: function(descriptor, value) {
        createDescriptor(descriptor, true, true, true, value);
    },
    g: function(descriptor, value) {
        createDescriptor(descriptor, false, false, undefined, undefined, value, undefined);
    },
    s: function(descriptor, value) {
        createDescriptor(descriptor, false, false, undefined, undefined, undefined, value);
    },
    cg: function(descriptor, value) {
        createDescriptor(descriptor, true, false, undefined, undefined, value, undefined);
    },
    cs: function(descriptor, value) {
        createDescriptor(descriptor, true, false, undefined, undefined, undefined, value);
    },
    eg: function(descriptor, value) {
        createDescriptor(descriptor, false, true, undefined, undefined, value, undefined);
    },
    es: function(descriptor, value) {
        createDescriptor(descriptor, false, true, undefined, undefined, undefined, value);
    },
    ceg: function(descriptor, value) {
        createDescriptor(descriptor, true, true, undefined, undefined, value, undefined);
    },
    ces: function(descriptor, value) {
        createDescriptor(descriptor, true, true, undefined, undefined, undefined, value);
    }
};

var internalExtensions = {
    get: base.g,
    set: base.s,
    readonly: base._

};

var externalExtensions = {};

function createDescriptor(descriptor, configurable, enumerable, writable, value, get, set) {
    descriptor.configurable = configurable;
    descriptor.enumerable = enumerable;

    if (writable !== undefined)
        descriptor.writable = writable;
    if (value !== undefined)
        descriptor.value = value;
    if (get !== undefined) {
        validateIsFunction(get);
        descriptor.get = get;
    }
    if (set !== undefined) {
        validateIsFunction(set);
        descriptor.set = set;
    }

    return descriptor;
}

var validateIsFunction = function(value) {
    if (!(value instanceof Function))
        throw new TypeError("Expected value of get/set property to be a function, but got " + typeof value);
};
