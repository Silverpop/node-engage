
module.exports = (function() {

    var my = {};

    var fs = require('fs');

    function _validateObjectWithPrefix(defs, obj, prefix) {

        var newObj = {};
        var field, validatedField;

        for (field in defs) {

            validatedField = _validateField(prefix, field, defs[field], obj[field]);

            if (validatedField !== null) {
                newObj[validatedField.name] = validatedField.value;
            }
        }

        return newObj;
    }

    function _validateField(prefix, field, def, value) {

        var name, multiValue, i;

        if (typeof def.rename !== 'undefined') {
            name = def.rename;
        } else {
            name = field;
        }

        if (typeof value === 'undefined') {

            if (typeof def.default !== 'undefined') {
                return {name: name, value: def.default};
            }

            if (typeof def.required !== 'undefined' && def.required === true) {
                throw new TypeError("Field '" + prefix.concat([field]).join('.') + "' is required");
            }

            return null;
        }

        if (typeof def.multi !== 'undefined' && def.multi === true) {

            value = my.coerceArray(value);

            multiValue = [];

            for (i in value) {
                multiValue.push(_validateFieldAssert(prefix, field, def.assert, value[i], i));
            }

            return {name: name, value: multiValue};

        }

        return {name: name, value: _validateFieldAssert(prefix, field, def.assert, value)};
    }

    function _validateFieldAssert(prefix, field, assert, value, i) {

        if (typeof i !== 'undefined') {
            field = field + '[' + i + ']';
        }

        if (typeof assert === 'object') {
            return _validateObjectWithPrefix(assert, value, prefix.concat([field]));
        }

        if (typeof assert === 'function') {
            return assert(value, 'field ' + prefix.concat([field]).join('.'));
        }

        return value;
    }

    function _assertValue(assert, desc, val, name) {
        if (!assert(val)) {
            _failAssertion(desc, val, name);
        }
        return val;
    };

    function _failAssertion(type, val, name) {
        throw new TypeError('Value ' + (typeof name === 'undefined' ? '' : 'of ' + name) + ' must be ' + type);
    }

    my.normalizeArgs = function(options, cb) {

        var args = {
            options: options,
            cb: cb
        };

        if (typeof cb === 'undefined' && typeof options === 'function') {
            args.options = {};
            args.cb = options;
        }

        return args;
    };

    my.validateObject = function(defs, obj) {

        var newObj = null;
        var field;

        if (typeof obj === 'undefined' || obj === null || (typeof obj === 'string' && obj.match(/^\s*$/))) {
            obj = {};
        } else if (typeof obj !== 'object') {
            for (field in defs) {
                if (typeof defs[field].loneArg !== 'undefined' && defs[field].loneArg === true) {
                    newObj = {};
                    newObj[field] = obj;
                }
            }

            if (newObj === null) {
                newObj = {};
            }

            obj = newObj;
        }

        return _validateObjectWithPrefix(defs, obj, []);
    };

    my.validateCallback = function(cb) {

        if (typeof cb === 'undefined') {
            return function() {};
        }

        if (typeof cb !== 'function') {
            throw new TypeError('Invalid callback provided');
        }

        return cb;
    };

    my.isInteger = function(val) {
        return ((typeof val === 'number') && !isNaN(val) && (val % 1 === 0));
    };

    my.isBoolean = function(val) {
        return (typeof val === 'boolean');
    };

    my.isString = function(val) {
        return (typeof val === 'string');
    };

    my.isScalar = function(val) {
        return (my.isInteger(val) || my.isBoolean(val) || my.isString(val));
    };

    my.isScalarArray = function(val) {

        var i;

        if (!my.isArray(val)) {
            return false;
        }

        for (i = val.length - 1; i >= 0; --i) {
            if (!my.isScalar(val[i])) {
                return false;
            }
        }

        return true;
    };

    my.isScalarHash = function(val) {

        var key;

        if (!my.isObject(val)) {
            return false;
        }

        for (key in val) {
            if (!my.isScalar(val[key])) {
                return false;
            }
        }

        return true;
    };

    my.isObject = function(val) {
        return (typeof val === 'object');
    };

    my.isArray = function(val) {
        return (Object.prototype.toString.call(val) === '[object Array]');
    };

    my.isPositiveInteger = function(val) {
        return (my.isInteger(val) && val > 0);
    };

    my.isNonEmptyString = function(val) {
        return (my.isString(val) && (val !== ''));
    };

    my.isEngagePod = function(val) {
        return (my.isInteger(val) && val >= 0 && val <= 6);
    };

    my.isOAuthId = function(val) {
        return my.isNonEmptyString(val);
    };

    my.isReadableFile = function(val) {
        try {
            fs.accessSync(val, fs.R_OK);
        } catch (e) {
            return false;
        }
        return true;
    }

    my.assertInteger = function(val, name) {
        return _assertValue(my.isInteger, 'an integer', val, name);
    };

    my.assertBoolean = function(val, name) {
        return _assertValue(my.isBoolean, 'boolean', val, name);
    };

    my.assertString = function(val, name) {
        return _assertValue(my.isString, 'a string', val, name);
    };

    my.assertScalar = function(val, name) {
        return _assertValue(my.isScalar, 'a scalar value', val, name);
    };

    my.assertScalarArray = function(val, name) {
        return _assertValue(my.isScalarArray, 'an array of scalar values', val, name);
    };

    my.assertScalarHash = function(val, name) {
        return _assertValue(my.isScalarHash, 'a hash of scalar values', val, name);
    };

    my.assertPositiveInteger = function(val, name) {
        return _assertValue(my.isPositiveInteger, 'a positive integer', val, name);
    };

    my.assertNonEmptyString = function(val, name) {
        return _assertValue(my.isNonEmptyString, 'a non-empty string', val, name);
    };

    my.assertEngagePod = function(val, name) {
        return _assertValue(
            my.isEngagePod,
            'an Engage pod number (integer between 0-6)',
            val,
            name
        );
    };

    my.assertOAuthId = function(val, name) {
        return _assertValue(
            my.isOAuthId,
            'an OAuth id string',
            val,
            name
        );
    };

    my.assertReadableFile = function(val, name) {
        return _assertValue(my.isReadableFile, 'a readable file', val, name);
    };

    my.assertCallback = function(cb) {

        if (typeof cb !== 'function') {
            throw new TypeError('Invalid callback provided');
        }

        return cb;
    };

    my.coerceInteger = function(val, name) {

        if (my.isInteger(val)) {
            return val;
        }

        return my.assertInteger(parseInt(val, 10), name);
    };

    my.coerceBoolean = function(val, name) {

        if (my.isBoolean(val)) {
            return val;
        }

        return (my.coerceString(val, name).toLowerCase() === 'true');
    };

    my.coerceString = function(val, name) {

        if (my.isString(val)) {
            return val;
        }

        return String(val);
    };

    my.coerceIntegerOrString = function(val, name) {

        var intVal;

        if (my.isInteger(val)) {
            return val;
        };

        intVal = parseInt(val, 10);

        if (my.isInteger(intVal)) {
            return val;
        }

        return my.coerceString(val);
    }

    my.coerceArray = function(val, name) {

        if (my.isArray(val)) {
            return val;
        }

        return [val];
    };

    my.coercePositiveInteger = function(val, name) {

        var intVal;

        if (my.isPositiveInteger(val)) {
            return val;
        }

        return my.assertPositiveInteger(parseInt(val, 10), name);
    };

    return my;

})();

