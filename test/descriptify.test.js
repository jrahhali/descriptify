var assert = require("assert");
var descriptify = require("./../lib/descriptify");

function data(property) {
    this.foo = {};
    this.foo[property] = "bar";
    descriptify(this);
    this.descriptor = Object.getOwnPropertyDescriptor(this, "foo");
}

var getFunction = function() {};
var setFunction = function(val) {};
function accessor(getterProperty, setterProperty) {
    this.foo = {};
    if (getterProperty) {
        this.foo[getterProperty] = getFunction;
    }
    if (setterProperty) {
        this.foo[setterProperty] = setFunction;
    }
    descriptify(this);
    this.descriptor = Object.getOwnPropertyDescriptor(this, "foo");
}

describe("descriptify", function() {
    it("null should throw exception", function() {
        assert.throws(function() { descriptify(null); });
    });

    it("undefined should throw exception", function() {
        assert.throws(function() { descriptify(undefined); });
    });

    it("mixing descriptify and non-descriptify properties should work", function() {
        function test() {
            this.normalProperty = "foo";
            this.descriptifyProperty = {_: "bar"};
            descriptify(this);
        }
        var mix = new test();
        var normalDescriptor = Object.getOwnPropertyDescriptor(mix, "normalProperty");
        var descriptifyDescriptor = Object.getOwnPropertyDescriptor(mix, "descriptifyProperty");

        assert(normalDescriptor.configurable && normalDescriptor.enumerable && normalDescriptor.writable && normalDescriptor.value === "foo" &&
               !descriptifyDescriptor.configurable && !descriptifyDescriptor.enumerable && !descriptifyDescriptor.writable && descriptifyDescriptor.value === "bar");
    });

    it("a property that has a descriptify mapping amongst other non-descriptify mappings should be ignored.", function() {
        var propValue = {w: "foo", non_descriptify_property: "bar" };
        function test() {
            this.normalProperty = propValue;
            descriptify(this);
        }
        var obj = new test();
        var d = Object.getOwnPropertyDescriptor(obj, "normalProperty");
        assert(d.configurable && d.enumerable && d.writable && d.value === propValue);
    });

    describe("data descriptors", function() {
        it("'_' should equal !c!e!w", function() {
            var test = new data("_");
            var d = test.descriptor;
            assert(!d.configurable && !d.enumerable && !d.writable && d.value === "bar");
        });

        it("'c' should equal c!e!w", function() {
            var test = new data("c");
            var d = test.descriptor;
            assert(d.configurable && !d.enumerable && !d.writable && d.value === "bar");
        });

        it("'e' should equal !ce!w", function() {
            var test = new data("e");
            var d = test.descriptor;
            assert(!d.configurable && d.enumerable && !d.writable && d.value === "bar");
        });

        it("'w' should equal !c!ew", function() {
            var test = new data("w");
            var d = test.descriptor;
            assert(!d.configurable && !d.enumerable && d.writable && d.value === "bar");
        });

        it("'ce' should equal ce!w", function() {
            var test = new data("ce");
            var d = test.descriptor;
            assert(d.configurable && d.enumerable && !d.writable && d.value === "bar");
        });

        it("'cw' should equal c!ew", function() {
            var test = new data("cw");
            var d = test.descriptor;
            assert(d.configurable && !d.enumerable && d.writable && d.value === "bar");
        });

        it("'ew' should equal c!e!w", function() {
            var test = new data("ew");
            var d = test.descriptor;
            assert(!d.configurable && d.enumerable && d.writable && d.value === "bar");
        });

        it("'cew' should equal cew", function() {
            var test = new data("cew");
            var d = test.descriptor;
            assert(d.configurable && d.enumerable && d.writable && d.value === "bar");
        });

        it("mixing the order up: wce should equal cew", function() {
            var test = new data("wce");
            var d = test.descriptor;
            assert(d.configurable && d.enumerable && d.writable && d.value === "bar");
        });
    });

    describe("accessor descriptors", function() {
        it("'g' without a function as a value should throw error", function() {
            assert.throws(function() { new data("g"); });
        });

        it("'s' without a function as a value should throw error", function() {
            assert.throws(function() { new data("s"); });
        });

        it("'get' should equal !c!e & get", function() {
            var test = new accessor("get");
            var d = test.descriptor;
            assert(!d.configurable && !d.enumerable && d.get === getFunction);
        });

        it("'g' should equal !c!e & get", function() {
            var test = new accessor("g");
            var d = test.descriptor;
            assert(!d.configurable && !d.enumerable && d.get === getFunction);
        });

        it("'set' should equal !c!e & set", function() {
            var test = new accessor(undefined, "set");
            var d = test.descriptor;
            assert(!d.configurable && !d.enumerable && d.set === setFunction);
        });

        it("'s' should equal !c!e & set", function() {
            var test = new accessor(undefined, "s");
            var d = test.descriptor;
            assert(!d.configurable && !d.enumerable && d.set === setFunction);
        });

        it("'cg' should equal c!e & get", function() {
            var test = new accessor("cg");
            var d = test.descriptor;
            assert(d.configurable && !d.enumerable && d.get === getFunction);
        });

        it("'cs' should equal c!e & set", function() {
            var test = new accessor(undefined, "cs");
            var d = test.descriptor;
            assert(d.configurable && !d.enumerable && d.set === setFunction);
        });

        it("'eg' should equal !ce & get", function() {
            var test = new accessor("eg");
            var d = test.descriptor;
            assert(!d.configurable && d.enumerable && d.get === getFunction);
        });

        it("'es' should equal !ce & set", function() {
            var test = new accessor(undefined, "es");
            var d = test.descriptor;
            assert(!d.configurable && d.enumerable && d.set === setFunction);
        });

        it("'ceg' should equal ce & get", function() {
            var test = new accessor("ceg");
            var d = test.descriptor;
            assert(d.configurable && d.enumerable && d.get === getFunction);
        });

        it("'ces' should equal ce & set", function() {
            var test = new accessor(undefined, "ces");
            var d = test.descriptor;
            assert(d.configurable && d.enumerable && d.set === setFunction);
        });

        it("providing a g and a s should define get and set descriptors", function() {
            debugger;
            var test = new accessor("g", "se");
            var d = test.descriptor;
            assert(!d.configurable && d.enumerable && d.get === getFunction && d.set === setFunction);
        });

        it("mixing the order up: 'sce' should equal ce & set", function() {
            var test = new accessor(undefined, "ces");
            var d = test.descriptor;
            assert(d.configurable && d.enumerable && d.set === setFunction);
        });
    });

    describe("map()", function() {
        it("should throw if no value is found for the key", function() {
            assert.throws(function() {
                descriptify.map("jamal", "poopy");
            });
        });

        it("map a new value to an existing value", function() {
            descriptify.map("readonly", "_");
            var test = new data("readonly");
            var d = test.descriptor;
            assert(!d.configurable && !d.enumerable && !d.writable && d.value === "bar");
        });
    });
});
