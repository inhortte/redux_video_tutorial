(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function isFunction (sth) {
        // https://github.com/moment/moment/issues/2325
        return typeof sth === 'function' &&
            Object.prototype.toString.call(sth) === '[object Function]';
    }


    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    config._f = isoDates[i][0];
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    // match[6] should be 'T' or space
                    config._f += (match[6] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear, janX = createUTCDate(year, 0, 1 + week1Jan), d = janX.getUTCDay(), dayOfYear;
        if (d < firstDayOfWeek) {
            d += 7;
        }

        weekday = weekday != null ? 1 * weekday : firstDayOfWeek;

        dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             return other < this ? this : other;
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (typeof this._isDSTShifted !== 'undefined') {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        this._weekdaysParse = this._weekdaysParse || [];

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.to           = to;
    momentPrototype__proto.toNow        = toNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toObject     = toObject;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes === 1          && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   === 1          && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    === 1          && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  === 1          && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.6';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}],2:[function(require,module,exports){
// -----------------------------------
// { categoryName:
//   { interestName:
//     { source: 'facebook',
//       clicks: 5,
//       added: Date.now() },
//     ...
// -----------------------------------

module.exports = {
  staticInterests: {
    music:              { source: 'ticketpro', clicks: 31, added: Date.now(), selected: true,
                          related: 'rock music,jazz,concerts,opera' },
    "french actors":    { source: 'ticketpro', clicks: 37, added: Date.now(), selected: false,
                          related: 'drama,film' },
    actors:             { source: 'ticketpro', clicks: 35, added: Date.now(), selected: false,
                          related: 'czech film, film' },
    spirituality:       { source: 'ticketpro', clicks: 18, added: Date.now(), selected: false,
                          related: 'literature,music' },
    "czech film":       { source: 'ticketpro', clicks: 54, added: Date.now(), selected: false,
                          related: 'film,actors' },
    "rock music":       { source: 'ticketpro', clicks: 12, added: Date.now(), selected: false,
                          related: 'music' },
    "world music":      { source: 'ticketpro', clicks: 10, added: Date.now(), selected: false,
                          related: 'music' },
    jazz:               { source: 'ticketpro', clicks: 16, added: Date.now(), selected: true,
                          related: 'music' },
    technology:         { source: 'ticketpro', clicks: 19, added: Date.now(), selected: false,
                          related: 'health,science' },
    health:             { source: 'ticketpro', clicks: 20, added: Date.now(), selected: true,
                          related: 'science,dental' },
    dental:             { source: 'ticketpro', clicks: 21, added: Date.now(), selected: false,
                          related: 'health' },
    comics:             { source: 'ticketpro', clicks: 34, added: Date.now(), selected: false,
                          related: 'humor,literature' },
    humor:              { source: 'ticketpro', clicks: 10, added: Date.now(), selected: false,
                          related: 'actors,literature' },
    literature:         { source: 'ticketpro', clicks: 11, added: Date.now(), selected: false,
                          related: 'theater,comics' },
    science:            { source: 'ticketpro', clicks: 13, added: Date.now(), selected: false,
                          related: 'technology,health' },
    drama:              { source: 'ticketpro', clicks: 19, added: Date.now(), selected: false,
                          related: 'theater,film,literature' },
    theater:            { source: 'ticketpro', clicks: 20, added: Date.now(), selected: false,
                          related: 'drama,literature,opera' },
    film:               { source: 'ticketpro', clicks: 21, added: Date.now(), selected: false,
                          related: 'drama,literature,comics' },
    concerts:           { source: 'ticketpro', clicks: 30, added: Date.now(), selected: false,
                          related: 'music,theater' },
    "contemporary art": { source: 'ticketpro', clicks: 18, added: Date.now(), selected: true,
                          related: 'literature,film,theater' },
    opera:              { source: 'ticketpro', clicks: 25, added: Date.now(), selected: false,
                          related: 'music,theater' },
    fitness:            { source: 'ticketpro', clicks: 16, added: Date.now(), selected: false,
                          related: 'health,science' }
  },

  capitalize: function(s) {
    return(s[0].toUpperCase() + s.substr(1));
  },

  blinkNodes: function() {
    console.log('blinkNodes!!!!!!');
    var that = this;
    var selectedInterests = Object.keys(this.staticInterests).filter(function(interest) {
      return that.staticInterests[interest]['selected'];
    }).reduce(function(is, i) {
      is[i] = that.staticInterests[i];
      return is;
    }, {});
    var selectedInterestKeys = Object.keys(selectedInterests);
    console.log(JSON.stringify(selectedInterestKeys));

    $("*[vdnaclass]").each(function(index, el) {
      if($(el).attr('vdnaclass').split(/,/).reduce(function(showOrHide, keyword) {
        return showOrHide || (selectedInterestKeys.indexOf(keyword) > -1);
      }, false)) {
        // console.log('showing ' + $(el).attr('vdnaclass'));
        $(el).show();
      } else {
        // console.log('hiding ' + $(el).attr('vdnaclass'));
        $(el).hide();
      }
    });
  },

  /*
   addInterest: function(category, interest) {
     staticData[category][interest] = { category: category, source: 'vdna', clicks: 1, added: Date.now(), selected: true };
   },
   */

  addInterest: function(interest) {
    if(this.staticInterests[interest] !== undefined) {
      this.staticInterests[interest]['selected'] = true;
      this.blinkNodes();
      // React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
      return true;
    } else {
      return false;
    }
  },

  /*
   var addRelatedInterest = function(category, interest) {
     staticData[category][interest]['selected'] = true;
     React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
   },
   */

  addRelatedInterest: function(interest) {
    this.staticInterests[interest]['selected'] = true;
    this.blinkNodes();
    // React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
  },

  /*
   unLikeAnInterest: function(category, interest) {
     staticData[category][interest]['selected'] = false;
     React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
   },
   */

  unLikeAnInterest: function(interest) {
    this.staticInterests[interest]['selected'] = false;
    this.blinkNodes();
    // React.render(<VdnaMenu />, document.getElementById('vdnamenu'));
  }
};

},{}],3:[function(require,module,exports){
'use strict';

var Moment = require('moment');
var data = require('vdna/static_data');
// var Autocomplete = require('react-autocomplete/lib/main.js');
// var Combobox = Autocomplete.Combobox;
// var ComboboxOption = Autocomplete.ComboboxOption;

// -------------------------------------------------
// Autocomplete code
// -------------------------------------------------

var Autocomplete = React.createClass({
  displayName: 'Autocomplete',

  componentDidMount: function componentDidMount() {
    this._setInputFromValue();
    var highlightedIndex;
    var that = this;
    document.onkeydown = function (e) {
      switch (e.keyCode) {
        case 13:
          // enter.
          console.log('ENTER!');
          that.props.addLikeDone();
          break;
        case 9:
          // tab
          console.log('TAB!');
          that._setFromHighlighted();
          break;
        case 38:
          // up
          highlightedIndex = that._highlightedIndex();
          console.log('UP! ' + highlightedIndex);
          if (highlightedIndex > 0) {
            that.setState({ highlightedValue: that._currentMatches()[highlightedIndex - 1] });
          }
          break;
        case 40:
          // down
          highlightedIndex = that._highlightedIndex();
          console.log('DOWN! ' + highlightedIndex);
          if (highlightedIndex === -1) {
            that.setState({ highlightedValue: that._currentMatches()[0] });
          } else if (highlightedIndex < that._currentMatches().length - 1) {
            that.setState({ highlightedValue: that._currentMatches()[highlightedIndex + 1] });
          }
          break;
      }
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      defaultValue: 'apple',
      limitToList: true,
      maxItemsShown: 8,
      sourceUrl: null,
      defaultList: ['apple', 'banana', 'orange', 'grape', 'cherry'],
      alsoSearchValues: false,
      loadUrlOnce: true,
      selectAllTextOnClick: true,
      onNoMatch: function onNoMatch(state) {}
    };
  },
  getInitialState: function getInitialState() {
    return {
      list: this.props.defaultList,
      currentValue: this.props.defaultValue,
      highlightedValue: this.props.defaultValue,
      showEntries: false
    };
  },
  render: function render() {
    var entries = this.state.showEntries ? React.createElement(
      'ol',
      { style: { position: 'absolute', backgroundColor: 'white', color: 'black', listStyle: 'none', padding: 0, margin: 0 }, onMouseLeave: this._onEntryMouseOut },
      this._renderMatches()
    ) : '';
    return React.createElement(
      'div',
      null,
      React.createElement('input', { id: this.props.inputId, className: this.props.className, ref: 'autoInput', onChange: this._onChange, onFocus: this._onFocus, onBlur: this._onBlur, onClick: this._onInputClick }),
      entries
    );
  },
  _currentMatches: function _currentMatches() {
    var that = this;
    var cm = this.state.list.filter(function (entry) {
      return entry.indexOf(that._input()) > -1;
    });
    return cm;
  },
  _input: function _input() {
    if (!this.isMounted()) {
      return '';
    } else {
      return React.findDOMNode(this.refs.autoInput).value;
    }
  },
  _renderMatches: function _renderMatches() {
    var that = this;
    return this._currentMatches().slice(0, this.props.maxItemsShown).map(function (entry, index) {
      return React.createElement(AutocompleteEntry, { highlighted: entry === that.state.highlightedValue, key: entry, value: entry, onEntryClick: that._onEntryClick, onEntryMouseOver: that._onEntryMouseOver });
    });
  },
  _highlightedIndex: function _highlightedIndex() {
    var that = this;
    var foundIndex = -1;
    this._currentMatches().forEach(function (entry, index) {
      if (entry === that.state.highlightedValue) {
        foundIndex = index;
      }
    });
    return foundIndex;
  },
  _updateHighlightedValue: function _updateHighlightedValue() {
    var newValue;
    var highlightedIndex = this._highlightedIndex();
    if (highlightedIndex < 0) {
      newValue = this.state.list[0];
    } else {
      newValue = this.state.list[highlightedIndex];
    }
    this.setState({ highlightedValue: newValue });
  },
  _setInputFromValue: function _setInputFromValue() {
    React.findDOMNode(this.refs.autoInput).value = this.state.currentValue;
  },
  _setValueFromInput: function _setValueFromInput() {
    var inputText = React.findDOMNode(this.refs.autoInput).value;
    var foundEntries = this.state.list.filter(function (entry) {
      return entry.indexOf(inputText) > -1;
    });
    if (foundEntries.length > 0) {
      this.setState({
        currentValue: foundEntries[0],
        highlightedValue: foundEntries[0]
      });
    } else {
      this.props.onNoMatch(this.state);
      if (this.props.limitToList) {
        this.setState({
          currentValue: this.props.defaultValue,
          highlightedValue: this.props.defaultValue
        });
      }
    }
  },
  _setFromHighlighted: function _setFromHighlighted() {
    this.setState({
      currentValue: this.state.highlightedValue
    }, function () {
      this._setInputFromValue();
    });
  },
  _onChange: function _onChange() {
    this._setValueFromInput();
  },
  _onFocus: function _onFocus() {
    this.setState({ showEntries: true });
  },
  _onBlur: function _onBlur() {
    this._setFromHighlighted();
    this.setState({ showEntries: false });
  },
  _onEntryClick: function _onEntryClick(entry) {
    this.setState({
      currentValue: entry
    }, function () {
      this._setInputFromValue();
    });
  },
  _onEntryMouseOver: function _onEntryMouseOver(entry) {
    this.setState({ highlightedValue: entry });
  },
  _onEntryMouseOut: function _onEntryMouseOut(entry) {
    this.setState({ highlightedValue: this.currentValue });
  },
  _onInputClick: function _onInputClick() {
    React.findDOMNode(this.refs.autoInput).select();
  }
});

var AutocompleteEntry = React.createClass({
  displayName: 'AutocompleteEntry',

  getInitialState: function getInitialState() {
    return { hover: false };
  },
  _onClick: function _onClick() {
    this.props.onEntryClick(this.props.value);
  },
  _onMouseOver: function _onMouseOver() {
    this.props.onEntryMouseOver(this.props.value);
  },
  render: function render() {
    return React.createElement(
      'li',
      { style: { backgroundColor: this.props.highlighted ? 'hsl(90, 50%, 50%)' : '', zIndex: 9999, cursor: 'pointer' }, onMouseDown: this._onClick, onMouseOver: this._onMouseOver },
      this.props.value
    );
  }
});

// ---------------
// end Autocomplete
// ---------------

function reRender() {
  React.render(React.createElement(VdnaMenu, { tabList: tabList }), document.getElementById('vdnamenu'));
};

var tabList = [{ id: 1, href: 'profile', text: 'Edit My Profile', selected: true }, { id: 2, href: 'notifications', text: 'View Notifications', selected: false }, { id: 3, href: 'import', text: 'Import and Sync', selected: false }, { id: 4, href: 'settings', text: 'Change Settings', selected: false }, { id: 5, href: 'privacy', text: 'Privacy', selected: false }, { id: 6, href: 'about', text: 'About', selected: false }];

var VdnaMenu = React.createClass({
  displayName: 'VdnaMenu',

  getInitialState: function getInitialState() {
    return {
      tabList: this.props.tabList,
      currentTab: 1
    };
  },
  changeTab: function changeTab(tabId) {
    var newTabList = tabList.map(function (tab) {
      tab.selected = tab.id === tabId;
      return tab;
    });
    this.setState({
      tabList: newTabList,
      currentTab: tabId
    });
  },
  render: function render() {
    var tabContent;
    switch (this.state.currentTab) {
      case 1:
        tabContent = React.createElement(MyProfile, null);
        break;
      case 2:
        tabContent = React.createElement(Notifications, null);
        break;
      case 3:
        tabContent = React.createElement(Import, null);
        break;
      case 4:
        tabContent = React.createElement(Settings, null);
        break;
      case 5:
        tabContent = React.createElement(Privacy, null);
        break;
      case 6:
        tabContent = React.createElement(About, null);
        break;
      default:
        tabContent = React.createElement(MyProfile, null);
    }
    return React.createElement(
      'section',
      { className: 'vdna' },
      React.createElement(
        'div',
        { className: 'vdna-body' },
        React.createElement(
          'div',
          { className: 'container' },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(Tabs, { tabList: this.state.tabList, changeTab: this.changeTab }),
            React.createElement(
              'div',
              { className: 'main-content col-xs-8 col-xs-offset-4 col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2' },
              React.createElement(
                'div',
                { className: 'tab-content' },
                tabContent
              )
            )
          )
        ),
        React.createElement(CloseVdna, null)
      )
    );
  }
});

var OpenVdna = React.createClass({
  displayName: 'OpenVdna',

  handleClick: function handleClick() {
    $("#vdnamenu").show();
    $("#openVdna").hide();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'span',
        { 'data-toggle': 'tooltip', title: 'Click to open VDNA', id: 'openVdna', className: 'btn btn-sm btn-primary openVdna', onClick: this.handleClick },
        'Open vDNA'
      )
    );
  }
});

var CloseVdna = React.createClass({
  displayName: 'CloseVdna',

  handleClick: function handleClick() {
    $("#vdnamenu").hide();
    $("#openVdna").show();
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'span',
        { 'data-toggle': 'tooltip', title: 'Click to close', className: 'closeVdna', style: { cursor: 'pointer' }, onClick: this.handleClick },
        React.createElement('span', { className: 'fa fa-power-off' })
      )
    );
  }
});

var Tabs = React.createClass({
  displayName: 'Tabs',

  render: function render() {
    var that = this;
    var tabListNodes = this.props.tabList.map(function (tab, index) {
      return React.createElement(Tab, { changeTab: that.props.changeTab, key: tab.href, id: tab.href, tab: tab });
    });
    return React.createElement(
      'div',
      { className: 'sidebar col-xs-4 col-sm-3 col-lg-2' },
      React.createElement(
        'nav',
        { className: 'navbar navbar-default', role: 'navigation' },
        React.createElement(
          'ul',
          { className: 'nav navbar-nav', role: 'tablist' },
          tabListNodes
        )
      )
    );
  }
});

var Tab = React.createClass({
  displayName: 'Tab',

  handleClick: function handleClick() {
    this.props.changeTab(this.props.tab.id);
  },
  render: function render() {
    return React.createElement(
      'li',
      { role: 'presentation', className: this.props.tab.selected ? 'active' : '' },
      React.createElement(
        'a',
        { href: this.props.tab.href, 'aria-controls': this.props.tab.href, role: 'tab', 'data-toggle': 'tab', onClick: this.handleClick },
        this.props.tab.text
      )
    );
  }
});

var MyProfileHeader = React.createClass({
  displayName: 'MyProfileHeader',

  render: function render() {
    return React.createElement(
      'header',
      { className: 'page-header' },
      React.createElement(
        'div',
        { className: 'media' },
        React.createElement(
          'div',
          { className: 'media-left' },
          React.createElement('span', { className: 'fa fa-2x fa-user' })
        ),
        React.createElement(
          'div',
          { className: 'media-body' },
          React.createElement(
            'h1',
            { className: 'media-heading' },
            'Your profile ',
            React.createElement(
              'small',
              null,
              'at'
            ),
            ' [site.com]'
          )
        )
      )
    );
  }
});

var MyProfileCategories = React.createClass({
  displayName: 'MyProfileCategories',

  handleChange: function handleChange() {
    console.log(React.findDOMNode(this.refs.category).value);
    this.props.getCategoryOnChange(React.findDOMNode(this.refs.category).value);
  },
  getInitialState: function getInitialState() {
    return {
      categories: this.props.categories
    };
  },
  render: function render() {
    var that = this;
    var categoryNodes = this.state.categories.map(function (category) {
      return React.createElement(MyProfileCategory, { category: category });
    });
    return React.createElement(
      'div',
      { className: 'form-group form-group-sm' },
      React.createElement(
        'label',
        { htmlFor: 'category', className: 'col-sm-2 control-label' },
        'Category'
      ),
      React.createElement(
        'div',
        { className: 'col-sm-10' },
        React.createElement(
          'select',
          { className: 'selectpicker', id: 'category', ref: 'category', onChange: this.handleChange },
          categoryNodes
        )
      )
    );
  }
});

var MyProfileCategory = React.createClass({
  displayName: 'MyProfileCategory',

  render: function render() {
    return React.createElement(
      'option',
      { value: this.props.category, ref: this.props.category },
      data.capitalize(this.props.category)
    );
  }
});

var MyProfilePrivacy = React.createClass({
  displayName: 'MyProfilePrivacy',

  componentDidMount: function componentDidMount() {
    $("#privacySettingSlider").slider({ min: 1, max: 5, step: 1, value: 3 });
    $("#privacySettingSlider").on("slide", function (n) {
      n.value === 1 ? $("#privacySettingSliderVal").text("20") : n.value === 2 ? $("#privacySettingSliderVal").text("40") : n.value === 3 ? $("#privacySettingSliderVal").text("60") : n.value === 4 ? $("#privacySettingSliderVal").text("80") : n.value === 5 && $("#privacySettingSliderVal").text("100");
    });
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'form-group form-group-sm' },
      React.createElement(
        'label',
        { htmlFor: 'inputEmail3', className: 'col-sm-2 control-label' },
        'Privacy'
      ),
      React.createElement(
        'div',
        { className: 'col-sm-6' },
        React.createElement('input', { id: 'privacySettingSlider', type: 'text' })
      ),
      React.createElement(
        'div',
        { className: 'col-sm-2' },
        'Sharing ',
        React.createElement(
          'span',
          { id: 'privacySettingSliderVal' },
          '60'
        ),
        '%'
      )
    );
  }
});

var MyProfileInterests = React.createClass({
  displayName: 'MyProfileInterests',

  showDetails: function showDetails(interest, details) {
    console.log(interest + ": " + JSON.stringify(details));
    this.setState({ currentInterest: interest, currentDetails: details });
  },
  getInitialState: function getInitialState() {
    return { currentInterest: null,
      currentDetails: {},
      addInterestCollapsed: true };
  },
  componentDidMount: function componentDidMount() {
    data.blinkNodes();
  },
  showAddLike: function showAddLike() {
    this.setState({ addInterestCollapsed: false });
  },
  hideAddLike: function hideAddLike() {
    this.setState({ addInterestCollapsed: true });
  },
  render: function render() {
    var that = this;
    var currentInterests = Object.keys(this.props.interests).reduce(function (is, i) {
      if (that.props.interests[i]['selected']) {
        is[i] = that.props.interests[i];
      }
      return is;
    }, {});
    var interestNodes = Object.keys(this.props.interests).filter(function (interest) {
      return that.props.interests[interest]['selected'];
    }).map(function (interest) {
      return React.createElement(MyProfileInterest, { key: interest, interest: interest, showDetails: that.showDetails.bind(that, interest, that.props.interests[interest]) });
    });
    /*
    var relatedInterests = Object.keys(this.props.interests).filter(function(interest) {
      return !that.props.interests[interest]['selected'];
    });
     */
    var relatedInterests = this.state.currentInterest ? this.state.currentDetails['related'].split(/,/) : [];
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'form-group form-group-sm' },
        React.createElement(
          'label',
          { className: 'col-sm-2 control-label' },
          'Interests'
        ),
        React.createElement(
          'div',
          { className: 'col-sm-6' },
          React.createElement(
            'div',
            { className: 'panel panel-interests' },
            React.createElement(
              'div',
              { className: 'panel-body' },
              interestNodes
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'col-sm-4 col-bottom' },
          React.createElement(
            'button',
            { type: 'submit', className: 'btn btn-sm btn-default' },
            'Import'
          ),
          React.createElement(
            'button',
            { id: 'addLike', onClick: this.showAddLike, type: 'submit', role: 'button', className: 'btn btn-sm btn-success', 'aria-expanded': 'false', 'aria-controls': 'addLike' },
            React.createElement('span', { className: 'glyphicon glyphicon-plus' }),
            ' Add'
          )
        )
      ),
      React.createElement(MyProfileAddAnInterest, { interests: currentInterests, collapse: this.state.addInterestCollapsed, hideAddLike: this.hideAddLike }),
      React.createElement(MyProfileLikeDetails, { currentInterest: this.state.currentInterest, currentDetails: this.state.currentDetails, relatedInterests: relatedInterests, collapse: false })
    );
  }
});

var MyProfileInterest = React.createClass({
  displayName: 'MyProfileInterest',

  handleClick: function handleClick() {
    this.props.showDetails();
  },
  render: function render() {
    return React.createElement(
      'span',
      { className: 'btn btn-sm btn-default', ref: 'interestSpan', title: this.props.interest, key: this.props.interest, role: 'button', onClick: this.handleClick },
      data.capitalize(this.props.interest)
    );
  }
});

var MyProfileAddAnInterest = React.createClass({
  displayName: 'MyProfileAddAnInterest',

  render: function render() {
    var currentInterestKeys = Object.keys(this.props.interests);
    var availableInterestKeys = Object.keys(data.staticInterests).filter(function (interestKey) {
      return currentInterestKeys.indexOf(interestKey) == -1;
    });
    var baseDivStyles = ['form-group', 'form-group-sm'];
    var availableInterestNodes = availableInterestKeys.map(function (interest) {
      return React.createElement(MyProfileAvailableInterest, { availableInterest: interest });
    });
    if (this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    return React.createElement(
      'div',
      { className: baseDivStyles.join(' '), id: 'addAnInterest' },
      React.createElement(
        'label',
        { className: 'col-sm-2 control-label' },
        'Add a like'
      ),
      React.createElement(
        'div',
        { className: 'col-sm-6' },
        availableInterestNodes
      )
    );
  }
});

var MyProfileAvailableInterest = React.createClass({
  displayName: 'MyProfileAvailableInterest',

  addInterest: function addInterest() {
    data.addInterest(this.props.availableInterest);
    reRender();
  },
  render: function render() {
    return React.createElement(
      'span',
      { className: 'btn btn-sm btn-default', ref: 'interestSpan', title: this.props.availableInterest, key: this.props.availableInterest, role: 'button', onClick: this.addInterest },
      data.capitalize(this.props.availableInterest)
    );
  }
});

/* It's quite a pity to have to comment this out...
var MyProfileAddAnInterest = React.createClass({
  addLikeDone: function() {
    console.log($("#addInterestInput").val());
    if(data.addInterest($("#addInterestInput").val())) {
      this.props.hideAddLike();
    }
    $("#addInterestInput").val("");
    reRender();
  },
  render: function() {
    var currentInterestKeys = Object.keys(this.props.interests);
    console.log('current interests: ' + JSON.stringify(currentInterestKeys));
    var availableInterestKeys = Object.keys(data.staticInterests).filter(function(interestKey) {
      return currentInterestKeys.indexOf(interestKey) == -1;
    });
    console.log('available interests: ' + JSON.stringify(availableInterestKeys));
    var baseDivStyles = ['form-group', 'form-group-sm'];
    if(this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    console.log('Add a like: "' + baseDivStyles.join(' ') + '"');
    return (
      <div className={baseDivStyles.join(' ')} id="addAnInterest">
        <label className="col-sm-2 control-label">Add a like</label>
        <div className="col-sm-6">
          <Autocomplete inputId="addInterestInput" defaultValue={''} defaultList={availableInterestKeys} className="form-control" addLikeDone={this.addLikeDone} />
        </div>
        <div className="col-sm-2">
          <button type="button" className="btn btn-sm btn-default" onClick={this.addLikeDone}>Done</button>
        </div>
      </div>
    );
  }
});
*/

var MyProfileLikeDetails = React.createClass({
  displayName: 'MyProfileLikeDetails',

  removeInterest: function removeInterest() {
    // data.unLikeAnInterest(this.props.category, this.props.currentInterest);
    data.unLikeAnInterest(this.props.currentInterest);
    reRender();
  },
  render: function render() {
    var that = this;
    var relatedInterestNodes = this.props.relatedInterests.map(function (interest) {
      return(
        // <MyProfileRelatedInterest category={that.props.category} relatedInterest={interest} />
        React.createElement(MyProfileRelatedInterest, { relatedInterest: interest })
      );
    });
    var baseDivStyles = ['form-group', 'form-group-sm'];
    if (this.props.collapse) {
      baseDivStyles.push('collapse');
    }
    var html;
    if (this.props.currentInterest) {
      html = React.createElement(
        'div',
        { className: baseDivStyles.join(' '), id: 'likeDetails' },
        React.createElement(
          'div',
          { className: 'col-sm-6 col-sm-offset-2' },
          React.createElement(
            'div',
            { className: 'well well-sm' },
            React.createElement(
              'div',
              { className: 'row' },
              React.createElement(
                'div',
                { className: 'col-xs-4' },
                React.createElement(
                  'button',
                  { type: 'button', className: 'btn btn-sm btn-primary' },
                  this.props.currentInterest
                )
              ),
              React.createElement(
                'div',
                { className: 'col-xs-8' },
                React.createElement(
                  'ul',
                  { className: 'list-inline' },
                  React.createElement(
                    'li',
                    null,
                    React.createElement(
                      'small',
                      null,
                      React.createElement(
                        'strong',
                        null,
                        'Total clicks:'
                      ),
                      ' ',
                      this.props.currentDetails['clicks']
                    )
                  ),
                  React.createElement(
                    'li',
                    null,
                    React.createElement(
                      'small',
                      null,
                      React.createElement(
                        'strong',
                        null,
                        'Source:'
                      ),
                      ' Imported from ',
                      data.capitalize(this.props.currentDetails['source']),
                      React.createElement('br', null),
                      'Added on ',
                      Moment(this.props.currentDetails['added']).format("DD MMM YYYY")
                    )
                  )
                )
              )
            )
          ),
          React.createElement(
            'p',
            null,
            React.createElement(
              'strong',
              null,
              'Related interests:'
            ),
            relatedInterestNodes
          )
        ),
        React.createElement(
          'div',
          { className: 'col-sm-4' },
          React.createElement(
            'button',
            { type: 'submit', role: 'button', className: 'btn btn-sm btn-default remove-like', 'aria-expanded': 'true', 'aria-controls': 'removeLike', onClick: this.removeInterest },
            'Remove'
          )
        )
      );
    } else {
      html = React.createElement('div', { className: baseDivStyles.join(' '), id: 'likeDetails' });
    }
    return React.createElement(
      'div',
      null,
      html
    );
  }
});

var MyProfileRelatedInterest = React.createClass({
  displayName: 'MyProfileRelatedInterest',

  addInterest: function addInterest() {
    // data.addRelatedInterest(this.props.category, this.props.relatedInterest);
    data.addRelatedInterest(this.props.relatedInterest);
    reRender();
  },
  render: function render() {
    return React.createElement(
      'span',
      { className: 'btn btn-sm btn-default', ref: 'interestSpan', title: this.props.relatedInterest, key: this.props.relatedInterest, role: 'button', onClick: this.addInterest },
      data.capitalize(this.props.relatedInterest)
    );
  }
});

var MyProfile = React.createClass({
  displayName: 'MyProfile',

  getInitialState: function getInitialState() {
    return {
      // category: Object.keys(staticData)[0],
      // interests: staticData[Object.keys(staticData)[0]]
      interests: data.staticInterests
    };
  },
  getCategoryOnChange: function getCategoryOnChange(category) {
    console.log(JSON.stringify(data.staticData[category]));
    this.setState({ category: category,
      interests: data.staticData[category] });
  },
  render: function render() {
    return React.createElement(
      'div',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'profile' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(MyProfileHeader, null),
        React.createElement(
          'div',
          { className: 'form-horizontal' },
          React.createElement(MyProfilePrivacy, null),
          React.createElement(MyProfileInterests, { interests: this.state.interests, setInterests: this.setInterests })
        )
      )
    );
  }
});

var Notifications = React.createClass({
  displayName: 'Notifications',

  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'notifications' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement(
            'h1',
            null,
            'Notifications ',
            React.createElement(
              'small',
              null,
              'from'
            ),
            ' [site.com]'
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-12' },
            React.createElement(
              'table',
              { className: 'table table-notifications' },
              React.createElement(
                'thead',
                null,
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'th',
                    { colSpan: '2' },
                    React.createElement(
                      'p',
                      null,
                      'Site.com has requested to add following interests to your profile.',
                      React.createElement('br', null),
                      React.createElement(
                        'small',
                        null,
                        'See ',
                        React.createElement(
                          'a',
                          { href: '#' },
                          'settings'
                        ),
                        ' to change the default behavior for this window.'
                      )
                    )
                  ),
                  React.createElement(
                    'th',
                    null,
                    React.createElement(
                      'nav',
                      { className: 'table-filter text-right' },
                      React.createElement(
                        'ul',
                        { className: 'list-inline' },
                        React.createElement(
                          'li',
                          { className: 'text-muted' },
                          'Show:'
                        ),
                        React.createElement(
                          'li',
                          null,
                          React.createElement(
                            'a',
                            { href: '#' },
                            'Pending'
                          )
                        ),
                        React.createElement(
                          'li',
                          null,
                          React.createElement(
                            'a',
                            { href: '#' },
                            'Accepted'
                          )
                        ),
                        React.createElement(
                          'li',
                          null,
                          React.createElement(
                            'a',
                            { href: '#' },
                            'Rejected'
                          )
                        ),
                        React.createElement(
                          'li',
                          { className: 'active' },
                          React.createElement(
                            'a',
                            { href: '#' },
                            'All'
                          )
                        )
                      )
                    )
                  )
                )
              ),
              React.createElement(
                'tbody',
                null,
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'th',
                    { scope: 'row' },
                    React.createElement(
                      'span',
                      { className: 'btn btn btn-sm btn-default' },
                      'Tennis'
                    )
                  ),
                  React.createElement(
                    'td',
                    null,
                    React.createElement(
                      'ul',
                      { className: 'list-inline' },
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Category: ',
                          React.createElement(
                            'strong',
                            null,
                            'Sports'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Source: Imported from ',
                          React.createElement(
                            'strong',
                            null,
                            'Facebook'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Requested on @DateTime.Now'
                        )
                      )
                    )
                  ),
                  React.createElement(
                    'td',
                    { className: 'text-right' },
                    React.createElement(
                      'div',
                      { className: 'btn-group', role: 'group', 'aria-label': '...' },
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-success' },
                        React.createElement('span', { className: 'fa fa-check' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Approve'
                        )
                      ),
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-danger' },
                        React.createElement('span', { className: 'fa fa-remove' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Remove'
                        )
                      )
                    )
                  )
                ),
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'th',
                    { scope: 'row' },
                    React.createElement(
                      'span',
                      { className: 'btn btn-sm btn-default' },
                      'Skiing'
                    )
                  ),
                  React.createElement(
                    'td',
                    null,
                    React.createElement(
                      'ul',
                      { className: 'list-inline' },
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Category: ',
                          React.createElement(
                            'strong',
                            null,
                            'Sports'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Source: Imported from ',
                          React.createElement(
                            'strong',
                            null,
                            'Facebook'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Requested on @DateTime.Now'
                        )
                      )
                    )
                  ),
                  React.createElement(
                    'td',
                    { className: 'text-right' },
                    React.createElement(
                      'div',
                      { className: 'btn-group', role: 'group', 'aria-label': '...' },
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-success' },
                        React.createElement('span', { className: 'fa fa-check' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Approve'
                        )
                      ),
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-danger' },
                        React.createElement('span', { className: 'fa fa-remove' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Remove'
                        )
                      )
                    )
                  )
                ),
                React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'th',
                    { scope: 'row' },
                    React.createElement(
                      'span',
                      { className: 'btn btn btn-sm btn-default' },
                      'Windsurfing'
                    )
                  ),
                  React.createElement(
                    'td',
                    null,
                    React.createElement(
                      'ul',
                      { className: 'list-inline' },
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Category: ',
                          React.createElement(
                            'strong',
                            null,
                            'Sports'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Source: Imported from ',
                          React.createElement(
                            'strong',
                            null,
                            'Facebook'
                          )
                        )
                      ),
                      React.createElement(
                        'li',
                        null,
                        React.createElement(
                          'small',
                          null,
                          'Requested on @DateTime.Now'
                        )
                      )
                    )
                  ),
                  React.createElement(
                    'td',
                    { className: 'text-right' },
                    React.createElement(
                      'div',
                      { className: 'btn-group', role: 'group', 'aria-label': '...' },
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-success' },
                        React.createElement('span', { className: 'fa fa-check' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Approve'
                        )
                      ),
                      React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-link btn-danger' },
                        React.createElement('span', { className: 'fa fa-remove' }),
                        React.createElement(
                          'span',
                          { className: 'hidden-xs' },
                          'Remove'
                        )
                      )
                    )
                  )
                )
              )
            ),
            React.createElement(
              'nav',
              { className: 'text-right' },
              React.createElement(
                'ul',
                { className: 'pagination' },
                React.createElement(
                  'li',
                  { className: 'disabled' },
                  React.createElement(
                    'a',
                    { 'aria-label': 'Previous', href: '#' },
                    React.createElement(
                      'span',
                      { 'aria-hidden': 'true' },
                      '« Previous'
                    )
                  )
                ),
                React.createElement(
                  'li',
                  { className: 'active' },
                  React.createElement(
                    'a',
                    { href: '#' },
                    '1 ',
                    React.createElement(
                      'span',
                      { className: 'sr-only' },
                      '(current)'
                    )
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { href: '#' },
                    '2'
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { href: '#' },
                    '3'
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { href: '#' },
                    '4'
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { href: '#' },
                    '5'
                  )
                ),
                React.createElement(
                  'li',
                  null,
                  React.createElement(
                    'a',
                    { 'aria-label': 'Next', href: '#' },
                    React.createElement(
                      'span',
                      { 'aria-hidden': 'true' },
                      'Next »'
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }
});

var Import = React.createClass({
  displayName: 'Import',

  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'import' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement(
            'h3',
            null,
            '...your interests across apps and devices.'
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-6 col-lg-4' },
            React.createElement(
              'p',
              { className: 'lead' },
              'Connect with Facebook!'
            ),
            React.createElement(
              'div',
              { className: 'pull-left' },
              React.createElement(
                'strong',
                null,
                'Last sync:'
              ),
              ' 25 interests (5 new)',
              React.createElement('br', null),
              React.createElement(
                'strong',
                null,
                'Last synced on:'
              ),
              ' @DateTime.Now'
            ),
            React.createElement(
              'a',
              { href: '#', className: 'btn btn-sm btn-default pull-right' },
              'Connect'
            )
          ),
          React.createElement(
            'div',
            { className: 'col-xs-6 col-lg-4 col-lg-offset-1' },
            React.createElement(
              'p',
              { className: 'lead' },
              'Import your pins from Pinterest!'
            ),
            React.createElement(
              'div',
              { className: 'pull-left' },
              React.createElement(
                'strong',
                null,
                'Last sync:'
              ),
              ' 25 interests (5 new)',
              React.createElement('br', null),
              React.createElement(
                'strong',
                null,
                'Last synced on:'
              ),
              ' @DateTime.Now'
            ),
            React.createElement(
              'a',
              { href: '#', className: 'btn btn-sm btn-default pull-right' },
              'Import'
            )
          )
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-12 col-lg-9' },
            React.createElement(
              'h3',
              null,
              'Try your app!'
            ),
            React.createElement(
              'p',
              null,
              'Like controlling the web??? We thought so. Our nifty app lets you take it to the next level and puts all your internet-wide preferences in one central place so you can quickly and easily view and accept your notifications with a few steps.'
            ),
            React.createElement(
              'div',
              { className: 'pull-left' },
              React.createElement(
                'a',
                { href: '#', className: 'btn btn-sm btn-default' },
                'download for android'
              ),
              React.createElement(
                'a',
                { href: '#', className: 'btn btn-sm btn-default' },
                'download for iphone'
              )
            ),
            React.createElement(
              'div',
              { className: 'pull-right' },
              'Got an app? Now ',
              React.createElement(
                'a',
                { href: '#', className: 'btn btn-sm btn-default' },
                'Generate a sync code!'
              )
            )
          )
        )
      )
    );
  }
});

var Settings = React.createClass({
  displayName: 'Settings',

  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'settings' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement(
            'h1',
            null,
            'Settings ',
            React.createElement(
              'small',
              null,
              'on'
            ),
            ' [site.com]'
          ),
          React.createElement(
            'p',
            null,
            'You are in control! Change your settings here.'
          )
        ),
        React.createElement(
          'div',
          { className: 'form-horizontal' },
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'label',
              { htmlFor: 'personalization', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Personalization'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              React.createElement('input', { type: 'checkbox', name: 'personalization', className: 'switch' })
            )
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'label',
              { htmlFor: 'sorting', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Sorting'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              React.createElement(
                'select',
                { 'class': 'selectpicker', id: 'sorting' },
                React.createElement(
                  'option',
                  null,
                  'Your interests'
                ),
                React.createElement(
                  'option',
                  null,
                  'Site default'
                )
              )
            )
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'label',
              { htmlFor: 'autosave', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Autosave'
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              React.createElement('input', { type: 'checkbox', name: 'autosave', className: 'switch' })
            )
          ),
          React.createElement('hr', null),
          React.createElement(
            'div',
            { className: 'form-group form-group-sm' },
            React.createElement(
              'label',
              { htmlFor: 'delete', className: 'col-xs-7 col-sm-5 col-md-4 col-lg-3 control-label' },
              'Delete my profile ',
              React.createElement(
                'small',
                null,
                'at'
              ),
              ' ',
              React.createElement(
                'i',
                null,
                '[site.com]'
              )
            ),
            React.createElement(
              'div',
              { className: 'col-xs-5 col-sm-7 col-md-8 col-lg-9' },
              React.createElement(
                'a',
                { href: '#', className: 'btn btn-sm btn-danger' },
                'Delete'
              )
            )
          )
        )
      )
    );
  }
});

var Privacy = React.createClass({
  displayName: 'Privacy',

  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'privacy' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement(
            'h1',
            null,
            'Privacy'
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-10' },
            React.createElement(
              'p',
              { className: 'lead' },
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.'
            ),
            React.createElement(
              'p',
              null,
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.'
            )
          )
        )
      )
    );
  }
});

var About = React.createClass({
  displayName: 'About',

  render: function render() {
    return React.createElement(
      'section',
      { role: 'tabpanel', className: 'tab-pane fade active in', id: 'about' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'header',
          { className: 'page-header' },
          React.createElement('img', { src: '/images/logo-zivter.png', alt: '' })
        )
      )
    );
  }
});

reRender();

/*
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <link rel="stylesheet" type="text/css" href="Content/vdna.min.css">
    <script type="text/javascript" src="Scripts/modernizr-2.6.2.js"></script>
  </head>
  <body>

    <!-- vdna app -->
    <section class="vdna">
      <div class="vdna-body">

	<!-- container -->
	<div class="container">
	  <div class="row">

	    <!-- sidebar ----------------------------------------------------------------------------------------->
	    <div class="sidebar col-xs-4 col-sm-3 col-lg-2">

	    </div><!-- /sidebar ---------------------------------------------------------------------------------->

	    <!-- main content -->
	    <div class="main-content col-xs-8 col-xs-offset-4 col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2">
	      <div class="tab-content">

		<!-- section: my profile ------------------------------------------------------>

		    </div><!-- /my profile form -->

		  </div>
		</section><!-- /section: my profile -------------------------------------------->

		<!-- section: notifications ------------------------------------------------------>
                <!-- /section: notifications ----------------------------------------------------->

		<!-- section: import ----------------------------------------------------------------->
                <!-- /section: import ---------------------------------------------------------------->

		<!-- section: settings ------------------------------------------------------------------>
                <!-- section: settings ------------------------------------------------------------------>

		<!-- section: privacy ---------------------------------------------------------------------->
                <!-- /section: privacy ------------------------------------------------------------------->

		<!-- section: about ------------------------------------------------------------------------->
                <!-- /section: about ---------------------------------------------------------------------->

	      </div>
	    </div><!-- /main content -->

	  </div>

	  <!-- close app -->
	  <a href="#closeVdna" data-toggle="tooltip" title="Click to close" class="closeVdna"><span class="fa fa-power-off"></span></a>

	</div><!-- /container -->

	<!-- open app -->
	<a href="#openVdna" data-toggle="tooltip" title="Click to open VDNA" class="btn btn-sm btn-primary openVdna">Open vDNA</a>
      </div>
    </section><!-- /vdna app -->

    <!-- Website placeholder -->
    <img src="Content/images/ticketpro.png" alt="" />

    <!-- Scripts -->
    <script type="text/javascript" src="Scripts/bundles/jquery.js"></script>
    <script type="text/javascript" src="Scripts/bundles/bootstrap.js"></script>
    <script type="text/javascript" src="Scripts/bundles/vdna.js"></script>

  </body>
</html>
*/
/* <OpenVdna /> */ /*<strong>Category:</strong> {data.capitalize(this.props.currentDetails['category'])}<br />*/ /*<MyProfileCategories categories={Object.keys(data.staticData)} getCategoryOnChange={this.getCategoryOnChange} />*/ /*<MyProfileInterests category={this.state.category} interests={this.state.interests} setInterests={this.setInterests} />*/


},{"moment":1,"vdna/static_data":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9tb21lbnQvbW9tZW50LmpzIiwiL2hvbWUvcG9sYXJpcy9ydW1tYWdpbmdfcm91bmQvbm9kZS5qcy90cC1yZWFjdC9ub2RlX21vZHVsZXMvdmRuYS9zdGF0aWNfZGF0YS5qcyIsIi9ob21lL3BvbGFyaXMvcnVtbWFnaW5nX3JvdW5kL25vZGUuanMvdHAtcmVhY3QvcHVibGljL2pzL3ZkbmFtZW51LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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RUFBRTtRQUMxQixLQUFLLENBQUMsYUFBYTtVQUNqQixRQUFRO1VBQ1IsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFO1VBQzVCLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLHlCQUF5QixFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQztTQUN4RTtPQUNGO0tBQ0YsQ0FBQztHQUNIO0FBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUgsUUFBUSxFQUFFLENBQUM7O0FBRVg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztFQUVFO0FBQ0Ysa0JBQWtCLENBQUMsNkZBQTZGLENBQUMsb0hBQW9ILENBQUMsMkhBQTJIO0FBQ2pXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vISBtb21lbnQuanNcbi8vISB2ZXJzaW9uIDogMi4xMC42XG4vLyEgYXV0aG9ycyA6IFRpbSBXb29kLCBJc2tyZW4gQ2hlcm5ldiwgTW9tZW50LmpzIGNvbnRyaWJ1dG9yc1xuLy8hIGxpY2Vuc2UgOiBNSVRcbi8vISBtb21lbnRqcy5jb21cblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgICBnbG9iYWwubW9tZW50ID0gZmFjdG9yeSgpXG59KHRoaXMsIGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGhvb2tDYWxsYmFjaztcblxuICAgIGZ1bmN0aW9uIHV0aWxzX2hvb2tzX19ob29rcyAoKSB7XG4gICAgICAgIHJldHVybiBob29rQ2FsbGJhY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGlzIGRvbmUgdG8gcmVnaXN0ZXIgdGhlIG1ldGhvZCBjYWxsZWQgd2l0aCBtb21lbnQoKVxuICAgIC8vIHdpdGhvdXQgY3JlYXRpbmcgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLlxuICAgIGZ1bmN0aW9uIHNldEhvb2tDYWxsYmFjayAoY2FsbGJhY2spIHtcbiAgICAgICAgaG9va0NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNBcnJheShpbnB1dCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RhdGUoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0IGluc3RhbmNlb2YgRGF0ZSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBEYXRlXSc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFwKGFyciwgZm4pIHtcbiAgICAgICAgdmFyIHJlcyA9IFtdLCBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICByZXMucHVzaChmbihhcnJbaV0sIGkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhc093blByb3AoYSwgYikge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsIGIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4dGVuZChhLCBiKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gYikge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoYiwgaSkpIHtcbiAgICAgICAgICAgICAgICBhW2ldID0gYltpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGIsICd0b1N0cmluZycpKSB7XG4gICAgICAgICAgICBhLnRvU3RyaW5nID0gYi50b1N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGIsICd2YWx1ZU9mJykpIHtcbiAgICAgICAgICAgIGEudmFsdWVPZiA9IGIudmFsdWVPZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZV91dGNfX2NyZWF0ZVVUQyAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsT3JVVEMoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIHRydWUpLnV0YygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmF1bHRQYXJzaW5nRmxhZ3MoKSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gZGVlcCBjbG9uZSB0aGlzIG9iamVjdC5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVtcHR5ICAgICAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgdW51c2VkVG9rZW5zICAgIDogW10sXG4gICAgICAgICAgICB1bnVzZWRJbnB1dCAgICAgOiBbXSxcbiAgICAgICAgICAgIG92ZXJmbG93ICAgICAgICA6IC0yLFxuICAgICAgICAgICAgY2hhcnNMZWZ0T3ZlciAgIDogMCxcbiAgICAgICAgICAgIG51bGxJbnB1dCAgICAgICA6IGZhbHNlLFxuICAgICAgICAgICAgaW52YWxpZE1vbnRoICAgIDogbnVsbCxcbiAgICAgICAgICAgIGludmFsaWRGb3JtYXQgICA6IGZhbHNlLFxuICAgICAgICAgICAgdXNlckludmFsaWRhdGVkIDogZmFsc2UsXG4gICAgICAgICAgICBpc28gICAgICAgICAgICAgOiBmYWxzZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFBhcnNpbmdGbGFncyhtKSB7XG4gICAgICAgIGlmIChtLl9wZiA9PSBudWxsKSB7XG4gICAgICAgICAgICBtLl9wZiA9IGRlZmF1bHRQYXJzaW5nRmxhZ3MoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbS5fcGY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRfX2lzVmFsaWQobSkge1xuICAgICAgICBpZiAobS5faXNWYWxpZCA9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgZmxhZ3MgPSBnZXRQYXJzaW5nRmxhZ3MobSk7XG4gICAgICAgICAgICBtLl9pc1ZhbGlkID0gIWlzTmFOKG0uX2QuZ2V0VGltZSgpKSAmJlxuICAgICAgICAgICAgICAgIGZsYWdzLm92ZXJmbG93IDwgMCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5lbXB0eSAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5pbnZhbGlkTW9udGggJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MuaW52YWxpZFdlZWtkYXkgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MubnVsbElucHV0ICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLmludmFsaWRGb3JtYXQgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MudXNlckludmFsaWRhdGVkO1xuXG4gICAgICAgICAgICBpZiAobS5fc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgbS5faXNWYWxpZCA9IG0uX2lzVmFsaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MuY2hhcnNMZWZ0T3ZlciA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgICBmbGFncy51bnVzZWRUb2tlbnMubGVuZ3RoID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLmJpZ0hvdXIgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbS5faXNWYWxpZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZF9fY3JlYXRlSW52YWxpZCAoZmxhZ3MpIHtcbiAgICAgICAgdmFyIG0gPSBjcmVhdGVfdXRjX19jcmVhdGVVVEMoTmFOKTtcbiAgICAgICAgaWYgKGZsYWdzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGV4dGVuZChnZXRQYXJzaW5nRmxhZ3MobSksIGZsYWdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhtKS51c2VySW52YWxpZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxuXG4gICAgdmFyIG1vbWVudFByb3BlcnRpZXMgPSB1dGlsc19ob29rc19faG9va3MubW9tZW50UHJvcGVydGllcyA9IFtdO1xuXG4gICAgZnVuY3Rpb24gY29weUNvbmZpZyh0bywgZnJvbSkge1xuICAgICAgICB2YXIgaSwgcHJvcCwgdmFsO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faXNBTW9tZW50T2JqZWN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2lzQU1vbWVudE9iamVjdCA9IGZyb20uX2lzQU1vbWVudE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2kgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faSA9IGZyb20uX2k7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9mICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2YgPSBmcm9tLl9mO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9sID0gZnJvbS5fbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3N0cmljdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9zdHJpY3QgPSBmcm9tLl9zdHJpY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl90em0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fdHptID0gZnJvbS5fdHptO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faXNVVEMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faXNVVEMgPSBmcm9tLl9pc1VUQztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX29mZnNldCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9vZmZzZXQgPSBmcm9tLl9vZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9wZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9wZiA9IGdldFBhcnNpbmdGbGFncyhmcm9tKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2xvY2FsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9sb2NhbGUgPSBmcm9tLl9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9tZW50UHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGkgaW4gbW9tZW50UHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIHByb3AgPSBtb21lbnRQcm9wZXJ0aWVzW2ldO1xuICAgICAgICAgICAgICAgIHZhbCA9IGZyb21bcHJvcF07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvW3Byb3BdID0gdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0bztcbiAgICB9XG5cbiAgICB2YXIgdXBkYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG4gICAgLy8gTW9tZW50IHByb3RvdHlwZSBvYmplY3RcbiAgICBmdW5jdGlvbiBNb21lbnQoY29uZmlnKSB7XG4gICAgICAgIGNvcHlDb25maWcodGhpcywgY29uZmlnKTtcbiAgICAgICAgdGhpcy5fZCA9IG5ldyBEYXRlKGNvbmZpZy5fZCAhPSBudWxsID8gY29uZmlnLl9kLmdldFRpbWUoKSA6IE5hTik7XG4gICAgICAgIC8vIFByZXZlbnQgaW5maW5pdGUgbG9vcCBpbiBjYXNlIHVwZGF0ZU9mZnNldCBjcmVhdGVzIG5ldyBtb21lbnRcbiAgICAgICAgLy8gb2JqZWN0cy5cbiAgICAgICAgaWYgKHVwZGF0ZUluUHJvZ3Jlc3MgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB1cGRhdGVJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQodGhpcyk7XG4gICAgICAgICAgICB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc01vbWVudCAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBNb21lbnQgfHwgKG9iaiAhPSBudWxsICYmIG9iai5faXNBTW9tZW50T2JqZWN0ICE9IG51bGwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFic0Zsb29yIChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwobnVtYmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0ludChhcmd1bWVudEZvckNvZXJjaW9uKSB7XG4gICAgICAgIHZhciBjb2VyY2VkTnVtYmVyID0gK2FyZ3VtZW50Rm9yQ29lcmNpb24sXG4gICAgICAgICAgICB2YWx1ZSA9IDA7XG5cbiAgICAgICAgaWYgKGNvZXJjZWROdW1iZXIgIT09IDAgJiYgaXNGaW5pdGUoY29lcmNlZE51bWJlcikpIHtcbiAgICAgICAgICAgIHZhbHVlID0gYWJzRmxvb3IoY29lcmNlZE51bWJlcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcGFyZUFycmF5cyhhcnJheTEsIGFycmF5MiwgZG9udENvbnZlcnQpIHtcbiAgICAgICAgdmFyIGxlbiA9IE1hdGgubWluKGFycmF5MS5sZW5ndGgsIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgbGVuZ3RoRGlmZiA9IE1hdGguYWJzKGFycmF5MS5sZW5ndGggLSBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgICAgIGRpZmZzID0gMCxcbiAgICAgICAgICAgIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKChkb250Q29udmVydCAmJiBhcnJheTFbaV0gIT09IGFycmF5MltpXSkgfHxcbiAgICAgICAgICAgICAgICAoIWRvbnRDb252ZXJ0ICYmIHRvSW50KGFycmF5MVtpXSkgIT09IHRvSW50KGFycmF5MltpXSkpKSB7XG4gICAgICAgICAgICAgICAgZGlmZnMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlmZnMgKyBsZW5ndGhEaWZmO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIExvY2FsZSgpIHtcbiAgICB9XG5cbiAgICB2YXIgbG9jYWxlcyA9IHt9O1xuICAgIHZhciBnbG9iYWxMb2NhbGU7XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVMb2NhbGUoa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkgPyBrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCdfJywgJy0nKSA6IGtleTtcbiAgICB9XG5cbiAgICAvLyBwaWNrIHRoZSBsb2NhbGUgZnJvbSB0aGUgYXJyYXlcbiAgICAvLyB0cnkgWydlbi1hdScsICdlbi1nYiddIGFzICdlbi1hdScsICdlbi1nYicsICdlbicsIGFzIGluIG1vdmUgdGhyb3VnaCB0aGUgbGlzdCB0cnlpbmcgZWFjaFxuICAgIC8vIHN1YnN0cmluZyBmcm9tIG1vc3Qgc3BlY2lmaWMgdG8gbGVhc3QsIGJ1dCBtb3ZlIHRvIHRoZSBuZXh0IGFycmF5IGl0ZW0gaWYgaXQncyBhIG1vcmUgc3BlY2lmaWMgdmFyaWFudCB0aGFuIHRoZSBjdXJyZW50IHJvb3RcbiAgICBmdW5jdGlvbiBjaG9vc2VMb2NhbGUobmFtZXMpIHtcbiAgICAgICAgdmFyIGkgPSAwLCBqLCBuZXh0LCBsb2NhbGUsIHNwbGl0O1xuXG4gICAgICAgIHdoaWxlIChpIDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzcGxpdCA9IG5vcm1hbGl6ZUxvY2FsZShuYW1lc1tpXSkuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGogPSBzcGxpdC5sZW5ndGg7XG4gICAgICAgICAgICBuZXh0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2kgKyAxXSk7XG4gICAgICAgICAgICBuZXh0ID0gbmV4dCA/IG5leHQuc3BsaXQoJy0nKSA6IG51bGw7XG4gICAgICAgICAgICB3aGlsZSAoaiA+IDApIHtcbiAgICAgICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKHNwbGl0LnNsaWNlKDAsIGopLmpvaW4oJy0nKSk7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0Lmxlbmd0aCA+PSBqICYmIGNvbXBhcmVBcnJheXMoc3BsaXQsIG5leHQsIHRydWUpID49IGogLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhlIG5leHQgYXJyYXkgaXRlbSBpcyBiZXR0ZXIgdGhhbiBhIHNoYWxsb3dlciBzdWJzdHJpbmcgb2YgdGhpcyBvbmVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGotLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkTG9jYWxlKG5hbWUpIHtcbiAgICAgICAgdmFyIG9sZExvY2FsZSA9IG51bGw7XG4gICAgICAgIC8vIFRPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlZ2lzdGVyIGFuZCBsb2FkIGFsbCB0aGUgbG9jYWxlcyBpbiBOb2RlXG4gICAgICAgIGlmICghbG9jYWxlc1tuYW1lXSAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgICAgIG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvbGRMb2NhbGUgPSBnbG9iYWxMb2NhbGUuX2FiYnI7XG4gICAgICAgICAgICAgICAgcmVxdWlyZSgnLi9sb2NhbGUvJyArIG5hbWUpO1xuICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgZGVmaW5lTG9jYWxlIGN1cnJlbnRseSBhbHNvIHNldHMgdGhlIGdsb2JhbCBsb2NhbGUsIHdlXG4gICAgICAgICAgICAgICAgLy8gd2FudCB0byB1bmRvIHRoYXQgZm9yIGxhenkgbG9hZGVkIGxvY2FsZXNcbiAgICAgICAgICAgICAgICBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKG9sZExvY2FsZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgbG9hZCBsb2NhbGUgYW5kIHRoZW4gc2V0IHRoZSBnbG9iYWwgbG9jYWxlLiAgSWZcbiAgICAvLyBubyBhcmd1bWVudHMgYXJlIHBhc3NlZCBpbiwgaXQgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZSBjdXJyZW50IGdsb2JhbFxuICAgIC8vIGxvY2FsZSBrZXkuXG4gICAgZnVuY3Rpb24gbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZSAoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgdmFyIGRhdGE7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWVzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGVmaW5lTG9jYWxlKGtleSwgdmFsdWVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBtb21lbnQuZHVyYXRpb24uX2xvY2FsZSA9IG1vbWVudC5fbG9jYWxlID0gZGF0YTtcbiAgICAgICAgICAgICAgICBnbG9iYWxMb2NhbGUgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdsb2JhbExvY2FsZS5fYWJicjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZpbmVMb2NhbGUgKG5hbWUsIHZhbHVlcykge1xuICAgICAgICBpZiAodmFsdWVzICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZXMuYWJiciA9IG5hbWU7XG4gICAgICAgICAgICBsb2NhbGVzW25hbWVdID0gbG9jYWxlc1tuYW1lXSB8fCBuZXcgTG9jYWxlKCk7XG4gICAgICAgICAgICBsb2NhbGVzW25hbWVdLnNldCh2YWx1ZXMpO1xuXG4gICAgICAgICAgICAvLyBiYWNrd2FyZHMgY29tcGF0IGZvciBub3c6IGFsc28gc2V0IHRoZSBsb2NhbGVcbiAgICAgICAgICAgIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUobmFtZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdXNlZnVsIGZvciB0ZXN0aW5nXG4gICAgICAgICAgICBkZWxldGUgbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmV0dXJucyBsb2NhbGUgZGF0YVxuICAgIGZ1bmN0aW9uIGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUgKGtleSkge1xuICAgICAgICB2YXIgbG9jYWxlO1xuXG4gICAgICAgIGlmIChrZXkgJiYga2V5Ll9sb2NhbGUgJiYga2V5Ll9sb2NhbGUuX2FiYnIpIHtcbiAgICAgICAgICAgIGtleSA9IGtleS5fbG9jYWxlLl9hYmJyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgICAgLy9zaG9ydC1jaXJjdWl0IGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShrZXkpO1xuICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkgPSBba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaG9vc2VMb2NhbGUoa2V5KTtcbiAgICB9XG5cbiAgICB2YXIgYWxpYXNlcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkVW5pdEFsaWFzICh1bml0LCBzaG9ydGhhbmQpIHtcbiAgICAgICAgdmFyIGxvd2VyQ2FzZSA9IHVuaXQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgYWxpYXNlc1tsb3dlckNhc2VdID0gYWxpYXNlc1tsb3dlckNhc2UgKyAncyddID0gYWxpYXNlc1tzaG9ydGhhbmRdID0gdW5pdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVVbml0cyh1bml0cykge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHVuaXRzID09PSAnc3RyaW5nJyA/IGFsaWFzZXNbdW5pdHNdIHx8IGFsaWFzZXNbdW5pdHMudG9Mb3dlckNhc2UoKV0gOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplT2JqZWN0VW5pdHMoaW5wdXRPYmplY3QpIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IHt9LFxuICAgICAgICAgICAgbm9ybWFsaXplZFByb3AsXG4gICAgICAgICAgICBwcm9wO1xuXG4gICAgICAgIGZvciAocHJvcCBpbiBpbnB1dE9iamVjdCkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoaW5wdXRPYmplY3QsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb3AgPSBub3JtYWxpemVVbml0cyhwcm9wKTtcbiAgICAgICAgICAgICAgICBpZiAobm9ybWFsaXplZFByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZElucHV0W25vcm1hbGl6ZWRQcm9wXSA9IGlucHV0T2JqZWN0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub3JtYWxpemVkSW5wdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUdldFNldCAodW5pdCwga2VlcFRpbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBnZXRfc2V0X19zZXQodGhpcywgdW5pdCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQodGhpcywga2VlcFRpbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0X3NldF9fZ2V0KHRoaXMsIHVuaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldF9zZXRfX2dldCAobW9tLCB1bml0KSB7XG4gICAgICAgIHJldHVybiBtb20uX2RbJ2dldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0oKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRfc2V0X19zZXQgKG1vbSwgdW5pdCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0ICh1bml0cywgdmFsdWUpIHtcbiAgICAgICAgdmFyIHVuaXQ7XG4gICAgICAgIGlmICh0eXBlb2YgdW5pdHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBmb3IgKHVuaXQgaW4gdW5pdHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldCh1bml0LCB1bml0c1t1bml0XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpc1t1bml0c10gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1t1bml0c10odmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHplcm9GaWxsKG51bWJlciwgdGFyZ2V0TGVuZ3RoLCBmb3JjZVNpZ24pIHtcbiAgICAgICAgdmFyIGFic051bWJlciA9ICcnICsgTWF0aC5hYnMobnVtYmVyKSxcbiAgICAgICAgICAgIHplcm9zVG9GaWxsID0gdGFyZ2V0TGVuZ3RoIC0gYWJzTnVtYmVyLmxlbmd0aCxcbiAgICAgICAgICAgIHNpZ24gPSBudW1iZXIgPj0gMDtcbiAgICAgICAgcmV0dXJuIChzaWduID8gKGZvcmNlU2lnbiA/ICcrJyA6ICcnKSA6ICctJykgK1xuICAgICAgICAgICAgTWF0aC5wb3coMTAsIE1hdGgubWF4KDAsIHplcm9zVG9GaWxsKSkudG9TdHJpbmcoKS5zdWJzdHIoMSkgKyBhYnNOdW1iZXI7XG4gICAgfVxuXG4gICAgdmFyIGZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTW98TU0/TT9NP3xEb3xERERvfEREP0Q/RD98ZGRkP2Q/fGRvP3x3W298d10/fFdbb3xXXT98UXxZWVlZWVl8WVlZWVl8WVlZWXxZWXxnZyhnZ2c/KT98R0coR0dHPyk/fGV8RXxhfEF8aGg/fEhIP3xtbT98c3M/fFN7MSw5fXx4fFh8eno/fFpaP3wuKS9nO1xuXG4gICAgdmFyIGxvY2FsRm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhMVFN8TFR8TEw/TD9MP3xsezEsNH0pL2c7XG5cbiAgICB2YXIgZm9ybWF0RnVuY3Rpb25zID0ge307XG5cbiAgICB2YXIgZm9ybWF0VG9rZW5GdW5jdGlvbnMgPSB7fTtcblxuICAgIC8vIHRva2VuOiAgICAnTSdcbiAgICAvLyBwYWRkZWQ6ICAgWydNTScsIDJdXG4gICAgLy8gb3JkaW5hbDogICdNbydcbiAgICAvLyBjYWxsYmFjazogZnVuY3Rpb24gKCkgeyB0aGlzLm1vbnRoKCkgKyAxIH1cbiAgICBmdW5jdGlvbiBhZGRGb3JtYXRUb2tlbiAodG9rZW4sIHBhZGRlZCwgb3JkaW5hbCwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGZ1bmMgPSBjYWxsYmFjaztcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGZ1bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNbY2FsbGJhY2tdKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbdG9rZW5dID0gZnVuYztcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFkZGVkKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1twYWRkZWRbMF1dID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB6ZXJvRmlsbChmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHBhZGRlZFsxXSwgcGFkZGVkWzJdKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9yZGluYWwpIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW29yZGluYWxdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5vcmRpbmFsKGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgdG9rZW4pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgaWYgKGlucHV0Lm1hdGNoKC9cXFtbXFxzXFxTXS8pKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXlxcW3xcXF0kL2csICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXFxcXC9nLCAnJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUZvcm1hdEZ1bmN0aW9uKGZvcm1hdCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBmb3JtYXQubWF0Y2goZm9ybWF0dGluZ1Rva2VucyksIGksIGxlbmd0aDtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXSkge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoYXJyYXlbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtb20pIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBhcnJheVtpXSBpbnN0YW5jZW9mIEZ1bmN0aW9uID8gYXJyYXlbaV0uY2FsbChtb20sIGZvcm1hdCkgOiBhcnJheVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gZm9ybWF0IGRhdGUgdXNpbmcgbmF0aXZlIGRhdGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gZm9ybWF0TW9tZW50KG0sIGZvcm1hdCkge1xuICAgICAgICBpZiAoIW0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbS5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdCA9IGV4cGFuZEZvcm1hdChmb3JtYXQsIG0ubG9jYWxlRGF0YSgpKTtcbiAgICAgICAgZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0gPSBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSB8fCBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KTtcblxuICAgICAgICByZXR1cm4gZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0obSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBpID0gNTtcblxuICAgICAgICBmdW5jdGlvbiByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGUubG9uZ0RhdGVGb3JtYXQoaW5wdXQpIHx8IGlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHdoaWxlIChpID49IDAgJiYgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLnRlc3QoZm9ybWF0KSkge1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UobG9jYWxGb3JtYXR0aW5nVG9rZW5zLCByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMpO1xuICAgICAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICBpIC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgIH1cblxuICAgIHZhciBtYXRjaDEgICAgICAgICA9IC9cXGQvOyAgICAgICAgICAgIC8vICAgICAgIDAgLSA5XG4gICAgdmFyIG1hdGNoMiAgICAgICAgID0gL1xcZFxcZC87ICAgICAgICAgIC8vICAgICAgMDAgLSA5OVxuICAgIHZhciBtYXRjaDMgICAgICAgICA9IC9cXGR7M30vOyAgICAgICAgIC8vICAgICAwMDAgLSA5OTlcbiAgICB2YXIgbWF0Y2g0ICAgICAgICAgPSAvXFxkezR9LzsgICAgICAgICAvLyAgICAwMDAwIC0gOTk5OVxuICAgIHZhciBtYXRjaDYgICAgICAgICA9IC9bKy1dP1xcZHs2fS87ICAgIC8vIC05OTk5OTkgLSA5OTk5OTlcbiAgICB2YXIgbWF0Y2gxdG8yICAgICAgPSAvXFxkXFxkPy87ICAgICAgICAgLy8gICAgICAgMCAtIDk5XG4gICAgdmFyIG1hdGNoMXRvMyAgICAgID0gL1xcZHsxLDN9LzsgICAgICAgLy8gICAgICAgMCAtIDk5OVxuICAgIHZhciBtYXRjaDF0bzQgICAgICA9IC9cXGR7MSw0fS87ICAgICAgIC8vICAgICAgIDAgLSA5OTk5XG4gICAgdmFyIG1hdGNoMXRvNiAgICAgID0gL1srLV0/XFxkezEsNn0vOyAgLy8gLTk5OTk5OSAtIDk5OTk5OVxuXG4gICAgdmFyIG1hdGNoVW5zaWduZWQgID0gL1xcZCsvOyAgICAgICAgICAgLy8gICAgICAgMCAtIGluZlxuICAgIHZhciBtYXRjaFNpZ25lZCAgICA9IC9bKy1dP1xcZCsvOyAgICAgIC8vICAgIC1pbmYgLSBpbmZcblxuICAgIHZhciBtYXRjaE9mZnNldCAgICA9IC9afFsrLV1cXGRcXGQ6P1xcZFxcZC9naTsgLy8gKzAwOjAwIC0wMDowMCArMDAwMCAtMDAwMCBvciBaXG5cbiAgICB2YXIgbWF0Y2hUaW1lc3RhbXAgPSAvWystXT9cXGQrKFxcLlxcZHsxLDN9KT8vOyAvLyAxMjM0NTY3ODkgMTIzNDU2Nzg5LjEyM1xuXG4gICAgLy8gYW55IHdvcmQgKG9yIHR3bykgY2hhcmFjdGVycyBvciBudW1iZXJzIGluY2x1ZGluZyB0d28vdGhyZWUgd29yZCBtb250aCBpbiBhcmFiaWMuXG4gICAgdmFyIG1hdGNoV29yZCA9IC9bMC05XSpbJ2EtelxcdTAwQTAtXFx1MDVGRlxcdTA3MDAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0rfFtcXHUwNjAwLVxcdTA2RkZcXC9dKyhcXHMqP1tcXHUwNjAwLVxcdTA2RkZdKyl7MSwyfS9pO1xuXG4gICAgdmFyIHJlZ2V4ZXMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGlzRnVuY3Rpb24gKHN0aCkge1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMjMyNVxuICAgICAgICByZXR1cm4gdHlwZW9mIHN0aCA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN0aCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBhZGRSZWdleFRva2VuICh0b2tlbiwgcmVnZXgsIHN0cmljdFJlZ2V4KSB7XG4gICAgICAgIHJlZ2V4ZXNbdG9rZW5dID0gaXNGdW5jdGlvbihyZWdleCkgPyByZWdleCA6IGZ1bmN0aW9uIChpc1N0cmljdCkge1xuICAgICAgICAgICAgcmV0dXJuIChpc1N0cmljdCAmJiBzdHJpY3RSZWdleCkgPyBzdHJpY3RSZWdleCA6IHJlZ2V4O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFBhcnNlUmVnZXhGb3JUb2tlbiAodG9rZW4sIGNvbmZpZykge1xuICAgICAgICBpZiAoIWhhc093blByb3AocmVnZXhlcywgdG9rZW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cCh1bmVzY2FwZUZvcm1hdCh0b2tlbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlZ2V4ZXNbdG9rZW5dKGNvbmZpZy5fc3RyaWN0LCBjb25maWcuX2xvY2FsZSk7XG4gICAgfVxuXG4gICAgLy8gQ29kZSBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzU2MTQ5My9pcy10aGVyZS1hLXJlZ2V4cC1lc2NhcGUtZnVuY3Rpb24taW4tamF2YXNjcmlwdFxuICAgIGZ1bmN0aW9uIHVuZXNjYXBlRm9ybWF0KHMpIHtcbiAgICAgICAgcmV0dXJuIHMucmVwbGFjZSgnXFxcXCcsICcnKS5yZXBsYWNlKC9cXFxcKFxcWyl8XFxcXChcXF0pfFxcWyhbXlxcXVxcW10qKVxcXXxcXFxcKC4pL2csIGZ1bmN0aW9uIChtYXRjaGVkLCBwMSwgcDIsIHAzLCBwNCkge1xuICAgICAgICAgICAgcmV0dXJuIHAxIHx8IHAyIHx8IHAzIHx8IHA0O1xuICAgICAgICB9KS5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbiAgICB9XG5cbiAgICB2YXIgdG9rZW5zID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRQYXJzZVRva2VuICh0b2tlbiwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGksIGZ1bmMgPSBjYWxsYmFjaztcbiAgICAgICAgaWYgKHR5cGVvZiB0b2tlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRva2VuID0gW3Rva2VuXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZnVuYyA9IGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtjYWxsYmFja10gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW5zW3Rva2VuW2ldXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRXZWVrUGFyc2VUb2tlbiAodG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgICAgIGFkZFBhcnNlVG9rZW4odG9rZW4sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgICAgIGNvbmZpZy5fdyA9IGNvbmZpZy5fdyB8fCB7fTtcbiAgICAgICAgICAgIGNhbGxiYWNrKGlucHV0LCBjb25maWcuX3csIGNvbmZpZywgdG9rZW4pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgaW5wdXQsIGNvbmZpZykge1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCAmJiBoYXNPd25Qcm9wKHRva2VucywgdG9rZW4pKSB7XG4gICAgICAgICAgICB0b2tlbnNbdG9rZW5dKGlucHV0LCBjb25maWcuX2EsIGNvbmZpZywgdG9rZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFlFQVIgPSAwO1xuICAgIHZhciBNT05USCA9IDE7XG4gICAgdmFyIERBVEUgPSAyO1xuICAgIHZhciBIT1VSID0gMztcbiAgICB2YXIgTUlOVVRFID0gNDtcbiAgICB2YXIgU0VDT05EID0gNTtcbiAgICB2YXIgTUlMTElTRUNPTkQgPSA2O1xuXG4gICAgZnVuY3Rpb24gZGF5c0luTW9udGgoeWVhciwgbW9udGgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKHllYXIsIG1vbnRoICsgMSwgMCkpLmdldFVUQ0RhdGUoKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignTScsIFsnTU0nLCAyXSwgJ01vJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb250aCgpICsgMTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNTU0nLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tb250aHNTaG9ydCh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ01NTU0nLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tb250aHModGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnbW9udGgnLCAnTScpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignTScsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignTU0nLCAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdNTU0nLCAgbWF0Y2hXb3JkKTtcbiAgICBhZGRSZWdleFRva2VuKCdNTU1NJywgbWF0Y2hXb3JkKTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydNJywgJ01NJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbTU9OVEhdID0gdG9JbnQoaW5wdXQpIC0gMTtcbiAgICB9KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydNTU0nLCAnTU1NTSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHZhciBtb250aCA9IGNvbmZpZy5fbG9jYWxlLm1vbnRoc1BhcnNlKGlucHV0LCB0b2tlbiwgY29uZmlnLl9zdHJpY3QpO1xuICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgZmluZCBhIG1vbnRoIG5hbWUsIG1hcmsgdGhlIGRhdGUgYXMgaW52YWxpZC5cbiAgICAgICAgaWYgKG1vbnRoICE9IG51bGwpIHtcbiAgICAgICAgICAgIGFycmF5W01PTlRIXSA9IG1vbnRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaW52YWxpZE1vbnRoID0gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIExPQ0FMRVNcblxuICAgIHZhciBkZWZhdWx0TG9jYWxlTW9udGhzID0gJ0phbnVhcnlfRmVicnVhcnlfTWFyY2hfQXByaWxfTWF5X0p1bmVfSnVseV9BdWd1c3RfU2VwdGVtYmVyX09jdG9iZXJfTm92ZW1iZXJfRGVjZW1iZXInLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzIChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb250aHNbbS5tb250aCgpXTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZU1vbnRoc1Nob3J0ID0gJ0phbl9GZWJfTWFyX0Fwcl9NYXlfSnVuX0p1bF9BdWdfU2VwX09jdF9Ob3ZfRGVjJy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRoc1Nob3J0IChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFttLm1vbnRoKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRoc1BhcnNlIChtb250aE5hbWUsIGZvcm1hdCwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgICAgIGlmICghdGhpcy5fbW9udGhzUGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIG1vbSA9IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgaWYgKHN0cmljdCAmJiAhdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJykucmVwbGFjZSgnLicsICcnKSArICckJywgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghc3RyaWN0ICYmICF0aGlzLl9tb250aHNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgIHJlZ2V4ID0gJ14nICsgdGhpcy5tb250aHMobW9tLCAnJykgKyAnfF4nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ01NTU0nICYmIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RyaWN0ICYmIGZvcm1hdCA9PT0gJ01NTScgJiYgdGhpcy5fc2hvcnRNb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCAmJiB0aGlzLl9tb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIHNldE1vbnRoIChtb20sIHZhbHVlKSB7XG4gICAgICAgIHZhciBkYXlPZk1vbnRoO1xuXG4gICAgICAgIC8vIFRPRE86IE1vdmUgdGhpcyBvdXQgb2YgaGVyZSFcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbW9tLmxvY2FsZURhdGEoKS5tb250aHNQYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAvLyBUT0RPOiBBbm90aGVyIHNpbGVudCBmYWlsdXJlP1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZGF5T2ZNb250aCA9IE1hdGgubWluKG1vbS5kYXRlKCksIGRheXNJbk1vbnRoKG1vbS55ZWFyKCksIHZhbHVlKSk7XG4gICAgICAgIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyAnTW9udGgnXSh2YWx1ZSwgZGF5T2ZNb250aCk7XG4gICAgICAgIHJldHVybiBtb207XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0TW9udGggKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzZXRNb250aCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0X3NldF9fZ2V0KHRoaXMsICdNb250aCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGF5c0luTW9udGggKCkge1xuICAgICAgICByZXR1cm4gZGF5c0luTW9udGgodGhpcy55ZWFyKCksIHRoaXMubW9udGgoKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tPdmVyZmxvdyAobSkge1xuICAgICAgICB2YXIgb3ZlcmZsb3c7XG4gICAgICAgIHZhciBhID0gbS5fYTtcblxuICAgICAgICBpZiAoYSAmJiBnZXRQYXJzaW5nRmxhZ3MobSkub3ZlcmZsb3cgPT09IC0yKSB7XG4gICAgICAgICAgICBvdmVyZmxvdyA9XG4gICAgICAgICAgICAgICAgYVtNT05USF0gICAgICAgPCAwIHx8IGFbTU9OVEhdICAgICAgID4gMTEgID8gTU9OVEggOlxuICAgICAgICAgICAgICAgIGFbREFURV0gICAgICAgIDwgMSB8fCBhW0RBVEVdICAgICAgICA+IGRheXNJbk1vbnRoKGFbWUVBUl0sIGFbTU9OVEhdKSA/IERBVEUgOlxuICAgICAgICAgICAgICAgIGFbSE9VUl0gICAgICAgIDwgMCB8fCBhW0hPVVJdICAgICAgICA+IDI0IHx8IChhW0hPVVJdID09PSAyNCAmJiAoYVtNSU5VVEVdICE9PSAwIHx8IGFbU0VDT05EXSAhPT0gMCB8fCBhW01JTExJU0VDT05EXSAhPT0gMCkpID8gSE9VUiA6XG4gICAgICAgICAgICAgICAgYVtNSU5VVEVdICAgICAgPCAwIHx8IGFbTUlOVVRFXSAgICAgID4gNTkgID8gTUlOVVRFIDpcbiAgICAgICAgICAgICAgICBhW1NFQ09ORF0gICAgICA8IDAgfHwgYVtTRUNPTkRdICAgICAgPiA1OSAgPyBTRUNPTkQgOlxuICAgICAgICAgICAgICAgIGFbTUlMTElTRUNPTkRdIDwgMCB8fCBhW01JTExJU0VDT05EXSA+IDk5OSA/IE1JTExJU0VDT05EIDpcbiAgICAgICAgICAgICAgICAtMTtcblxuICAgICAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dEYXlPZlllYXIgJiYgKG92ZXJmbG93IDwgWUVBUiB8fCBvdmVyZmxvdyA+IERBVEUpKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBEQVRFO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MobSkub3ZlcmZsb3cgPSBvdmVyZmxvdztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdhcm4obXNnKSB7XG4gICAgICAgIGlmICh1dGlsc19ob29rc19faG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID09PSBmYWxzZSAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0RlcHJlY2F0aW9uIHdhcm5pbmc6ICcgKyBtc2cpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlKG1zZywgZm4pIHtcbiAgICAgICAgdmFyIGZpcnN0VGltZSA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIGV4dGVuZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgICAgICAgICAgd2Fybihtc2cgKyAnXFxuJyArIChuZXcgRXJyb3IoKSkuc3RhY2spO1xuICAgICAgICAgICAgICAgIGZpcnN0VGltZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sIGZuKTtcbiAgICB9XG5cbiAgICB2YXIgZGVwcmVjYXRpb25zID0ge307XG5cbiAgICBmdW5jdGlvbiBkZXByZWNhdGVTaW1wbGUobmFtZSwgbXNnKSB7XG4gICAgICAgIGlmICghZGVwcmVjYXRpb25zW25hbWVdKSB7XG4gICAgICAgICAgICB3YXJuKG1zZyk7XG4gICAgICAgICAgICBkZXByZWNhdGlvbnNbbmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9IGZhbHNlO1xuXG4gICAgdmFyIGZyb21fc3RyaW5nX19pc29SZWdleCA9IC9eXFxzKig/OlsrLV1cXGR7Nn18XFxkezR9KS0oPzooXFxkXFxkLVxcZFxcZCl8KFdcXGRcXGQkKXwoV1xcZFxcZC1cXGQpfChcXGRcXGRcXGQpKSgoVHwgKShcXGRcXGQoOlxcZFxcZCg6XFxkXFxkKFxcLlxcZCspPyk/KT8pPyhbXFwrXFwtXVxcZFxcZCg/Ojo/XFxkXFxkKT98XFxzKlopPyk/JC87XG5cbiAgICB2YXIgaXNvRGF0ZXMgPSBbXG4gICAgICAgIFsnWVlZWVlZLU1NLUREJywgL1srLV1cXGR7Nn0tXFxkezJ9LVxcZHsyfS9dLFxuICAgICAgICBbJ1lZWVktTU0tREQnLCAvXFxkezR9LVxcZHsyfS1cXGR7Mn0vXSxcbiAgICAgICAgWydHR0dHLVtXXVdXLUUnLCAvXFxkezR9LVdcXGR7Mn0tXFxkL10sXG4gICAgICAgIFsnR0dHRy1bV11XVycsIC9cXGR7NH0tV1xcZHsyfS9dLFxuICAgICAgICBbJ1lZWVktREREJywgL1xcZHs0fS1cXGR7M30vXVxuICAgIF07XG5cbiAgICAvLyBpc28gdGltZSBmb3JtYXRzIGFuZCByZWdleGVzXG4gICAgdmFyIGlzb1RpbWVzID0gW1xuICAgICAgICBbJ0hIOm1tOnNzLlNTU1MnLCAvKFR8IClcXGRcXGQ6XFxkXFxkOlxcZFxcZFxcLlxcZCsvXSxcbiAgICAgICAgWydISDptbTpzcycsIC8oVHwgKVxcZFxcZDpcXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgIFsnSEg6bW0nLCAvKFR8IClcXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgIFsnSEgnLCAvKFR8IClcXGRcXGQvXVxuICAgIF07XG5cbiAgICB2YXIgYXNwTmV0SnNvblJlZ2V4ID0gL15cXC8/RGF0ZVxcKChcXC0/XFxkKykvaTtcblxuICAgIC8vIGRhdGUgZnJvbSBpc28gZm9ybWF0XG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUlTTyhjb25maWcpIHtcbiAgICAgICAgdmFyIGksIGwsXG4gICAgICAgICAgICBzdHJpbmcgPSBjb25maWcuX2ksXG4gICAgICAgICAgICBtYXRjaCA9IGZyb21fc3RyaW5nX19pc29SZWdleC5leGVjKHN0cmluZyk7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pc28gPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb0RhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29EYXRlc1tpXVsxXS5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9mID0gaXNvRGF0ZXNbaV1bMF07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29UaW1lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNvVGltZXNbaV1bMV0uZXhlYyhzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoWzZdIHNob3VsZCBiZSAnVCcgb3Igc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9mICs9IChtYXRjaFs2XSB8fCAnICcpICsgaXNvVGltZXNbaV1bMF07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdHJpbmcubWF0Y2gobWF0Y2hPZmZzZXQpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9mICs9ICdaJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXQgb3IgZmFsbGJhY2tcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nKGNvbmZpZykge1xuICAgICAgICB2YXIgbWF0Y2hlZCA9IGFzcE5ldEpzb25SZWdleC5leGVjKGNvbmZpZy5faSk7XG5cbiAgICAgICAgaWYgKG1hdGNoZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCttYXRjaGVkWzFdKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZ0Zyb21JU08oY29uZmlnKTtcbiAgICAgICAgaWYgKGNvbmZpZy5faXNWYWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb25maWcuX2lzVmFsaWQ7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ21vbWVudCBjb25zdHJ1Y3Rpb24gZmFsbHMgYmFjayB0byBqcyBEYXRlLiBUaGlzIGlzICcgK1xuICAgICAgICAnZGlzY291cmFnZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB1cGNvbWluZyBtYWpvciAnICtcbiAgICAgICAgJ3JlbGVhc2UuIFBsZWFzZSByZWZlciB0byAnICtcbiAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDA3IGZvciBtb3JlIGluZm8uJyxcbiAgICAgICAgZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoY29uZmlnLl9pICsgKGNvbmZpZy5fdXNlVVRDID8gJyBVVEMnIDogJycpKTtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVEYXRlICh5LCBtLCBkLCBoLCBNLCBzLCBtcykge1xuICAgICAgICAvL2Nhbid0IGp1c3QgYXBwbHkoKSB0byBjcmVhdGUgYSBkYXRlOlxuICAgICAgICAvL2h0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTgxMzQ4L2luc3RhbnRpYXRpbmctYS1qYXZhc2NyaXB0LW9iamVjdC1ieS1jYWxsaW5nLXByb3RvdHlwZS1jb25zdHJ1Y3Rvci1hcHBseVxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHksIG0sIGQsIGgsIE0sIHMsIG1zKTtcblxuICAgICAgICAvL3RoZSBkYXRlIGNvbnN0cnVjdG9yIGRvZXNuJ3QgYWNjZXB0IHllYXJzIDwgMTk3MFxuICAgICAgICBpZiAoeSA8IDE5NzApIHtcbiAgICAgICAgICAgIGRhdGUuc2V0RnVsbFllYXIoeSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlVVRDRGF0ZSAoeSkge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDLmFwcGx5KG51bGwsIGFyZ3VtZW50cykpO1xuICAgICAgICBpZiAoeSA8IDE5NzApIHtcbiAgICAgICAgICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoeSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWScsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnllYXIoKSAlIDEwMDtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWScsICAgNF0sICAgICAgIDAsICd5ZWFyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZWScsICA1XSwgICAgICAgMCwgJ3llYXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVlZWScsIDYsIHRydWVdLCAwLCAneWVhcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCd5ZWFyJywgJ3knKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1knLCAgICAgIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdZWScsICAgICBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWScsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZWVlZJywgIG1hdGNoMXRvNiwgbWF0Y2g2KTtcbiAgICBhZGRSZWdleFRva2VuKCdZWVlZWVknLCBtYXRjaDF0bzYsIG1hdGNoNik7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnWVlZWVknLCAnWVlZWVlZJ10sIFlFQVIpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1lZWVknLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W1lFQVJdID0gaW5wdXQubGVuZ3RoID09PSAyID8gdXRpbHNfaG9va3NfX2hvb2tzLnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KSA6IHRvSW50KGlucHV0KTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCdZWScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbWUVBUl0gPSB1dGlsc19ob29rc19faG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgZnVuY3Rpb24gZGF5c0luWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiBpc0xlYXBZZWFyKHllYXIpID8gMzY2IDogMzY1O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTGVhcFllYXIoeWVhcikge1xuICAgICAgICByZXR1cm4gKHllYXIgJSA0ID09PSAwICYmIHllYXIgJSAxMDAgIT09IDApIHx8IHllYXIgJSA0MDAgPT09IDA7XG4gICAgfVxuXG4gICAgLy8gSE9PS1NcblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVR3b0RpZ2l0WWVhciA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICByZXR1cm4gdG9JbnQoaW5wdXQpICsgKHRvSW50KGlucHV0KSA+IDY4ID8gMTkwMCA6IDIwMDApO1xuICAgIH07XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0WWVhciA9IG1ha2VHZXRTZXQoJ0Z1bGxZZWFyJywgZmFsc2UpO1xuXG4gICAgZnVuY3Rpb24gZ2V0SXNMZWFwWWVhciAoKSB7XG4gICAgICAgIHJldHVybiBpc0xlYXBZZWFyKHRoaXMueWVhcigpKTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbigndycsIFsnd3cnLCAyXSwgJ3dvJywgJ3dlZWsnKTtcbiAgICBhZGRGb3JtYXRUb2tlbignVycsIFsnV1cnLCAyXSwgJ1dvJywgJ2lzb1dlZWsnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnd2VlaycsICd3Jyk7XG4gICAgYWRkVW5pdEFsaWFzKCdpc29XZWVrJywgJ1cnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ3cnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCd3dycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdXJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignV1cnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ3cnLCAnd3cnLCAnVycsICdXVyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbi5zdWJzdHIoMCwgMSldID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgLy8gZmlyc3REYXlPZldlZWsgICAgICAgMCA9IHN1biwgNiA9IHNhdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBkYXkgb2YgdGhlIHdlZWsgdGhhdCBzdGFydHMgdGhlIHdlZWtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAodXN1YWxseSBzdW5kYXkgb3IgbW9uZGF5KVxuICAgIC8vIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIDAgPSBzdW4sIDYgPSBzYXRcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICB0aGUgZmlyc3Qgd2VlayBpcyB0aGUgd2VlayB0aGF0IGNvbnRhaW5zIHRoZSBmaXJzdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIG9mIHRoaXMgZGF5IG9mIHRoZSB3ZWVrXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgKGVnLiBJU08gd2Vla3MgdXNlIHRodXJzZGF5ICg0KSlcbiAgICBmdW5jdGlvbiB3ZWVrT2ZZZWFyKG1vbSwgZmlyc3REYXlPZldlZWssIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyKSB7XG4gICAgICAgIHZhciBlbmQgPSBmaXJzdERheU9mV2Vla09mWWVhciAtIGZpcnN0RGF5T2ZXZWVrLFxuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrID0gZmlyc3REYXlPZldlZWtPZlllYXIgLSBtb20uZGF5KCksXG4gICAgICAgICAgICBhZGp1c3RlZE1vbWVudDtcblxuXG4gICAgICAgIGlmIChkYXlzVG9EYXlPZldlZWsgPiBlbmQpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayAtPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRheXNUb0RheU9mV2VlayA8IGVuZCAtIDcpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayArPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgYWRqdXN0ZWRNb21lbnQgPSBsb2NhbF9fY3JlYXRlTG9jYWwobW9tKS5hZGQoZGF5c1RvRGF5T2ZXZWVrLCAnZCcpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2VlazogTWF0aC5jZWlsKGFkanVzdGVkTW9tZW50LmRheU9mWWVhcigpIC8gNyksXG4gICAgICAgICAgICB5ZWFyOiBhZGp1c3RlZE1vbWVudC55ZWFyKClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrIChtb20pIHtcbiAgICAgICAgcmV0dXJuIHdlZWtPZlllYXIobW9tLCB0aGlzLl93ZWVrLmRvdywgdGhpcy5fd2Vlay5kb3kpLndlZWs7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrID0ge1xuICAgICAgICBkb3cgOiAwLCAvLyBTdW5kYXkgaXMgdGhlIGZpcnN0IGRheSBvZiB0aGUgd2Vlay5cbiAgICAgICAgZG95IDogNiAgLy8gVGhlIHdlZWsgdGhhdCBjb250YWlucyBKYW4gMXN0IGlzIHRoZSBmaXJzdCB3ZWVrIG9mIHRoZSB5ZWFyLlxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVGaXJzdERheU9mV2VlayAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrLmRvdztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVGaXJzdERheU9mWWVhciAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrLmRveTtcbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRXZWVrIChpbnB1dCkge1xuICAgICAgICB2YXIgd2VlayA9IHRoaXMubG9jYWxlRGF0YSgpLndlZWsodGhpcyk7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09XZWVrIChpbnB1dCkge1xuICAgICAgICB2YXIgd2VlayA9IHdlZWtPZlllYXIodGhpcywgMSwgNCkud2VlaztcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCdEREQnLCBbJ0REREQnLCAzXSwgJ0RERG8nLCAnZGF5T2ZZZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RheU9mWWVhcicsICdEREQnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0RERCcsICBtYXRjaDF0bzMpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0REREQnLCBtYXRjaDMpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydEREQnLCAnRERERCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvL2h0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPX3dlZWtfZGF0ZSNDYWxjdWxhdGluZ19hX2RhdGVfZ2l2ZW5fdGhlX3llYXIuMkNfd2Vla19udW1iZXJfYW5kX3dlZWtkYXlcbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla3MoeWVhciwgd2Vlaywgd2Vla2RheSwgZmlyc3REYXlPZldlZWtPZlllYXIsIGZpcnN0RGF5T2ZXZWVrKSB7XG4gICAgICAgIHZhciB3ZWVrMUphbiA9IDYgKyBmaXJzdERheU9mV2VlayAtIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyLCBqYW5YID0gY3JlYXRlVVRDRGF0ZSh5ZWFyLCAwLCAxICsgd2VlazFKYW4pLCBkID0gamFuWC5nZXRVVENEYXkoKSwgZGF5T2ZZZWFyO1xuICAgICAgICBpZiAoZCA8IGZpcnN0RGF5T2ZXZWVrKSB7XG4gICAgICAgICAgICBkICs9IDc7XG4gICAgICAgIH1cblxuICAgICAgICB3ZWVrZGF5ID0gd2Vla2RheSAhPSBudWxsID8gMSAqIHdlZWtkYXkgOiBmaXJzdERheU9mV2VlaztcblxuICAgICAgICBkYXlPZlllYXIgPSAxICsgd2VlazFKYW4gKyA3ICogKHdlZWsgLSAxKSAtIGQgKyB3ZWVrZGF5O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB5ZWFyOiBkYXlPZlllYXIgPiAwID8geWVhciA6IHllYXIgLSAxLFxuICAgICAgICAgICAgZGF5T2ZZZWFyOiBkYXlPZlllYXIgPiAwID8gIGRheU9mWWVhciA6IGRheXNJblllYXIoeWVhciAtIDEpICsgZGF5T2ZZZWFyXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0RGF5T2ZZZWFyIChpbnB1dCkge1xuICAgICAgICB2YXIgZGF5T2ZZZWFyID0gTWF0aC5yb3VuZCgodGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ2RheScpIC0gdGhpcy5jbG9uZSgpLnN0YXJ0T2YoJ3llYXInKSkgLyA4NjRlNSkgKyAxO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IGRheU9mWWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIGRheU9mWWVhciksICdkJyk7XG4gICAgfVxuXG4gICAgLy8gUGljayB0aGUgZmlyc3QgZGVmaW5lZCBvZiB0d28gb3IgdGhyZWUgYXJndW1lbnRzLlxuICAgIGZ1bmN0aW9uIGRlZmF1bHRzKGEsIGIsIGMpIHtcbiAgICAgICAgaWYgKGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGIgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3VycmVudERhdGVBcnJheShjb25maWcpIHtcbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGlmIChjb25maWcuX3VzZVVUQykge1xuICAgICAgICAgICAgcmV0dXJuIFtub3cuZ2V0VVRDRnVsbFllYXIoKSwgbm93LmdldFVUQ01vbnRoKCksIG5vdy5nZXRVVENEYXRlKCldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbm93LmdldEZ1bGxZZWFyKCksIG5vdy5nZXRNb250aCgpLCBub3cuZ2V0RGF0ZSgpXTtcbiAgICB9XG5cbiAgICAvLyBjb252ZXJ0IGFuIGFycmF5IHRvIGEgZGF0ZS5cbiAgICAvLyB0aGUgYXJyYXkgc2hvdWxkIG1pcnJvciB0aGUgcGFyYW1ldGVycyBiZWxvd1xuICAgIC8vIG5vdGU6IGFsbCB2YWx1ZXMgcGFzdCB0aGUgeWVhciBhcmUgb3B0aW9uYWwgYW5kIHdpbGwgZGVmYXVsdCB0byB0aGUgbG93ZXN0IHBvc3NpYmxlIHZhbHVlLlxuICAgIC8vIFt5ZWFyLCBtb250aCwgZGF5ICwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpc2Vjb25kXVxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21BcnJheSAoY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBkYXRlLCBpbnB1dCA9IFtdLCBjdXJyZW50RGF0ZSwgeWVhclRvVXNlO1xuXG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnREYXRlID0gY3VycmVudERhdGVBcnJheShjb25maWcpO1xuXG4gICAgICAgIC8vY29tcHV0ZSBkYXkgb2YgdGhlIHllYXIgZnJvbSB3ZWVrcyBhbmQgd2Vla2RheXNcbiAgICAgICAgaWYgKGNvbmZpZy5fdyAmJiBjb25maWcuX2FbREFURV0gPT0gbnVsbCAmJiBjb25maWcuX2FbTU9OVEhdID09IG51bGwpIHtcbiAgICAgICAgICAgIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pZiB0aGUgZGF5IG9mIHRoZSB5ZWFyIGlzIHNldCwgZmlndXJlIG91dCB3aGF0IGl0IGlzXG4gICAgICAgIGlmIChjb25maWcuX2RheU9mWWVhcikge1xuICAgICAgICAgICAgeWVhclRvVXNlID0gZGVmYXVsdHMoY29uZmlnLl9hW1lFQVJdLCBjdXJyZW50RGF0ZVtZRUFSXSk7XG5cbiAgICAgICAgICAgIGlmIChjb25maWcuX2RheU9mWWVhciA+IGRheXNJblllYXIoeWVhclRvVXNlKSkge1xuICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLl9vdmVyZmxvd0RheU9mWWVhciA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGUgPSBjcmVhdGVVVENEYXRlKHllYXJUb1VzZSwgMCwgY29uZmlnLl9kYXlPZlllYXIpO1xuICAgICAgICAgICAgY29uZmlnLl9hW01PTlRIXSA9IGRhdGUuZ2V0VVRDTW9udGgoKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtEQVRFXSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGVmYXVsdCB0byBjdXJyZW50IGRhdGUuXG4gICAgICAgIC8vICogaWYgbm8geWVhciwgbW9udGgsIGRheSBvZiBtb250aCBhcmUgZ2l2ZW4sIGRlZmF1bHQgdG8gdG9kYXlcbiAgICAgICAgLy8gKiBpZiBkYXkgb2YgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgbW9udGggYW5kIHllYXJcbiAgICAgICAgLy8gKiBpZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBvbmx5IHllYXJcbiAgICAgICAgLy8gKiBpZiB5ZWFyIGlzIGdpdmVuLCBkb24ndCBkZWZhdWx0IGFueXRoaW5nXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAzICYmIGNvbmZpZy5fYVtpXSA9PSBudWxsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gY3VycmVudERhdGVbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBaZXJvIG91dCB3aGF0ZXZlciB3YXMgbm90IGRlZmF1bHRlZCwgaW5jbHVkaW5nIHRpbWVcbiAgICAgICAgZm9yICg7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gKGNvbmZpZy5fYVtpXSA9PSBudWxsKSA/IChpID09PSAyID8gMSA6IDApIDogY29uZmlnLl9hW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIDI0OjAwOjAwLjAwMFxuICAgICAgICBpZiAoY29uZmlnLl9hW0hPVVJdID09PSAyNCAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtNSU5VVEVdID09PSAwICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW1NFQ09ORF0gPT09IDAgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbTUlMTElTRUNPTkRdID09PSAwKSB7XG4gICAgICAgICAgICBjb25maWcuX25leHREYXkgPSB0cnVlO1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZy5fZCA9IChjb25maWcuX3VzZVVUQyA/IGNyZWF0ZVVUQ0RhdGUgOiBjcmVhdGVEYXRlKS5hcHBseShudWxsLCBpbnB1dCk7XG4gICAgICAgIC8vIEFwcGx5IHRpbWV6b25lIG9mZnNldCBmcm9tIGlucHV0LiBUaGUgYWN0dWFsIHV0Y09mZnNldCBjYW4gYmUgY2hhbmdlZFxuICAgICAgICAvLyB3aXRoIHBhcnNlWm9uZS5cbiAgICAgICAgaWYgKGNvbmZpZy5fdHptICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZC5zZXRVVENNaW51dGVzKGNvbmZpZy5fZC5nZXRVVENNaW51dGVzKCkgLSBjb25maWcuX3R6bSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZmlnLl9uZXh0RGF5KSB7XG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPSAyNDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpIHtcbiAgICAgICAgdmFyIHcsIHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSwgdGVtcDtcblxuICAgICAgICB3ID0gY29uZmlnLl93O1xuICAgICAgICBpZiAody5HRyAhPSBudWxsIHx8IHcuVyAhPSBudWxsIHx8IHcuRSAhPSBudWxsKSB7XG4gICAgICAgICAgICBkb3cgPSAxO1xuICAgICAgICAgICAgZG95ID0gNDtcblxuICAgICAgICAgICAgLy8gVE9ETzogV2UgbmVlZCB0byB0YWtlIHRoZSBjdXJyZW50IGlzb1dlZWtZZWFyLCBidXQgdGhhdCBkZXBlbmRzIG9uXG4gICAgICAgICAgICAvLyBob3cgd2UgaW50ZXJwcmV0IG5vdyAobG9jYWwsIHV0YywgZml4ZWQgb2Zmc2V0KS4gU28gY3JlYXRlXG4gICAgICAgICAgICAvLyBhIG5vdyB2ZXJzaW9uIG9mIGN1cnJlbnQgY29uZmlnICh0YWtlIGxvY2FsL3V0Yy9vZmZzZXQgZmxhZ3MsIGFuZFxuICAgICAgICAgICAgLy8gY3JlYXRlIG5vdykuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRlZmF1bHRzKHcuR0csIGNvbmZpZy5fYVtZRUFSXSwgd2Vla09mWWVhcihsb2NhbF9fY3JlYXRlTG9jYWwoKSwgMSwgNCkueWVhcik7XG4gICAgICAgICAgICB3ZWVrID0gZGVmYXVsdHMody5XLCAxKTtcbiAgICAgICAgICAgIHdlZWtkYXkgPSBkZWZhdWx0cyh3LkUsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG93ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG93O1xuICAgICAgICAgICAgZG95ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG95O1xuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRlZmF1bHRzKHcuZ2csIGNvbmZpZy5fYVtZRUFSXSwgd2Vla09mWWVhcihsb2NhbF9fY3JlYXRlTG9jYWwoKSwgZG93LCBkb3kpLnllYXIpO1xuICAgICAgICAgICAgd2VlayA9IGRlZmF1bHRzKHcudywgMSk7XG5cbiAgICAgICAgICAgIGlmICh3LmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIHdlZWtkYXkgLS0gbG93IGRheSBudW1iZXJzIGFyZSBjb25zaWRlcmVkIG5leHQgd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmQ7XG4gICAgICAgICAgICAgICAgaWYgKHdlZWtkYXkgPCBkb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgKyt3ZWVrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAody5lICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBsb2NhbCB3ZWVrZGF5IC0tIGNvdW50aW5nIHN0YXJ0cyBmcm9tIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5lICsgZG93O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IHRvIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gZG93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXAgPSBkYXlPZlllYXJGcm9tV2Vla3Mod2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRveSwgZG93KTtcblxuICAgICAgICBjb25maWcuX2FbWUVBUl0gPSB0ZW1wLnllYXI7XG4gICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdGVtcC5kYXlPZlllYXI7XG4gICAgfVxuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLklTT184NjAxID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBkYXRlIGZyb20gc3RyaW5nIGFuZCBmb3JtYXQgc3RyaW5nXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpIHtcbiAgICAgICAgLy8gVE9ETzogTW92ZSB0aGlzIHRvIGFub3RoZXIgcGFydCBvZiB0aGUgY3JlYXRpb24gZmxvdyB0byBwcmV2ZW50IGNpcmN1bGFyIGRlcHNcbiAgICAgICAgaWYgKGNvbmZpZy5fZiA9PT0gdXRpbHNfaG9va3NfX2hvb2tzLklTT184NjAxKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tSVNPKGNvbmZpZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcuX2EgPSBbXTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuZW1wdHkgPSB0cnVlO1xuXG4gICAgICAgIC8vIFRoaXMgYXJyYXkgaXMgdXNlZCB0byBtYWtlIGEgRGF0ZSwgZWl0aGVyIHdpdGggYG5ldyBEYXRlYCBvciBgRGF0ZS5VVENgXG4gICAgICAgIHZhciBzdHJpbmcgPSAnJyArIGNvbmZpZy5faSxcbiAgICAgICAgICAgIGksIHBhcnNlZElucHV0LCB0b2tlbnMsIHRva2VuLCBza2lwcGVkLFxuICAgICAgICAgICAgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICAgIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGggPSAwO1xuXG4gICAgICAgIHRva2VucyA9IGV4cGFuZEZvcm1hdChjb25maWcuX2YsIGNvbmZpZy5fbG9jYWxlKS5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSB8fCBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgIHBhcnNlZElucHV0ID0gKHN0cmluZy5tYXRjaChnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4odG9rZW4sIGNvbmZpZykpIHx8IFtdKVswXTtcbiAgICAgICAgICAgIGlmIChwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIHNraXBwZWQgPSBzdHJpbmcuc3Vic3RyKDAsIHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHNraXBwZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRJbnB1dC5wdXNoKHNraXBwZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc2xpY2Uoc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpICsgcGFyc2VkSW5wdXQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoICs9IHBhcnNlZElucHV0Lmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRvbid0IHBhcnNlIGlmIGl0J3Mgbm90IGEga25vd24gdG9rZW5cbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuZW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIHBhcnNlZElucHV0LCBjb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29uZmlnLl9zdHJpY3QgJiYgIXBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHJlbWFpbmluZyB1bnBhcnNlZCBpbnB1dCBsZW5ndGggdG8gdGhlIHN0cmluZ1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5jaGFyc0xlZnRPdmVyID0gc3RyaW5nTGVuZ3RoIC0gdG90YWxQYXJzZWRJbnB1dExlbmd0aDtcbiAgICAgICAgaWYgKHN0cmluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRJbnB1dC5wdXNoKHN0cmluZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjbGVhciBfMTJoIGZsYWcgaWYgaG91ciBpcyA8PSAxMlxuICAgICAgICBpZiAoZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA8PSAxMiAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA+IDApIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaGFuZGxlIG1lcmlkaWVtXG4gICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IG1lcmlkaWVtRml4V3JhcChjb25maWcuX2xvY2FsZSwgY29uZmlnLl9hW0hPVVJdLCBjb25maWcuX21lcmlkaWVtKTtcblxuICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICAgICAgY2hlY2tPdmVyZmxvdyhjb25maWcpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gbWVyaWRpZW1GaXhXcmFwIChsb2NhbGUsIGhvdXIsIG1lcmlkaWVtKSB7XG4gICAgICAgIHZhciBpc1BtO1xuXG4gICAgICAgIGlmIChtZXJpZGllbSA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBub3RoaW5nIHRvIGRvXG4gICAgICAgICAgICByZXR1cm4gaG91cjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlLm1lcmlkaWVtSG91ciAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlLm1lcmlkaWVtSG91cihob3VyLCBtZXJpZGllbSk7XG4gICAgICAgIH0gZWxzZSBpZiAobG9jYWxlLmlzUE0gIT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gRmFsbGJhY2tcbiAgICAgICAgICAgIGlzUG0gPSBsb2NhbGUuaXNQTShtZXJpZGllbSk7XG4gICAgICAgICAgICBpZiAoaXNQbSAmJiBob3VyIDwgMTIpIHtcbiAgICAgICAgICAgICAgICBob3VyICs9IDEyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1BtICYmIGhvdXIgPT09IDEyKSB7XG4gICAgICAgICAgICAgICAgaG91ciA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaG91cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgbm90IHN1cHBvc2VkIHRvIGhhcHBlblxuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciB0ZW1wQ29uZmlnLFxuICAgICAgICAgICAgYmVzdE1vbWVudCxcblxuICAgICAgICAgICAgc2NvcmVUb0JlYXQsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgY3VycmVudFNjb3JlO1xuXG4gICAgICAgIGlmIChjb25maWcuX2YubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkRm9ybWF0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKE5hTik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29uZmlnLl9mLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgPSAwO1xuICAgICAgICAgICAgdGVtcENvbmZpZyA9IGNvcHlDb25maWcoe30sIGNvbmZpZyk7XG4gICAgICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRlbXBDb25maWcuX3VzZVVUQyA9IGNvbmZpZy5fdXNlVVRDO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVtcENvbmZpZy5fZiA9IGNvbmZpZy5fZltpXTtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQodGVtcENvbmZpZyk7XG5cbiAgICAgICAgICAgIGlmICghdmFsaWRfX2lzVmFsaWQodGVtcENvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYW55IGlucHV0IHRoYXQgd2FzIG5vdCBwYXJzZWQgYWRkIGEgcGVuYWx0eSBmb3IgdGhhdCBmb3JtYXRcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykuY2hhcnNMZWZ0T3ZlcjtcblxuICAgICAgICAgICAgLy9vciB0b2tlbnNcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykudW51c2VkVG9rZW5zLmxlbmd0aCAqIDEwO1xuXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3ModGVtcENvbmZpZykuc2NvcmUgPSBjdXJyZW50U2NvcmU7XG5cbiAgICAgICAgICAgIGlmIChzY29yZVRvQmVhdCA9PSBudWxsIHx8IGN1cnJlbnRTY29yZSA8IHNjb3JlVG9CZWF0KSB7XG4gICAgICAgICAgICAgICAgc2NvcmVUb0JlYXQgPSBjdXJyZW50U2NvcmU7XG4gICAgICAgICAgICAgICAgYmVzdE1vbWVudCA9IHRlbXBDb25maWc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHRlbmQoY29uZmlnLCBiZXN0TW9tZW50IHx8IHRlbXBDb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21PYmplY3QoY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoY29uZmlnLl9pKTtcbiAgICAgICAgY29uZmlnLl9hID0gW2kueWVhciwgaS5tb250aCwgaS5kYXkgfHwgaS5kYXRlLCBpLmhvdXIsIGkubWludXRlLCBpLnNlY29uZCwgaS5taWxsaXNlY29uZF07XG5cbiAgICAgICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlRnJvbUNvbmZpZyAoY29uZmlnKSB7XG4gICAgICAgIHZhciByZXMgPSBuZXcgTW9tZW50KGNoZWNrT3ZlcmZsb3cocHJlcGFyZUNvbmZpZyhjb25maWcpKSk7XG4gICAgICAgIGlmIChyZXMuX25leHREYXkpIHtcbiAgICAgICAgICAgIC8vIEFkZGluZyBpcyBzbWFydCBlbm91Z2ggYXJvdW5kIERTVFxuICAgICAgICAgICAgcmVzLmFkZCgxLCAnZCcpO1xuICAgICAgICAgICAgcmVzLl9uZXh0RGF5ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmVwYXJlQ29uZmlnIChjb25maWcpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gY29uZmlnLl9pLFxuICAgICAgICAgICAgZm9ybWF0ID0gY29uZmlnLl9mO1xuXG4gICAgICAgIGNvbmZpZy5fbG9jYWxlID0gY29uZmlnLl9sb2NhbGUgfHwgbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZShjb25maWcuX2wpO1xuXG4gICAgICAgIGlmIChpbnB1dCA9PT0gbnVsbCB8fCAoZm9ybWF0ID09PSB1bmRlZmluZWQgJiYgaW5wdXQgPT09ICcnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbGlkX19jcmVhdGVJbnZhbGlkKHtudWxsSW5wdXQ6IHRydWV9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25maWcuX2kgPSBpbnB1dCA9IGNvbmZpZy5fbG9jYWxlLnByZXBhcnNlKGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc01vbWVudChpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9tZW50KGNoZWNrT3ZlcmZsb3coaW5wdXQpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRBcnJheShjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCkge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRGF0ZShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IGlucHV0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnRnJvbUlucHV0KGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21JbnB1dChjb25maWcpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gY29uZmlnLl9pO1xuICAgICAgICBpZiAoaW5wdXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgraW5wdXQpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmcoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9hID0gbWFwKGlucHV0LnNsaWNlKDApLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG9iaiwgMTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YoaW5wdXQpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgY29uZmlnRnJvbU9iamVjdChjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihpbnB1dCkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBmcm9tIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVMb2NhbE9yVVRDIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgaXNVVEMpIHtcbiAgICAgICAgdmFyIGMgPSB7fTtcblxuICAgICAgICBpZiAodHlwZW9mKGxvY2FsZSkgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgc3RyaWN0ID0gbG9jYWxlO1xuICAgICAgICAgICAgbG9jYWxlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9iamVjdCBjb25zdHJ1Y3Rpb24gbXVzdCBiZSBkb25lIHRoaXMgd2F5LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQyM1xuICAgICAgICBjLl9pc0FNb21lbnRPYmplY3QgPSB0cnVlO1xuICAgICAgICBjLl91c2VVVEMgPSBjLl9pc1VUQyA9IGlzVVRDO1xuICAgICAgICBjLl9sID0gbG9jYWxlO1xuICAgICAgICBjLl9pID0gaW5wdXQ7XG4gICAgICAgIGMuX2YgPSBmb3JtYXQ7XG4gICAgICAgIGMuX3N0cmljdCA9IHN0cmljdDtcblxuICAgICAgICByZXR1cm4gY3JlYXRlRnJvbUNvbmZpZyhjKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbF9fY3JlYXRlTG9jYWwgKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0KSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVMb2NhbE9yVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvdHlwZU1pbiA9IGRlcHJlY2F0ZShcbiAgICAgICAgICdtb21lbnQoKS5taW4gaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5taW4gaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE1NDgnLFxuICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgIHZhciBvdGhlciA9IGxvY2FsX19jcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgIHJldHVybiBvdGhlciA8IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgICB9XG4gICAgICk7XG5cbiAgICB2YXIgcHJvdG90eXBlTWF4ID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50KCkubWF4IGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWF4IGluc3RlYWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNTQ4JyxcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG90aGVyID0gbG9jYWxfX2NyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gb3RoZXIgPiB0aGlzID8gdGhpcyA6IG90aGVyO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIC8vIFBpY2sgYSBtb21lbnQgbSBmcm9tIG1vbWVudHMgc28gdGhhdCBtW2ZuXShvdGhlcikgaXMgdHJ1ZSBmb3IgYWxsXG4gICAgLy8gb3RoZXIuIFRoaXMgcmVsaWVzIG9uIHRoZSBmdW5jdGlvbiBmbiB0byBiZSB0cmFuc2l0aXZlLlxuICAgIC8vXG4gICAgLy8gbW9tZW50cyBzaG91bGQgZWl0aGVyIGJlIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzIG9yIGFuIGFycmF5LCB3aG9zZVxuICAgIC8vIGZpcnN0IGVsZW1lbnQgaXMgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMuXG4gICAgZnVuY3Rpb24gcGlja0J5KGZuLCBtb21lbnRzKSB7XG4gICAgICAgIHZhciByZXMsIGk7XG4gICAgICAgIGlmIChtb21lbnRzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KG1vbWVudHNbMF0pKSB7XG4gICAgICAgICAgICBtb21lbnRzID0gbW9tZW50c1swXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1vbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxfX2NyZWF0ZUxvY2FsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gbW9tZW50c1swXTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IG1vbWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmICghbW9tZW50c1tpXS5pc1ZhbGlkKCkgfHwgbW9tZW50c1tpXVtmbl0ocmVzKSkge1xuICAgICAgICAgICAgICAgIHJlcyA9IG1vbWVudHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBVc2UgW10uc29ydCBpbnN0ZWFkP1xuICAgIGZ1bmN0aW9uIG1pbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHJldHVybiBwaWNrQnkoJ2lzQmVmb3JlJywgYXJncyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWF4ICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgcmV0dXJuIHBpY2tCeSgnaXNBZnRlcicsIGFyZ3MpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIER1cmF0aW9uIChkdXJhdGlvbikge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoZHVyYXRpb24pLFxuICAgICAgICAgICAgeWVhcnMgPSBub3JtYWxpemVkSW5wdXQueWVhciB8fCAwLFxuICAgICAgICAgICAgcXVhcnRlcnMgPSBub3JtYWxpemVkSW5wdXQucXVhcnRlciB8fCAwLFxuICAgICAgICAgICAgbW9udGhzID0gbm9ybWFsaXplZElucHV0Lm1vbnRoIHx8IDAsXG4gICAgICAgICAgICB3ZWVrcyA9IG5vcm1hbGl6ZWRJbnB1dC53ZWVrIHx8IDAsXG4gICAgICAgICAgICBkYXlzID0gbm9ybWFsaXplZElucHV0LmRheSB8fCAwLFxuICAgICAgICAgICAgaG91cnMgPSBub3JtYWxpemVkSW5wdXQuaG91ciB8fCAwLFxuICAgICAgICAgICAgbWludXRlcyA9IG5vcm1hbGl6ZWRJbnB1dC5taW51dGUgfHwgMCxcbiAgICAgICAgICAgIHNlY29uZHMgPSBub3JtYWxpemVkSW5wdXQuc2Vjb25kIHx8IDAsXG4gICAgICAgICAgICBtaWxsaXNlY29uZHMgPSBub3JtYWxpemVkSW5wdXQubWlsbGlzZWNvbmQgfHwgMDtcblxuICAgICAgICAvLyByZXByZXNlbnRhdGlvbiBmb3IgZGF0ZUFkZFJlbW92ZVxuICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgPSArbWlsbGlzZWNvbmRzICtcbiAgICAgICAgICAgIHNlY29uZHMgKiAxZTMgKyAvLyAxMDAwXG4gICAgICAgICAgICBtaW51dGVzICogNmU0ICsgLy8gMTAwMCAqIDYwXG4gICAgICAgICAgICBob3VycyAqIDM2ZTU7IC8vIDEwMDAgKiA2MCAqIDYwXG4gICAgICAgIC8vIEJlY2F1c2Ugb2YgZGF0ZUFkZFJlbW92ZSB0cmVhdHMgMjQgaG91cnMgYXMgZGlmZmVyZW50IGZyb20gYVxuICAgICAgICAvLyBkYXkgd2hlbiB3b3JraW5nIGFyb3VuZCBEU1QsIHdlIG5lZWQgdG8gc3RvcmUgdGhlbSBzZXBhcmF0ZWx5XG4gICAgICAgIHRoaXMuX2RheXMgPSArZGF5cyArXG4gICAgICAgICAgICB3ZWVrcyAqIDc7XG4gICAgICAgIC8vIEl0IGlzIGltcG9zc2libGUgdHJhbnNsYXRlIG1vbnRocyBpbnRvIGRheXMgd2l0aG91dCBrbm93aW5nXG4gICAgICAgIC8vIHdoaWNoIG1vbnRocyB5b3UgYXJlIGFyZSB0YWxraW5nIGFib3V0LCBzbyB3ZSBoYXZlIHRvIHN0b3JlXG4gICAgICAgIC8vIGl0IHNlcGFyYXRlbHkuXG4gICAgICAgIHRoaXMuX21vbnRocyA9ICttb250aHMgK1xuICAgICAgICAgICAgcXVhcnRlcnMgKiAzICtcbiAgICAgICAgICAgIHllYXJzICogMTI7XG5cbiAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuXG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoKTtcblxuICAgICAgICB0aGlzLl9idWJibGUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0R1cmF0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIER1cmF0aW9uO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9mZnNldCAodG9rZW4sIHNlcGFyYXRvcikge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbih0b2tlbiwgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudXRjT2Zmc2V0KCk7XG4gICAgICAgICAgICB2YXIgc2lnbiA9ICcrJztcbiAgICAgICAgICAgIGlmIChvZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gLW9mZnNldDtcbiAgICAgICAgICAgICAgICBzaWduID0gJy0nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNpZ24gKyB6ZXJvRmlsbCh+fihvZmZzZXQgLyA2MCksIDIpICsgc2VwYXJhdG9yICsgemVyb0ZpbGwofn4ob2Zmc2V0KSAlIDYwLCAyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb2Zmc2V0KCdaJywgJzonKTtcbiAgICBvZmZzZXQoJ1paJywgJycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignWicsICBtYXRjaE9mZnNldCk7XG4gICAgYWRkUmVnZXhUb2tlbignWlonLCBtYXRjaE9mZnNldCk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ1onLCAnWlonXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fdXNlVVRDID0gdHJ1ZTtcbiAgICAgICAgY29uZmlnLl90em0gPSBvZmZzZXRGcm9tU3RyaW5nKGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIC8vIHRpbWV6b25lIGNodW5rZXJcbiAgICAvLyAnKzEwOjAwJyA+IFsnMTAnLCAgJzAwJ11cbiAgICAvLyAnLTE1MzAnICA+IFsnLTE1JywgJzMwJ11cbiAgICB2YXIgY2h1bmtPZmZzZXQgPSAvKFtcXCtcXC1dfFxcZFxcZCkvZ2k7XG5cbiAgICBmdW5jdGlvbiBvZmZzZXRGcm9tU3RyaW5nKHN0cmluZykge1xuICAgICAgICB2YXIgbWF0Y2hlcyA9ICgoc3RyaW5nIHx8ICcnKS5tYXRjaChtYXRjaE9mZnNldCkgfHwgW10pO1xuICAgICAgICB2YXIgY2h1bmsgICA9IG1hdGNoZXNbbWF0Y2hlcy5sZW5ndGggLSAxXSB8fCBbXTtcbiAgICAgICAgdmFyIHBhcnRzICAgPSAoY2h1bmsgKyAnJykubWF0Y2goY2h1bmtPZmZzZXQpIHx8IFsnLScsIDAsIDBdO1xuICAgICAgICB2YXIgbWludXRlcyA9ICsocGFydHNbMV0gKiA2MCkgKyB0b0ludChwYXJ0c1syXSk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnRzWzBdID09PSAnKycgPyBtaW51dGVzIDogLW1pbnV0ZXM7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGEgbW9tZW50IGZyb20gaW5wdXQsIHRoYXQgaXMgbG9jYWwvdXRjL3pvbmUgZXF1aXZhbGVudCB0byBtb2RlbC5cbiAgICBmdW5jdGlvbiBjbG9uZVdpdGhPZmZzZXQoaW5wdXQsIG1vZGVsKSB7XG4gICAgICAgIHZhciByZXMsIGRpZmY7XG4gICAgICAgIGlmIChtb2RlbC5faXNVVEMpIHtcbiAgICAgICAgICAgIHJlcyA9IG1vZGVsLmNsb25lKCk7XG4gICAgICAgICAgICBkaWZmID0gKGlzTW9tZW50KGlucHV0KSB8fCBpc0RhdGUoaW5wdXQpID8gK2lucHV0IDogK2xvY2FsX19jcmVhdGVMb2NhbChpbnB1dCkpIC0gKCtyZXMpO1xuICAgICAgICAgICAgLy8gVXNlIGxvdy1sZXZlbCBhcGksIGJlY2F1c2UgdGhpcyBmbiBpcyBsb3ctbGV2ZWwgYXBpLlxuICAgICAgICAgICAgcmVzLl9kLnNldFRpbWUoK3Jlcy5fZCArIGRpZmYpO1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldChyZXMsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KS5sb2NhbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGF0ZU9mZnNldCAobSkge1xuICAgICAgICAvLyBPbiBGaXJlZm94LjI0IERhdGUjZ2V0VGltZXpvbmVPZmZzZXQgcmV0dXJucyBhIGZsb2F0aW5nIHBvaW50LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9wdWxsLzE4NzFcbiAgICAgICAgcmV0dXJuIC1NYXRoLnJvdW5kKG0uX2QuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDE1KSAqIDE1O1xuICAgIH1cblxuICAgIC8vIEhPT0tTXG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIGEgbW9tZW50IGlzIG11dGF0ZWQuXG4gICAgLy8gSXQgaXMgaW50ZW5kZWQgdG8ga2VlcCB0aGUgb2Zmc2V0IGluIHN5bmMgd2l0aCB0aGUgdGltZXpvbmUuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgLy8ga2VlcExvY2FsVGltZSA9IHRydWUgbWVhbnMgb25seSBjaGFuZ2UgdGhlIHRpbWV6b25lLCB3aXRob3V0XG4gICAgLy8gYWZmZWN0aW5nIHRoZSBsb2NhbCBob3VyLiBTbyA1OjMxOjI2ICswMzAwIC0tW3V0Y09mZnNldCgyLCB0cnVlKV0tLT5cbiAgICAvLyA1OjMxOjI2ICswMjAwIEl0IGlzIHBvc3NpYmxlIHRoYXQgNTozMToyNiBkb2Vzbid0IGV4aXN0IHdpdGggb2Zmc2V0XG4gICAgLy8gKzAyMDAsIHNvIHdlIGFkanVzdCB0aGUgdGltZSBhcyBuZWVkZWQsIHRvIGJlIHZhbGlkLlxuICAgIC8vXG4gICAgLy8gS2VlcGluZyB0aGUgdGltZSBhY3R1YWxseSBhZGRzL3N1YnRyYWN0cyAob25lIGhvdXIpXG4gICAgLy8gZnJvbSB0aGUgYWN0dWFsIHJlcHJlc2VudGVkIHRpbWUuIFRoYXQgaXMgd2h5IHdlIGNhbGwgdXBkYXRlT2Zmc2V0XG4gICAgLy8gYSBzZWNvbmQgdGltZS4gSW4gY2FzZSBpdCB3YW50cyB1cyB0byBjaGFuZ2UgdGhlIG9mZnNldCBhZ2FpblxuICAgIC8vIF9jaGFuZ2VJblByb2dyZXNzID09IHRydWUgY2FzZSwgdGhlbiB3ZSBoYXZlIHRvIGFkanVzdCwgYmVjYXVzZVxuICAgIC8vIHRoZXJlIGlzIG5vIHN1Y2ggdGltZSBpbiB0aGUgZ2l2ZW4gdGltZXpvbmUuXG4gICAgZnVuY3Rpb24gZ2V0U2V0T2Zmc2V0IChpbnB1dCwga2VlcExvY2FsVGltZSkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5fb2Zmc2V0IHx8IDAsXG4gICAgICAgICAgICBsb2NhbEFkanVzdDtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBvZmZzZXRGcm9tU3RyaW5nKGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhpbnB1dCkgPCAxNikge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQgKiA2MDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5faXNVVEMgJiYga2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgIGxvY2FsQWRqdXN0ID0gZ2V0RGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX29mZnNldCA9IGlucHV0O1xuICAgICAgICAgICAgdGhpcy5faXNVVEMgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGxvY2FsQWRqdXN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZChsb2NhbEFkanVzdCwgJ20nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvZmZzZXQgIT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFrZWVwTG9jYWxUaW1lIHx8IHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCh0aGlzLCBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKGlucHV0IC0gb2Zmc2V0LCAnbScpLCAxLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyBvZmZzZXQgOiBnZXREYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0Wm9uZSAoaW5wdXQsIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSAtaW5wdXQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KGlucHV0LCBrZWVwTG9jYWxUaW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gLXRoaXMudXRjT2Zmc2V0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPZmZzZXRUb1VUQyAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICByZXR1cm4gdGhpcy51dGNPZmZzZXQoMCwga2VlcExvY2FsVGltZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9Mb2NhbCAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICBpZiAodGhpcy5faXNVVEMpIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgICAgICAgICAgdGhpcy5faXNVVEMgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnRyYWN0KGdldERhdGVPZmZzZXQodGhpcyksICdtJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9QYXJzZWRPZmZzZXQgKCkge1xuICAgICAgICBpZiAodGhpcy5fdHptKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCh0aGlzLl90em0pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLl9pID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQob2Zmc2V0RnJvbVN0cmluZyh0aGlzLl9pKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFzQWxpZ25lZEhvdXJPZmZzZXQgKGlucHV0KSB7XG4gICAgICAgIGlucHV0ID0gaW5wdXQgPyBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpLnV0Y09mZnNldCgpIDogMDtcblxuICAgICAgICByZXR1cm4gKHRoaXMudXRjT2Zmc2V0KCkgLSBpbnB1dCkgJSA2MCA9PT0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RheWxpZ2h0U2F2aW5nVGltZSAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgpID4gdGhpcy5jbG9uZSgpLm1vbnRoKDApLnV0Y09mZnNldCgpIHx8XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCgpID4gdGhpcy5jbG9uZSgpLm1vbnRoKDUpLnV0Y09mZnNldCgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXlsaWdodFNhdmluZ1RpbWVTaGlmdGVkICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9pc0RTVFNoaWZ0ZWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNEU1RTaGlmdGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGMgPSB7fTtcblxuICAgICAgICBjb3B5Q29uZmlnKGMsIHRoaXMpO1xuICAgICAgICBjID0gcHJlcGFyZUNvbmZpZyhjKTtcblxuICAgICAgICBpZiAoYy5fYSkge1xuICAgICAgICAgICAgdmFyIG90aGVyID0gYy5faXNVVEMgPyBjcmVhdGVfdXRjX19jcmVhdGVVVEMoYy5fYSkgOiBsb2NhbF9fY3JlYXRlTG9jYWwoYy5fYSk7XG4gICAgICAgICAgICB0aGlzLl9pc0RTVFNoaWZ0ZWQgPSB0aGlzLmlzVmFsaWQoKSAmJlxuICAgICAgICAgICAgICAgIGNvbXBhcmVBcnJheXMoYy5fYSwgb3RoZXIudG9BcnJheSgpKSA+IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pc0RTVFNoaWZ0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0RTVFNoaWZ0ZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMb2NhbCAoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5faXNVVEM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVdGNPZmZzZXQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVdGMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgJiYgdGhpcy5fb2Zmc2V0ID09PSAwO1xuICAgIH1cblxuICAgIHZhciBhc3BOZXRSZWdleCA9IC8oXFwtKT8oPzooXFxkKilcXC4pPyhcXGQrKVxcOihcXGQrKSg/OlxcOihcXGQrKVxcLj8oXFxkezN9KT8pPy87XG5cbiAgICAvLyBmcm9tIGh0dHA6Ly9kb2NzLmNsb3N1cmUtbGlicmFyeS5nb29nbGVjb2RlLmNvbS9naXQvY2xvc3VyZV9nb29nX2RhdGVfZGF0ZS5qcy5zb3VyY2UuaHRtbFxuICAgIC8vIHNvbWV3aGF0IG1vcmUgaW4gbGluZSB3aXRoIDQuNC4zLjIgMjAwNCBzcGVjLCBidXQgYWxsb3dzIGRlY2ltYWwgYW55d2hlcmVcbiAgICB2YXIgY3JlYXRlX19pc29SZWdleCA9IC9eKC0pP1AoPzooPzooWzAtOSwuXSopWSk/KD86KFswLTksLl0qKU0pPyg/OihbMC05LC5dKilEKT8oPzpUKD86KFswLTksLl0qKUgpPyg/OihbMC05LC5dKilNKT8oPzooWzAtOSwuXSopUyk/KT98KFswLTksLl0qKVcpJC87XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uIChpbnB1dCwga2V5KSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGlucHV0LFxuICAgICAgICAgICAgLy8gbWF0Y2hpbmcgYWdhaW5zdCByZWdleHAgaXMgZXhwZW5zaXZlLCBkbyBpdCBvbiBkZW1hbmRcbiAgICAgICAgICAgIG1hdGNoID0gbnVsbCxcbiAgICAgICAgICAgIHNpZ24sXG4gICAgICAgICAgICByZXQsXG4gICAgICAgICAgICBkaWZmUmVzO1xuXG4gICAgICAgIGlmIChpc0R1cmF0aW9uKGlucHV0KSkge1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgbXMgOiBpbnB1dC5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgICAgIGQgIDogaW5wdXQuX2RheXMsXG4gICAgICAgICAgICAgICAgTSAgOiBpbnB1dC5fbW9udGhzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb25ba2V5XSA9IGlucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbi5taWxsaXNlY29uZHMgPSBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGFzcE5ldFJlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IChtYXRjaFsxXSA9PT0gJy0nKSA/IC0xIDogMTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHkgIDogMCxcbiAgICAgICAgICAgICAgICBkICA6IHRvSW50KG1hdGNoW0RBVEVdKSAgICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIGggIDogdG9JbnQobWF0Y2hbSE9VUl0pICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgbSAgOiB0b0ludChtYXRjaFtNSU5VVEVdKSAgICAgICogc2lnbixcbiAgICAgICAgICAgICAgICBzICA6IHRvSW50KG1hdGNoW1NFQ09ORF0pICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIG1zIDogdG9JbnQobWF0Y2hbTUlMTElTRUNPTkRdKSAqIHNpZ25cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBjcmVhdGVfX2lzb1JlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IChtYXRjaFsxXSA9PT0gJy0nKSA/IC0xIDogMTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHkgOiBwYXJzZUlzbyhtYXRjaFsyXSwgc2lnbiksXG4gICAgICAgICAgICAgICAgTSA6IHBhcnNlSXNvKG1hdGNoWzNdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBkIDogcGFyc2VJc28obWF0Y2hbNF0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIGggOiBwYXJzZUlzbyhtYXRjaFs1XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgbSA6IHBhcnNlSXNvKG1hdGNoWzZdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBzIDogcGFyc2VJc28obWF0Y2hbN10sIHNpZ24pLFxuICAgICAgICAgICAgICAgIHcgOiBwYXJzZUlzbyhtYXRjaFs4XSwgc2lnbilcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoZHVyYXRpb24gPT0gbnVsbCkgey8vIGNoZWNrcyBmb3IgbnVsbCBvciB1bmRlZmluZWRcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGR1cmF0aW9uID09PSAnb2JqZWN0JyAmJiAoJ2Zyb20nIGluIGR1cmF0aW9uIHx8ICd0bycgaW4gZHVyYXRpb24pKSB7XG4gICAgICAgICAgICBkaWZmUmVzID0gbW9tZW50c0RpZmZlcmVuY2UobG9jYWxfX2NyZWF0ZUxvY2FsKGR1cmF0aW9uLmZyb20pLCBsb2NhbF9fY3JlYXRlTG9jYWwoZHVyYXRpb24udG8pKTtcblxuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgICAgIGR1cmF0aW9uLm1zID0gZGlmZlJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICBkdXJhdGlvbi5NID0gZGlmZlJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXQgPSBuZXcgRHVyYXRpb24oZHVyYXRpb24pO1xuXG4gICAgICAgIGlmIChpc0R1cmF0aW9uKGlucHV0KSAmJiBoYXNPd25Qcm9wKGlucHV0LCAnX2xvY2FsZScpKSB7XG4gICAgICAgICAgICByZXQuX2xvY2FsZSA9IGlucHV0Ll9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24uZm4gPSBEdXJhdGlvbi5wcm90b3R5cGU7XG5cbiAgICBmdW5jdGlvbiBwYXJzZUlzbyAoaW5wLCBzaWduKSB7XG4gICAgICAgIC8vIFdlJ2Qgbm9ybWFsbHkgdXNlIH5+aW5wIGZvciB0aGlzLCBidXQgdW5mb3J0dW5hdGVseSBpdCBhbHNvXG4gICAgICAgIC8vIGNvbnZlcnRzIGZsb2F0cyB0byBpbnRzLlxuICAgICAgICAvLyBpbnAgbWF5IGJlIHVuZGVmaW5lZCwgc28gY2FyZWZ1bCBjYWxsaW5nIHJlcGxhY2Ugb24gaXQuXG4gICAgICAgIHZhciByZXMgPSBpbnAgJiYgcGFyc2VGbG9hdChpbnAucmVwbGFjZSgnLCcsICcuJykpO1xuICAgICAgICAvLyBhcHBseSBzaWduIHdoaWxlIHdlJ3JlIGF0IGl0XG4gICAgICAgIHJldHVybiAoaXNOYU4ocmVzKSA/IDAgOiByZXMpICogc2lnbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgICAgIHZhciByZXMgPSB7bWlsbGlzZWNvbmRzOiAwLCBtb250aHM6IDB9O1xuXG4gICAgICAgIHJlcy5tb250aHMgPSBvdGhlci5tb250aCgpIC0gYmFzZS5tb250aCgpICtcbiAgICAgICAgICAgIChvdGhlci55ZWFyKCkgLSBiYXNlLnllYXIoKSkgKiAxMjtcbiAgICAgICAgaWYgKGJhc2UuY2xvbmUoKS5hZGQocmVzLm1vbnRocywgJ00nKS5pc0FmdGVyKG90aGVyKSkge1xuICAgICAgICAgICAgLS1yZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzLm1pbGxpc2Vjb25kcyA9ICtvdGhlciAtICsoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpKTtcblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKSB7XG4gICAgICAgIHZhciByZXM7XG4gICAgICAgIG90aGVyID0gY2xvbmVXaXRoT2Zmc2V0KG90aGVyLCBiYXNlKTtcbiAgICAgICAgaWYgKGJhc2UuaXNCZWZvcmUob3RoZXIpKSB7XG4gICAgICAgICAgICByZXMgPSBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKGJhc2UsIG90aGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2Uob3RoZXIsIGJhc2UpO1xuICAgICAgICAgICAgcmVzLm1pbGxpc2Vjb25kcyA9IC1yZXMubWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgcmVzLm1vbnRocyA9IC1yZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVBZGRlcihkaXJlY3Rpb24sIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWwsIHBlcmlvZCkge1xuICAgICAgICAgICAgdmFyIGR1ciwgdG1wO1xuICAgICAgICAgICAgLy9pbnZlcnQgdGhlIGFyZ3VtZW50cywgYnV0IGNvbXBsYWluIGFib3V0IGl0XG4gICAgICAgICAgICBpZiAocGVyaW9kICE9PSBudWxsICYmICFpc05hTigrcGVyaW9kKSkge1xuICAgICAgICAgICAgICAgIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCAnbW9tZW50KCkuJyArIG5hbWUgICsgJyhwZXJpb2QsIG51bWJlcikgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBtb21lbnQoKS4nICsgbmFtZSArICcobnVtYmVyLCBwZXJpb2QpLicpO1xuICAgICAgICAgICAgICAgIHRtcCA9IHZhbDsgdmFsID0gcGVyaW9kOyBwZXJpb2QgPSB0bXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbCA9IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gK3ZhbCA6IHZhbDtcbiAgICAgICAgICAgIGR1ciA9IGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24odmFsLCBwZXJpb2QpO1xuICAgICAgICAgICAgYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCh0aGlzLCBkdXIsIGRpcmVjdGlvbik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0IChtb20sIGR1cmF0aW9uLCBpc0FkZGluZywgdXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgZGF5cyA9IGR1cmF0aW9uLl9kYXlzLFxuICAgICAgICAgICAgbW9udGhzID0gZHVyYXRpb24uX21vbnRocztcbiAgICAgICAgdXBkYXRlT2Zmc2V0ID0gdXBkYXRlT2Zmc2V0ID09IG51bGwgPyB0cnVlIDogdXBkYXRlT2Zmc2V0O1xuXG4gICAgICAgIGlmIChtaWxsaXNlY29uZHMpIHtcbiAgICAgICAgICAgIG1vbS5fZC5zZXRUaW1lKCttb20uX2QgKyBtaWxsaXNlY29uZHMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRheXMpIHtcbiAgICAgICAgICAgIGdldF9zZXRfX3NldChtb20sICdEYXRlJywgZ2V0X3NldF9fZ2V0KG1vbSwgJ0RhdGUnKSArIGRheXMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vbnRocykge1xuICAgICAgICAgICAgc2V0TW9udGgobW9tLCBnZXRfc2V0X19nZXQobW9tLCAnTW9udGgnKSArIG1vbnRocyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KG1vbSwgZGF5cyB8fCBtb250aHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGFkZF9zdWJ0cmFjdF9fYWRkICAgICAgPSBjcmVhdGVBZGRlcigxLCAnYWRkJyk7XG4gICAgdmFyIGFkZF9zdWJ0cmFjdF9fc3VidHJhY3QgPSBjcmVhdGVBZGRlcigtMSwgJ3N1YnRyYWN0Jyk7XG5cbiAgICBmdW5jdGlvbiBtb21lbnRfY2FsZW5kYXJfX2NhbGVuZGFyICh0aW1lLCBmb3JtYXRzKSB7XG4gICAgICAgIC8vIFdlIHdhbnQgdG8gY29tcGFyZSB0aGUgc3RhcnQgb2YgdG9kYXksIHZzIHRoaXMuXG4gICAgICAgIC8vIEdldHRpbmcgc3RhcnQtb2YtdG9kYXkgZGVwZW5kcyBvbiB3aGV0aGVyIHdlJ3JlIGxvY2FsL3V0Yy9vZmZzZXQgb3Igbm90LlxuICAgICAgICB2YXIgbm93ID0gdGltZSB8fCBsb2NhbF9fY3JlYXRlTG9jYWwoKSxcbiAgICAgICAgICAgIHNvZCA9IGNsb25lV2l0aE9mZnNldChub3csIHRoaXMpLnN0YXJ0T2YoJ2RheScpLFxuICAgICAgICAgICAgZGlmZiA9IHRoaXMuZGlmZihzb2QsICdkYXlzJywgdHJ1ZSksXG4gICAgICAgICAgICBmb3JtYXQgPSBkaWZmIDwgLTYgPyAnc2FtZUVsc2UnIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgLTEgPyAnbGFzdFdlZWsnIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgMCA/ICdsYXN0RGF5JyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDEgPyAnc2FtZURheScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAyID8gJ25leHREYXknIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgNyA/ICduZXh0V2VlaycgOiAnc2FtZUVsc2UnO1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQoZm9ybWF0cyAmJiBmb3JtYXRzW2Zvcm1hdF0gfHwgdGhpcy5sb2NhbGVEYXRhKCkuY2FsZW5kYXIoZm9ybWF0LCB0aGlzLCBsb2NhbF9fY3JlYXRlTG9jYWwobm93KSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb25lICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNBZnRlciAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHZhciBpbnB1dE1zO1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHR5cGVvZiB1bml0cyAhPT0gJ3VuZGVmaW5lZCcgPyB1bml0cyA6ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzID4gK2lucHV0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXRNcyA9IGlzTW9tZW50KGlucHV0KSA/ICtpbnB1dCA6ICtsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0TXMgPCArdGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNCZWZvcmUgKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgaW5wdXRNcztcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh0eXBlb2YgdW5pdHMgIT09ICd1bmRlZmluZWQnID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArdGhpcyA8ICtpbnB1dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0TXMgPSBpc01vbWVudChpbnB1dCkgPyAraW5wdXQgOiArbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArdGhpcy5jbG9uZSgpLmVuZE9mKHVuaXRzKSA8IGlucHV0TXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0JldHdlZW4gKGZyb20sIHRvLCB1bml0cykge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0FmdGVyKGZyb20sIHVuaXRzKSAmJiB0aGlzLmlzQmVmb3JlKHRvLCB1bml0cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNTYW1lIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGlucHV0TXM7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMgfHwgJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgaW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMgPT09ICtpbnB1dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0TXMgPSArbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArKHRoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKSkgPD0gaW5wdXRNcyAmJiBpbnB1dE1zIDw9ICsodGhpcy5jbG9uZSgpLmVuZE9mKHVuaXRzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaWZmIChpbnB1dCwgdW5pdHMsIGFzRmxvYXQpIHtcbiAgICAgICAgdmFyIHRoYXQgPSBjbG9uZVdpdGhPZmZzZXQoaW5wdXQsIHRoaXMpLFxuICAgICAgICAgICAgem9uZURlbHRhID0gKHRoYXQudXRjT2Zmc2V0KCkgLSB0aGlzLnV0Y09mZnNldCgpKSAqIDZlNCxcbiAgICAgICAgICAgIGRlbHRhLCBvdXRwdXQ7XG5cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgaWYgKHVuaXRzID09PSAneWVhcicgfHwgdW5pdHMgPT09ICdtb250aCcgfHwgdW5pdHMgPT09ICdxdWFydGVyJykge1xuICAgICAgICAgICAgb3V0cHV0ID0gbW9udGhEaWZmKHRoaXMsIHRoYXQpO1xuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgLyAzO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0IC8gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWx0YSA9IHRoaXMgLSB0aGF0O1xuICAgICAgICAgICAgb3V0cHV0ID0gdW5pdHMgPT09ICdzZWNvbmQnID8gZGVsdGEgLyAxZTMgOiAvLyAxMDAwXG4gICAgICAgICAgICAgICAgdW5pdHMgPT09ICdtaW51dGUnID8gZGVsdGEgLyA2ZTQgOiAvLyAxMDAwICogNjBcbiAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ2hvdXInID8gZGVsdGEgLyAzNmU1IDogLy8gMTAwMCAqIDYwICogNjBcbiAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ2RheScgPyAoZGVsdGEgLSB6b25lRGVsdGEpIC8gODY0ZTUgOiAvLyAxMDAwICogNjAgKiA2MCAqIDI0LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICAgICAgdW5pdHMgPT09ICd3ZWVrJyA/IChkZWx0YSAtIHpvbmVEZWx0YSkgLyA2MDQ4ZTUgOiAvLyAxMDAwICogNjAgKiA2MCAqIDI0ICogNywgbmVnYXRlIGRzdFxuICAgICAgICAgICAgICAgIGRlbHRhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhc0Zsb2F0ID8gb3V0cHV0IDogYWJzRmxvb3Iob3V0cHV0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb250aERpZmYgKGEsIGIpIHtcbiAgICAgICAgLy8gZGlmZmVyZW5jZSBpbiBtb250aHNcbiAgICAgICAgdmFyIHdob2xlTW9udGhEaWZmID0gKChiLnllYXIoKSAtIGEueWVhcigpKSAqIDEyKSArIChiLm1vbnRoKCkgLSBhLm1vbnRoKCkpLFxuICAgICAgICAgICAgLy8gYiBpcyBpbiAoYW5jaG9yIC0gMSBtb250aCwgYW5jaG9yICsgMSBtb250aClcbiAgICAgICAgICAgIGFuY2hvciA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYsICdtb250aHMnKSxcbiAgICAgICAgICAgIGFuY2hvcjIsIGFkanVzdDtcblxuICAgICAgICBpZiAoYiAtIGFuY2hvciA8IDApIHtcbiAgICAgICAgICAgIGFuY2hvcjIgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmIC0gMSwgJ21vbnRocycpO1xuICAgICAgICAgICAgLy8gbGluZWFyIGFjcm9zcyB0aGUgbW9udGhcbiAgICAgICAgICAgIGFkanVzdCA9IChiIC0gYW5jaG9yKSAvIChhbmNob3IgLSBhbmNob3IyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuY2hvcjIgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmICsgMSwgJ21vbnRocycpO1xuICAgICAgICAgICAgLy8gbGluZWFyIGFjcm9zcyB0aGUgbW9udGhcbiAgICAgICAgICAgIGFkanVzdCA9IChiIC0gYW5jaG9yKSAvIChhbmNob3IyIC0gYW5jaG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAtKHdob2xlTW9udGhEaWZmICsgYWRqdXN0KTtcbiAgICB9XG5cbiAgICB1dGlsc19ob29rc19faG9va3MuZGVmYXVsdEZvcm1hdCA9ICdZWVlZLU1NLUREVEhIOm1tOnNzWic7XG5cbiAgICBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsb25lKCkubG9jYWxlKCdlbicpLmZvcm1hdCgnZGRkIE1NTSBERCBZWVlZIEhIOm1tOnNzIFtHTVRdWlonKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRfZm9ybWF0X190b0lTT1N0cmluZyAoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcy5jbG9uZSgpLnV0YygpO1xuICAgICAgICBpZiAoMCA8IG0ueWVhcigpICYmIG0ueWVhcigpIDw9IDk5OTkpIHtcbiAgICAgICAgICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAvLyBuYXRpdmUgaW1wbGVtZW50YXRpb24gaXMgfjUweCBmYXN0ZXIsIHVzZSBpdCB3aGVuIHdlIGNhblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgJ1lZWVktTU0tRERbVF1ISDptbTpzcy5TU1NbWl0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgJ1lZWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0IChpbnB1dFN0cmluZykge1xuICAgICAgICB2YXIgb3V0cHV0ID0gZm9ybWF0TW9tZW50KHRoaXMsIGlucHV0U3RyaW5nIHx8IHV0aWxzX2hvb2tzX19ob29rcy5kZWZhdWx0Rm9ybWF0KTtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLnBvc3Rmb3JtYXQob3V0cHV0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmcm9tICh0aW1lLCB3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKHt0bzogdGhpcywgZnJvbTogdGltZX0pLmxvY2FsZSh0aGlzLmxvY2FsZSgpKS5odW1hbml6ZSghd2l0aG91dFN1ZmZpeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbU5vdyAod2l0aG91dFN1ZmZpeCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mcm9tKGxvY2FsX19jcmVhdGVMb2NhbCgpLCB3aXRob3V0U3VmZml4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0byAodGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3JlYXRlX19jcmVhdGVEdXJhdGlvbih7ZnJvbTogdGhpcywgdG86IHRpbWV9KS5sb2NhbGUodGhpcy5sb2NhbGUoKSkuaHVtYW5pemUoIXdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvTm93ICh3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvKGxvY2FsX19jcmVhdGVMb2NhbCgpLCB3aXRob3V0U3VmZml4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGUgKGtleSkge1xuICAgICAgICB2YXIgbmV3TG9jYWxlRGF0YTtcblxuICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGUuX2FiYnI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdMb2NhbGVEYXRhID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZShrZXkpO1xuICAgICAgICAgICAgaWYgKG5ld0xvY2FsZURhdGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvY2FsZSA9IG5ld0xvY2FsZURhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsYW5nID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50KCkubGFuZygpIGlzIGRlcHJlY2F0ZWQuIEluc3RlYWQsIHVzZSBtb21lbnQoKS5sb2NhbGVEYXRhKCkgdG8gZ2V0IHRoZSBsYW5ndWFnZSBjb25maWd1cmF0aW9uLiBVc2UgbW9tZW50KCkubG9jYWxlKCkgdG8gY2hhbmdlIGxhbmd1YWdlcy4nLFxuICAgICAgICBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZShrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZURhdGEgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0YXJ0T2YgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAvLyB0aGUgZm9sbG93aW5nIHN3aXRjaCBpbnRlbnRpb25hbGx5IG9taXRzIGJyZWFrIGtleXdvcmRzXG4gICAgICAgIC8vIHRvIHV0aWxpemUgZmFsbGluZyB0aHJvdWdoIHRoZSBjYXNlcy5cbiAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgICAgIHRoaXMubW9udGgoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ3F1YXJ0ZXInOlxuICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgICB0aGlzLmRhdGUoMSk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ3dlZWsnOlxuICAgICAgICBjYXNlICdpc29XZWVrJzpcbiAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgICAgIHRoaXMuaG91cnMoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ2hvdXInOlxuICAgICAgICAgICAgdGhpcy5taW51dGVzKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdtaW51dGUnOlxuICAgICAgICAgICAgdGhpcy5zZWNvbmRzKDApO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdzZWNvbmQnOlxuICAgICAgICAgICAgdGhpcy5taWxsaXNlY29uZHMoMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3ZWVrcyBhcmUgYSBzcGVjaWFsIGNhc2VcbiAgICAgICAgaWYgKHVuaXRzID09PSAnd2VlaycpIHtcbiAgICAgICAgICAgIHRoaXMud2Vla2RheSgwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodW5pdHMgPT09ICdpc29XZWVrJykge1xuICAgICAgICAgICAgdGhpcy5pc29XZWVrZGF5KDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcXVhcnRlcnMgYXJlIGFsc28gc3BlY2lhbFxuICAgICAgICBpZiAodW5pdHMgPT09ICdxdWFydGVyJykge1xuICAgICAgICAgICAgdGhpcy5tb250aChNYXRoLmZsb29yKHRoaXMubW9udGgoKSAvIDMpICogMyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmRPZiAodW5pdHMpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gdW5kZWZpbmVkIHx8IHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zdGFydE9mKHVuaXRzKS5hZGQoMSwgKHVuaXRzID09PSAnaXNvV2VlaycgPyAnd2VlaycgOiB1bml0cykpLnN1YnRyYWN0KDEsICdtcycpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvX3R5cGVfX3ZhbHVlT2YgKCkge1xuICAgICAgICByZXR1cm4gK3RoaXMuX2QgLSAoKHRoaXMuX29mZnNldCB8fCAwKSAqIDYwMDAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bml4ICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoK3RoaXMgLyAxMDAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0RhdGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0ID8gbmV3IERhdGUoK3RoaXMpIDogdGhpcy5fZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0FycmF5ICgpIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzO1xuICAgICAgICByZXR1cm4gW20ueWVhcigpLCBtLm1vbnRoKCksIG0uZGF0ZSgpLCBtLmhvdXIoKSwgbS5taW51dGUoKSwgbS5zZWNvbmQoKSwgbS5taWxsaXNlY29uZCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b09iamVjdCAoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHllYXJzOiBtLnllYXIoKSxcbiAgICAgICAgICAgIG1vbnRoczogbS5tb250aCgpLFxuICAgICAgICAgICAgZGF0ZTogbS5kYXRlKCksXG4gICAgICAgICAgICBob3VyczogbS5ob3VycygpLFxuICAgICAgICAgICAgbWludXRlczogbS5taW51dGVzKCksXG4gICAgICAgICAgICBzZWNvbmRzOiBtLnNlY29uZHMoKSxcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kczogbS5taWxsaXNlY29uZHMoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbWVudF92YWxpZF9faXNWYWxpZCAoKSB7XG4gICAgICAgIHJldHVybiB2YWxpZF9faXNWYWxpZCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzaW5nRmxhZ3MgKCkge1xuICAgICAgICByZXR1cm4gZXh0ZW5kKHt9LCBnZXRQYXJzaW5nRmxhZ3ModGhpcykpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGludmFsaWRBdCAoKSB7XG4gICAgICAgIHJldHVybiBnZXRQYXJzaW5nRmxhZ3ModGhpcykub3ZlcmZsb3c7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydnZycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndlZWtZZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ0dHJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNvV2Vla1llYXIoKSAlIDEwMDtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4gKHRva2VuLCBnZXR0ZXIpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4oMCwgW3Rva2VuLCB0b2tlbi5sZW5ndGhdLCAwLCBnZXR0ZXIpO1xuICAgIH1cblxuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ2dnZ2cnLCAgICAgJ3dlZWtZZWFyJyk7XG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignZ2dnZ2cnLCAgICAnd2Vla1llYXInKTtcbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdHR0dHJywgICdpc29XZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ0dHR0dHJywgJ2lzb1dlZWtZZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3dlZWtZZWFyJywgJ2dnJyk7XG4gICAgYWRkVW5pdEFsaWFzKCdpc29XZWVrWWVhcicsICdHRycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignRycsICAgICAgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2cnLCAgICAgIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdHRycsICAgICBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignZ2cnLCAgICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHR0cnLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdnZ2dnJywgICBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignR0dHR0cnLCAgbWF0Y2gxdG82LCBtYXRjaDYpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnZ2dnJywgIG1hdGNoMXRvNiwgbWF0Y2g2KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZ2dnZycsICdnZ2dnZycsICdHR0dHJywgJ0dHR0dHJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuLnN1YnN0cigwLCAyKV0gPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2dnJywgJ0dHJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuXSA9IHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICBmdW5jdGlvbiB3ZWVrc0luWWVhcih5ZWFyLCBkb3csIGRveSkge1xuICAgICAgICByZXR1cm4gd2Vla09mWWVhcihsb2NhbF9fY3JlYXRlTG9jYWwoW3llYXIsIDExLCAzMSArIGRvdyAtIGRveV0pLCBkb3csIGRveSkud2VlaztcbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRXZWVrWWVhciAoaW5wdXQpIHtcbiAgICAgICAgdmFyIHllYXIgPSB3ZWVrT2ZZZWFyKHRoaXMsIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRvdywgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG95KS55ZWFyO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHllYXIgOiB0aGlzLmFkZCgoaW5wdXQgLSB5ZWFyKSwgJ3knKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09XZWVrWWVhciAoaW5wdXQpIHtcbiAgICAgICAgdmFyIHllYXIgPSB3ZWVrT2ZZZWFyKHRoaXMsIDEsIDQpLnllYXI7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8geWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIHllYXIpLCAneScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldElTT1dlZWtzSW5ZZWFyICgpIHtcbiAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCAxLCA0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRXZWVrc0luWWVhciAoKSB7XG4gICAgICAgIHZhciB3ZWVrSW5mbyA9IHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrO1xuICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIHdlZWtJbmZvLmRvdywgd2Vla0luZm8uZG95KTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbignUScsIDAsIDAsICdxdWFydGVyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3F1YXJ0ZXInLCAnUScpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignUScsIG1hdGNoMSk7XG4gICAgYWRkUGFyc2VUb2tlbignUScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbTU9OVEhdID0gKHRvSW50KGlucHV0KSAtIDEpICogMztcbiAgICB9KTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldFF1YXJ0ZXIgKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gTWF0aC5jZWlsKCh0aGlzLm1vbnRoKCkgKyAxKSAvIDMpIDogdGhpcy5tb250aCgoaW5wdXQgLSAxKSAqIDMgKyB0aGlzLm1vbnRoKCkgJSAzKTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbignRCcsIFsnREQnLCAyXSwgJ0RvJywgJ2RhdGUnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF0ZScsICdEJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdEJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignREQnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignRG8nLCBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gaXNTdHJpY3QgPyBsb2NhbGUuX29yZGluYWxQYXJzZSA6IGxvY2FsZS5fb3JkaW5hbFBhcnNlTGVuaWVudDtcbiAgICB9KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydEJywgJ0REJ10sIERBVEUpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ0RvJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtEQVRFXSA9IHRvSW50KGlucHV0Lm1hdGNoKG1hdGNoMXRvMilbMF0sIDEwKTtcbiAgICB9KTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXREYXlPZk1vbnRoID0gbWFrZUdldFNldCgnRGF0ZScsIHRydWUpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2QnLCAwLCAnZG8nLCAnZGF5Jyk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5c01pbih0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZGRkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXModGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdlJywgMCwgMCwgJ3dlZWtkYXknKTtcbiAgICBhZGRGb3JtYXRUb2tlbignRScsIDAsIDAsICdpc29XZWVrZGF5Jyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RheScsICdkJyk7XG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrZGF5JywgJ2UnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWtkYXknLCAnRScpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignZCcsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignZScsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignRScsICAgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignZGQnLCAgIG1hdGNoV29yZCk7XG4gICAgYWRkUmVnZXhUb2tlbignZGRkJywgIG1hdGNoV29yZCk7XG4gICAgYWRkUmVnZXhUb2tlbignZGRkZCcsIG1hdGNoV29yZCk7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2RkJywgJ2RkZCcsICdkZGRkJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnKSB7XG4gICAgICAgIHZhciB3ZWVrZGF5ID0gY29uZmlnLl9sb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCk7XG4gICAgICAgIC8vIGlmIHdlIGRpZG4ndCBnZXQgYSB3ZWVrZGF5IG5hbWUsIG1hcmsgdGhlIGRhdGUgYXMgaW52YWxpZFxuICAgICAgICBpZiAod2Vla2RheSAhPSBudWxsKSB7XG4gICAgICAgICAgICB3ZWVrLmQgPSB3ZWVrZGF5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuaW52YWxpZFdlZWtkYXkgPSBpbnB1dDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydkJywgJ2UnLCAnRSddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbl0gPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICBmdW5jdGlvbiBwYXJzZVdlZWtkYXkoaW5wdXQsIGxvY2FsZSkge1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc05hTihpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUludChpbnB1dCwgMTApO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5wdXQgPSBsb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCk7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWtkYXlzID0gJ1N1bmRheV9Nb25kYXlfVHVlc2RheV9XZWRuZXNkYXlfVGh1cnNkYXlfRnJpZGF5X1NhdHVyZGF5Jy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzIChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1ttLmRheSgpXTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQgPSAnU3VuX01vbl9UdWVfV2VkX1RodV9GcmlfU2F0Jy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzU2hvcnQgKG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRbbS5kYXkoKV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5c01pbiA9ICdTdV9Nb19UdV9XZV9UaF9Gcl9TYScuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c01pbiAobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNNaW5bbS5kYXkoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNQYXJzZSAod2Vla2RheU5hbWUpIHtcbiAgICAgICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZSA9IHRoaXMuX3dlZWtkYXlzUGFyc2UgfHwgW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICBtb20gPSBsb2NhbF9fY3JlYXRlTG9jYWwoWzIwMDAsIDFdKS5kYXkoaSk7XG4gICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLndlZWtkYXlzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldERheU9mV2VlayAoaW5wdXQpIHtcbiAgICAgICAgdmFyIGRheSA9IHRoaXMuX2lzVVRDID8gdGhpcy5fZC5nZXRVVENEYXkoKSA6IHRoaXMuX2QuZ2V0RGF5KCk7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpbnB1dCA9IHBhcnNlV2Vla2RheShpbnB1dCwgdGhpcy5sb2NhbGVEYXRhKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkKGlucHV0IC0gZGF5LCAnZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRheTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldExvY2FsZURheU9mV2VlayAoaW5wdXQpIHtcbiAgICAgICAgdmFyIHdlZWtkYXkgPSAodGhpcy5kYXkoKSArIDcgLSB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3cpICUgNztcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrZGF5IDogdGhpcy5hZGQoaW5wdXQgLSB3ZWVrZGF5LCAnZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT0RheU9mV2VlayAoaW5wdXQpIHtcbiAgICAgICAgLy8gYmVoYXZlcyB0aGUgc2FtZSBhcyBtb21lbnQjZGF5IGV4Y2VwdFxuICAgICAgICAvLyBhcyBhIGdldHRlciwgcmV0dXJucyA3IGluc3RlYWQgb2YgMCAoMS03IHJhbmdlIGluc3RlYWQgb2YgMC02KVxuICAgICAgICAvLyBhcyBhIHNldHRlciwgc3VuZGF5IHNob3VsZCBiZWxvbmcgdG8gdGhlIHByZXZpb3VzIHdlZWsuXG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gdGhpcy5kYXkoKSB8fCA3IDogdGhpcy5kYXkodGhpcy5kYXkoKSAlIDcgPyBpbnB1dCA6IGlucHV0IC0gNyk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0gnLCBbJ0hIJywgMl0sIDAsICdob3VyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ2gnLCBbJ2hoJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaG91cnMoKSAlIDEyIHx8IDEyO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gbWVyaWRpZW0gKHRva2VuLCBsb3dlcmNhc2UpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4odG9rZW4sIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tZXJpZGllbSh0aGlzLmhvdXJzKCksIHRoaXMubWludXRlcygpLCBsb3dlcmNhc2UpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtZXJpZGllbSgnYScsIHRydWUpO1xuICAgIG1lcmlkaWVtKCdBJywgZmFsc2UpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdob3VyJywgJ2gnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGZ1bmN0aW9uIG1hdGNoTWVyaWRpZW0gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5fbWVyaWRpZW1QYXJzZTtcbiAgICB9XG5cbiAgICBhZGRSZWdleFRva2VuKCdhJywgIG1hdGNoTWVyaWRpZW0pO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0EnLCAgbWF0Y2hNZXJpZGllbSk7XG4gICAgYWRkUmVnZXhUb2tlbignSCcsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2gnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdISCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdoaCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydIJywgJ0hIJ10sIEhPVVIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydhJywgJ0EnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5faXNQbSA9IGNvbmZpZy5fbG9jYWxlLmlzUE0oaW5wdXQpO1xuICAgICAgICBjb25maWcuX21lcmlkaWVtID0gaW5wdXQ7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ2gnLCAnaGgnXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGFycmF5W0hPVVJdID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIC8vIExPQ0FMRVNcblxuICAgIGZ1bmN0aW9uIGxvY2FsZUlzUE0gKGlucHV0KSB7XG4gICAgICAgIC8vIElFOCBRdWlya3MgTW9kZSAmIElFNyBTdGFuZGFyZHMgTW9kZSBkbyBub3QgYWxsb3cgYWNjZXNzaW5nIHN0cmluZ3MgbGlrZSBhcnJheXNcbiAgICAgICAgLy8gVXNpbmcgY2hhckF0IHNob3VsZCBiZSBtb3JlIGNvbXBhdGlibGUuXG4gICAgICAgIHJldHVybiAoKGlucHV0ICsgJycpLnRvTG93ZXJDYXNlKCkuY2hhckF0KDApID09PSAncCcpO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlTWVyaWRpZW1QYXJzZSA9IC9bYXBdXFwuP20/XFwuPy9pO1xuICAgIGZ1bmN0aW9uIGxvY2FsZU1lcmlkaWVtIChob3VycywgbWludXRlcywgaXNMb3dlcikge1xuICAgICAgICBpZiAoaG91cnMgPiAxMSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAncG0nIDogJ1BNJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ2FtJyA6ICdBTSc7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIC8vIFNldHRpbmcgdGhlIGhvdXIgc2hvdWxkIGtlZXAgdGhlIHRpbWUsIGJlY2F1c2UgdGhlIHVzZXIgZXhwbGljaXRseVxuICAgIC8vIHNwZWNpZmllZCB3aGljaCBob3VyIGhlIHdhbnRzLiBTbyB0cnlpbmcgdG8gbWFpbnRhaW4gdGhlIHNhbWUgaG91ciAoaW5cbiAgICAvLyBhIG5ldyB0aW1lem9uZSkgbWFrZXMgc2Vuc2UuIEFkZGluZy9zdWJ0cmFjdGluZyBob3VycyBkb2VzIG5vdCBmb2xsb3dcbiAgICAvLyB0aGlzIHJ1bGUuXG4gICAgdmFyIGdldFNldEhvdXIgPSBtYWtlR2V0U2V0KCdIb3VycycsIHRydWUpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ20nLCBbJ21tJywgMl0sIDAsICdtaW51dGUnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnbWludXRlJywgJ20nKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ20nLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdtbScsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRQYXJzZVRva2VuKFsnbScsICdtbSddLCBNSU5VVEUpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldE1pbnV0ZSA9IG1ha2VHZXRTZXQoJ01pbnV0ZXMnLCBmYWxzZSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigncycsIFsnc3MnLCAyXSwgMCwgJ3NlY29uZCcpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdzZWNvbmQnLCAncycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbigncycsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3NzJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydzJywgJ3NzJ10sIFNFQ09ORCk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0U2Vjb25kID0gbWFrZUdldFNldCgnU2Vjb25kcycsIGZhbHNlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdTJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gfn4odGhpcy5taWxsaXNlY29uZCgpIC8gMTAwKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1MnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gfn4odGhpcy5taWxsaXNlY29uZCgpIC8gMTApO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1MnLCAzXSwgMCwgJ21pbGxpc2Vjb25kJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTJywgNF0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1MnLCA1XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTJywgNl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTJywgN10sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTU1MnLCA4XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTU1NTJywgOV0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDAwMDA7XG4gICAgfSk7XG5cblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnbWlsbGlzZWNvbmQnLCAnbXMnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1MnLCAgICBtYXRjaDF0bzMsIG1hdGNoMSk7XG4gICAgYWRkUmVnZXhUb2tlbignU1MnLCAgIG1hdGNoMXRvMywgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdTU1MnLCAgbWF0Y2gxdG8zLCBtYXRjaDMpO1xuXG4gICAgdmFyIHRva2VuO1xuICAgIGZvciAodG9rZW4gPSAnU1NTUyc7IHRva2VuLmxlbmd0aCA8PSA5OyB0b2tlbiArPSAnUycpIHtcbiAgICAgICAgYWRkUmVnZXhUb2tlbih0b2tlbiwgbWF0Y2hVbnNpZ25lZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VNcyhpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbTUlMTElTRUNPTkRdID0gdG9JbnQoKCcwLicgKyBpbnB1dCkgKiAxMDAwKTtcbiAgICB9XG5cbiAgICBmb3IgKHRva2VuID0gJ1MnOyB0b2tlbi5sZW5ndGggPD0gOTsgdG9rZW4gKz0gJ1MnKSB7XG4gICAgICAgIGFkZFBhcnNlVG9rZW4odG9rZW4sIHBhcnNlTXMpO1xuICAgIH1cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0TWlsbGlzZWNvbmQgPSBtYWtlR2V0U2V0KCdNaWxsaXNlY29uZHMnLCBmYWxzZSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigneicsICAwLCAwLCAnem9uZUFiYnInKTtcbiAgICBhZGRGb3JtYXRUb2tlbignenonLCAwLCAwLCAnem9uZU5hbWUnKTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFpvbmVBYmJyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ1VUQycgOiAnJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRab25lTmFtZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/ICdDb29yZGluYXRlZCBVbml2ZXJzYWwgVGltZScgOiAnJztcbiAgICB9XG5cbiAgICB2YXIgbW9tZW50UHJvdG90eXBlX19wcm90byA9IE1vbWVudC5wcm90b3R5cGU7XG5cbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmFkZCAgICAgICAgICA9IGFkZF9zdWJ0cmFjdF9fYWRkO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uY2FsZW5kYXIgICAgID0gbW9tZW50X2NhbGVuZGFyX19jYWxlbmRhcjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmNsb25lICAgICAgICA9IGNsb25lO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGlmZiAgICAgICAgID0gZGlmZjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmVuZE9mICAgICAgICA9IGVuZE9mO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZm9ybWF0ICAgICAgID0gZm9ybWF0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZnJvbSAgICAgICAgID0gZnJvbTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmZyb21Ob3cgICAgICA9IGZyb21Ob3c7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50byAgICAgICAgICAgPSB0bztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvTm93ICAgICAgICA9IHRvTm93O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZ2V0ICAgICAgICAgID0gZ2V0U2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaW52YWxpZEF0ICAgID0gaW52YWxpZEF0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNBZnRlciAgICAgID0gaXNBZnRlcjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzQmVmb3JlICAgICA9IGlzQmVmb3JlO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNCZXR3ZWVuICAgID0gaXNCZXR3ZWVuO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNTYW1lICAgICAgID0gaXNTYW1lO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNWYWxpZCAgICAgID0gbW9tZW50X3ZhbGlkX19pc1ZhbGlkO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubGFuZyAgICAgICAgID0gbGFuZztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmxvY2FsZSAgICAgICA9IGxvY2FsZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmxvY2FsZURhdGEgICA9IGxvY2FsZURhdGE7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5tYXggICAgICAgICAgPSBwcm90b3R5cGVNYXg7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5taW4gICAgICAgICAgPSBwcm90b3R5cGVNaW47XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5wYXJzaW5nRmxhZ3MgPSBwYXJzaW5nRmxhZ3M7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5zZXQgICAgICAgICAgPSBnZXRTZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5zdGFydE9mICAgICAgPSBzdGFydE9mO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uc3VidHJhY3QgICAgID0gYWRkX3N1YnRyYWN0X19zdWJ0cmFjdDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvQXJyYXkgICAgICA9IHRvQXJyYXk7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b09iamVjdCAgICAgPSB0b09iamVjdDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvRGF0ZSAgICAgICA9IHRvRGF0ZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvSVNPU3RyaW5nICA9IG1vbWVudF9mb3JtYXRfX3RvSVNPU3RyaW5nO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9KU09OICAgICAgID0gbW9tZW50X2Zvcm1hdF9fdG9JU09TdHJpbmc7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b1N0cmluZyAgICAgPSB0b1N0cmluZztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnVuaXggICAgICAgICA9IHVuaXg7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by52YWx1ZU9mICAgICAgPSB0b190eXBlX192YWx1ZU9mO1xuXG4gICAgLy8gWWVhclxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ueWVhciAgICAgICA9IGdldFNldFllYXI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0xlYXBZZWFyID0gZ2V0SXNMZWFwWWVhcjtcblxuICAgIC8vIFdlZWsgWWVhclxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ud2Vla1llYXIgICAgPSBnZXRTZXRXZWVrWWVhcjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWtZZWFyID0gZ2V0U2V0SVNPV2Vla1llYXI7XG5cbiAgICAvLyBRdWFydGVyXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5xdWFydGVyID0gbW9tZW50UHJvdG90eXBlX19wcm90by5xdWFydGVycyA9IGdldFNldFF1YXJ0ZXI7XG5cbiAgICAvLyBNb250aFxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubW9udGggICAgICAgPSBnZXRTZXRNb250aDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRheXNJbk1vbnRoID0gZ2V0RGF5c0luTW9udGg7XG5cbiAgICAvLyBXZWVrXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrICAgICAgICAgICA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8ud2Vla3MgICAgICAgID0gZ2V0U2V0V2VlaztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWsgICAgICAgID0gbW9tZW50UHJvdG90eXBlX19wcm90by5pc29XZWVrcyAgICAgPSBnZXRTZXRJU09XZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ud2Vla3NJblllYXIgICAgPSBnZXRXZWVrc0luWWVhcjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWtzSW5ZZWFyID0gZ2V0SVNPV2Vla3NJblllYXI7XG5cbiAgICAvLyBEYXlcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmRhdGUgICAgICAgPSBnZXRTZXREYXlPZk1vbnRoO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF5ICAgICAgICA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF5cyAgICAgICAgICAgICA9IGdldFNldERheU9mV2VlaztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLndlZWtkYXkgICAgPSBnZXRTZXRMb2NhbGVEYXlPZldlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc29XZWVrZGF5ID0gZ2V0U2V0SVNPRGF5T2ZXZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF5T2ZZZWFyICA9IGdldFNldERheU9mWWVhcjtcblxuICAgIC8vIEhvdXJcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmhvdXIgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmhvdXJzID0gZ2V0U2V0SG91cjtcblxuICAgIC8vIE1pbnV0ZVxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWludXRlID0gbW9tZW50UHJvdG90eXBlX19wcm90by5taW51dGVzID0gZ2V0U2V0TWludXRlO1xuXG4gICAgLy8gU2Vjb25kXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5zZWNvbmQgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnNlY29uZHMgPSBnZXRTZXRTZWNvbmQ7XG5cbiAgICAvLyBNaWxsaXNlY29uZFxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWlsbGlzZWNvbmQgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1pbGxpc2Vjb25kcyA9IGdldFNldE1pbGxpc2Vjb25kO1xuXG4gICAgLy8gT2Zmc2V0XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by51dGNPZmZzZXQgICAgICAgICAgICA9IGdldFNldE9mZnNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnV0YyAgICAgICAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9VVEM7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5sb2NhbCAgICAgICAgICAgICAgICA9IHNldE9mZnNldFRvTG9jYWw7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5wYXJzZVpvbmUgICAgICAgICAgICA9IHNldE9mZnNldFRvUGFyc2VkT2Zmc2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaGFzQWxpZ25lZEhvdXJPZmZzZXQgPSBoYXNBbGlnbmVkSG91ck9mZnNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzRFNUICAgICAgICAgICAgICAgID0gaXNEYXlsaWdodFNhdmluZ1RpbWU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0RTVFNoaWZ0ZWQgICAgICAgICA9IGlzRGF5bGlnaHRTYXZpbmdUaW1lU2hpZnRlZDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzTG9jYWwgICAgICAgICAgICAgID0gaXNMb2NhbDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzVXRjT2Zmc2V0ICAgICAgICAgID0gaXNVdGNPZmZzZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1V0YyAgICAgICAgICAgICAgICA9IGlzVXRjO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNVVEMgICAgICAgICAgICAgICAgPSBpc1V0YztcblxuICAgIC8vIFRpbWV6b25lXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by56b25lQWJiciA9IGdldFpvbmVBYmJyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uem9uZU5hbWUgPSBnZXRab25lTmFtZTtcblxuICAgIC8vIERlcHJlY2F0aW9uc1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF0ZXMgID0gZGVwcmVjYXRlKCdkYXRlcyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgZGF0ZSBpbnN0ZWFkLicsIGdldFNldERheU9mTW9udGgpO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubW9udGhzID0gZGVwcmVjYXRlKCdtb250aHMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbnRoIGluc3RlYWQnLCBnZXRTZXRNb250aCk7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by55ZWFycyAgPSBkZXByZWNhdGUoJ3llYXJzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSB5ZWFyIGluc3RlYWQnLCBnZXRTZXRZZWFyKTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnpvbmUgICA9IGRlcHJlY2F0ZSgnbW9tZW50KCkuem9uZSBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50KCkudXRjT2Zmc2V0IGluc3RlYWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNzc5JywgZ2V0U2V0Wm9uZSk7XG5cbiAgICB2YXIgbW9tZW50UHJvdG90eXBlID0gbW9tZW50UHJvdG90eXBlX19wcm90bztcblxuICAgIGZ1bmN0aW9uIG1vbWVudF9fY3JlYXRlVW5peCAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCAqIDEwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbWVudF9fY3JlYXRlSW5ab25lICgpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsX19jcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpLnBhcnNlWm9uZSgpO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0Q2FsZW5kYXIgPSB7XG4gICAgICAgIHNhbWVEYXkgOiAnW1RvZGF5IGF0XSBMVCcsXG4gICAgICAgIG5leHREYXkgOiAnW1RvbW9ycm93IGF0XSBMVCcsXG4gICAgICAgIG5leHRXZWVrIDogJ2RkZGQgW2F0XSBMVCcsXG4gICAgICAgIGxhc3REYXkgOiAnW1llc3RlcmRheSBhdF0gTFQnLFxuICAgICAgICBsYXN0V2VlayA6ICdbTGFzdF0gZGRkZCBbYXRdIExUJyxcbiAgICAgICAgc2FtZUVsc2UgOiAnTCdcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlX2NhbGVuZGFyX19jYWxlbmRhciAoa2V5LCBtb20sIG5vdykge1xuICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5fY2FsZW5kYXJba2V5XTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvdXRwdXQgPT09ICdmdW5jdGlvbicgPyBvdXRwdXQuY2FsbChtb20sIG5vdykgOiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb25nRGF0ZUZvcm1hdCA9IHtcbiAgICAgICAgTFRTICA6ICdoOm1tOnNzIEEnLFxuICAgICAgICBMVCAgIDogJ2g6bW0gQScsXG4gICAgICAgIEwgICAgOiAnTU0vREQvWVlZWScsXG4gICAgICAgIExMICAgOiAnTU1NTSBELCBZWVlZJyxcbiAgICAgICAgTExMICA6ICdNTU1NIEQsIFlZWVkgaDptbSBBJyxcbiAgICAgICAgTExMTCA6ICdkZGRkLCBNTU1NIEQsIFlZWVkgaDptbSBBJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb25nRGF0ZUZvcm1hdCAoa2V5KSB7XG4gICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldLFxuICAgICAgICAgICAgZm9ybWF0VXBwZXIgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXkudG9VcHBlckNhc2UoKV07XG5cbiAgICAgICAgaWYgKGZvcm1hdCB8fCAhZm9ybWF0VXBwZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldID0gZm9ybWF0VXBwZXIucmVwbGFjZSgvTU1NTXxNTXxERHxkZGRkL2csIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWwuc2xpY2UoMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0SW52YWxpZERhdGUgPSAnSW52YWxpZCBkYXRlJztcblxuICAgIGZ1bmN0aW9uIGludmFsaWREYXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludmFsaWREYXRlO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0T3JkaW5hbCA9ICclZCc7XG4gICAgdmFyIGRlZmF1bHRPcmRpbmFsUGFyc2UgPSAvXFxkezEsMn0vO1xuXG4gICAgZnVuY3Rpb24gb3JkaW5hbCAobnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vcmRpbmFsLnJlcGxhY2UoJyVkJywgbnVtYmVyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmVQYXJzZVBvc3RGb3JtYXQgKHN0cmluZykge1xuICAgICAgICByZXR1cm4gc3RyaW5nO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0UmVsYXRpdmVUaW1lID0ge1xuICAgICAgICBmdXR1cmUgOiAnaW4gJXMnLFxuICAgICAgICBwYXN0ICAgOiAnJXMgYWdvJyxcbiAgICAgICAgcyAgOiAnYSBmZXcgc2Vjb25kcycsXG4gICAgICAgIG0gIDogJ2EgbWludXRlJyxcbiAgICAgICAgbW0gOiAnJWQgbWludXRlcycsXG4gICAgICAgIGggIDogJ2FuIGhvdXInLFxuICAgICAgICBoaCA6ICclZCBob3VycycsXG4gICAgICAgIGQgIDogJ2EgZGF5JyxcbiAgICAgICAgZGQgOiAnJWQgZGF5cycsXG4gICAgICAgIE0gIDogJ2EgbW9udGgnLFxuICAgICAgICBNTSA6ICclZCBtb250aHMnLFxuICAgICAgICB5ICA6ICdhIHllYXInLFxuICAgICAgICB5eSA6ICclZCB5ZWFycydcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcmVsYXRpdmVfX3JlbGF0aXZlVGltZSAobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbc3RyaW5nXTtcbiAgICAgICAgcmV0dXJuICh0eXBlb2Ygb3V0cHV0ID09PSAnZnVuY3Rpb24nKSA/XG4gICAgICAgICAgICBvdXRwdXQobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSA6XG4gICAgICAgICAgICBvdXRwdXQucmVwbGFjZSgvJWQvaSwgbnVtYmVyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXN0RnV0dXJlIChkaWZmLCBvdXRwdXQpIHtcbiAgICAgICAgdmFyIGZvcm1hdCA9IHRoaXMuX3JlbGF0aXZlVGltZVtkaWZmID4gMCA/ICdmdXR1cmUnIDogJ3Bhc3QnXTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBmb3JtYXQgPT09ICdmdW5jdGlvbicgPyBmb3JtYXQob3V0cHV0KSA6IGZvcm1hdC5yZXBsYWNlKC8lcy9pLCBvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZV9zZXRfX3NldCAoY29uZmlnKSB7XG4gICAgICAgIHZhciBwcm9wLCBpO1xuICAgICAgICBmb3IgKGkgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICBwcm9wID0gY29uZmlnW2ldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhpc1tpXSA9IHByb3A7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXNbJ18nICsgaV0gPSBwcm9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIExlbmllbnQgb3JkaW5hbCBwYXJzaW5nIGFjY2VwdHMganVzdCBhIG51bWJlciBpbiBhZGRpdGlvbiB0b1xuICAgICAgICAvLyBudW1iZXIgKyAocG9zc2libHkpIHN0dWZmIGNvbWluZyBmcm9tIF9vcmRpbmFsUGFyc2VMZW5pZW50LlxuICAgICAgICB0aGlzLl9vcmRpbmFsUGFyc2VMZW5pZW50ID0gbmV3IFJlZ0V4cCh0aGlzLl9vcmRpbmFsUGFyc2Uuc291cmNlICsgJ3wnICsgKC9cXGR7MSwyfS8pLnNvdXJjZSk7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvdHlwZV9fcHJvdG8gPSBMb2NhbGUucHJvdG90eXBlO1xuXG4gICAgcHJvdG90eXBlX19wcm90by5fY2FsZW5kYXIgICAgICAgPSBkZWZhdWx0Q2FsZW5kYXI7XG4gICAgcHJvdG90eXBlX19wcm90by5jYWxlbmRhciAgICAgICAgPSBsb2NhbGVfY2FsZW5kYXJfX2NhbGVuZGFyO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX2xvbmdEYXRlRm9ybWF0ID0gZGVmYXVsdExvbmdEYXRlRm9ybWF0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8ubG9uZ0RhdGVGb3JtYXQgID0gbG9uZ0RhdGVGb3JtYXQ7XG4gICAgcHJvdG90eXBlX19wcm90by5faW52YWxpZERhdGUgICAgPSBkZWZhdWx0SW52YWxpZERhdGU7XG4gICAgcHJvdG90eXBlX19wcm90by5pbnZhbGlkRGF0ZSAgICAgPSBpbnZhbGlkRGF0ZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9vcmRpbmFsICAgICAgICA9IGRlZmF1bHRPcmRpbmFsO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ub3JkaW5hbCAgICAgICAgID0gb3JkaW5hbDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9vcmRpbmFsUGFyc2UgICA9IGRlZmF1bHRPcmRpbmFsUGFyc2U7XG4gICAgcHJvdG90eXBlX19wcm90by5wcmVwYXJzZSAgICAgICAgPSBwcmVQYXJzZVBvc3RGb3JtYXQ7XG4gICAgcHJvdG90eXBlX19wcm90by5wb3N0Zm9ybWF0ICAgICAgPSBwcmVQYXJzZVBvc3RGb3JtYXQ7XG4gICAgcHJvdG90eXBlX19wcm90by5fcmVsYXRpdmVUaW1lICAgPSBkZWZhdWx0UmVsYXRpdmVUaW1lO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ucmVsYXRpdmVUaW1lICAgID0gcmVsYXRpdmVfX3JlbGF0aXZlVGltZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnBhc3RGdXR1cmUgICAgICA9IHBhc3RGdXR1cmU7XG4gICAgcHJvdG90eXBlX19wcm90by5zZXQgICAgICAgICAgICAgPSBsb2NhbGVfc2V0X19zZXQ7XG5cbiAgICAvLyBNb250aFxuICAgIHByb3RvdHlwZV9fcHJvdG8ubW9udGhzICAgICAgID0gICAgICAgIGxvY2FsZU1vbnRocztcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9tb250aHMgICAgICA9IGRlZmF1bHRMb2NhbGVNb250aHM7XG4gICAgcHJvdG90eXBlX19wcm90by5tb250aHNTaG9ydCAgPSAgICAgICAgbG9jYWxlTW9udGhzU2hvcnQ7XG4gICAgcHJvdG90eXBlX19wcm90by5fbW9udGhzU2hvcnQgPSBkZWZhdWx0TG9jYWxlTW9udGhzU2hvcnQ7XG4gICAgcHJvdG90eXBlX19wcm90by5tb250aHNQYXJzZSAgPSAgICAgICAgbG9jYWxlTW9udGhzUGFyc2U7XG5cbiAgICAvLyBXZWVrXG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrID0gbG9jYWxlV2VlaztcbiAgICBwcm90b3R5cGVfX3Byb3RvLl93ZWVrID0gZGVmYXVsdExvY2FsZVdlZWs7XG4gICAgcHJvdG90eXBlX19wcm90by5maXJzdERheU9mWWVhciA9IGxvY2FsZUZpcnN0RGF5T2ZZZWFyO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uZmlyc3REYXlPZldlZWsgPSBsb2NhbGVGaXJzdERheU9mV2VlaztcblxuICAgIC8vIERheSBvZiBXZWVrXG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrZGF5cyAgICAgICA9ICAgICAgICBsb2NhbGVXZWVrZGF5cztcbiAgICBwcm90b3R5cGVfX3Byb3RvLl93ZWVrZGF5cyAgICAgID0gZGVmYXVsdExvY2FsZVdlZWtkYXlzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ud2Vla2RheXNNaW4gICAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNNaW47XG4gICAgcHJvdG90eXBlX19wcm90by5fd2Vla2RheXNNaW4gICA9IGRlZmF1bHRMb2NhbGVXZWVrZGF5c01pbjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWtkYXlzU2hvcnQgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzU2hvcnQ7XG4gICAgcHJvdG90eXBlX19wcm90by5fd2Vla2RheXNTaG9ydCA9IGRlZmF1bHRMb2NhbGVXZWVrZGF5c1Nob3J0O1xuICAgIHByb3RvdHlwZV9fcHJvdG8ud2Vla2RheXNQYXJzZSAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNQYXJzZTtcblxuICAgIC8vIEhvdXJzXG4gICAgcHJvdG90eXBlX19wcm90by5pc1BNID0gbG9jYWxlSXNQTTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9tZXJpZGllbVBhcnNlID0gZGVmYXVsdExvY2FsZU1lcmlkaWVtUGFyc2U7XG4gICAgcHJvdG90eXBlX19wcm90by5tZXJpZGllbSA9IGxvY2FsZU1lcmlkaWVtO1xuXG4gICAgZnVuY3Rpb24gbGlzdHNfX2dldCAoZm9ybWF0LCBpbmRleCwgZmllbGQsIHNldHRlcikge1xuICAgICAgICB2YXIgbG9jYWxlID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZSgpO1xuICAgICAgICB2YXIgdXRjID0gY3JlYXRlX3V0Y19fY3JlYXRlVVRDKCkuc2V0KHNldHRlciwgaW5kZXgpO1xuICAgICAgICByZXR1cm4gbG9jYWxlW2ZpZWxkXSh1dGMsIGZvcm1hdCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdCAoZm9ybWF0LCBpbmRleCwgZmllbGQsIGNvdW50LCBzZXR0ZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmb3JtYXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBpbmRleCA9IGZvcm1hdDtcbiAgICAgICAgICAgIGZvcm1hdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCAnJztcblxuICAgICAgICBpZiAoaW5kZXggIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3RzX19nZXQoZm9ybWF0LCBpbmRleCwgZmllbGQsIHNldHRlcik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIG91dCA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgb3V0W2ldID0gbGlzdHNfX2dldChmb3JtYXQsIGksIGZpZWxkLCBzZXR0ZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdHNfX2xpc3RNb250aHMgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QoZm9ybWF0LCBpbmRleCwgJ21vbnRocycsIDEyLCAnbW9udGgnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fbGlzdE1vbnRoc1Nob3J0IChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0KGZvcm1hdCwgaW5kZXgsICdtb250aHNTaG9ydCcsIDEyLCAnbW9udGgnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fbGlzdFdlZWtkYXlzIChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0KGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5cycsIDcsICdkYXknKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fbGlzdFdlZWtkYXlzU2hvcnQgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QoZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzU2hvcnQnLCA3LCAnZGF5Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdHNfX2xpc3RXZWVrZGF5c01pbiAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnd2Vla2RheXNNaW4nLCA3LCAnZGF5Jyk7XG4gICAgfVxuXG4gICAgbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZSgnZW4nLCB7XG4gICAgICAgIG9yZGluYWxQYXJzZTogL1xcZHsxLDJ9KHRofHN0fG5kfHJkKS8sXG4gICAgICAgIG9yZGluYWwgOiBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgYiA9IG51bWJlciAlIDEwLFxuICAgICAgICAgICAgICAgIG91dHB1dCA9ICh0b0ludChudW1iZXIgJSAxMDAgLyAxMCkgPT09IDEpID8gJ3RoJyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDEpID8gJ3N0JyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDIpID8gJ25kJyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDMpID8gJ3JkJyA6ICd0aCc7XG4gICAgICAgICAgICByZXR1cm4gbnVtYmVyICsgb3V0cHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmxhbmcgPSBkZXByZWNhdGUoJ21vbWVudC5sYW5nIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQubG9jYWxlIGluc3RlYWQuJywgbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZSk7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmxhbmdEYXRhID0gZGVwcmVjYXRlKCdtb21lbnQubGFuZ0RhdGEgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbWVudC5sb2NhbGVEYXRhIGluc3RlYWQuJywgbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZSk7XG5cbiAgICB2YXIgbWF0aEFicyA9IE1hdGguYWJzO1xuXG4gICAgZnVuY3Rpb24gZHVyYXRpb25fYWJzX19hYnMgKCkge1xuICAgICAgICB2YXIgZGF0YSAgICAgICAgICAgPSB0aGlzLl9kYXRhO1xuXG4gICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyA9IG1hdGhBYnModGhpcy5fbWlsbGlzZWNvbmRzKTtcbiAgICAgICAgdGhpcy5fZGF5cyAgICAgICAgID0gbWF0aEFicyh0aGlzLl9kYXlzKTtcbiAgICAgICAgdGhpcy5fbW9udGhzICAgICAgID0gbWF0aEFicyh0aGlzLl9tb250aHMpO1xuXG4gICAgICAgIGRhdGEubWlsbGlzZWNvbmRzICA9IG1hdGhBYnMoZGF0YS5taWxsaXNlY29uZHMpO1xuICAgICAgICBkYXRhLnNlY29uZHMgICAgICAgPSBtYXRoQWJzKGRhdGEuc2Vjb25kcyk7XG4gICAgICAgIGRhdGEubWludXRlcyAgICAgICA9IG1hdGhBYnMoZGF0YS5taW51dGVzKTtcbiAgICAgICAgZGF0YS5ob3VycyAgICAgICAgID0gbWF0aEFicyhkYXRhLmhvdXJzKTtcbiAgICAgICAgZGF0YS5tb250aHMgICAgICAgID0gbWF0aEFicyhkYXRhLm1vbnRocyk7XG4gICAgICAgIGRhdGEueWVhcnMgICAgICAgICA9IG1hdGhBYnMoZGF0YS55ZWFycyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCAoZHVyYXRpb24sIGlucHV0LCB2YWx1ZSwgZGlyZWN0aW9uKSB7XG4gICAgICAgIHZhciBvdGhlciA9IGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24oaW5wdXQsIHZhbHVlKTtcblxuICAgICAgICBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzICs9IGRpcmVjdGlvbiAqIG90aGVyLl9taWxsaXNlY29uZHM7XG4gICAgICAgIGR1cmF0aW9uLl9kYXlzICAgICAgICAgKz0gZGlyZWN0aW9uICogb3RoZXIuX2RheXM7XG4gICAgICAgIGR1cmF0aW9uLl9tb250aHMgICAgICAgKz0gZGlyZWN0aW9uICogb3RoZXIuX21vbnRocztcblxuICAgICAgICByZXR1cm4gZHVyYXRpb24uX2J1YmJsZSgpO1xuICAgIH1cblxuICAgIC8vIHN1cHBvcnRzIG9ubHkgMi4wLXN0eWxlIGFkZCgxLCAncycpIG9yIGFkZChkdXJhdGlvbilcbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX2FkZCAoaW5wdXQsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0KHRoaXMsIGlucHV0LCB2YWx1ZSwgMSk7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgc3VidHJhY3QoMSwgJ3MnKSBvciBzdWJ0cmFjdChkdXJhdGlvbilcbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX3N1YnRyYWN0IChpbnB1dCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QodGhpcywgaW5wdXQsIHZhbHVlLCAtMSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzQ2VpbCAobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnViYmxlICgpIHtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMuX21pbGxpc2Vjb25kcztcbiAgICAgICAgdmFyIGRheXMgICAgICAgICA9IHRoaXMuX2RheXM7XG4gICAgICAgIHZhciBtb250aHMgICAgICAgPSB0aGlzLl9tb250aHM7XG4gICAgICAgIHZhciBkYXRhICAgICAgICAgPSB0aGlzLl9kYXRhO1xuICAgICAgICB2YXIgc2Vjb25kcywgbWludXRlcywgaG91cnMsIHllYXJzLCBtb250aHNGcm9tRGF5cztcblxuICAgICAgICAvLyBpZiB3ZSBoYXZlIGEgbWl4IG9mIHBvc2l0aXZlIGFuZCBuZWdhdGl2ZSB2YWx1ZXMsIGJ1YmJsZSBkb3duIGZpcnN0XG4gICAgICAgIC8vIGNoZWNrOiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMjE2NlxuICAgICAgICBpZiAoISgobWlsbGlzZWNvbmRzID49IDAgJiYgZGF5cyA+PSAwICYmIG1vbnRocyA+PSAwKSB8fFxuICAgICAgICAgICAgICAgIChtaWxsaXNlY29uZHMgPD0gMCAmJiBkYXlzIDw9IDAgJiYgbW9udGhzIDw9IDApKSkge1xuICAgICAgICAgICAgbWlsbGlzZWNvbmRzICs9IGFic0NlaWwobW9udGhzVG9EYXlzKG1vbnRocykgKyBkYXlzKSAqIDg2NGU1O1xuICAgICAgICAgICAgZGF5cyA9IDA7XG4gICAgICAgICAgICBtb250aHMgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBjb2RlIGJ1YmJsZXMgdXAgdmFsdWVzLCBzZWUgdGhlIHRlc3RzIGZvclxuICAgICAgICAvLyBleGFtcGxlcyBvZiB3aGF0IHRoYXQgbWVhbnMuXG4gICAgICAgIGRhdGEubWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzICUgMTAwMDtcblxuICAgICAgICBzZWNvbmRzICAgICAgICAgICA9IGFic0Zsb29yKG1pbGxpc2Vjb25kcyAvIDEwMDApO1xuICAgICAgICBkYXRhLnNlY29uZHMgICAgICA9IHNlY29uZHMgJSA2MDtcblxuICAgICAgICBtaW51dGVzICAgICAgICAgICA9IGFic0Zsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICAgIGRhdGEubWludXRlcyAgICAgID0gbWludXRlcyAlIDYwO1xuXG4gICAgICAgIGhvdXJzICAgICAgICAgICAgID0gYWJzRmxvb3IobWludXRlcyAvIDYwKTtcbiAgICAgICAgZGF0YS5ob3VycyAgICAgICAgPSBob3VycyAlIDI0O1xuXG4gICAgICAgIGRheXMgKz0gYWJzRmxvb3IoaG91cnMgLyAyNCk7XG5cbiAgICAgICAgLy8gY29udmVydCBkYXlzIHRvIG1vbnRoc1xuICAgICAgICBtb250aHNGcm9tRGF5cyA9IGFic0Zsb29yKGRheXNUb01vbnRocyhkYXlzKSk7XG4gICAgICAgIG1vbnRocyArPSBtb250aHNGcm9tRGF5cztcbiAgICAgICAgZGF5cyAtPSBhYnNDZWlsKG1vbnRoc1RvRGF5cyhtb250aHNGcm9tRGF5cykpO1xuXG4gICAgICAgIC8vIDEyIG1vbnRocyAtPiAxIHllYXJcbiAgICAgICAgeWVhcnMgPSBhYnNGbG9vcihtb250aHMgLyAxMik7XG4gICAgICAgIG1vbnRocyAlPSAxMjtcblxuICAgICAgICBkYXRhLmRheXMgICA9IGRheXM7XG4gICAgICAgIGRhdGEubW9udGhzID0gbW9udGhzO1xuICAgICAgICBkYXRhLnllYXJzICA9IHllYXJzO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheXNUb01vbnRocyAoZGF5cykge1xuICAgICAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxNDYwOTcgZGF5cyAodGFraW5nIGludG8gYWNjb3VudCBsZWFwIHllYXIgcnVsZXMpXG4gICAgICAgIC8vIDQwMCB5ZWFycyBoYXZlIDEyIG1vbnRocyA9PT0gNDgwMFxuICAgICAgICByZXR1cm4gZGF5cyAqIDQ4MDAgLyAxNDYwOTc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9udGhzVG9EYXlzIChtb250aHMpIHtcbiAgICAgICAgLy8gdGhlIHJldmVyc2Ugb2YgZGF5c1RvTW9udGhzXG4gICAgICAgIHJldHVybiBtb250aHMgKiAxNDYwOTcgLyA0ODAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFzICh1bml0cykge1xuICAgICAgICB2YXIgZGF5cztcbiAgICAgICAgdmFyIG1vbnRocztcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMuX21pbGxpc2Vjb25kcztcblxuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcblxuICAgICAgICBpZiAodW5pdHMgPT09ICdtb250aCcgfHwgdW5pdHMgPT09ICd5ZWFyJykge1xuICAgICAgICAgICAgZGF5cyAgID0gdGhpcy5fZGF5cyAgICsgbWlsbGlzZWNvbmRzIC8gODY0ZTU7XG4gICAgICAgICAgICBtb250aHMgPSB0aGlzLl9tb250aHMgKyBkYXlzVG9Nb250aHMoZGF5cyk7XG4gICAgICAgICAgICByZXR1cm4gdW5pdHMgPT09ICdtb250aCcgPyBtb250aHMgOiBtb250aHMgLyAxMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBtaWxsaXNlY29uZHMgc2VwYXJhdGVseSBiZWNhdXNlIG9mIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIChpc3N1ZSAjMTg2NylcbiAgICAgICAgICAgIGRheXMgPSB0aGlzLl9kYXlzICsgTWF0aC5yb3VuZChtb250aHNUb0RheXModGhpcy5fbW9udGhzKSk7XG4gICAgICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnd2VlaycgICA6IHJldHVybiBkYXlzIC8gNyAgICAgKyBtaWxsaXNlY29uZHMgLyA2MDQ4ZTU7XG4gICAgICAgICAgICAgICAgY2FzZSAnZGF5JyAgICA6IHJldHVybiBkYXlzICAgICAgICAgKyBtaWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdob3VyJyAgIDogcmV0dXJuIGRheXMgKiAyNCAgICArIG1pbGxpc2Vjb25kcyAvIDM2ZTU7XG4gICAgICAgICAgICAgICAgY2FzZSAnbWludXRlJyA6IHJldHVybiBkYXlzICogMTQ0MCAgKyBtaWxsaXNlY29uZHMgLyA2ZTQ7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2Vjb25kJyA6IHJldHVybiBkYXlzICogODY0MDAgKyBtaWxsaXNlY29uZHMgLyAxMDAwO1xuICAgICAgICAgICAgICAgIC8vIE1hdGguZmxvb3IgcHJldmVudHMgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgaGVyZVxuICAgICAgICAgICAgICAgIGNhc2UgJ21pbGxpc2Vjb25kJzogcmV0dXJuIE1hdGguZmxvb3IoZGF5cyAqIDg2NGU1KSArIG1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gdW5pdCAnICsgdW5pdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVE9ETzogVXNlIHRoaXMuYXMoJ21zJyk/XG4gICAgZnVuY3Rpb24gZHVyYXRpb25fYXNfX3ZhbHVlT2YgKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzICtcbiAgICAgICAgICAgIHRoaXMuX2RheXMgKiA4NjRlNSArXG4gICAgICAgICAgICAodGhpcy5fbW9udGhzICUgMTIpICogMjU5MmU2ICtcbiAgICAgICAgICAgIHRvSW50KHRoaXMuX21vbnRocyAvIDEyKSAqIDMxNTM2ZTZcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlQXMgKGFsaWFzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcyhhbGlhcyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGFzTWlsbGlzZWNvbmRzID0gbWFrZUFzKCdtcycpO1xuICAgIHZhciBhc1NlY29uZHMgICAgICA9IG1ha2VBcygncycpO1xuICAgIHZhciBhc01pbnV0ZXMgICAgICA9IG1ha2VBcygnbScpO1xuICAgIHZhciBhc0hvdXJzICAgICAgICA9IG1ha2VBcygnaCcpO1xuICAgIHZhciBhc0RheXMgICAgICAgICA9IG1ha2VBcygnZCcpO1xuICAgIHZhciBhc1dlZWtzICAgICAgICA9IG1ha2VBcygndycpO1xuICAgIHZhciBhc01vbnRocyAgICAgICA9IG1ha2VBcygnTScpO1xuICAgIHZhciBhc1llYXJzICAgICAgICA9IG1ha2VBcygneScpO1xuXG4gICAgZnVuY3Rpb24gZHVyYXRpb25fZ2V0X19nZXQgKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICByZXR1cm4gdGhpc1t1bml0cyArICdzJ10oKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlR2V0dGVyKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhW25hbWVdO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBtaWxsaXNlY29uZHMgPSBtYWtlR2V0dGVyKCdtaWxsaXNlY29uZHMnKTtcbiAgICB2YXIgc2Vjb25kcyAgICAgID0gbWFrZUdldHRlcignc2Vjb25kcycpO1xuICAgIHZhciBtaW51dGVzICAgICAgPSBtYWtlR2V0dGVyKCdtaW51dGVzJyk7XG4gICAgdmFyIGhvdXJzICAgICAgICA9IG1ha2VHZXR0ZXIoJ2hvdXJzJyk7XG4gICAgdmFyIGRheXMgICAgICAgICA9IG1ha2VHZXR0ZXIoJ2RheXMnKTtcbiAgICB2YXIgbW9udGhzICAgICAgID0gbWFrZUdldHRlcignbW9udGhzJyk7XG4gICAgdmFyIHllYXJzICAgICAgICA9IG1ha2VHZXR0ZXIoJ3llYXJzJyk7XG5cbiAgICBmdW5jdGlvbiB3ZWVrcyAoKSB7XG4gICAgICAgIHJldHVybiBhYnNGbG9vcih0aGlzLmRheXMoKSAvIDcpO1xuICAgIH1cblxuICAgIHZhciByb3VuZCA9IE1hdGgucm91bmQ7XG4gICAgdmFyIHRocmVzaG9sZHMgPSB7XG4gICAgICAgIHM6IDQ1LCAgLy8gc2Vjb25kcyB0byBtaW51dGVcbiAgICAgICAgbTogNDUsICAvLyBtaW51dGVzIHRvIGhvdXJcbiAgICAgICAgaDogMjIsICAvLyBob3VycyB0byBkYXlcbiAgICAgICAgZDogMjYsICAvLyBkYXlzIHRvIG1vbnRoXG4gICAgICAgIE06IDExICAgLy8gbW9udGhzIHRvIHllYXJcbiAgICB9O1xuXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uIGZvciBtb21lbnQuZm4uZnJvbSwgbW9tZW50LmZuLmZyb21Ob3csIGFuZCBtb21lbnQuZHVyYXRpb24uZm4uaHVtYW5pemVcbiAgICBmdW5jdGlvbiBzdWJzdGl0dXRlVGltZUFnbyhzdHJpbmcsIG51bWJlciwgd2l0aG91dFN1ZmZpeCwgaXNGdXR1cmUsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLnJlbGF0aXZlVGltZShudW1iZXIgfHwgMSwgISF3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9odW1hbml6ZV9fcmVsYXRpdmVUaW1lIChwb3NOZWdEdXJhdGlvbiwgd2l0aG91dFN1ZmZpeCwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24ocG9zTmVnRHVyYXRpb24pLmFicygpO1xuICAgICAgICB2YXIgc2Vjb25kcyAgPSByb3VuZChkdXJhdGlvbi5hcygncycpKTtcbiAgICAgICAgdmFyIG1pbnV0ZXMgID0gcm91bmQoZHVyYXRpb24uYXMoJ20nKSk7XG4gICAgICAgIHZhciBob3VycyAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdoJykpO1xuICAgICAgICB2YXIgZGF5cyAgICAgPSByb3VuZChkdXJhdGlvbi5hcygnZCcpKTtcbiAgICAgICAgdmFyIG1vbnRocyAgID0gcm91bmQoZHVyYXRpb24uYXMoJ00nKSk7XG4gICAgICAgIHZhciB5ZWFycyAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCd5JykpO1xuXG4gICAgICAgIHZhciBhID0gc2Vjb25kcyA8IHRocmVzaG9sZHMucyAmJiBbJ3MnLCBzZWNvbmRzXSAgfHxcbiAgICAgICAgICAgICAgICBtaW51dGVzID09PSAxICAgICAgICAgICYmIFsnbSddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPCB0aHJlc2hvbGRzLm0gJiYgWydtbScsIG1pbnV0ZXNdIHx8XG4gICAgICAgICAgICAgICAgaG91cnMgICA9PT0gMSAgICAgICAgICAmJiBbJ2gnXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBob3VycyAgIDwgdGhyZXNob2xkcy5oICYmIFsnaGgnLCBob3Vyc10gICB8fFxuICAgICAgICAgICAgICAgIGRheXMgICAgPT09IDEgICAgICAgICAgJiYgWydkJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgZGF5cyAgICA8IHRocmVzaG9sZHMuZCAmJiBbJ2RkJywgZGF5c10gICAgfHxcbiAgICAgICAgICAgICAgICBtb250aHMgID09PSAxICAgICAgICAgICYmIFsnTSddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIG1vbnRocyAgPCB0aHJlc2hvbGRzLk0gJiYgWydNTScsIG1vbnRoc10gIHx8XG4gICAgICAgICAgICAgICAgeWVhcnMgICA9PT0gMSAgICAgICAgICAmJiBbJ3knXSAgICAgICAgICAgfHwgWyd5eScsIHllYXJzXTtcblxuICAgICAgICBhWzJdID0gd2l0aG91dFN1ZmZpeDtcbiAgICAgICAgYVszXSA9ICtwb3NOZWdEdXJhdGlvbiA+IDA7XG4gICAgICAgIGFbNF0gPSBsb2NhbGU7XG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRlVGltZUFnby5hcHBseShudWxsLCBhKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gc2V0IGEgdGhyZXNob2xkIGZvciByZWxhdGl2ZSB0aW1lIHN0cmluZ3NcbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9odW1hbml6ZV9fZ2V0U2V0UmVsYXRpdmVUaW1lVGhyZXNob2xkICh0aHJlc2hvbGQsIGxpbWl0KSB7XG4gICAgICAgIGlmICh0aHJlc2hvbGRzW3RocmVzaG9sZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaW1pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhyZXNob2xkc1t0aHJlc2hvbGRdO1xuICAgICAgICB9XG4gICAgICAgIHRocmVzaG9sZHNbdGhyZXNob2xkXSA9IGxpbWl0O1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBodW1hbml6ZSAod2l0aFN1ZmZpeCkge1xuICAgICAgICB2YXIgbG9jYWxlID0gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgICAgIHZhciBvdXRwdXQgPSBkdXJhdGlvbl9odW1hbml6ZV9fcmVsYXRpdmVUaW1lKHRoaXMsICF3aXRoU3VmZml4LCBsb2NhbGUpO1xuXG4gICAgICAgIGlmICh3aXRoU3VmZml4KSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBsb2NhbGUucGFzdEZ1dHVyZSgrdGhpcywgb3V0cHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsb2NhbGUucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgIH1cblxuICAgIHZhciBpc29fc3RyaW5nX19hYnMgPSBNYXRoLmFicztcblxuICAgIGZ1bmN0aW9uIGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nKCkge1xuICAgICAgICAvLyBmb3IgSVNPIHN0cmluZ3Mgd2UgZG8gbm90IHVzZSB0aGUgbm9ybWFsIGJ1YmJsaW5nIHJ1bGVzOlxuICAgICAgICAvLyAgKiBtaWxsaXNlY29uZHMgYnViYmxlIHVwIHVudGlsIHRoZXkgYmVjb21lIGhvdXJzXG4gICAgICAgIC8vICAqIGRheXMgZG8gbm90IGJ1YmJsZSBhdCBhbGxcbiAgICAgICAgLy8gICogbW9udGhzIGJ1YmJsZSB1cCB1bnRpbCB0aGV5IGJlY29tZSB5ZWFyc1xuICAgICAgICAvLyBUaGlzIGlzIGJlY2F1c2UgdGhlcmUgaXMgbm8gY29udGV4dC1mcmVlIGNvbnZlcnNpb24gYmV0d2VlbiBob3VycyBhbmQgZGF5c1xuICAgICAgICAvLyAodGhpbmsgb2YgY2xvY2sgY2hhbmdlcylcbiAgICAgICAgLy8gYW5kIGFsc28gbm90IGJldHdlZW4gZGF5cyBhbmQgbW9udGhzICgyOC0zMSBkYXlzIHBlciBtb250aClcbiAgICAgICAgdmFyIHNlY29uZHMgPSBpc29fc3RyaW5nX19hYnModGhpcy5fbWlsbGlzZWNvbmRzKSAvIDEwMDA7XG4gICAgICAgIHZhciBkYXlzICAgICAgICAgPSBpc29fc3RyaW5nX19hYnModGhpcy5fZGF5cyk7XG4gICAgICAgIHZhciBtb250aHMgICAgICAgPSBpc29fc3RyaW5nX19hYnModGhpcy5fbW9udGhzKTtcbiAgICAgICAgdmFyIG1pbnV0ZXMsIGhvdXJzLCB5ZWFycztcblxuICAgICAgICAvLyAzNjAwIHNlY29uZHMgLT4gNjAgbWludXRlcyAtPiAxIGhvdXJcbiAgICAgICAgbWludXRlcyAgICAgICAgICAgPSBhYnNGbG9vcihzZWNvbmRzIC8gNjApO1xuICAgICAgICBob3VycyAgICAgICAgICAgICA9IGFic0Zsb29yKG1pbnV0ZXMgLyA2MCk7XG4gICAgICAgIHNlY29uZHMgJT0gNjA7XG4gICAgICAgIG1pbnV0ZXMgJT0gNjA7XG5cbiAgICAgICAgLy8gMTIgbW9udGhzIC0+IDEgeWVhclxuICAgICAgICB5ZWFycyAgPSBhYnNGbG9vcihtb250aHMgLyAxMik7XG4gICAgICAgIG1vbnRocyAlPSAxMjtcblxuXG4gICAgICAgIC8vIGluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9kb3JkaWxsZS9tb21lbnQtaXNvZHVyYXRpb24vYmxvYi9tYXN0ZXIvbW9tZW50Lmlzb2R1cmF0aW9uLmpzXG4gICAgICAgIHZhciBZID0geWVhcnM7XG4gICAgICAgIHZhciBNID0gbW9udGhzO1xuICAgICAgICB2YXIgRCA9IGRheXM7XG4gICAgICAgIHZhciBoID0gaG91cnM7XG4gICAgICAgIHZhciBtID0gbWludXRlcztcbiAgICAgICAgdmFyIHMgPSBzZWNvbmRzO1xuICAgICAgICB2YXIgdG90YWwgPSB0aGlzLmFzU2Vjb25kcygpO1xuXG4gICAgICAgIGlmICghdG90YWwpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIHNhbWUgYXMgQyMncyAoTm9kYSkgYW5kIHB5dGhvbiAoaXNvZGF0ZSkuLi5cbiAgICAgICAgICAgIC8vIGJ1dCBub3Qgb3RoZXIgSlMgKGdvb2cuZGF0ZSlcbiAgICAgICAgICAgIHJldHVybiAnUDBEJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAodG90YWwgPCAwID8gJy0nIDogJycpICtcbiAgICAgICAgICAgICdQJyArXG4gICAgICAgICAgICAoWSA/IFkgKyAnWScgOiAnJykgK1xuICAgICAgICAgICAgKE0gPyBNICsgJ00nIDogJycpICtcbiAgICAgICAgICAgIChEID8gRCArICdEJyA6ICcnKSArXG4gICAgICAgICAgICAoKGggfHwgbSB8fCBzKSA/ICdUJyA6ICcnKSArXG4gICAgICAgICAgICAoaCA/IGggKyAnSCcgOiAnJykgK1xuICAgICAgICAgICAgKG0gPyBtICsgJ00nIDogJycpICtcbiAgICAgICAgICAgIChzID8gcyArICdTJyA6ICcnKTtcbiAgICB9XG5cbiAgICB2YXIgZHVyYXRpb25fcHJvdG90eXBlX19wcm90byA9IER1cmF0aW9uLnByb3RvdHlwZTtcblxuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYWJzICAgICAgICAgICAgPSBkdXJhdGlvbl9hYnNfX2FicztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFkZCAgICAgICAgICAgID0gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGQ7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5zdWJ0cmFjdCAgICAgICA9IGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fc3VidHJhY3Q7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hcyAgICAgICAgICAgICA9IGFzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNNaWxsaXNlY29uZHMgPSBhc01pbGxpc2Vjb25kcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzU2Vjb25kcyAgICAgID0gYXNTZWNvbmRzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNNaW51dGVzICAgICAgPSBhc01pbnV0ZXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc0hvdXJzICAgICAgICA9IGFzSG91cnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc0RheXMgICAgICAgICA9IGFzRGF5cztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzV2Vla3MgICAgICAgID0gYXNXZWVrcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzTW9udGhzICAgICAgID0gYXNNb250aHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc1llYXJzICAgICAgICA9IGFzWWVhcnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by52YWx1ZU9mICAgICAgICA9IGR1cmF0aW9uX2FzX192YWx1ZU9mO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uX2J1YmJsZSAgICAgICAgPSBidWJibGU7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5nZXQgICAgICAgICAgICA9IGR1cmF0aW9uX2dldF9fZ2V0O1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubWlsbGlzZWNvbmRzICAgPSBtaWxsaXNlY29uZHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5zZWNvbmRzICAgICAgICA9IHNlY29uZHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5taW51dGVzICAgICAgICA9IG1pbnV0ZXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5ob3VycyAgICAgICAgICA9IGhvdXJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uZGF5cyAgICAgICAgICAgPSBkYXlzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ud2Vla3MgICAgICAgICAgPSB3ZWVrcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLm1vbnRocyAgICAgICAgID0gbW9udGhzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ueWVhcnMgICAgICAgICAgPSB5ZWFycztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmh1bWFuaXplICAgICAgID0gaHVtYW5pemU7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by50b0lTT1N0cmluZyAgICA9IGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udG9TdHJpbmcgICAgICAgPSBpc29fc3RyaW5nX190b0lTT1N0cmluZztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnRvSlNPTiAgICAgICAgID0gaXNvX3N0cmluZ19fdG9JU09TdHJpbmc7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5sb2NhbGUgICAgICAgICA9IGxvY2FsZTtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmxvY2FsZURhdGEgICAgID0gbG9jYWxlRGF0YTtcblxuICAgIC8vIERlcHJlY2F0aW9uc1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udG9Jc29TdHJpbmcgPSBkZXByZWNhdGUoJ3RvSXNvU3RyaW5nKCkgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0b0lTT1N0cmluZygpIGluc3RlYWQgKG5vdGljZSB0aGUgY2FwaXRhbHMpJywgaXNvX3N0cmluZ19fdG9JU09TdHJpbmcpO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubGFuZyA9IGxhbmc7XG5cbiAgICAvLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cbiAgICBhZGRGb3JtYXRUb2tlbignWCcsIDAsIDAsICd1bml4Jyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ3gnLCAwLCAwLCAndmFsdWVPZicpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbigneCcsIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdYJywgbWF0Y2hUaW1lc3RhbXApO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1gnLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUocGFyc2VGbG9hdChpbnB1dCwgMTApICogMTAwMCk7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbigneCcsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSh0b0ludChpbnB1dCkpO1xuICAgIH0pO1xuXG4gICAgLy8gU2lkZSBlZmZlY3QgaW1wb3J0c1xuXG5cbiAgICB1dGlsc19ob29rc19faG9va3MudmVyc2lvbiA9ICcyLjEwLjYnO1xuXG4gICAgc2V0SG9va0NhbGxiYWNrKGxvY2FsX19jcmVhdGVMb2NhbCk7XG5cbiAgICB1dGlsc19ob29rc19faG9va3MuZm4gICAgICAgICAgICAgICAgICAgID0gbW9tZW50UHJvdG90eXBlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5taW4gICAgICAgICAgICAgICAgICAgPSBtaW47XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm1heCAgICAgICAgICAgICAgICAgICA9IG1heDtcbiAgICB1dGlsc19ob29rc19faG9va3MudXRjICAgICAgICAgICAgICAgICAgID0gY3JlYXRlX3V0Y19fY3JlYXRlVVRDO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy51bml4ICAgICAgICAgICAgICAgICAgPSBtb21lbnRfX2NyZWF0ZVVuaXg7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm1vbnRocyAgICAgICAgICAgICAgICA9IGxpc3RzX19saXN0TW9udGhzO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5pc0RhdGUgICAgICAgICAgICAgICAgPSBpc0RhdGU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmxvY2FsZSAgICAgICAgICAgICAgICA9IGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmludmFsaWQgICAgICAgICAgICAgICA9IHZhbGlkX19jcmVhdGVJbnZhbGlkO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5kdXJhdGlvbiAgICAgICAgICAgICAgPSBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5pc01vbWVudCAgICAgICAgICAgICAgPSBpc01vbWVudDtcbiAgICB1dGlsc19ob29rc19faG9va3Mud2Vla2RheXMgICAgICAgICAgICAgID0gbGlzdHNfX2xpc3RXZWVrZGF5cztcbiAgICB1dGlsc19ob29rc19faG9va3MucGFyc2Vab25lICAgICAgICAgICAgID0gbW9tZW50X19jcmVhdGVJblpvbmU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmxvY2FsZURhdGEgICAgICAgICAgICA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmlzRHVyYXRpb24gICAgICAgICAgICA9IGlzRHVyYXRpb247XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm1vbnRoc1Nob3J0ICAgICAgICAgICA9IGxpc3RzX19saXN0TW9udGhzU2hvcnQ7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLndlZWtkYXlzTWluICAgICAgICAgICA9IGxpc3RzX19saXN0V2Vla2RheXNNaW47XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmRlZmluZUxvY2FsZSAgICAgICAgICA9IGRlZmluZUxvY2FsZTtcbiAgICB1dGlsc19ob29rc19faG9va3Mud2Vla2RheXNTaG9ydCAgICAgICAgID0gbGlzdHNfX2xpc3RXZWVrZGF5c1Nob3J0O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5ub3JtYWxpemVVbml0cyAgICAgICAgPSBub3JtYWxpemVVbml0cztcbiAgICB1dGlsc19ob29rc19faG9va3MucmVsYXRpdmVUaW1lVGhyZXNob2xkID0gZHVyYXRpb25faHVtYW5pemVfX2dldFNldFJlbGF0aXZlVGltZVRocmVzaG9sZDtcblxuICAgIHZhciBfbW9tZW50ID0gdXRpbHNfaG9va3NfX2hvb2tzO1xuXG4gICAgcmV0dXJuIF9tb21lbnQ7XG5cbn0pKTsiLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8geyBjYXRlZ29yeU5hbWU6XG4vLyAgIHsgaW50ZXJlc3ROYW1lOlxuLy8gICAgIHsgc291cmNlOiAnZmFjZWJvb2snLFxuLy8gICAgICAgY2xpY2tzOiA1LFxuLy8gICAgICAgYWRkZWQ6IERhdGUubm93KCkgfSxcbi8vICAgICAuLi5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzdGF0aWNJbnRlcmVzdHM6IHtcbiAgICBtdXNpYzogICAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAzMSwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAncm9jayBtdXNpYyxqYXp6LGNvbmNlcnRzLG9wZXJhJyB9LFxuICAgIFwiZnJlbmNoIGFjdG9yc1wiOiAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMzcsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdkcmFtYSxmaWxtJyB9LFxuICAgIGFjdG9yczogICAgICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDM1LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnY3plY2ggZmlsbSwgZmlsbScgfSxcbiAgICBzcGlyaXR1YWxpdHk6ICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAxOCwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ2xpdGVyYXR1cmUsbXVzaWMnIH0sXG4gICAgXCJjemVjaCBmaWxtXCI6ICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiA1NCwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ2ZpbG0sYWN0b3JzJyB9LFxuICAgIFwicm9jayBtdXNpY1wiOiAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMTIsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdtdXNpYycgfSxcbiAgICBcIndvcmxkIG11c2ljXCI6ICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDEwLCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnbXVzaWMnIH0sXG4gICAgamF6ejogICAgICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMTYsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ211c2ljJyB9LFxuICAgIHRlY2hub2xvZ3k6ICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDE5LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnaGVhbHRoLHNjaWVuY2UnIH0sXG4gICAgaGVhbHRoOiAgICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMjAsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ3NjaWVuY2UsZGVudGFsJyB9LFxuICAgIGRlbnRhbDogICAgICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDIxLCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnaGVhbHRoJyB9LFxuICAgIGNvbWljczogICAgICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDM0LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnaHVtb3IsbGl0ZXJhdHVyZScgfSxcbiAgICBodW1vcjogICAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAxMCwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ2FjdG9ycyxsaXRlcmF0dXJlJyB9LFxuICAgIGxpdGVyYXR1cmU6ICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDExLCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAndGhlYXRlcixjb21pY3MnIH0sXG4gICAgc2NpZW5jZTogICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMTMsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICd0ZWNobm9sb2d5LGhlYWx0aCcgfSxcbiAgICBkcmFtYTogICAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAxOSwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ3RoZWF0ZXIsZmlsbSxsaXRlcmF0dXJlJyB9LFxuICAgIHRoZWF0ZXI6ICAgICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDIwLCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnZHJhbWEsbGl0ZXJhdHVyZSxvcGVyYScgfSxcbiAgICBmaWxtOiAgICAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAyMSwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ2RyYW1hLGxpdGVyYXR1cmUsY29taWNzJyB9LFxuICAgIGNvbmNlcnRzOiAgICAgICAgICAgeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDMwLCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWxhdGVkOiAnbXVzaWMsdGhlYXRlcicgfSxcbiAgICBcImNvbnRlbXBvcmFyeSBhcnRcIjogeyBzb3VyY2U6ICd0aWNrZXRwcm8nLCBjbGlja3M6IDE4LCBhZGRlZDogRGF0ZS5ub3coKSwgc2VsZWN0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdsaXRlcmF0dXJlLGZpbG0sdGhlYXRlcicgfSxcbiAgICBvcGVyYTogICAgICAgICAgICAgIHsgc291cmNlOiAndGlja2V0cHJvJywgY2xpY2tzOiAyNSwgYWRkZWQ6IERhdGUubm93KCksIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRlZDogJ211c2ljLHRoZWF0ZXInIH0sXG4gICAgZml0bmVzczogICAgICAgICAgICB7IHNvdXJjZTogJ3RpY2tldHBybycsIGNsaWNrczogMTYsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlbGF0ZWQ6ICdoZWFsdGgsc2NpZW5jZScgfVxuICB9LFxuXG4gIGNhcGl0YWxpemU6IGZ1bmN0aW9uKHMpIHtcbiAgICByZXR1cm4oc1swXS50b1VwcGVyQ2FzZSgpICsgcy5zdWJzdHIoMSkpO1xuICB9LFxuXG4gIGJsaW5rTm9kZXM6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdibGlua05vZGVzISEhISEhJyk7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHZhciBzZWxlY3RlZEludGVyZXN0cyA9IE9iamVjdC5rZXlzKHRoaXMuc3RhdGljSW50ZXJlc3RzKS5maWx0ZXIoZnVuY3Rpb24oaW50ZXJlc3QpIHtcbiAgICAgIHJldHVybiB0aGF0LnN0YXRpY0ludGVyZXN0c1tpbnRlcmVzdF1bJ3NlbGVjdGVkJ107XG4gICAgfSkucmVkdWNlKGZ1bmN0aW9uKGlzLCBpKSB7XG4gICAgICBpc1tpXSA9IHRoYXQuc3RhdGljSW50ZXJlc3RzW2ldO1xuICAgICAgcmV0dXJuIGlzO1xuICAgIH0sIHt9KTtcbiAgICB2YXIgc2VsZWN0ZWRJbnRlcmVzdEtleXMgPSBPYmplY3Qua2V5cyhzZWxlY3RlZEludGVyZXN0cyk7XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoc2VsZWN0ZWRJbnRlcmVzdEtleXMpKTtcblxuICAgICQoXCIqW3ZkbmFjbGFzc11cIikuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgIGlmKCQoZWwpLmF0dHIoJ3ZkbmFjbGFzcycpLnNwbGl0KC8sLykucmVkdWNlKGZ1bmN0aW9uKHNob3dPckhpZGUsIGtleXdvcmQpIHtcbiAgICAgICAgcmV0dXJuIHNob3dPckhpZGUgfHwgKHNlbGVjdGVkSW50ZXJlc3RLZXlzLmluZGV4T2Yoa2V5d29yZCkgPiAtMSk7XG4gICAgICB9LCBmYWxzZSkpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3Nob3dpbmcgJyArICQoZWwpLmF0dHIoJ3ZkbmFjbGFzcycpKTtcbiAgICAgICAgJChlbCkuc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2hpZGluZyAnICsgJChlbCkuYXR0cigndmRuYWNsYXNzJykpO1xuICAgICAgICAkKGVsKS5oaWRlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLypcbiAgIGFkZEludGVyZXN0OiBmdW5jdGlvbihjYXRlZ29yeSwgaW50ZXJlc3QpIHtcbiAgICAgc3RhdGljRGF0YVtjYXRlZ29yeV1baW50ZXJlc3RdID0geyBjYXRlZ29yeTogY2F0ZWdvcnksIHNvdXJjZTogJ3ZkbmEnLCBjbGlja3M6IDEsIGFkZGVkOiBEYXRlLm5vdygpLCBzZWxlY3RlZDogdHJ1ZSB9O1xuICAgfSxcbiAgICovXG5cbiAgYWRkSW50ZXJlc3Q6IGZ1bmN0aW9uKGludGVyZXN0KSB7XG4gICAgaWYodGhpcy5zdGF0aWNJbnRlcmVzdHNbaW50ZXJlc3RdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc3RhdGljSW50ZXJlc3RzW2ludGVyZXN0XVsnc2VsZWN0ZWQnXSA9IHRydWU7XG4gICAgICB0aGlzLmJsaW5rTm9kZXMoKTtcbiAgICAgIC8vIFJlYWN0LnJlbmRlcig8VmRuYU1lbnUgLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2ZG5hbWVudScpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIC8qXG4gICB2YXIgYWRkUmVsYXRlZEludGVyZXN0ID0gZnVuY3Rpb24oY2F0ZWdvcnksIGludGVyZXN0KSB7XG4gICAgIHN0YXRpY0RhdGFbY2F0ZWdvcnldW2ludGVyZXN0XVsnc2VsZWN0ZWQnXSA9IHRydWU7XG4gICAgIFJlYWN0LnJlbmRlcig8VmRuYU1lbnUgLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2ZG5hbWVudScpKTtcbiAgIH0sXG4gICAqL1xuXG4gIGFkZFJlbGF0ZWRJbnRlcmVzdDogZnVuY3Rpb24oaW50ZXJlc3QpIHtcbiAgICB0aGlzLnN0YXRpY0ludGVyZXN0c1tpbnRlcmVzdF1bJ3NlbGVjdGVkJ10gPSB0cnVlO1xuICAgIHRoaXMuYmxpbmtOb2RlcygpO1xuICAgIC8vIFJlYWN0LnJlbmRlcig8VmRuYU1lbnUgLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2ZG5hbWVudScpKTtcbiAgfSxcblxuICAvKlxuICAgdW5MaWtlQW5JbnRlcmVzdDogZnVuY3Rpb24oY2F0ZWdvcnksIGludGVyZXN0KSB7XG4gICAgIHN0YXRpY0RhdGFbY2F0ZWdvcnldW2ludGVyZXN0XVsnc2VsZWN0ZWQnXSA9IGZhbHNlO1xuICAgICBSZWFjdC5yZW5kZXIoPFZkbmFNZW51IC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmRuYW1lbnUnKSk7XG4gICB9LFxuICAgKi9cblxuICB1bkxpa2VBbkludGVyZXN0OiBmdW5jdGlvbihpbnRlcmVzdCkge1xuICAgIHRoaXMuc3RhdGljSW50ZXJlc3RzW2ludGVyZXN0XVsnc2VsZWN0ZWQnXSA9IGZhbHNlO1xuICAgIHRoaXMuYmxpbmtOb2RlcygpO1xuICAgIC8vIFJlYWN0LnJlbmRlcig8VmRuYU1lbnUgLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2ZG5hbWVudScpKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIE1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xudmFyIGRhdGEgPSByZXF1aXJlKCd2ZG5hL3N0YXRpY19kYXRhJyk7XG4vLyB2YXIgQXV0b2NvbXBsZXRlID0gcmVxdWlyZSgncmVhY3QtYXV0b2NvbXBsZXRlL2xpYi9tYWluLmpzJyk7XG4vLyB2YXIgQ29tYm9ib3ggPSBBdXRvY29tcGxldGUuQ29tYm9ib3g7XG4vLyB2YXIgQ29tYm9ib3hPcHRpb24gPSBBdXRvY29tcGxldGUuQ29tYm9ib3hPcHRpb247XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEF1dG9jb21wbGV0ZSBjb2RlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBBdXRvY29tcGxldGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnQXV0b2NvbXBsZXRlJyxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5fc2V0SW5wdXRGcm9tVmFsdWUoKTtcbiAgICB2YXIgaGlnaGxpZ2h0ZWRJbmRleDtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4gICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgLy8gZW50ZXIuXG4gICAgICAgICAgY29uc29sZS5sb2coJ0VOVEVSIScpO1xuICAgICAgICAgIHRoYXQucHJvcHMuYWRkTGlrZURvbmUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA5OlxuICAgICAgICAgIC8vIHRhYlxuICAgICAgICAgIGNvbnNvbGUubG9nKCdUQUIhJyk7XG4gICAgICAgICAgdGhhdC5fc2V0RnJvbUhpZ2hsaWdodGVkKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgLy8gdXBcbiAgICAgICAgICBoaWdobGlnaHRlZEluZGV4ID0gdGhhdC5faGlnaGxpZ2h0ZWRJbmRleCgpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdVUCEgJyArIGhpZ2hsaWdodGVkSW5kZXgpO1xuICAgICAgICAgIGlmIChoaWdobGlnaHRlZEluZGV4ID4gMCkge1xuICAgICAgICAgICAgdGhhdC5zZXRTdGF0ZSh7IGhpZ2hsaWdodGVkVmFsdWU6IHRoYXQuX2N1cnJlbnRNYXRjaGVzKClbaGlnaGxpZ2h0ZWRJbmRleCAtIDFdIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAvLyBkb3duXG4gICAgICAgICAgaGlnaGxpZ2h0ZWRJbmRleCA9IHRoYXQuX2hpZ2hsaWdodGVkSW5kZXgoKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRE9XTiEgJyArIGhpZ2hsaWdodGVkSW5kZXgpO1xuICAgICAgICAgIGlmIChoaWdobGlnaHRlZEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgdGhhdC5zZXRTdGF0ZSh7IGhpZ2hsaWdodGVkVmFsdWU6IHRoYXQuX2N1cnJlbnRNYXRjaGVzKClbMF0gfSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChoaWdobGlnaHRlZEluZGV4IDwgdGhhdC5fY3VycmVudE1hdGNoZXMoKS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICB0aGF0LnNldFN0YXRlKHsgaGlnaGxpZ2h0ZWRWYWx1ZTogdGhhdC5fY3VycmVudE1hdGNoZXMoKVtoaWdobGlnaHRlZEluZGV4ICsgMV0gfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZWZhdWx0VmFsdWU6ICdhcHBsZScsXG4gICAgICBsaW1pdFRvTGlzdDogdHJ1ZSxcbiAgICAgIG1heEl0ZW1zU2hvd246IDgsXG4gICAgICBzb3VyY2VVcmw6IG51bGwsXG4gICAgICBkZWZhdWx0TGlzdDogWydhcHBsZScsICdiYW5hbmEnLCAnb3JhbmdlJywgJ2dyYXBlJywgJ2NoZXJyeSddLFxuICAgICAgYWxzb1NlYXJjaFZhbHVlczogZmFsc2UsXG4gICAgICBsb2FkVXJsT25jZTogdHJ1ZSxcbiAgICAgIHNlbGVjdEFsbFRleHRPbkNsaWNrOiB0cnVlLFxuICAgICAgb25Ob01hdGNoOiBmdW5jdGlvbiBvbk5vTWF0Y2goc3RhdGUpIHt9XG4gICAgfTtcbiAgfSxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpc3Q6IHRoaXMucHJvcHMuZGVmYXVsdExpc3QsXG4gICAgICBjdXJyZW50VmFsdWU6IHRoaXMucHJvcHMuZGVmYXVsdFZhbHVlLFxuICAgICAgaGlnaGxpZ2h0ZWRWYWx1ZTogdGhpcy5wcm9wcy5kZWZhdWx0VmFsdWUsXG4gICAgICBzaG93RW50cmllczogZmFsc2VcbiAgICB9O1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgZW50cmllcyA9IHRoaXMuc3RhdGUuc2hvd0VudHJpZXMgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ29sJyxcbiAgICAgIHsgc3R5bGU6IHsgcG9zaXRpb246ICdhYnNvbHV0ZScsIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJywgY29sb3I6ICdibGFjaycsIGxpc3RTdHlsZTogJ25vbmUnLCBwYWRkaW5nOiAwLCBtYXJnaW46IDAgfSwgb25Nb3VzZUxlYXZlOiB0aGlzLl9vbkVudHJ5TW91c2VPdXQgfSxcbiAgICAgIHRoaXMuX3JlbmRlck1hdGNoZXMoKVxuICAgICkgOiAnJztcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JywgeyBpZDogdGhpcy5wcm9wcy5pbnB1dElkLCBjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lLCByZWY6ICdhdXRvSW5wdXQnLCBvbkNoYW5nZTogdGhpcy5fb25DaGFuZ2UsIG9uRm9jdXM6IHRoaXMuX29uRm9jdXMsIG9uQmx1cjogdGhpcy5fb25CbHVyLCBvbkNsaWNrOiB0aGlzLl9vbklucHV0Q2xpY2sgfSksXG4gICAgICBlbnRyaWVzXG4gICAgKTtcbiAgfSxcbiAgX2N1cnJlbnRNYXRjaGVzOiBmdW5jdGlvbiBfY3VycmVudE1hdGNoZXMoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHZhciBjbSA9IHRoaXMuc3RhdGUubGlzdC5maWx0ZXIoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICByZXR1cm4gZW50cnkuaW5kZXhPZih0aGF0Ll9pbnB1dCgpKSA+IC0xO1xuICAgIH0pO1xuICAgIHJldHVybiBjbTtcbiAgfSxcbiAgX2lucHV0OiBmdW5jdGlvbiBfaW5wdXQoKSB7XG4gICAgaWYgKCF0aGlzLmlzTW91bnRlZCgpKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuYXV0b0lucHV0KS52YWx1ZTtcbiAgICB9XG4gIH0sXG4gIF9yZW5kZXJNYXRjaGVzOiBmdW5jdGlvbiBfcmVuZGVyTWF0Y2hlcygpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRNYXRjaGVzKCkuc2xpY2UoMCwgdGhpcy5wcm9wcy5tYXhJdGVtc1Nob3duKS5tYXAoZnVuY3Rpb24gKGVudHJ5LCBpbmRleCkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQXV0b2NvbXBsZXRlRW50cnksIHsgaGlnaGxpZ2h0ZWQ6IGVudHJ5ID09PSB0aGF0LnN0YXRlLmhpZ2hsaWdodGVkVmFsdWUsIGtleTogZW50cnksIHZhbHVlOiBlbnRyeSwgb25FbnRyeUNsaWNrOiB0aGF0Ll9vbkVudHJ5Q2xpY2ssIG9uRW50cnlNb3VzZU92ZXI6IHRoYXQuX29uRW50cnlNb3VzZU92ZXIgfSk7XG4gICAgfSk7XG4gIH0sXG4gIF9oaWdobGlnaHRlZEluZGV4OiBmdW5jdGlvbiBfaGlnaGxpZ2h0ZWRJbmRleCgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMTtcbiAgICB0aGlzLl9jdXJyZW50TWF0Y2hlcygpLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5LCBpbmRleCkge1xuICAgICAgaWYgKGVudHJ5ID09PSB0aGF0LnN0YXRlLmhpZ2hsaWdodGVkVmFsdWUpIHtcbiAgICAgICAgZm91bmRJbmRleCA9IGluZGV4O1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmb3VuZEluZGV4O1xuICB9LFxuICBfdXBkYXRlSGlnaGxpZ2h0ZWRWYWx1ZTogZnVuY3Rpb24gX3VwZGF0ZUhpZ2hsaWdodGVkVmFsdWUoKSB7XG4gICAgdmFyIG5ld1ZhbHVlO1xuICAgIHZhciBoaWdobGlnaHRlZEluZGV4ID0gdGhpcy5faGlnaGxpZ2h0ZWRJbmRleCgpO1xuICAgIGlmIChoaWdobGlnaHRlZEluZGV4IDwgMCkge1xuICAgICAgbmV3VmFsdWUgPSB0aGlzLnN0YXRlLmxpc3RbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1ZhbHVlID0gdGhpcy5zdGF0ZS5saXN0W2hpZ2hsaWdodGVkSW5kZXhdO1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgaGlnaGxpZ2h0ZWRWYWx1ZTogbmV3VmFsdWUgfSk7XG4gIH0sXG4gIF9zZXRJbnB1dEZyb21WYWx1ZTogZnVuY3Rpb24gX3NldElucHV0RnJvbVZhbHVlKCkge1xuICAgIFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5hdXRvSW5wdXQpLnZhbHVlID0gdGhpcy5zdGF0ZS5jdXJyZW50VmFsdWU7XG4gIH0sXG4gIF9zZXRWYWx1ZUZyb21JbnB1dDogZnVuY3Rpb24gX3NldFZhbHVlRnJvbUlucHV0KCkge1xuICAgIHZhciBpbnB1dFRleHQgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzLnJlZnMuYXV0b0lucHV0KS52YWx1ZTtcbiAgICB2YXIgZm91bmRFbnRyaWVzID0gdGhpcy5zdGF0ZS5saXN0LmZpbHRlcihmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgIHJldHVybiBlbnRyeS5pbmRleE9mKGlucHV0VGV4dCkgPiAtMTtcbiAgICB9KTtcbiAgICBpZiAoZm91bmRFbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjdXJyZW50VmFsdWU6IGZvdW5kRW50cmllc1swXSxcbiAgICAgICAgaGlnaGxpZ2h0ZWRWYWx1ZTogZm91bmRFbnRyaWVzWzBdXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9wcy5vbk5vTWF0Y2godGhpcy5zdGF0ZSk7XG4gICAgICBpZiAodGhpcy5wcm9wcy5saW1pdFRvTGlzdCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBjdXJyZW50VmFsdWU6IHRoaXMucHJvcHMuZGVmYXVsdFZhbHVlLFxuICAgICAgICAgIGhpZ2hsaWdodGVkVmFsdWU6IHRoaXMucHJvcHMuZGVmYXVsdFZhbHVlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgX3NldEZyb21IaWdobGlnaHRlZDogZnVuY3Rpb24gX3NldEZyb21IaWdobGlnaHRlZCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRWYWx1ZTogdGhpcy5zdGF0ZS5oaWdobGlnaHRlZFZhbHVlXG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fc2V0SW5wdXRGcm9tVmFsdWUoKTtcbiAgICB9KTtcbiAgfSxcbiAgX29uQ2hhbmdlOiBmdW5jdGlvbiBfb25DaGFuZ2UoKSB7XG4gICAgdGhpcy5fc2V0VmFsdWVGcm9tSW5wdXQoKTtcbiAgfSxcbiAgX29uRm9jdXM6IGZ1bmN0aW9uIF9vbkZvY3VzKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93RW50cmllczogdHJ1ZSB9KTtcbiAgfSxcbiAgX29uQmx1cjogZnVuY3Rpb24gX29uQmx1cigpIHtcbiAgICB0aGlzLl9zZXRGcm9tSGlnaGxpZ2h0ZWQoKTtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0VudHJpZXM6IGZhbHNlIH0pO1xuICB9LFxuICBfb25FbnRyeUNsaWNrOiBmdW5jdGlvbiBfb25FbnRyeUNsaWNrKGVudHJ5KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50VmFsdWU6IGVudHJ5XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fc2V0SW5wdXRGcm9tVmFsdWUoKTtcbiAgICB9KTtcbiAgfSxcbiAgX29uRW50cnlNb3VzZU92ZXI6IGZ1bmN0aW9uIF9vbkVudHJ5TW91c2VPdmVyKGVudHJ5KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGhpZ2hsaWdodGVkVmFsdWU6IGVudHJ5IH0pO1xuICB9LFxuICBfb25FbnRyeU1vdXNlT3V0OiBmdW5jdGlvbiBfb25FbnRyeU1vdXNlT3V0KGVudHJ5KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGhpZ2hsaWdodGVkVmFsdWU6IHRoaXMuY3VycmVudFZhbHVlIH0pO1xuICB9LFxuICBfb25JbnB1dENsaWNrOiBmdW5jdGlvbiBfb25JbnB1dENsaWNrKCkge1xuICAgIFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5hdXRvSW5wdXQpLnNlbGVjdCgpO1xuICB9XG59KTtcblxudmFyIEF1dG9jb21wbGV0ZUVudHJ5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0F1dG9jb21wbGV0ZUVudHJ5JyxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4geyBob3ZlcjogZmFsc2UgfTtcbiAgfSxcbiAgX29uQ2xpY2s6IGZ1bmN0aW9uIF9vbkNsaWNrKCkge1xuICAgIHRoaXMucHJvcHMub25FbnRyeUNsaWNrKHRoaXMucHJvcHMudmFsdWUpO1xuICB9LFxuICBfb25Nb3VzZU92ZXI6IGZ1bmN0aW9uIF9vbk1vdXNlT3ZlcigpIHtcbiAgICB0aGlzLnByb3BzLm9uRW50cnlNb3VzZU92ZXIodGhpcy5wcm9wcy52YWx1ZSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2xpJyxcbiAgICAgIHsgc3R5bGU6IHsgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLmhpZ2hsaWdodGVkID8gJ2hzbCg5MCwgNTAlLCA1MCUpJyA6ICcnLCB6SW5kZXg6IDk5OTksIGN1cnNvcjogJ3BvaW50ZXInIH0sIG9uTW91c2VEb3duOiB0aGlzLl9vbkNsaWNrLCBvbk1vdXNlT3ZlcjogdGhpcy5fb25Nb3VzZU92ZXIgfSxcbiAgICAgIHRoaXMucHJvcHMudmFsdWVcbiAgICApO1xuICB9XG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tXG4vLyBlbmQgQXV0b2NvbXBsZXRlXG4vLyAtLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gcmVSZW5kZXIoKSB7XG4gIFJlYWN0LnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFZkbmFNZW51LCB7IHRhYkxpc3Q6IHRhYkxpc3QgfSksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2ZG5hbWVudScpKTtcbn07XG5cbnZhciB0YWJMaXN0ID0gW3sgaWQ6IDEsIGhyZWY6ICdwcm9maWxlJywgdGV4dDogJ0VkaXQgTXkgUHJvZmlsZScsIHNlbGVjdGVkOiB0cnVlIH0sIHsgaWQ6IDIsIGhyZWY6ICdub3RpZmljYXRpb25zJywgdGV4dDogJ1ZpZXcgTm90aWZpY2F0aW9ucycsIHNlbGVjdGVkOiBmYWxzZSB9LCB7IGlkOiAzLCBocmVmOiAnaW1wb3J0JywgdGV4dDogJ0ltcG9ydCBhbmQgU3luYycsIHNlbGVjdGVkOiBmYWxzZSB9LCB7IGlkOiA0LCBocmVmOiAnc2V0dGluZ3MnLCB0ZXh0OiAnQ2hhbmdlIFNldHRpbmdzJywgc2VsZWN0ZWQ6IGZhbHNlIH0sIHsgaWQ6IDUsIGhyZWY6ICdwcml2YWN5JywgdGV4dDogJ1ByaXZhY3knLCBzZWxlY3RlZDogZmFsc2UgfSwgeyBpZDogNiwgaHJlZjogJ2Fib3V0JywgdGV4dDogJ0Fib3V0Jywgc2VsZWN0ZWQ6IGZhbHNlIH1dO1xuXG52YXIgVmRuYU1lbnUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnVmRuYU1lbnUnLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0YWJMaXN0OiB0aGlzLnByb3BzLnRhYkxpc3QsXG4gICAgICBjdXJyZW50VGFiOiAxXG4gICAgfTtcbiAgfSxcbiAgY2hhbmdlVGFiOiBmdW5jdGlvbiBjaGFuZ2VUYWIodGFiSWQpIHtcbiAgICB2YXIgbmV3VGFiTGlzdCA9IHRhYkxpc3QubWFwKGZ1bmN0aW9uICh0YWIpIHtcbiAgICAgIHRhYi5zZWxlY3RlZCA9IHRhYi5pZCA9PT0gdGFiSWQ7XG4gICAgICByZXR1cm4gdGFiO1xuICAgIH0pO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdGFiTGlzdDogbmV3VGFiTGlzdCxcbiAgICAgIGN1cnJlbnRUYWI6IHRhYklkXG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciB0YWJDb250ZW50O1xuICAgIHN3aXRjaCAodGhpcy5zdGF0ZS5jdXJyZW50VGFiKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHRhYkNvbnRlbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KE15UHJvZmlsZSwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICB0YWJDb250ZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChOb3RpZmljYXRpb25zLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIHRhYkNvbnRlbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KEltcG9ydCwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0OlxuICAgICAgICB0YWJDb250ZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChTZXR0aW5ncywgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA1OlxuICAgICAgICB0YWJDb250ZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChQcml2YWN5LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDY6XG4gICAgICAgIHRhYkNvbnRlbnQgPSBSZWFjdC5jcmVhdGVFbGVtZW50KEFib3V0LCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0YWJDb250ZW50ID0gUmVhY3QuY3JlYXRlRWxlbWVudChNeVByb2ZpbGUsIG51bGwpO1xuICAgIH1cbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdzZWN0aW9uJyxcbiAgICAgIHsgY2xhc3NOYW1lOiAndmRuYScgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ3ZkbmEtYm9keScgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbnRhaW5lcicgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3JvdycgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFicywgeyB0YWJMaXN0OiB0aGlzLnN0YXRlLnRhYkxpc3QsIGNoYW5nZVRhYjogdGhpcy5jaGFuZ2VUYWIgfSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdtYWluLWNvbnRlbnQgY29sLXhzLTggY29sLXhzLW9mZnNldC00IGNvbC1zbS05IGNvbC1zbS1vZmZzZXQtMyBjb2wtbGctMTAgY29sLWxnLW9mZnNldC0yJyB9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAndGFiLWNvbnRlbnQnIH0sXG4gICAgICAgICAgICAgICAgdGFiQ29udGVudFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENsb3NlVmRuYSwgbnVsbClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIE9wZW5WZG5hID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ09wZW5WZG5hJyxcblxuICBoYW5kbGVDbGljazogZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XG4gICAgJChcIiN2ZG5hbWVudVwiKS5zaG93KCk7XG4gICAgJChcIiNvcGVuVmRuYVwiKS5oaWRlKCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ3NwYW4nLFxuICAgICAgICB7ICdkYXRhLXRvZ2dsZSc6ICd0b29sdGlwJywgdGl0bGU6ICdDbGljayB0byBvcGVuIFZETkEnLCBpZDogJ29wZW5WZG5hJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tcHJpbWFyeSBvcGVuVmRuYScsIG9uQ2xpY2s6IHRoaXMuaGFuZGxlQ2xpY2sgfSxcbiAgICAgICAgJ09wZW4gdkROQSdcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIENsb3NlVmRuYSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdDbG9zZVZkbmEnLFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiBoYW5kbGVDbGljaygpIHtcbiAgICAkKFwiI3ZkbmFtZW51XCIpLmhpZGUoKTtcbiAgICAkKFwiI29wZW5WZG5hXCIpLnNob3coKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnc3BhbicsXG4gICAgICAgIHsgJ2RhdGEtdG9nZ2xlJzogJ3Rvb2x0aXAnLCB0aXRsZTogJ0NsaWNrIHRvIGNsb3NlJywgY2xhc3NOYW1lOiAnY2xvc2VWZG5hJywgc3R5bGU6IHsgY3Vyc29yOiAncG9pbnRlcicgfSwgb25DbGljazogdGhpcy5oYW5kbGVDbGljayB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBjbGFzc05hbWU6ICdmYSBmYS1wb3dlci1vZmYnIH0pXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBUYWJzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1RhYnMnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgdGFiTGlzdE5vZGVzID0gdGhpcy5wcm9wcy50YWJMaXN0Lm1hcChmdW5jdGlvbiAodGFiLCBpbmRleCkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFiLCB7IGNoYW5nZVRhYjogdGhhdC5wcm9wcy5jaGFuZ2VUYWIsIGtleTogdGFiLmhyZWYsIGlkOiB0YWIuaHJlZiwgdGFiOiB0YWIgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIHsgY2xhc3NOYW1lOiAnc2lkZWJhciBjb2wteHMtNCBjb2wtc20tMyBjb2wtbGctMicgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICduYXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ25hdmJhciBuYXZiYXItZGVmYXVsdCcsIHJvbGU6ICduYXZpZ2F0aW9uJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICd1bCcsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICduYXYgbmF2YmFyLW5hdicsIHJvbGU6ICd0YWJsaXN0JyB9LFxuICAgICAgICAgIHRhYkxpc3ROb2Rlc1xuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBUYWIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnVGFiJyxcblxuICBoYW5kbGVDbGljazogZnVuY3Rpb24gaGFuZGxlQ2xpY2soKSB7XG4gICAgdGhpcy5wcm9wcy5jaGFuZ2VUYWIodGhpcy5wcm9wcy50YWIuaWQpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdsaScsXG4gICAgICB7IHJvbGU6ICdwcmVzZW50YXRpb24nLCBjbGFzc05hbWU6IHRoaXMucHJvcHMudGFiLnNlbGVjdGVkID8gJ2FjdGl2ZScgOiAnJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2EnLFxuICAgICAgICB7IGhyZWY6IHRoaXMucHJvcHMudGFiLmhyZWYsICdhcmlhLWNvbnRyb2xzJzogdGhpcy5wcm9wcy50YWIuaHJlZiwgcm9sZTogJ3RhYicsICdkYXRhLXRvZ2dsZSc6ICd0YWInLCBvbkNsaWNrOiB0aGlzLmhhbmRsZUNsaWNrIH0sXG4gICAgICAgIHRoaXMucHJvcHMudGFiLnRleHRcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIE15UHJvZmlsZUhlYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNeVByb2ZpbGVIZWFkZXInLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2hlYWRlcicsXG4gICAgICB7IGNsYXNzTmFtZTogJ3BhZ2UtaGVhZGVyJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnbWVkaWEnIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdtZWRpYS1sZWZ0JyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogJ2ZhIGZhLTJ4IGZhLXVzZXInIH0pXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdtZWRpYS1ib2R5JyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnaDEnLFxuICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdtZWRpYS1oZWFkaW5nJyB9LFxuICAgICAgICAgICAgJ1lvdXIgcHJvZmlsZSAnLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgJ2F0J1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICcgW3NpdGUuY29tXSdcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIE15UHJvZmlsZUNhdGVnb3JpZXMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTXlQcm9maWxlQ2F0ZWdvcmllcycsXG5cbiAgaGFuZGxlQ2hhbmdlOiBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoKSB7XG4gICAgY29uc29sZS5sb2coUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmNhdGVnb3J5KS52YWx1ZSk7XG4gICAgdGhpcy5wcm9wcy5nZXRDYXRlZ29yeU9uQ2hhbmdlKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5jYXRlZ29yeSkudmFsdWUpO1xuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2F0ZWdvcmllczogdGhpcy5wcm9wcy5jYXRlZ29yaWVzXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHZhciBjYXRlZ29yeU5vZGVzID0gdGhpcy5zdGF0ZS5jYXRlZ29yaWVzLm1hcChmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE15UHJvZmlsZUNhdGVnb3J5LCB7IGNhdGVnb3J5OiBjYXRlZ29yeSB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgeyBjbGFzc05hbWU6ICdmb3JtLWdyb3VwIGZvcm0tZ3JvdXAtc20nIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnbGFiZWwnLFxuICAgICAgICB7IGh0bWxGb3I6ICdjYXRlZ29yeScsIGNsYXNzTmFtZTogJ2NvbC1zbS0yIGNvbnRyb2wtbGFiZWwnIH0sXG4gICAgICAgICdDYXRlZ29yeSdcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wtc20tMTAnIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ3NlbGVjdCcsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdzZWxlY3RwaWNrZXInLCBpZDogJ2NhdGVnb3J5JywgcmVmOiAnY2F0ZWdvcnknLCBvbkNoYW5nZTogdGhpcy5oYW5kbGVDaGFuZ2UgfSxcbiAgICAgICAgICBjYXRlZ29yeU5vZGVzXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIE15UHJvZmlsZUNhdGVnb3J5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ015UHJvZmlsZUNhdGVnb3J5JyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdvcHRpb24nLFxuICAgICAgeyB2YWx1ZTogdGhpcy5wcm9wcy5jYXRlZ29yeSwgcmVmOiB0aGlzLnByb3BzLmNhdGVnb3J5IH0sXG4gICAgICBkYXRhLmNhcGl0YWxpemUodGhpcy5wcm9wcy5jYXRlZ29yeSlcbiAgICApO1xuICB9XG59KTtcblxudmFyIE15UHJvZmlsZVByaXZhY3kgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTXlQcm9maWxlUHJpdmFjeScsXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICQoXCIjcHJpdmFjeVNldHRpbmdTbGlkZXJcIikuc2xpZGVyKHsgbWluOiAxLCBtYXg6IDUsIHN0ZXA6IDEsIHZhbHVlOiAzIH0pO1xuICAgICQoXCIjcHJpdmFjeVNldHRpbmdTbGlkZXJcIikub24oXCJzbGlkZVwiLCBmdW5jdGlvbiAobikge1xuICAgICAgbi52YWx1ZSA9PT0gMSA/ICQoXCIjcHJpdmFjeVNldHRpbmdTbGlkZXJWYWxcIikudGV4dChcIjIwXCIpIDogbi52YWx1ZSA9PT0gMiA/ICQoXCIjcHJpdmFjeVNldHRpbmdTbGlkZXJWYWxcIikudGV4dChcIjQwXCIpIDogbi52YWx1ZSA9PT0gMyA/ICQoXCIjcHJpdmFjeVNldHRpbmdTbGlkZXJWYWxcIikudGV4dChcIjYwXCIpIDogbi52YWx1ZSA9PT0gNCA/ICQoXCIjcHJpdmFjeVNldHRpbmdTbGlkZXJWYWxcIikudGV4dChcIjgwXCIpIDogbi52YWx1ZSA9PT0gNSAmJiAkKFwiI3ByaXZhY3lTZXR0aW5nU2xpZGVyVmFsXCIpLnRleHQoXCIxMDBcIik7XG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7IGNsYXNzTmFtZTogJ2Zvcm0tZ3JvdXAgZm9ybS1ncm91cC1zbScgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdsYWJlbCcsXG4gICAgICAgIHsgaHRtbEZvcjogJ2lucHV0RW1haWwzJywgY2xhc3NOYW1lOiAnY29sLXNtLTIgY29udHJvbC1sYWJlbCcgfSxcbiAgICAgICAgJ1ByaXZhY3knXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXNtLTYnIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JywgeyBpZDogJ3ByaXZhY3lTZXR0aW5nU2xpZGVyJywgdHlwZTogJ3RleHQnIH0pXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXNtLTInIH0sXG4gICAgICAgICdTaGFyaW5nICcsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgIHsgaWQ6ICdwcml2YWN5U2V0dGluZ1NsaWRlclZhbCcgfSxcbiAgICAgICAgICAnNjAnXG4gICAgICAgICksXG4gICAgICAgICclJ1xuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgTXlQcm9maWxlSW50ZXJlc3RzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ015UHJvZmlsZUludGVyZXN0cycsXG5cbiAgc2hvd0RldGFpbHM6IGZ1bmN0aW9uIHNob3dEZXRhaWxzKGludGVyZXN0LCBkZXRhaWxzKSB7XG4gICAgY29uc29sZS5sb2coaW50ZXJlc3QgKyBcIjogXCIgKyBKU09OLnN0cmluZ2lmeShkZXRhaWxzKSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRJbnRlcmVzdDogaW50ZXJlc3QsIGN1cnJlbnREZXRhaWxzOiBkZXRhaWxzIH0pO1xuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4geyBjdXJyZW50SW50ZXJlc3Q6IG51bGwsXG4gICAgICBjdXJyZW50RGV0YWlsczoge30sXG4gICAgICBhZGRJbnRlcmVzdENvbGxhcHNlZDogdHJ1ZSB9O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgZGF0YS5ibGlua05vZGVzKCk7XG4gIH0sXG4gIHNob3dBZGRMaWtlOiBmdW5jdGlvbiBzaG93QWRkTGlrZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgYWRkSW50ZXJlc3RDb2xsYXBzZWQ6IGZhbHNlIH0pO1xuICB9LFxuICBoaWRlQWRkTGlrZTogZnVuY3Rpb24gaGlkZUFkZExpa2UoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGFkZEludGVyZXN0Q29sbGFwc2VkOiB0cnVlIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGN1cnJlbnRJbnRlcmVzdHMgPSBPYmplY3Qua2V5cyh0aGlzLnByb3BzLmludGVyZXN0cykucmVkdWNlKGZ1bmN0aW9uIChpcywgaSkge1xuICAgICAgaWYgKHRoYXQucHJvcHMuaW50ZXJlc3RzW2ldWydzZWxlY3RlZCddKSB7XG4gICAgICAgIGlzW2ldID0gdGhhdC5wcm9wcy5pbnRlcmVzdHNbaV07XG4gICAgICB9XG4gICAgICByZXR1cm4gaXM7XG4gICAgfSwge30pO1xuICAgIHZhciBpbnRlcmVzdE5vZGVzID0gT2JqZWN0LmtleXModGhpcy5wcm9wcy5pbnRlcmVzdHMpLmZpbHRlcihmdW5jdGlvbiAoaW50ZXJlc3QpIHtcbiAgICAgIHJldHVybiB0aGF0LnByb3BzLmludGVyZXN0c1tpbnRlcmVzdF1bJ3NlbGVjdGVkJ107XG4gICAgfSkubWFwKGZ1bmN0aW9uIChpbnRlcmVzdCkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTXlQcm9maWxlSW50ZXJlc3QsIHsga2V5OiBpbnRlcmVzdCwgaW50ZXJlc3Q6IGludGVyZXN0LCBzaG93RGV0YWlsczogdGhhdC5zaG93RGV0YWlscy5iaW5kKHRoYXQsIGludGVyZXN0LCB0aGF0LnByb3BzLmludGVyZXN0c1tpbnRlcmVzdF0pIH0pO1xuICAgIH0pO1xuICAgIC8qXHJcbiAgICB2YXIgcmVsYXRlZEludGVyZXN0cyA9IE9iamVjdC5rZXlzKHRoaXMucHJvcHMuaW50ZXJlc3RzKS5maWx0ZXIoZnVuY3Rpb24oaW50ZXJlc3QpIHtcclxuICAgICAgcmV0dXJuICF0aGF0LnByb3BzLmludGVyZXN0c1tpbnRlcmVzdF1bJ3NlbGVjdGVkJ107XHJcbiAgICB9KTtcclxuICAgICAqL1xuICAgIHZhciByZWxhdGVkSW50ZXJlc3RzID0gdGhpcy5zdGF0ZS5jdXJyZW50SW50ZXJlc3QgPyB0aGlzLnN0YXRlLmN1cnJlbnREZXRhaWxzWydyZWxhdGVkJ10uc3BsaXQoLywvKSA6IFtdO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnZm9ybS1ncm91cCBmb3JtLWdyb3VwLXNtJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdsYWJlbCcsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wtc20tMiBjb250cm9sLWxhYmVsJyB9LFxuICAgICAgICAgICdJbnRlcmVzdHMnXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wtc20tNicgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3BhbmVsIHBhbmVsLWludGVyZXN0cycgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3BhbmVsLWJvZHknIH0sXG4gICAgICAgICAgICAgIGludGVyZXN0Tm9kZXNcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wtc20tNCBjb2wtYm90dG9tJyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAgIHsgdHlwZTogJ3N1Ym1pdCcsIGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLWRlZmF1bHQnIH0sXG4gICAgICAgICAgICAnSW1wb3J0J1xuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgICAgeyBpZDogJ2FkZExpa2UnLCBvbkNsaWNrOiB0aGlzLnNob3dBZGRMaWtlLCB0eXBlOiAnc3VibWl0Jywgcm9sZTogJ2J1dHRvbicsIGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLXN1Y2Nlc3MnLCAnYXJpYS1leHBhbmRlZCc6ICdmYWxzZScsICdhcmlhLWNvbnRyb2xzJzogJ2FkZExpa2UnIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBjbGFzc05hbWU6ICdnbHlwaGljb24gZ2x5cGhpY29uLXBsdXMnIH0pLFxuICAgICAgICAgICAgJyBBZGQnXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNeVByb2ZpbGVBZGRBbkludGVyZXN0LCB7IGludGVyZXN0czogY3VycmVudEludGVyZXN0cywgY29sbGFwc2U6IHRoaXMuc3RhdGUuYWRkSW50ZXJlc3RDb2xsYXBzZWQsIGhpZGVBZGRMaWtlOiB0aGlzLmhpZGVBZGRMaWtlIH0pLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNeVByb2ZpbGVMaWtlRGV0YWlscywgeyBjdXJyZW50SW50ZXJlc3Q6IHRoaXMuc3RhdGUuY3VycmVudEludGVyZXN0LCBjdXJyZW50RGV0YWlsczogdGhpcy5zdGF0ZS5jdXJyZW50RGV0YWlscywgcmVsYXRlZEludGVyZXN0czogcmVsYXRlZEludGVyZXN0cywgY29sbGFwc2U6IGZhbHNlIH0pXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBNeVByb2ZpbGVJbnRlcmVzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNeVByb2ZpbGVJbnRlcmVzdCcsXG5cbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xuICAgIHRoaXMucHJvcHMuc2hvd0RldGFpbHMoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnc3BhbicsXG4gICAgICB7IGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLWRlZmF1bHQnLCByZWY6ICdpbnRlcmVzdFNwYW4nLCB0aXRsZTogdGhpcy5wcm9wcy5pbnRlcmVzdCwga2V5OiB0aGlzLnByb3BzLmludGVyZXN0LCByb2xlOiAnYnV0dG9uJywgb25DbGljazogdGhpcy5oYW5kbGVDbGljayB9LFxuICAgICAgZGF0YS5jYXBpdGFsaXplKHRoaXMucHJvcHMuaW50ZXJlc3QpXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBNeVByb2ZpbGVBZGRBbkludGVyZXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ015UHJvZmlsZUFkZEFuSW50ZXJlc3QnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBjdXJyZW50SW50ZXJlc3RLZXlzID0gT2JqZWN0LmtleXModGhpcy5wcm9wcy5pbnRlcmVzdHMpO1xuICAgIHZhciBhdmFpbGFibGVJbnRlcmVzdEtleXMgPSBPYmplY3Qua2V5cyhkYXRhLnN0YXRpY0ludGVyZXN0cykuZmlsdGVyKGZ1bmN0aW9uIChpbnRlcmVzdEtleSkge1xuICAgICAgcmV0dXJuIGN1cnJlbnRJbnRlcmVzdEtleXMuaW5kZXhPZihpbnRlcmVzdEtleSkgPT0gLTE7XG4gICAgfSk7XG4gICAgdmFyIGJhc2VEaXZTdHlsZXMgPSBbJ2Zvcm0tZ3JvdXAnLCAnZm9ybS1ncm91cC1zbSddO1xuICAgIHZhciBhdmFpbGFibGVJbnRlcmVzdE5vZGVzID0gYXZhaWxhYmxlSW50ZXJlc3RLZXlzLm1hcChmdW5jdGlvbiAoaW50ZXJlc3QpIHtcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE15UHJvZmlsZUF2YWlsYWJsZUludGVyZXN0LCB7IGF2YWlsYWJsZUludGVyZXN0OiBpbnRlcmVzdCB9KTtcbiAgICB9KTtcbiAgICBpZiAodGhpcy5wcm9wcy5jb2xsYXBzZSkge1xuICAgICAgYmFzZURpdlN0eWxlcy5wdXNoKCdjb2xsYXBzZScpO1xuICAgIH1cbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgeyBjbGFzc05hbWU6IGJhc2VEaXZTdHlsZXMuam9pbignICcpLCBpZDogJ2FkZEFuSW50ZXJlc3QnIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnbGFiZWwnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC1zbS0yIGNvbnRyb2wtbGFiZWwnIH0sXG4gICAgICAgICdBZGQgYSBsaWtlJ1xuICAgICAgKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC1zbS02JyB9LFxuICAgICAgICBhdmFpbGFibGVJbnRlcmVzdE5vZGVzXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBNeVByb2ZpbGVBdmFpbGFibGVJbnRlcmVzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNeVByb2ZpbGVBdmFpbGFibGVJbnRlcmVzdCcsXG5cbiAgYWRkSW50ZXJlc3Q6IGZ1bmN0aW9uIGFkZEludGVyZXN0KCkge1xuICAgIGRhdGEuYWRkSW50ZXJlc3QodGhpcy5wcm9wcy5hdmFpbGFibGVJbnRlcmVzdCk7XG4gICAgcmVSZW5kZXIoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnc3BhbicsXG4gICAgICB7IGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLWRlZmF1bHQnLCByZWY6ICdpbnRlcmVzdFNwYW4nLCB0aXRsZTogdGhpcy5wcm9wcy5hdmFpbGFibGVJbnRlcmVzdCwga2V5OiB0aGlzLnByb3BzLmF2YWlsYWJsZUludGVyZXN0LCByb2xlOiAnYnV0dG9uJywgb25DbGljazogdGhpcy5hZGRJbnRlcmVzdCB9LFxuICAgICAgZGF0YS5jYXBpdGFsaXplKHRoaXMucHJvcHMuYXZhaWxhYmxlSW50ZXJlc3QpXG4gICAgKTtcbiAgfVxufSk7XG5cbi8qIEl0J3MgcXVpdGUgYSBwaXR5IHRvIGhhdmUgdG8gY29tbWVudCB0aGlzIG91dC4uLlxyXG52YXIgTXlQcm9maWxlQWRkQW5JbnRlcmVzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICBhZGRMaWtlRG9uZTogZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZygkKFwiI2FkZEludGVyZXN0SW5wdXRcIikudmFsKCkpO1xyXG4gICAgaWYoZGF0YS5hZGRJbnRlcmVzdCgkKFwiI2FkZEludGVyZXN0SW5wdXRcIikudmFsKCkpKSB7XHJcbiAgICAgIHRoaXMucHJvcHMuaGlkZUFkZExpa2UoKTtcclxuICAgIH1cclxuICAgICQoXCIjYWRkSW50ZXJlc3RJbnB1dFwiKS52YWwoXCJcIik7XHJcbiAgICByZVJlbmRlcigpO1xyXG4gIH0sXHJcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBjdXJyZW50SW50ZXJlc3RLZXlzID0gT2JqZWN0LmtleXModGhpcy5wcm9wcy5pbnRlcmVzdHMpO1xyXG4gICAgY29uc29sZS5sb2coJ2N1cnJlbnQgaW50ZXJlc3RzOiAnICsgSlNPTi5zdHJpbmdpZnkoY3VycmVudEludGVyZXN0S2V5cykpO1xyXG4gICAgdmFyIGF2YWlsYWJsZUludGVyZXN0S2V5cyA9IE9iamVjdC5rZXlzKGRhdGEuc3RhdGljSW50ZXJlc3RzKS5maWx0ZXIoZnVuY3Rpb24oaW50ZXJlc3RLZXkpIHtcclxuICAgICAgcmV0dXJuIGN1cnJlbnRJbnRlcmVzdEtleXMuaW5kZXhPZihpbnRlcmVzdEtleSkgPT0gLTE7XHJcbiAgICB9KTtcclxuICAgIGNvbnNvbGUubG9nKCdhdmFpbGFibGUgaW50ZXJlc3RzOiAnICsgSlNPTi5zdHJpbmdpZnkoYXZhaWxhYmxlSW50ZXJlc3RLZXlzKSk7XHJcbiAgICB2YXIgYmFzZURpdlN0eWxlcyA9IFsnZm9ybS1ncm91cCcsICdmb3JtLWdyb3VwLXNtJ107XHJcbiAgICBpZih0aGlzLnByb3BzLmNvbGxhcHNlKSB7XHJcbiAgICAgIGJhc2VEaXZTdHlsZXMucHVzaCgnY29sbGFwc2UnKTtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKCdBZGQgYSBsaWtlOiBcIicgKyBiYXNlRGl2U3R5bGVzLmpvaW4oJyAnKSArICdcIicpO1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9e2Jhc2VEaXZTdHlsZXMuam9pbignICcpfSBpZD1cImFkZEFuSW50ZXJlc3RcIj5cclxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLXNtLTIgY29udHJvbC1sYWJlbFwiPkFkZCBhIGxpa2U8L2xhYmVsPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNtLTZcIj5cclxuICAgICAgICAgIDxBdXRvY29tcGxldGUgaW5wdXRJZD1cImFkZEludGVyZXN0SW5wdXRcIiBkZWZhdWx0VmFsdWU9eycnfSBkZWZhdWx0TGlzdD17YXZhaWxhYmxlSW50ZXJlc3RLZXlzfSBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBhZGRMaWtlRG9uZT17dGhpcy5hZGRMaWtlRG9uZX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zbS0yXCI+XHJcbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLXNtIGJ0bi1kZWZhdWx0XCIgb25DbGljaz17dGhpcy5hZGRMaWtlRG9uZX0+RG9uZTwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG59KTtcclxuKi9cblxudmFyIE15UHJvZmlsZUxpa2VEZXRhaWxzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ015UHJvZmlsZUxpa2VEZXRhaWxzJyxcblxuICByZW1vdmVJbnRlcmVzdDogZnVuY3Rpb24gcmVtb3ZlSW50ZXJlc3QoKSB7XG4gICAgLy8gZGF0YS51bkxpa2VBbkludGVyZXN0KHRoaXMucHJvcHMuY2F0ZWdvcnksIHRoaXMucHJvcHMuY3VycmVudEludGVyZXN0KTtcbiAgICBkYXRhLnVuTGlrZUFuSW50ZXJlc3QodGhpcy5wcm9wcy5jdXJyZW50SW50ZXJlc3QpO1xuICAgIHJlUmVuZGVyKCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgcmVsYXRlZEludGVyZXN0Tm9kZXMgPSB0aGlzLnByb3BzLnJlbGF0ZWRJbnRlcmVzdHMubWFwKGZ1bmN0aW9uIChpbnRlcmVzdCkge1xuICAgICAgcmV0dXJuKFxuICAgICAgICAvLyA8TXlQcm9maWxlUmVsYXRlZEludGVyZXN0IGNhdGVnb3J5PXt0aGF0LnByb3BzLmNhdGVnb3J5fSByZWxhdGVkSW50ZXJlc3Q9e2ludGVyZXN0fSAvPlxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE15UHJvZmlsZVJlbGF0ZWRJbnRlcmVzdCwgeyByZWxhdGVkSW50ZXJlc3Q6IGludGVyZXN0IH0pXG4gICAgICApO1xuICAgIH0pO1xuICAgIHZhciBiYXNlRGl2U3R5bGVzID0gWydmb3JtLWdyb3VwJywgJ2Zvcm0tZ3JvdXAtc20nXTtcbiAgICBpZiAodGhpcy5wcm9wcy5jb2xsYXBzZSkge1xuICAgICAgYmFzZURpdlN0eWxlcy5wdXNoKCdjb2xsYXBzZScpO1xuICAgIH1cbiAgICB2YXIgaHRtbDtcbiAgICBpZiAodGhpcy5wcm9wcy5jdXJyZW50SW50ZXJlc3QpIHtcbiAgICAgIGh0bWwgPSBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6IGJhc2VEaXZTdHlsZXMuam9pbignICcpLCBpZDogJ2xpa2VEZXRhaWxzJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXNtLTYgY29sLXNtLW9mZnNldC0yJyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnd2VsbCB3ZWxsLXNtJyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAncm93JyB9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXhzLTQnIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnYnV0dG9uJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tcHJpbWFyeScgfSxcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY3VycmVudEludGVyZXN0XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXhzLTgnIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICd1bCcsXG4gICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2xpc3QtaW5saW5lJyB9LFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAnc21hbGwnLFxuICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdHJvbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdUb3RhbCBjbGlja3M6J1xuICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgJyAnLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY3VycmVudERldGFpbHNbJ2NsaWNrcyddXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ1NvdXJjZTonXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAnIEltcG9ydGVkIGZyb20gJyxcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhLmNhcGl0YWxpemUodGhpcy5wcm9wcy5jdXJyZW50RGV0YWlsc1snc291cmNlJ10pLFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2JyJywgbnVsbCksXG4gICAgICAgICAgICAgICAgICAgICAgJ0FkZGVkIG9uICcsXG4gICAgICAgICAgICAgICAgICAgICAgTW9tZW50KHRoaXMucHJvcHMuY3VycmVudERldGFpbHNbJ2FkZGVkJ10pLmZvcm1hdChcIkREIE1NTSBZWVlZXCIpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAncCcsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ3N0cm9uZycsXG4gICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICdSZWxhdGVkIGludGVyZXN0czonXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgcmVsYXRlZEludGVyZXN0Tm9kZXNcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wtc20tNCcgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAgICB7IHR5cGU6ICdzdWJtaXQnLCByb2xlOiAnYnV0dG9uJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCByZW1vdmUtbGlrZScsICdhcmlhLWV4cGFuZGVkJzogJ3RydWUnLCAnYXJpYS1jb250cm9scyc6ICdyZW1vdmVMaWtlJywgb25DbGljazogdGhpcy5yZW1vdmVJbnRlcmVzdCB9LFxuICAgICAgICAgICAgJ1JlbW92ZSdcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGh0bWwgPSBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGNsYXNzTmFtZTogYmFzZURpdlN0eWxlcy5qb2luKCcgJyksIGlkOiAnbGlrZURldGFpbHMnIH0pO1xuICAgIH1cbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgbnVsbCxcbiAgICAgIGh0bWxcbiAgICApO1xuICB9XG59KTtcblxudmFyIE15UHJvZmlsZVJlbGF0ZWRJbnRlcmVzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNeVByb2ZpbGVSZWxhdGVkSW50ZXJlc3QnLFxuXG4gIGFkZEludGVyZXN0OiBmdW5jdGlvbiBhZGRJbnRlcmVzdCgpIHtcbiAgICAvLyBkYXRhLmFkZFJlbGF0ZWRJbnRlcmVzdCh0aGlzLnByb3BzLmNhdGVnb3J5LCB0aGlzLnByb3BzLnJlbGF0ZWRJbnRlcmVzdCk7XG4gICAgZGF0YS5hZGRSZWxhdGVkSW50ZXJlc3QodGhpcy5wcm9wcy5yZWxhdGVkSW50ZXJlc3QpO1xuICAgIHJlUmVuZGVyKCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3NwYW4nLFxuICAgICAgeyBjbGFzc05hbWU6ICdidG4gYnRuLXNtIGJ0bi1kZWZhdWx0JywgcmVmOiAnaW50ZXJlc3RTcGFuJywgdGl0bGU6IHRoaXMucHJvcHMucmVsYXRlZEludGVyZXN0LCBrZXk6IHRoaXMucHJvcHMucmVsYXRlZEludGVyZXN0LCByb2xlOiAnYnV0dG9uJywgb25DbGljazogdGhpcy5hZGRJbnRlcmVzdCB9LFxuICAgICAgZGF0YS5jYXBpdGFsaXplKHRoaXMucHJvcHMucmVsYXRlZEludGVyZXN0KVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgTXlQcm9maWxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ015UHJvZmlsZScsXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIGNhdGVnb3J5OiBPYmplY3Qua2V5cyhzdGF0aWNEYXRhKVswXSxcbiAgICAgIC8vIGludGVyZXN0czogc3RhdGljRGF0YVtPYmplY3Qua2V5cyhzdGF0aWNEYXRhKVswXV1cbiAgICAgIGludGVyZXN0czogZGF0YS5zdGF0aWNJbnRlcmVzdHNcbiAgICB9O1xuICB9LFxuICBnZXRDYXRlZ29yeU9uQ2hhbmdlOiBmdW5jdGlvbiBnZXRDYXRlZ29yeU9uQ2hhbmdlKGNhdGVnb3J5KSB7XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZGF0YS5zdGF0aWNEYXRhW2NhdGVnb3J5XSkpO1xuICAgIHRoaXMuc2V0U3RhdGUoeyBjYXRlZ29yeTogY2F0ZWdvcnksXG4gICAgICBpbnRlcmVzdHM6IGRhdGEuc3RhdGljRGF0YVtjYXRlZ29yeV0gfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7IHJvbGU6ICd0YWJwYW5lbCcsIGNsYXNzTmFtZTogJ3RhYi1wYW5lIGZhZGUgYWN0aXZlIGluJywgaWQ6ICdwcm9maWxlJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnY29udGFpbmVyJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE15UHJvZmlsZUhlYWRlciwgbnVsbCksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdmb3JtLWhvcml6b250YWwnIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNeVByb2ZpbGVQcml2YWN5LCBudWxsKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE15UHJvZmlsZUludGVyZXN0cywgeyBpbnRlcmVzdHM6IHRoaXMuc3RhdGUuaW50ZXJlc3RzLCBzZXRJbnRlcmVzdHM6IHRoaXMuc2V0SW50ZXJlc3RzIH0pXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIE5vdGlmaWNhdGlvbnMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTm90aWZpY2F0aW9ucycsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnc2VjdGlvbicsXG4gICAgICB7IHJvbGU6ICd0YWJwYW5lbCcsIGNsYXNzTmFtZTogJ3RhYi1wYW5lIGZhZGUgYWN0aXZlIGluJywgaWQ6ICdub3RpZmljYXRpb25zJyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnY29udGFpbmVyJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdoZWFkZXInLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAncGFnZS1oZWFkZXInIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdoMScsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgJ05vdGlmaWNhdGlvbnMgJyxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICdmcm9tJ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICcgW3NpdGUuY29tXSdcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdyb3cnIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wteHMtMTInIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAndGFibGUnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3RhYmxlIHRhYmxlLW5vdGlmaWNhdGlvbnMnIH0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ3RoZWFkJyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAndHInLFxuICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICd0aCcsXG4gICAgICAgICAgICAgICAgICAgIHsgY29sU3BhbjogJzInIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ3AnLFxuICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgJ1NpdGUuY29tIGhhcyByZXF1ZXN0ZWQgdG8gYWRkIGZvbGxvd2luZyBpbnRlcmVzdHMgdG8geW91ciBwcm9maWxlLicsXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnYnInLCBudWxsKSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAnU2VlICcsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsgaHJlZjogJyMnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzZXR0aW5ncydcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAnIHRvIGNoYW5nZSB0aGUgZGVmYXVsdCBiZWhhdmlvciBmb3IgdGhpcyB3aW5kb3cuJ1xuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICd0aCcsXG4gICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ25hdicsXG4gICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICd0YWJsZS1maWx0ZXIgdGV4dC1yaWdodCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3VsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnbGlzdC1pbmxpbmUnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3RleHQtbXV0ZWQnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdTaG93OidcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGhyZWY6ICcjJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdQZW5kaW5nJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBocmVmOiAnIycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQWNjZXB0ZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGhyZWY6ICcjJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSZWplY3RlZCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnYWN0aXZlJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGhyZWY6ICcjJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdBbGwnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ3Rib2R5JyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAndHInLFxuICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICd0aCcsXG4gICAgICAgICAgICAgICAgICAgIHsgc2NvcGU6ICdyb3cnIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnYnRuIGJ0biBidG4tc20gYnRuLWRlZmF1bHQnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJ1Rlbm5pcydcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICd0ZCcsXG4gICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ3VsJyxcbiAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2xpc3QtaW5saW5lJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdDYXRlZ29yeTogJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTcG9ydHMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdTb3VyY2U6IEltcG9ydGVkIGZyb20gJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGYWNlYm9vaydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlcXVlc3RlZCBvbiBARGF0ZVRpbWUuTm93J1xuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICd0ZCcsXG4gICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAndGV4dC1yaWdodCcgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2J0bi1ncm91cCcsIHJvbGU6ICdncm91cCcsICdhcmlhLWxhYmVsJzogJy4uLicgfSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHR5cGU6ICdidXR0b24nLCBjbGFzc05hbWU6ICdidG4gYnRuLWxpbmsgYnRuLXN1Y2Nlc3MnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBjbGFzc05hbWU6ICdmYSBmYS1jaGVjaycgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnaGlkZGVuLXhzJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnQXBwcm92ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ2J1dHRvbicsIGNsYXNzTmFtZTogJ2J0biBidG4tbGluayBidG4tZGFuZ2VyJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgY2xhc3NOYW1lOiAnZmEgZmEtcmVtb3ZlJyB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdoaWRkZW4teHMnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdSZW1vdmUnXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgJ3RyJyxcbiAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAndGgnLFxuICAgICAgICAgICAgICAgICAgICB7IHNjb3BlOiAncm93JyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2J0biBidG4tc20gYnRuLWRlZmF1bHQnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJ1NraWluZydcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICd0ZCcsXG4gICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ3VsJyxcbiAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2xpc3QtaW5saW5lJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdDYXRlZ29yeTogJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTcG9ydHMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdTb3VyY2U6IEltcG9ydGVkIGZyb20gJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGYWNlYm9vaydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlcXVlc3RlZCBvbiBARGF0ZVRpbWUuTm93J1xuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICd0ZCcsXG4gICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAndGV4dC1yaWdodCcgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2J0bi1ncm91cCcsIHJvbGU6ICdncm91cCcsICdhcmlhLWxhYmVsJzogJy4uLicgfSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHR5cGU6ICdidXR0b24nLCBjbGFzc05hbWU6ICdidG4gYnRuLWxpbmsgYnRuLXN1Y2Nlc3MnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBjbGFzc05hbWU6ICdmYSBmYS1jaGVjaycgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnaGlkZGVuLXhzJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnQXBwcm92ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ2J1dHRvbicsIGNsYXNzTmFtZTogJ2J0biBidG4tbGluayBidG4tZGFuZ2VyJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgY2xhc3NOYW1lOiAnZmEgZmEtcmVtb3ZlJyB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdoaWRkZW4teHMnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdSZW1vdmUnXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgJ3RyJyxcbiAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAndGgnLFxuICAgICAgICAgICAgICAgICAgICB7IHNjb3BlOiAncm93JyB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2J0biBidG4gYnRuLXNtIGJ0bi1kZWZhdWx0JyB9LFxuICAgICAgICAgICAgICAgICAgICAgICdXaW5kc3VyZmluZydcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICd0ZCcsXG4gICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ3VsJyxcbiAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2xpc3QtaW5saW5lJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdDYXRlZ29yeTogJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTcG9ydHMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzbWFsbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdTb3VyY2U6IEltcG9ydGVkIGZyb20gJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGYWNlYm9vaydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlcXVlc3RlZCBvbiBARGF0ZVRpbWUuTm93J1xuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICd0ZCcsXG4gICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAndGV4dC1yaWdodCcgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2J0bi1ncm91cCcsIHJvbGU6ICdncm91cCcsICdhcmlhLWxhYmVsJzogJy4uLicgfSxcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHR5cGU6ICdidXR0b24nLCBjbGFzc05hbWU6ICdidG4gYnRuLWxpbmsgYnRuLXN1Y2Nlc3MnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBjbGFzc05hbWU6ICdmYSBmYS1jaGVjaycgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnaGlkZGVuLXhzJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnQXBwcm92ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ2J1dHRvbicsIGNsYXNzTmFtZTogJ2J0biBidG4tbGluayBidG4tZGFuZ2VyJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgY2xhc3NOYW1lOiAnZmEgZmEtcmVtb3ZlJyB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdoaWRkZW4teHMnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdSZW1vdmUnXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ25hdicsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAndGV4dC1yaWdodCcgfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAndWwnLFxuICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAncGFnaW5hdGlvbicgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZGlzYWJsZWQnIH0sXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgIHsgJ2FyaWEtbGFiZWwnOiAnUHJldmlvdXMnLCBocmVmOiAnIycgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgeyAnYXJpYS1oaWRkZW4nOiAndHJ1ZScgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnwqsgUHJldmlvdXMnXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdhY3RpdmUnIH0sXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgIHsgaHJlZjogJyMnIH0sXG4gICAgICAgICAgICAgICAgICAgICcxICcsXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnc3Itb25seScgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnKGN1cnJlbnQpJ1xuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgIHsgaHJlZjogJyMnIH0sXG4gICAgICAgICAgICAgICAgICAgICcyJ1xuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICB7IGhyZWY6ICcjJyB9LFxuICAgICAgICAgICAgICAgICAgICAnMydcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAnbGknLFxuICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAgICAgeyBocmVmOiAnIycgfSxcbiAgICAgICAgICAgICAgICAgICAgJzQnXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgJ2xpJyxcbiAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgIHsgaHJlZjogJyMnIH0sXG4gICAgICAgICAgICAgICAgICAgICc1J1xuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICdsaScsXG4gICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICB7ICdhcmlhLWxhYmVsJzogJ05leHQnLCBocmVmOiAnIycgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgeyAnYXJpYS1oaWRkZW4nOiAndHJ1ZScgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnTmV4dCDCuydcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgSW1wb3J0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0ltcG9ydCcsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnc2VjdGlvbicsXG4gICAgICB7IHJvbGU6ICd0YWJwYW5lbCcsIGNsYXNzTmFtZTogJ3RhYi1wYW5lIGZhZGUgYWN0aXZlIGluJywgaWQ6ICdpbXBvcnQnIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdjb250YWluZXInIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2hlYWRlcicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdwYWdlLWhlYWRlcicgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2gzJyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAnLi4ueW91ciBpbnRlcmVzdHMgYWNyb3NzIGFwcHMgYW5kIGRldmljZXMuJ1xuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ3JvdycgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC14cy02IGNvbC1sZy00JyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ3AnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2xlYWQnIH0sXG4gICAgICAgICAgICAgICdDb25uZWN0IHdpdGggRmFjZWJvb2shJ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3B1bGwtbGVmdCcgfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICdMYXN0IHN5bmM6J1xuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAnIDI1IGludGVyZXN0cyAoNSBuZXcpJyxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnYnInLCBudWxsKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICdMYXN0IHN5bmNlZCBvbjonXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICcgQERhdGVUaW1lLk5vdydcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgIHsgaHJlZjogJyMnLCBjbGFzc05hbWU6ICdidG4gYnRuLXNtIGJ0bi1kZWZhdWx0IHB1bGwtcmlnaHQnIH0sXG4gICAgICAgICAgICAgICdDb25uZWN0J1xuICAgICAgICAgICAgKVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wteHMtNiBjb2wtbGctNCBjb2wtbGctb2Zmc2V0LTEnIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAncCcsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnbGVhZCcgfSxcbiAgICAgICAgICAgICAgJ0ltcG9ydCB5b3VyIHBpbnMgZnJvbSBQaW50ZXJlc3QhJ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3B1bGwtbGVmdCcgfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICdMYXN0IHN5bmM6J1xuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAnIDI1IGludGVyZXN0cyAoNSBuZXcpJyxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnYnInLCBudWxsKSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICdMYXN0IHN5bmNlZCBvbjonXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICcgQERhdGVUaW1lLk5vdydcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgIHsgaHJlZjogJyMnLCBjbGFzc05hbWU6ICdidG4gYnRuLXNtIGJ0bi1kZWZhdWx0IHB1bGwtcmlnaHQnIH0sXG4gICAgICAgICAgICAgICdJbXBvcnQnXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdocicsIG51bGwpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAncm93JyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXhzLTEyIGNvbC1sZy05JyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2gzJyxcbiAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgJ1RyeSB5b3VyIGFwcCEnXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ3AnLFxuICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAnTGlrZSBjb250cm9sbGluZyB0aGUgd2ViPz8/IFdlIHRob3VnaHQgc28uIE91ciBuaWZ0eSBhcHAgbGV0cyB5b3UgdGFrZSBpdCB0byB0aGUgbmV4dCBsZXZlbCBhbmQgcHV0cyBhbGwgeW91ciBpbnRlcm5ldC13aWRlIHByZWZlcmVuY2VzIGluIG9uZSBjZW50cmFsIHBsYWNlIHNvIHlvdSBjYW4gcXVpY2tseSBhbmQgZWFzaWx5IHZpZXcgYW5kIGFjY2VwdCB5b3VyIG5vdGlmaWNhdGlvbnMgd2l0aCBhIGZldyBzdGVwcy4nXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAncHVsbC1sZWZ0JyB9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICB7IGhyZWY6ICcjJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCcgfSxcbiAgICAgICAgICAgICAgICAnZG93bmxvYWQgZm9yIGFuZHJvaWQnXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgIHsgaHJlZjogJyMnLCBjbGFzc05hbWU6ICdidG4gYnRuLXNtIGJ0bi1kZWZhdWx0JyB9LFxuICAgICAgICAgICAgICAgICdkb3dubG9hZCBmb3IgaXBob25lJ1xuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAncHVsbC1yaWdodCcgfSxcbiAgICAgICAgICAgICAgJ0dvdCBhbiBhcHA/IE5vdyAnLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICB7IGhyZWY6ICcjJywgY2xhc3NOYW1lOiAnYnRuIGJ0bi1zbSBidG4tZGVmYXVsdCcgfSxcbiAgICAgICAgICAgICAgICAnR2VuZXJhdGUgYSBzeW5jIGNvZGUhJ1xuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBTZXR0aW5ncyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdTZXR0aW5ncycsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnc2VjdGlvbicsXG4gICAgICB7IHJvbGU6ICd0YWJwYW5lbCcsIGNsYXNzTmFtZTogJ3RhYi1wYW5lIGZhZGUgYWN0aXZlIGluJywgaWQ6ICdzZXR0aW5ncycgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbnRhaW5lcicgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnaGVhZGVyJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ3BhZ2UtaGVhZGVyJyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnaDEnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICdTZXR0aW5ncyAnLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgJ29uJ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICcgW3NpdGUuY29tXSdcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAncCcsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgJ1lvdSBhcmUgaW4gY29udHJvbCEgQ2hhbmdlIHlvdXIgc2V0dGluZ3MgaGVyZS4nXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZm9ybS1ob3Jpem9udGFsJyB9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZm9ybS1ncm91cCBmb3JtLWdyb3VwLXNtJyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgICAgICAgeyBodG1sRm9yOiAncGVyc29uYWxpemF0aW9uJywgY2xhc3NOYW1lOiAnY29sLXhzLTcgY29sLXNtLTUgY29sLW1kLTQgY29sLWxnLTMgY29udHJvbC1sYWJlbCcgfSxcbiAgICAgICAgICAgICAgJ1BlcnNvbmFsaXphdGlvbidcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wteHMtNSBjb2wtc20tNyBjb2wtbWQtOCBjb2wtbGctOScgfSxcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7IHR5cGU6ICdjaGVja2JveCcsIG5hbWU6ICdwZXJzb25hbGl6YXRpb24nLCBjbGFzc05hbWU6ICdzd2l0Y2gnIH0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdocicsIG51bGwpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZm9ybS1ncm91cCBmb3JtLWdyb3VwLXNtJyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgICAgICAgeyBodG1sRm9yOiAnc29ydGluZycsIGNsYXNzTmFtZTogJ2NvbC14cy03IGNvbC1zbS01IGNvbC1tZC00IGNvbC1sZy0zIGNvbnRyb2wtbGFiZWwnIH0sXG4gICAgICAgICAgICAgICdTb3J0aW5nJ1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2NvbC14cy01IGNvbC1zbS03IGNvbC1tZC04IGNvbC1sZy05JyB9LFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdzZWxlY3QnLFxuICAgICAgICAgICAgICAgIHsgJ2NsYXNzJzogJ3NlbGVjdHBpY2tlcicsIGlkOiAnc29ydGluZycgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgJ29wdGlvbicsXG4gICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgJ1lvdXIgaW50ZXJlc3RzJ1xuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICdvcHRpb24nLFxuICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICdTaXRlIGRlZmF1bHQnXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdocicsIG51bGwpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZm9ybS1ncm91cCBmb3JtLWdyb3VwLXNtJyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgICAgICAgeyBodG1sRm9yOiAnYXV0b3NhdmUnLCBjbGFzc05hbWU6ICdjb2wteHMtNyBjb2wtc20tNSBjb2wtbWQtNCBjb2wtbGctMyBjb250cm9sLWxhYmVsJyB9LFxuICAgICAgICAgICAgICAnQXV0b3NhdmUnXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXhzLTUgY29sLXNtLTcgY29sLW1kLTggY29sLWxnLTknIH0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JywgeyB0eXBlOiAnY2hlY2tib3gnLCBuYW1lOiAnYXV0b3NhdmUnLCBjbGFzc05hbWU6ICdzd2l0Y2gnIH0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdocicsIG51bGwpLFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZm9ybS1ncm91cCBmb3JtLWdyb3VwLXNtJyB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgICAgICAgeyBodG1sRm9yOiAnZGVsZXRlJywgY2xhc3NOYW1lOiAnY29sLXhzLTcgY29sLXNtLTUgY29sLW1kLTQgY29sLWxnLTMgY29udHJvbC1sYWJlbCcgfSxcbiAgICAgICAgICAgICAgJ0RlbGV0ZSBteSBwcm9maWxlICcsXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICdhdCdcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgJyAnLFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdpJyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICdbc2l0ZS5jb21dJ1xuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY29sLXhzLTUgY29sLXNtLTcgY29sLW1kLTggY29sLWxnLTknIH0sXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgIHsgaHJlZjogJyMnLCBjbGFzc05hbWU6ICdidG4gYnRuLXNtIGJ0bi1kYW5nZXInIH0sXG4gICAgICAgICAgICAgICAgJ0RlbGV0ZSdcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgUHJpdmFjeSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdQcml2YWN5JyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdzZWN0aW9uJyxcbiAgICAgIHsgcm9sZTogJ3RhYnBhbmVsJywgY2xhc3NOYW1lOiAndGFiLXBhbmUgZmFkZSBhY3RpdmUgaW4nLCBpZDogJ3ByaXZhY3knIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdjb250YWluZXInIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2hlYWRlcicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdwYWdlLWhlYWRlcicgfSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgJ2gxJyxcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAnUHJpdmFjeSdcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdyb3cnIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdjb2wteHMtMTAnIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAncCcsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnbGVhZCcgfSxcbiAgICAgICAgICAgICAgJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuIEludGVnZXIgbmVjIG9kaW8uIFByYWVzZW50IGxpYmVyby4gU2VkIGN1cnN1cyBhbnRlIGRhcGlidXMgZGlhbS4gU2VkIG5pc2kuIE51bGxhIHF1aXMgc2VtIGF0IG5pYmggZWxlbWVudHVtIGltcGVyZGlldC4nXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgJ3AnLFxuICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4gSW50ZWdlciBuZWMgb2Rpby4gUHJhZXNlbnQgbGliZXJvLiBTZWQgY3Vyc3VzIGFudGUgZGFwaWJ1cyBkaWFtLiBTZWQgbmlzaS4gTnVsbGEgcXVpcyBzZW0gYXQgbmliaCBlbGVtZW50dW0gaW1wZXJkaWV0LidcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxudmFyIEFib3V0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0Fib3V0JyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdzZWN0aW9uJyxcbiAgICAgIHsgcm9sZTogJ3RhYnBhbmVsJywgY2xhc3NOYW1lOiAndGFiLXBhbmUgZmFkZSBhY3RpdmUgaW4nLCBpZDogJ2Fib3V0JyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnY29udGFpbmVyJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdoZWFkZXInLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAncGFnZS1oZWFkZXInIH0sXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaW1nJywgeyBzcmM6ICcvaW1hZ2VzL2xvZ28teml2dGVyLnBuZycsIGFsdDogJycgfSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5yZVJlbmRlcigpO1xuXG4vKlxyXG48IURPQ1RZUEUgaHRtbD5cclxuPGh0bWw+XHJcbiAgPGhlYWQ+XHJcbiAgICA8bWV0YSBjaGFyc2V0PVwidXRmLThcIiAvPlxyXG4gICAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLjBcIj5cclxuICAgIDx0aXRsZT48L3RpdGxlPlxyXG4gICAgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIHR5cGU9XCJ0ZXh0L2Nzc1wiIGhyZWY9XCJDb250ZW50L3ZkbmEubWluLmNzc1wiPlxyXG4gICAgPHNjcmlwdCB0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCIgc3JjPVwiU2NyaXB0cy9tb2Rlcm5penItMi42LjIuanNcIj48L3NjcmlwdD5cclxuICA8L2hlYWQ+XHJcbiAgPGJvZHk+XHJcblxyXG4gICAgPCEtLSB2ZG5hIGFwcCAtLT5cclxuICAgIDxzZWN0aW9uIGNsYXNzPVwidmRuYVwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwidmRuYS1ib2R5XCI+XHJcblxyXG5cdDwhLS0gY29udGFpbmVyIC0tPlxyXG5cdDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuXHQgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuXHJcblx0ICAgIDwhLS0gc2lkZWJhciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cclxuXHQgICAgPGRpdiBjbGFzcz1cInNpZGViYXIgY29sLXhzLTQgY29sLXNtLTMgY29sLWxnLTJcIj5cclxuXHJcblx0ICAgIDwvZGl2PjwhLS0gL3NpZGViYXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cclxuXHJcblx0ICAgIDwhLS0gbWFpbiBjb250ZW50IC0tPlxyXG5cdCAgICA8ZGl2IGNsYXNzPVwibWFpbi1jb250ZW50IGNvbC14cy04IGNvbC14cy1vZmZzZXQtNCBjb2wtc20tOSBjb2wtc20tb2Zmc2V0LTMgY29sLWxnLTEwIGNvbC1sZy1vZmZzZXQtMlwiPlxyXG5cdCAgICAgIDxkaXYgY2xhc3M9XCJ0YWItY29udGVudFwiPlxyXG5cclxuXHRcdDwhLS0gc2VjdGlvbjogbXkgcHJvZmlsZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XHJcblxyXG5cdFx0ICAgIDwvZGl2PjwhLS0gL215IHByb2ZpbGUgZm9ybSAtLT5cclxuXHJcblx0XHQgIDwvZGl2PlxyXG5cdFx0PC9zZWN0aW9uPjwhLS0gL3NlY3Rpb246IG15IHByb2ZpbGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XHJcblxyXG5cdFx0PCEtLSBzZWN0aW9uOiBub3RpZmljYXRpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cclxuICAgICAgICAgICAgICAgIDwhLS0gL3NlY3Rpb246IG5vdGlmaWNhdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XHJcblxyXG5cdFx0PCEtLSBzZWN0aW9uOiBpbXBvcnQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XHJcbiAgICAgICAgICAgICAgICA8IS0tIC9zZWN0aW9uOiBpbXBvcnQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cclxuXHJcblx0XHQ8IS0tIHNlY3Rpb246IHNldHRpbmdzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cclxuICAgICAgICAgICAgICAgIDwhLS0gc2VjdGlvbjogc2V0dGluZ3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxyXG5cclxuXHRcdDwhLS0gc2VjdGlvbjogcHJpdmFjeSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxyXG4gICAgICAgICAgICAgICAgPCEtLSAvc2VjdGlvbjogcHJpdmFjeSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxyXG5cclxuXHRcdDwhLS0gc2VjdGlvbjogYWJvdXQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cclxuICAgICAgICAgICAgICAgIDwhLS0gL3NlY3Rpb246IGFib3V0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XHJcblxyXG5cdCAgICAgIDwvZGl2PlxyXG5cdCAgICA8L2Rpdj48IS0tIC9tYWluIGNvbnRlbnQgLS0+XHJcblxyXG5cdCAgPC9kaXY+XHJcblxyXG5cdCAgPCEtLSBjbG9zZSBhcHAgLS0+XHJcblx0ICA8YSBocmVmPVwiI2Nsb3NlVmRuYVwiIGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiIHRpdGxlPVwiQ2xpY2sgdG8gY2xvc2VcIiBjbGFzcz1cImNsb3NlVmRuYVwiPjxzcGFuIGNsYXNzPVwiZmEgZmEtcG93ZXItb2ZmXCI+PC9zcGFuPjwvYT5cclxuXHJcblx0PC9kaXY+PCEtLSAvY29udGFpbmVyIC0tPlxyXG5cclxuXHQ8IS0tIG9wZW4gYXBwIC0tPlxyXG5cdDxhIGhyZWY9XCIjb3BlblZkbmFcIiBkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIiB0aXRsZT1cIkNsaWNrIHRvIG9wZW4gVkROQVwiIGNsYXNzPVwiYnRuIGJ0bi1zbSBidG4tcHJpbWFyeSBvcGVuVmRuYVwiPk9wZW4gdkROQTwvYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L3NlY3Rpb24+PCEtLSAvdmRuYSBhcHAgLS0+XHJcblxyXG4gICAgPCEtLSBXZWJzaXRlIHBsYWNlaG9sZGVyIC0tPlxyXG4gICAgPGltZyBzcmM9XCJDb250ZW50L2ltYWdlcy90aWNrZXRwcm8ucG5nXCIgYWx0PVwiXCIgLz5cclxuXHJcbiAgICA8IS0tIFNjcmlwdHMgLS0+XHJcbiAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCJTY3JpcHRzL2J1bmRsZXMvanF1ZXJ5LmpzXCI+PC9zY3JpcHQ+XHJcbiAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCJTY3JpcHRzL2J1bmRsZXMvYm9vdHN0cmFwLmpzXCI+PC9zY3JpcHQ+XHJcbiAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIiBzcmM9XCJTY3JpcHRzL2J1bmRsZXMvdmRuYS5qc1wiPjwvc2NyaXB0PlxyXG5cclxuICA8L2JvZHk+XHJcbjwvaHRtbD5cclxuKi9cbi8qIDxPcGVuVmRuYSAvPiAqLyAvKjxzdHJvbmc+Q2F0ZWdvcnk6PC9zdHJvbmc+IHtkYXRhLmNhcGl0YWxpemUodGhpcy5wcm9wcy5jdXJyZW50RGV0YWlsc1snY2F0ZWdvcnknXSl9PGJyIC8+Ki8gLyo8TXlQcm9maWxlQ2F0ZWdvcmllcyBjYXRlZ29yaWVzPXtPYmplY3Qua2V5cyhkYXRhLnN0YXRpY0RhdGEpfSBnZXRDYXRlZ29yeU9uQ2hhbmdlPXt0aGlzLmdldENhdGVnb3J5T25DaGFuZ2V9IC8+Ki8gLyo8TXlQcm9maWxlSW50ZXJlc3RzIGNhdGVnb3J5PXt0aGlzLnN0YXRlLmNhdGVnb3J5fSBpbnRlcmVzdHM9e3RoaXMuc3RhdGUuaW50ZXJlc3RzfSBzZXRJbnRlcmVzdHM9e3RoaXMuc2V0SW50ZXJlc3RzfSAvPiovXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMM0J2YkdGeWFYTXZjblZ0YldGbmFXNW5YM0p2ZFc1a0wyNXZaR1V1YW5NdmRIQXRjbVZoWTNRdmNIVmliR2xqTDJwekwzWmtibUZ0Wlc1MUxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPMEZCUVVFc1NVRkJTU3hOUVVGTkxFZEJRVWNzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUXk5Q0xFbEJRVWtzU1VGQlNTeEhRVUZITEU5QlFVOHNRMEZCUXl4clFrRkJhMElzUTBGQlF5eERRVUZET3pzN096czdPenM3UVVGVGRrTXNTVUZCU1N4WlFVRlpMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUTI1RExHMUNRVUZwUWl4RlFVRkZMRFpDUVVGWE8wRkJRelZDTEZGQlFVa3NRMEZCUXl4clFrRkJhMElzUlVGQlJTeERRVUZETzBGQlF6RkNMRkZCUVVrc1owSkJRV2RDTEVOQlFVTTdRVUZEY2tJc1VVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEyaENMRmxCUVZFc1EwRkJReXhUUVVGVExFZEJRVWNzVlVGQlV5eERRVUZETEVWQlFVVTdRVUZETDBJc1kwRkJUeXhEUVVGRExFTkJRVU1zVDBGQlR6dEJRVU5rTEdGQlFVc3NSVUZCUlRzN1FVRkRUQ3hwUWtGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVOMFFpeGpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmRCUVZjc1JVRkJSU3hEUVVGRE8wRkJRM3BDTEdkQ1FVRk5PMEZCUVVFc1FVRkRVaXhoUVVGTExFTkJRVU03TzBGQlEwb3NhVUpCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdRVUZEY0VJc1kwRkJTU3hEUVVGRExHMUNRVUZ0UWl4RlFVRkZMRU5CUVVNN1FVRkRNMElzWjBKQlFVMDdRVUZCUVN4QlFVTlNMR0ZCUVVzc1JVRkJSVHM3UVVGRFRDd3dRa0ZCWjBJc1IwRkJSeXhKUVVGSkxFTkJRVU1zYVVKQlFXbENMRVZCUVVVc1EwRkJRenRCUVVNMVF5eHBRa0ZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhOUVVGTkxFZEJRVWNzWjBKQlFXZENMRU5CUVVNc1EwRkJRenRCUVVOMlF5eGpRVUZITEdkQ1FVRm5RaXhIUVVGSExFTkJRVU1zUlVGQlJUdEJRVU4yUWl4blFrRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eEZRVUZETEdkQ1FVRm5RaXhGUVVGRkxFbEJRVWtzUTBGQlF5eGxRVUZsTEVWQlFVVXNRMEZCUXl4blFrRkJaMElzUjBGQlJ5eERRVUZETEVOQlFVTXNSVUZCUXl4RFFVRkRMRU5CUVVNN1YwRkRha1k3UVVGRFJDeG5Ra0ZCVFR0QlFVRkJMRUZCUTFJc1lVRkJTeXhGUVVGRk96dEJRVU5NTERCQ1FVRm5RaXhIUVVGSExFbEJRVWtzUTBGQlF5eHBRa0ZCYVVJc1JVRkJSU3hEUVVGRE8wRkJRelZETEdsQ1FVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUjBGQlJ5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8wRkJRM3BETEdOQlFVY3NaMEpCUVdkQ0xFdEJRVXNzUTBGQlF5eERRVUZETEVWQlFVVTdRVUZETVVJc1owSkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNSVUZCUXl4blFrRkJaMElzUlVGQlJTeEpRVUZKTEVOQlFVTXNaVUZCWlN4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVU1zUTBGQlF5eERRVUZETzFkQlF6bEVMRTFCUVUwc1NVRkJSeXhuUWtGQlowSXNSMEZCUnl4SlFVRkpMRU5CUVVNc1pVRkJaU3hGUVVGRkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNSVUZCUlR0QlFVTTVSQ3huUWtGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RlFVRkRMR2RDUVVGblFpeEZRVUZGTEVsQlFVa3NRMEZCUXl4bFFVRmxMRVZCUVVVc1EwRkJReXhuUWtGQlowSXNSMEZCUnl4RFFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRExFTkJRVU03VjBGRGFrWTdRVUZEUkN4blFrRkJUVHRCUVVGQkxFOUJRMVE3UzBGRFJpeERRVUZETzBkQlEwZzdRVUZEUkN4cFFrRkJaU3hGUVVGRkxESkNRVUZYTzBGQlF6RkNMRmRCUVU4N1FVRkRUQ3hyUWtGQldTeEZRVUZGTEU5QlFVODdRVUZEY2tJc2FVSkJRVmNzUlVGQlJTeEpRVUZKTzBGQlEycENMRzFDUVVGaExFVkJRVVVzUTBGQlF6dEJRVU5vUWl4bFFVRlRMRVZCUVVVc1NVRkJTVHRCUVVObUxHbENRVUZYTEVWQlFVVXNRMEZCUlN4UFFVRlBMRVZCUVVVc1VVRkJVU3hGUVVGRkxGRkJRVkVzUlVGQlJTeFBRVUZQTEVWQlFVVXNVVUZCVVN4RFFVRkZPMEZCUXk5RUxITkNRVUZuUWl4RlFVRkZMRXRCUVVzN1FVRkRka0lzYVVKQlFWY3NSVUZCUlN4SlFVRkpPMEZCUTJwQ0xEQkNRVUZ2UWl4RlFVRkZMRWxCUVVrN1FVRkRNVUlzWlVGQlV5eEZRVUZGTEcxQ1FVRlRMRXRCUVVzc1JVRkJSU3hGUVVGRk8wdEJRemxDTEVOQlFVTTdSMEZEU0R0QlFVTkVMR2xDUVVGbExFVkJRVVVzTWtKQlFWYzdRVUZETVVJc1YwRkJUenRCUVVOTUxGVkJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmRCUVZjN1FVRkROVUlzYTBKQlFWa3NSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGbEJRVms3UVVGRGNrTXNjMEpCUVdkQ0xFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4WlFVRlpPMEZCUTNwRExHbENRVUZYTEVWQlFVVXNTMEZCU3p0TFFVTnVRaXhEUVVGRE8wZEJRMGc3UVVGRFJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVVVGQlNTeFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhYUVVGWExFZEJRemxDT3p0UlFVRkpMRXRCUVVzc1JVRkJSU3hGUVVGRExGRkJRVkVzUlVGQlJTeFZRVUZWTEVWQlFVVXNaVUZCWlN4RlFVRkZMRTlCUVU4c1JVRkJSU3hMUVVGTExFVkJRVVVzVDBGQlR5eEZRVUZGTEZOQlFWTXNSVUZCUlN4TlFVRk5MRVZCUVVVc1QwRkJUeXhGUVVGRkxFTkJRVU1zUlVGQlJTeE5RVUZOTEVWQlFVVXNRMEZCUXl4RlFVRkRMRUZCUVVNc1JVRkJReXhaUVVGWkxFVkJRVVVzU1VGQlNTeERRVUZETEdkQ1FVRm5RaXhCUVVGRE8wMUJRVVVzU1VGQlNTeERRVUZETEdOQlFXTXNSVUZCUlR0TFFVRk5MRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRM0JOTEZkQlEwVTdPenROUVVORkxDdENRVUZQTEVWQlFVVXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUVVGQlF5eEZRVUZETEZOQlFWTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUVVGQlF5eEZRVUZETEVkQlFVY3NSVUZCUXl4WFFVRlhMRVZCUVVNc1VVRkJVU3hGUVVGRkxFbEJRVWtzUTBGQlF5eFRRVUZUTEVGQlFVTXNSVUZCUXl4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExGRkJRVkVzUVVGQlF5eEZRVUZETEUxQlFVMHNSVUZCUlN4SlFVRkpMRU5CUVVNc1QwRkJUeXhCUVVGRExFVkJRVU1zVDBGQlR5eEZRVUZGTEVsQlFVa3NRMEZCUXl4aFFVRmhMRUZCUVVNc1IwRkJSenROUVVOMFRDeFBRVUZQTzB0QlEwb3NRMEZEVGp0SFFVTklPMEZCUTBRc2FVSkJRV1VzUlVGQlJTd3lRa0ZCVnp0QlFVTXhRaXhSUVVGSkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEVOQlFVTTdRVUZEYUVJc1VVRkJTU3hGUVVGRkxFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExGVkJRVk1zUzBGQlN5eEZRVUZGTzBGQlF6bERMR0ZCUVU4c1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF6dExRVU14UXl4RFFVRkRMRU5CUVVNN1FVRkRTQ3hYUVVGUExFVkJRVVVzUTBGQlF6dEhRVU5ZTzBGQlEwUXNVVUZCVFN4RlFVRkZMR3RDUVVGWE8wRkJRMnBDTEZGQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhGUVVGRkxFVkJRVVU3UVVGRGNFSXNZVUZCVHl4RlFVRkZMRU5CUVVNN1MwRkRXQ3hOUVVGTk8wRkJRMHdzWVVGQlR5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRPMHRCUTNKRU8wZEJRMFk3UVVGRFJDeG5Ra0ZCWXl4RlFVRkZMREJDUVVGWE8wRkJRM3BDTEZGQlFVa3NTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJRenRCUVVOb1FpeFhRVUZQTEVsQlFVa3NRMEZCUXl4bFFVRmxMRVZCUVVVc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1lVRkJZU3hEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWTXNTMEZCU3l4RlFVRkZMRXRCUVVzc1JVRkJSVHRCUVVNeFJpeGhRVU5GTEc5Q1FVRkRMR2xDUVVGcFFpeEpRVUZETEZkQlFWY3NSVUZCUlN4TFFVRkxMRXRCUVVzc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eG5Ra0ZCWjBJc1FVRkJReXhGUVVGRExFZEJRVWNzUlVGQlJTeExRVUZMTEVGQlFVTXNSVUZCUXl4TFFVRkxMRVZCUVVVc1MwRkJTeXhCUVVGRExFVkJRVU1zV1VGQldTeEZRVUZGTEVsQlFVa3NRMEZCUXl4aFFVRmhMRUZCUVVNc1JVRkJReXhuUWtGQlowSXNSVUZCUlN4SlFVRkpMRU5CUVVNc2FVSkJRV2xDTEVGQlFVTXNSMEZCUnl4RFFVTXZTenRMUVVOSUxFTkJRVU1zUTBGQlF6dEhRVU5LTzBGQlEwUXNiVUpCUVdsQ0xFVkJRVVVzTmtKQlFWYzdRVUZETlVJc1VVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEyaENMRkZCUVVrc1ZVRkJWU3hIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzQkNMRkZCUVVrc1EwRkJReXhsUVVGbExFVkJRVVVzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVXl4TFFVRkxMRVZCUVVVc1MwRkJTeXhGUVVGRk8wRkJRM0JFTEZWQlFVY3NTMEZCU3l4TFFVRkxMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zWjBKQlFXZENMRVZCUVVVN1FVRkRlRU1zYTBKQlFWVXNSMEZCUnl4TFFVRkxMRU5CUVVNN1QwRkRjRUk3UzBGRFJpeERRVUZETEVOQlFVTTdRVUZEU0N4WFFVRlBMRlZCUVZVc1EwRkJRenRIUVVOdVFqdEJRVU5FTEhsQ1FVRjFRaXhGUVVGRkxHMURRVUZYTzBGQlEyeERMRkZCUVVrc1VVRkJVU3hEUVVGRE8wRkJRMklzVVVGQlNTeG5Ra0ZCWjBJc1IwRkJSeXhKUVVGSkxFTkJRVU1zYVVKQlFXbENMRVZCUVVVc1EwRkJRenRCUVVOb1JDeFJRVUZITEdkQ1FVRm5RaXhIUVVGSExFTkJRVU1zUlVGQlJUdEJRVU4yUWl4alFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1MwRkRMMElzVFVGQlRUdEJRVU5NTEdOQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8wdEJRemxETzBGQlEwUXNVVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhGUVVGRExHZENRVUZuUWl4RlFVRkZMRkZCUVZFc1JVRkJReXhEUVVGRExFTkJRVU03UjBGRE4wTTdRVUZEUkN4dlFrRkJhMElzUlVGQlJTdzRRa0ZCVnp0QlFVTTNRaXhUUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1dVRkJXU3hEUVVGRE8wZEJRM2hGTzBGQlEwUXNiMEpCUVd0Q0xFVkJRVVVzT0VKQlFWYzdRVUZETjBJc1VVRkJTU3hUUVVGVExFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETEV0QlFVc3NRMEZCUXp0QlFVTTNSQ3hSUVVGSkxGbEJRVmtzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zVlVGQlV5eExRVUZMTEVWQlFVVTdRVUZEZUVRc1lVRkJUeXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRE8wdEJRM1JETEVOQlFVTXNRMEZCUXp0QlFVTklMRkZCUVVjc1dVRkJXU3hEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVWQlFVVTdRVUZETVVJc1ZVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5hTEc5Q1FVRlpMRVZCUVVVc1dVRkJXU3hEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU0zUWl4M1FrRkJaMElzUlVGQlJTeFpRVUZaTEVOQlFVTXNRMEZCUXl4RFFVRkRPMDlCUTJ4RExFTkJRVU1zUTBGQlF6dExRVU5LTEUxQlFVMDdRVUZEVEN4VlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRha01zVlVGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmRCUVZjc1JVRkJSVHRCUVVONlFpeFpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRPMEZCUTFvc2MwSkJRVmtzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmxCUVZrN1FVRkRja01zTUVKQlFXZENMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFpRVUZaTzFOQlF6RkRMRU5CUVVNc1EwRkJRenRQUVVOS08wdEJRMFk3UjBGRFJqdEJRVU5FTEhGQ1FVRnRRaXhGUVVGRkxDdENRVUZYTzBGQlF6bENMRkZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRFdpeHJRa0ZCV1N4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zWjBKQlFXZENPMHRCUXpGRExFVkJRVVVzV1VGQlZ6dEJRVU5hTEZWQlFVa3NRMEZCUXl4clFrRkJhMElzUlVGQlJTeERRVUZETzB0QlF6TkNMRU5CUVVNc1EwRkJRenRIUVVOS08wRkJRMFFzVjBGQlV5eEZRVUZGTEhGQ1FVRlhPMEZCUTNCQ0xGRkJRVWtzUTBGQlF5eHJRa0ZCYTBJc1JVRkJSU3hEUVVGRE8wZEJRek5DTzBGQlEwUXNWVUZCVVN4RlFVRkZMRzlDUVVGWE8wRkJRMjVDTEZGQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1JVRkJReXhYUVVGWExFVkJRVVVzU1VGQlNTeEZRVUZETEVOQlFVTXNRMEZCUXp0SFFVTndRenRCUVVORUxGTkJRVThzUlVGQlJTeHRRa0ZCVnp0QlFVTnNRaXhSUVVGSkxFTkJRVU1zYlVKQlFXMUNMRVZCUVVVc1EwRkJRenRCUVVNelFpeFJRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVNc1YwRkJWeXhGUVVGRkxFdEJRVXNzUlVGQlF5eERRVUZETEVOQlFVTTdSMEZEY2tNN1FVRkRSQ3hsUVVGaExFVkJRVVVzZFVKQlFWTXNTMEZCU3l4RlFVRkZPMEZCUXpkQ0xGRkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEV2l4clFrRkJXU3hGUVVGRkxFdEJRVXM3UzBGRGNFSXNSVUZCUlN4WlFVRlhPMEZCUTFvc1ZVRkJTU3hEUVVGRExHdENRVUZyUWl4RlFVRkZMRU5CUVVNN1MwRkRNMElzUTBGQlF5eERRVUZETzBkQlEwbzdRVUZEUkN4dFFrRkJhVUlzUlVGQlJTd3lRa0ZCVXl4TFFVRkxMRVZCUVVVN1FVRkRha01zVVVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RlFVRkRMR2RDUVVGblFpeEZRVUZGTEV0QlFVc3NSVUZCUXl4RFFVRkRMRU5CUVVNN1IwRkRNVU03UVVGRFJDeHJRa0ZCWjBJc1JVRkJSU3d3UWtGQlV5eExRVUZMTEVWQlFVVTdRVUZEYUVNc1VVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eEZRVUZETEdkQ1FVRm5RaXhGUVVGRkxFbEJRVWtzUTBGQlF5eFpRVUZaTEVWQlFVTXNRMEZCUXl4RFFVRkRPMGRCUTNSRU8wRkJRMFFzWlVGQllTeEZRVUZGTEhsQ1FVRlhPMEZCUTNoQ0xGTkJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXp0SFFVTnFSRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4SlFVRkpMR2xDUVVGcFFpeEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVU40UXl4cFFrRkJaU3hGUVVGRkxESkNRVUZYTzBGQlF6RkNMRmRCUVU4c1JVRkJReXhMUVVGTExFVkJRVVVzUzBGQlN5eEZRVUZETEVOQlFVTTdSMEZEZGtJN1FVRkRSQ3hWUVVGUkxFVkJRVVVzYjBKQlFWYzdRVUZEYmtJc1VVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEhRVU16UXp0QlFVTkVMR05CUVZrc1JVRkJSU3gzUWtGQlZ6dEJRVU4yUWl4UlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHZENRVUZuUWl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdSMEZETDBNN1FVRkRSQ3hSUVVGTkxFVkJRVVVzYTBKQlFWYzdRVUZEYWtJc1YwRkRSVHM3VVVGQlNTeExRVUZMTEVWQlFVVXNSVUZCUXl4bFFVRmxMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFhRVUZYTEVkQlFVY3NiVUpCUVcxQ0xFZEJRVWNzUlVGQlJTeEZRVUZGTEUxQlFVMHNSVUZCUlN4SlFVRkpMRVZCUVVVc1RVRkJUU3hGUVVGRkxGTkJRVk1zUlVGQlF5eEJRVUZETEVWQlFVTXNWMEZCVnl4RlFVRkZMRWxCUVVrc1EwRkJReXhSUVVGUkxFRkJRVU1zUlVGQlF5eFhRVUZYTEVWQlFVVXNTVUZCU1N4RFFVRkRMRmxCUVZrc1FVRkJRenROUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3p0TFFVRk5MRU5CUTNKTk8wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPenM3T3p0QlFVMUlMRk5CUVZNc1VVRkJVU3hIUVVGSE8wRkJRMnhDTEU5QlFVc3NRMEZCUXl4TlFVRk5MRU5CUTFZc2IwSkJRVU1zVVVGQlVTeEpRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRUZCUVVNc1IwRkJSeXhGUVVNNVFpeFJRVUZSTEVOQlFVTXNZMEZCWXl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVOd1F5eERRVUZETzBOQlEwZ3NRMEZCUXpzN1FVRkZSaXhKUVVGSkxFOUJRVThzUjBGQlJ5eERRVU5hTEVWQlFVVXNSVUZCUlN4RlFVRkZMRU5CUVVNc1JVRkJSU3hKUVVGSkxFVkJRVVVzVTBGQlV5eEZRVUZGTEVsQlFVa3NSVUZCUlN4cFFrRkJhVUlzUlVGQlJTeFJRVUZSTEVWQlFVVXNTVUZCU1N4RlFVRkZMRVZCUTI1RkxFVkJRVVVzUlVGQlJTeEZRVUZGTEVOQlFVTXNSVUZCUlN4SlFVRkpMRVZCUVVVc1pVRkJaU3hGUVVGRkxFbEJRVWtzUlVGQlJTeHZRa0ZCYjBJc1JVRkJSU3hSUVVGUkxFVkJRVVVzUzBGQlN5eEZRVUZGTEVWQlF6ZEZMRVZCUVVVc1JVRkJSU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEpRVUZKTEVWQlFVVXNVVUZCVVN4RlFVRkZMRWxCUVVrc1JVRkJSU3hwUWtGQmFVSXNSVUZCUlN4UlFVRlJMRVZCUVVVc1MwRkJTeXhGUVVGRkxFVkJRMjVGTEVWQlFVVXNSVUZCUlN4RlFVRkZMRU5CUVVNc1JVRkJSU3hKUVVGSkxFVkJRVVVzVlVGQlZTeEZRVUZGTEVsQlFVa3NSVUZCUlN4cFFrRkJhVUlzUlVGQlJTeFJRVUZSTEVWQlFVVXNTMEZCU3l4RlFVRkZMRVZCUTNKRkxFVkJRVVVzUlVGQlJTeEZRVUZGTEVOQlFVTXNSVUZCUlN4SlFVRkpMRVZCUVVVc1UwRkJVeXhGUVVGRkxFbEJRVWtzUlVGQlJTeFRRVUZUTEVWQlFVVXNVVUZCVVN4RlFVRkZMRXRCUVVzc1JVRkJSU3hGUVVNMVJDeEZRVUZGTEVWQlFVVXNSVUZCUlN4RFFVRkRMRVZCUVVVc1NVRkJTU3hGUVVGRkxFOUJRVThzUlVGQlJTeEpRVUZKTEVWQlFVVXNUMEZCVHl4RlFVRkZMRkZCUVZFc1JVRkJSU3hMUVVGTExFVkJRVVVzUTBGRGVrUXNRMEZCUXpzN1FVRkZSaXhKUVVGSkxGRkJRVkVzUjBGQlJ5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGREwwSXNhVUpCUVdVc1JVRkJSU3d5UWtGQlZ6dEJRVU14UWl4WFFVRlBPMEZCUTB3c1lVRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHp0QlFVTXpRaXhuUWtGQlZTeEZRVUZGTEVOQlFVTTdTMEZEWkN4RFFVRkRPMGRCUTBnN1FVRkRSQ3hYUVVGVExFVkJRVVVzYlVKQlFWTXNTMEZCU3l4RlFVRkZPMEZCUTNwQ0xGRkJRVWtzVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJVeXhIUVVGSExFVkJRVVU3UVVGRGVrTXNVMEZCUnl4RFFVRkRMRkZCUVZFc1IwRkJSeXhIUVVGSExFTkJRVU1zUlVGQlJTeExRVUZMTEV0QlFVc3NRMEZCUXp0QlFVTm9ReXhoUVVGUExFZEJRVWNzUTBGQlF6dExRVU5hTEVOQlFVTXNRMEZCUXp0QlFVTklMRkZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRFdpeGhRVUZQTEVWQlFVVXNWVUZCVlR0QlFVTnVRaXhuUWtGQlZTeEZRVUZGTEV0QlFVczdTMEZEYkVJc1EwRkJReXhEUVVGRE8wZEJRMG83UVVGRFJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVVVGQlNTeFZRVUZWTEVOQlFVTTdRVUZEWml4WlFVRlBMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVlVGQlZUdEJRVU14UWl4WFFVRkxMRU5CUVVNN1FVRkRTaXhyUWtGQlZTeEhRVUZITEc5Q1FVRkRMRk5CUVZNc1QwRkJSeXhEUVVGRE8wRkJRek5DTEdOQlFVMDdRVUZCUVN4QlFVTlNMRmRCUVVzc1EwRkJRenRCUVVOS0xHdENRVUZWTEVkQlFVY3NiMEpCUVVNc1lVRkJZU3hQUVVGSExFTkJRVU03UVVGREwwSXNZMEZCVFR0QlFVRkJMRUZCUTFJc1YwRkJTeXhEUVVGRE8wRkJRMG9zYTBKQlFWVXNSMEZCUnl4dlFrRkJReXhOUVVGTkxFOUJRVWNzUTBGQlF6dEJRVU40UWl4alFVRk5PMEZCUVVFc1FVRkRVaXhYUVVGTExFTkJRVU03UVVGRFNpeHJRa0ZCVlN4SFFVRkhMRzlDUVVGRExGRkJRVkVzVDBGQlJ5eERRVUZETzBGQlF6RkNMR05CUVUwN1FVRkJRU3hCUVVOU0xGZEJRVXNzUTBGQlF6dEJRVU5LTEd0Q1FVRlZMRWRCUVVjc2IwSkJRVU1zVDBGQlR5eFBRVUZITEVOQlFVTTdRVUZEZWtJc1kwRkJUVHRCUVVGQkxFRkJRMUlzVjBGQlN5eERRVUZETzBGQlEwb3NhMEpCUVZVc1IwRkJSeXh2UWtGQlF5eExRVUZMTEU5QlFVY3NRMEZCUXp0QlFVTjJRaXhqUVVGTk8wRkJRVUVzUVVGRFVqdEJRVU5GTEd0Q1FVRlZMRWRCUVVjc2IwSkJRVU1zVTBGQlV5eFBRVUZITEVOQlFVTTdRVUZCUVN4TFFVTTVRanRCUVVORUxGZEJRMFU3TzFGQlFWTXNVMEZCVXl4RlFVRkRMRTFCUVUwN1RVRkRka0k3TzFWQlFVc3NVMEZCVXl4RlFVRkRMRmRCUVZjN1VVRkRlRUk3TzFsQlFVc3NVMEZCVXl4RlFVRkRMRmRCUVZjN1ZVRkRlRUk3TzJOQlFVc3NVMEZCVXl4RlFVRkRMRXRCUVVzN1dVRkRiRUlzYjBKQlFVTXNTVUZCU1N4SlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRVUZCUXl4RlFVRkRMRk5CUVZNc1JVRkJSU3hKUVVGSkxFTkJRVU1zVTBGQlV5eEJRVUZETEVkQlFVYzdXVUZEYUVVN08yZENRVUZMTEZOQlFWTXNSVUZCUXl3d1JrRkJNRVk3WTBGRGRrYzdPMnRDUVVGTExGTkJRVk1zUlVGQlF5eGhRVUZoTzJkQ1FVTjZRaXhWUVVGVk8yVkJRMUE3WVVGRFJqdFhRVU5HTzFOQlEwWTdVVUZEVGl4dlFrRkJReXhUUVVGVExFOUJRVWM3VDBGRlZEdExRVU5GTEVOQlExWTdSMEZEU0R0RFFVTkdMRU5CUVVNc1EwRkJRenM3UVVGRlNDeEpRVUZKTEZGQlFWRXNSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZETDBJc1lVRkJWeXhGUVVGRkxIVkNRVUZYTzBGQlEzUkNMRXRCUVVNc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF5eEpRVUZKTEVWQlFVVXNRMEZCUXp0QlFVTjBRaXhMUVVGRExFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUVVNN1IwRkRka0k3UVVGRFJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdPMDFCUTB3N08xVkJRVTBzWlVGQldTeFRRVUZUTEVWQlFVTXNTMEZCU3l4RlFVRkRMRzlDUVVGdlFpeEZRVUZETEVWQlFVVXNSVUZCUXl4VlFVRlZMRVZCUVVNc1UwRkJVeXhGUVVGRExHbERRVUZwUXl4RlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eEJRVUZET3p0UFFVVTNTRHRMUVVOSUxFTkJRMDQ3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hKUVVGSkxGTkJRVk1zUjBGQlJ5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGRGFFTXNZVUZCVnl4RlFVRkZMSFZDUVVGWE8wRkJRM1JDTEV0QlFVTXNRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGQlF6dEJRVU4wUWl4TFFVRkRMRU5CUVVNc1YwRkJWeXhEUVVGRExFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTTdSMEZEZGtJN1FVRkRSQ3hSUVVGTkxFVkJRVVVzYTBKQlFWYzdRVUZEYWtJc1YwRkRSVHM3TzAxQlEwdzdPMVZCUVUwc1pVRkJXU3hUUVVGVExFVkJRVU1zUzBGQlN5eEZRVUZETEdkQ1FVRm5RaXhGUVVGRExGTkJRVk1zUlVGQlF5eFhRVUZYTEVWQlFVTXNTMEZCU3l4RlFVRkZMRVZCUVVNc1RVRkJUU3hGUVVGRkxGTkJRVk1zUlVGQlF5eEJRVUZETEVWQlFVTXNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhYUVVGWExFRkJRVU03VVVGRGRFZ3NPRUpCUVUwc1UwRkJVeXhGUVVGRExHbENRVUZwUWl4SFFVRlJPMDlCUTNCRE8wdEJRMGdzUTBGRFRqdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFbEJRVWtzU1VGQlNTeEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVU16UWl4UlFVRk5MRVZCUVVVc2EwSkJRVmM3UVVGRGFrSXNVVUZCU1N4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRMmhDTEZGQlFVa3NXVUZCV1N4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlRMRWRCUVVjc1JVRkJSU3hMUVVGTExFVkJRVVU3UVVGRE4wUXNZVUZEUlN4dlFrRkJReXhIUVVGSExFbEJRVU1zVTBGQlV5eEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhCUVVGRExFVkJRVU1zUjBGQlJ5eEZRVUZGTEVkQlFVY3NRMEZCUXl4SlFVRkpMRUZCUVVNc1JVRkJReXhGUVVGRkxFVkJRVVVzUjBGQlJ5eERRVUZETEVsQlFVa3NRVUZCUXl4RlFVRkRMRWRCUVVjc1JVRkJSU3hIUVVGSExFRkJRVU1zUjBGQlJ5eERRVU12UlR0TFFVTklMRU5CUVVNc1EwRkJRenRCUVVOSUxGZEJRMFU3TzFGQlFVc3NVMEZCVXl4RlFVRkRMRzlEUVVGdlF6dE5RVU5xUkRzN1ZVRkJTeXhUUVVGVExFVkJRVU1zZFVKQlFYVkNMRVZCUVVNc1NVRkJTU3hGUVVGRExGbEJRVms3VVVGRGRFUTdPMWxCUVVrc1UwRkJVeXhGUVVGRExHZENRVUZuUWl4RlFVRkRMRWxCUVVrc1JVRkJReXhUUVVGVE8xVkJRekZETEZsQlFWazdVMEZEVmp0UFFVTkVPMHRCUTBZc1EwRkRUanRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0QlFVVklMRWxCUVVrc1IwRkJSeXhIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVNeFFpeGhRVUZYTEVWQlFVVXNkVUpCUVZjN1FVRkRkRUlzVVVGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN1IwRkRla003UVVGRFJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdVVUZCU1N4SlFVRkpMRVZCUVVNc1kwRkJZeXhGUVVGRExGTkJRVk1zUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhSUVVGUkxFZEJRVWNzVVVGQlVTeEhRVUZITEVWQlFVVXNRVUZCUXp0TlFVTjZSVHM3VlVGQlJ5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeEJRVUZETEVWQlFVTXNhVUpCUVdVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4QlFVRkRMRVZCUVVNc1NVRkJTU3hGUVVGRExFdEJRVXNzUlVGQlF5eGxRVUZaTEV0QlFVc3NSVUZCUXl4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExGZEJRVmNzUVVGQlF6dFJRVU4wU0N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTzA5QlEyeENPMHRCUTBRc1EwRkRURHRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0QlFVVklMRWxCUVVrc1pVRkJaU3hIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVOMFF5eFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdVVUZCVVN4VFFVRlRMRVZCUVVNc1lVRkJZVHROUVVNM1FqczdWVUZCU3l4VFFVRlRMRVZCUVVNc1QwRkJUenRSUVVOd1FqczdXVUZCU3l4VFFVRlRMRVZCUVVNc1dVRkJXVHRWUVVONlFpdzRRa0ZCVFN4VFFVRlRMRVZCUVVNc2EwSkJRV3RDTEVkQlFWRTdVMEZEZEVNN1VVRkRUanM3V1VGQlN5eFRRVUZUTEVWQlFVTXNXVUZCV1R0VlFVTjZRanM3WTBGQlNTeFRRVUZUTEVWQlFVTXNaVUZCWlRzN1dVRkJZenM3T3p0aFFVRnBRanM3VjBGQlowSTdVMEZEZUVVN1QwRkRSanRMUVVORExFTkJRMVE3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hKUVVGSkxHMUNRVUZ0UWl4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVTXhReXhqUVVGWkxFVkJRVVVzZDBKQlFWYzdRVUZEZGtJc1YwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRla1FzVVVGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1IwRkROMFU3UVVGRFJDeHBRa0ZCWlN4RlFVRkZMREpDUVVGWE8wRkJRekZDTEZkQlFVODdRVUZEVEN4blFrRkJWU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNWVUZCVlR0TFFVTnNReXhEUVVGRE8wZEJRMGc3UVVGRFJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVVVGQlNTeEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUTJoQ0xGRkJRVWtzWVVGQllTeEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1ZVRkJWU3hEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZUTEZGQlFWRXNSVUZCUlR0QlFVTXZSQ3hoUVVORkxHOUNRVUZETEdsQ1FVRnBRaXhKUVVGRExGRkJRVkVzUlVGQlJTeFJRVUZSTEVGQlFVTXNSMEZCUnl4RFFVTjZRenRMUVVOSUxFTkJRVU1zUTBGQlF6dEJRVU5JTEZkQlEwVTdPMUZCUVVzc1UwRkJVeXhGUVVGRExEQkNRVUV3UWp0TlFVTjJRenM3VlVGQlR5eFBRVUZQTEVWQlFVTXNWVUZCVlN4RlFVRkRMRk5CUVZNc1JVRkJReXgzUWtGQmQwSTdPMDlCUVdsQ08wMUJRemRGT3p0VlFVRkxMRk5CUVZNc1JVRkJReXhYUVVGWE8xRkJRM2hDT3p0WlFVRlJMRk5CUVZNc1JVRkJReXhqUVVGakxFVkJRVU1zUlVGQlJTeEZRVUZETEZWQlFWVXNSVUZCUXl4SFFVRkhMRVZCUVVNc1ZVRkJWU3hGUVVGRExGRkJRVkVzUlVGQlJTeEpRVUZKTEVOQlFVTXNXVUZCV1N4QlFVRkRPMVZCUTNaR0xHRkJRV0U3VTBGRFVEdFBRVU5NTzB0QlEwWXNRMEZEVGp0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dEJRVVZJTEVsQlFVa3NhVUpCUVdsQ0xFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJRM2hETEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFhRVU5GT3p0UlFVRlJMRXRCUVVzc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNRVUZCUXl4RlFVRkRMRWRCUVVjc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNRVUZCUXp0TlFVTXhSQ3hKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hEUVVGRE8wdEJRemxDTEVOQlExUTdSMEZEU0R0RFFVTkdMRU5CUVVNc1EwRkJRenM3UVVGRlNDeEpRVUZKTEdkQ1FVRm5RaXhIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVOMlF5eHRRa0ZCYVVJc1JVRkJSU3cyUWtGQlZ6dEJRVU0xUWl4TFFVRkRMRU5CUVVNc2RVSkJRWFZDTEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1JVRkJReXhIUVVGSExFVkJRVU1zUTBGQlF5eEZRVUZETEVkQlFVY3NSVUZCUXl4RFFVRkRMRVZCUVVNc1NVRkJTU3hGUVVGRExFTkJRVU1zUlVGQlF5eExRVUZMTEVWQlFVTXNRMEZCUXl4RlFVRkRMRU5CUVVNc1EwRkJRenRCUVVOb1JTeExRVUZETEVOQlFVTXNkVUpCUVhWQ0xFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTXNUMEZCVHl4RlFVRkZMRlZCUVZNc1EwRkJReXhGUVVGRk8wRkJRMnBFTEU5QlFVTXNRMEZCUXl4TFFVRkxMRXRCUVVzc1EwRkJReXhIUVVOWUxFTkJRVU1zUTBGQlF5d3dRa0ZCTUVJc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZEZUVNc1EwRkJReXhEUVVGRExFdEJRVXNzUzBGQlJ5eERRVUZETEVkQlExZ3NRMEZCUXl4RFFVRkRMREJDUVVFd1FpeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVONFF5eERRVUZETEVOQlFVTXNTMEZCU3l4TFFVRkhMRU5CUVVNc1IwRkRXQ3hEUVVGRExFTkJRVU1zTUVKQlFUQkNMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlEzaERMRU5CUVVNc1EwRkJReXhMUVVGTExFdEJRVWNzUTBGQlF5eEhRVU5ZTEVOQlFVTXNRMEZCUXl3d1FrRkJNRUlzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkRlRU1zUTBGQlF5eERRVUZETEV0QlFVc3NTMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExEQkNRVUV3UWl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzB0QlF6VkVMRU5CUVVNc1EwRkJRenRIUVVOS08wRkJRMFFzVVVGQlRTeEZRVUZGTEd0Q1FVRlhPMEZCUTJwQ0xGZEJRMFU3TzFGQlFVc3NVMEZCVXl4RlFVRkRMREJDUVVFd1FqdE5RVU4yUXpzN1ZVRkJUeXhQUVVGUExFVkJRVU1zWVVGQllTeEZRVUZETEZOQlFWTXNSVUZCUXl4M1FrRkJkMEk3TzA5QlFXZENPMDFCUXk5Rk96dFZRVUZMTEZOQlFWTXNSVUZCUXl4VlFVRlZPMUZCUTNaQ0xDdENRVUZQTEVWQlFVVXNSVUZCUXl4elFrRkJjMElzUlVGQlF5eEpRVUZKTEVWQlFVTXNUVUZCVFN4SFFVRkhPMDlCUXpORE8wMUJRMDQ3TzFWQlFVc3NVMEZCVXl4RlFVRkRMRlZCUVZVN08xRkJRVk03TzFsQlFVMHNSVUZCUlN4RlFVRkRMSGxDUVVGNVFqczdVMEZCVlRzN1QwRkJUenRMUVVOcVJpeERRVU5PTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzU1VGQlNTeHJRa0ZCYTBJc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkRla01zWVVGQlZ5eEZRVUZGTEhGQ1FVRlRMRkZCUVZFc1JVRkJSU3hQUVVGUExFVkJRVVU3UVVGRGRrTXNWMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhSUVVGUkxFZEJRVWNzU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU4yUkN4UlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFVkJRVU1zWlVGQlpTeEZRVUZGTEZGQlFWRXNSVUZCUlN4alFVRmpMRVZCUVVVc1QwRkJUeXhGUVVGRExFTkJRVU1zUTBGQlF6dEhRVU55UlR0QlFVTkVMR2xDUVVGbExFVkJRVVVzTWtKQlFWYzdRVUZETVVJc1YwRkJUeXhGUVVGRExHVkJRV1VzUlVGQlJTeEpRVUZKTzBGQlEzSkNMRzlDUVVGakxFVkJRVVVzUlVGQlJUdEJRVU5zUWl3d1FrRkJiMElzUlVGQlJTeEpRVUZKTEVWQlFVTXNRMEZCUXp0SFFVTnlRenRCUVVORUxHMUNRVUZwUWl4RlFVRkZMRFpDUVVGWE8wRkJRelZDTEZGQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJRenRIUVVOdVFqdEJRVU5FTEdGQlFWY3NSVUZCUlN4MVFrRkJWenRCUVVOMFFpeFJRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVNc2IwSkJRVzlDTEVWQlFVVXNTMEZCU3l4RlFVRkRMRU5CUVVNc1EwRkJRenRIUVVNNVF6dEJRVU5FTEdGQlFWY3NSVUZCUlN4MVFrRkJWenRCUVVOMFFpeFJRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVNc2IwSkJRVzlDTEVWQlFVVXNTVUZCU1N4RlFVRkRMRU5CUVVNc1EwRkJRenRIUVVNM1F6dEJRVU5FTEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFJRVUZKTEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRhRUlzVVVGQlNTeG5Ra0ZCWjBJc1IwRkJSeXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEZWQlFWTXNSVUZCUlN4RlFVRkZMRU5CUVVNc1JVRkJSVHRCUVVNNVJTeFZRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEZWQlFWVXNRMEZCUXl4RlFVRkZPMEZCUTNSRExGVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0UFFVTnFRenRCUVVORUxHRkJRVThzUlVGQlJTeERRVUZETzB0QlExZ3NSVUZCUlN4RlFVRkZMRU5CUVVNc1EwRkJRenRCUVVOUUxGRkJRVWtzWVVGQllTeEhRVUZITEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJVeXhSUVVGUkxFVkJRVVU3UVVGRE9VVXNZVUZCVHl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenRMUVVOdVJDeERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZNc1VVRkJVU3hGUVVGRk8wRkJRM2hDTEdGQlEwVXNiMEpCUVVNc2FVSkJRV2xDTEVsQlFVTXNSMEZCUnl4RlFVRkZMRkZCUVZFc1FVRkJReXhGUVVGRExGRkJRVkVzUlVGQlJTeFJRVUZSTEVGQlFVTXNSVUZCUXl4WFFVRlhMRVZCUVVVc1NVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhCUVVGRExFZEJRVWNzUTBGRE5VazdTMEZEU0N4RFFVRkRMRU5CUVVNN096czdPenRCUVUxSUxGRkJRVWtzWjBKQlFXZENMRWRCUVVjc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eGxRVUZsTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhqUVVGakxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhIUVVGSExFVkJRVVVzUTBGQlF6dEJRVU42Unl4WFFVTkZPenM3VFVGRFJUczdWVUZCU3l4VFFVRlRMRVZCUVVNc01FSkJRVEJDTzFGQlEzWkRPenRaUVVGUExGTkJRVk1zUlVGQlF5eDNRa0ZCZDBJN08xTkJRV3RDTzFGQlF6TkVPenRaUVVGTExGTkJRVk1zUlVGQlF5eFZRVUZWTzFWQlEzWkNPenRqUVVGTExGTkJRVk1zUlVGQlF5eDFRa0ZCZFVJN1dVRkRjRU03TzJkQ1FVRkxMRk5CUVZNc1JVRkJReXhaUVVGWk8yTkJRM3BDTEdGQlFXRTdZVUZEVkR0WFFVTkdPMU5CUTBZN1VVRkRUanM3V1VGQlN5eFRRVUZUTEVWQlFVTXNjVUpCUVhGQ08xVkJRMnhET3p0alFVRlJMRWxCUVVrc1JVRkJReXhSUVVGUkxFVkJRVU1zVTBGQlV5eEZRVUZETEhkQ1FVRjNRanM3VjBGQlowSTdWVUZEZUVVN08yTkJRVkVzUlVGQlJTeEZRVUZETEZOQlFWTXNSVUZCUXl4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExGZEJRVmNzUVVGQlF5eEZRVUZETEVsQlFVa3NSVUZCUXl4UlFVRlJMRVZCUVVNc1NVRkJTU3hGUVVGRExGRkJRVkVzUlVGQlF5eFRRVUZUTEVWQlFVTXNkMEpCUVhkQ0xFVkJRVU1zYVVKQlFXTXNUMEZCVHl4RlFVRkRMR2xDUVVGakxGTkJRVk03V1VGQlF5dzRRa0ZCVFN4VFFVRlRMRVZCUVVNc01FSkJRVEJDTEVkQlFWRTdPMWRCUVdFN1UwRkRlRTQ3VDBGRFJqdE5RVU5PTEc5Q1FVRkRMSE5DUVVGelFpeEpRVUZETEZOQlFWTXNSVUZCUlN4blFrRkJaMElzUVVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHOUNRVUZ2UWl4QlFVRkRMRVZCUVVNc1YwRkJWeXhGUVVGRkxFbEJRVWtzUTBGQlF5eFhRVUZYTEVGQlFVTXNSMEZCUnp0TlFVTnFTU3h2UWtGQlF5eHZRa0ZCYjBJc1NVRkJReXhsUVVGbExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4bFFVRmxMRUZCUVVNc1JVRkJReXhqUVVGakxFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4alFVRmpMRUZCUVVNc1JVRkJReXhuUWtGQlowSXNSVUZCUlN4blFrRkJaMElzUVVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUlN4TFFVRkxMRUZCUVVNc1IwRkJSenRMUVVOcVN5eERRVU5PTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzU1VGQlNTeHBRa0ZCYVVJc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkRlRU1zWVVGQlZ5eEZRVUZGTEhWQ1FVRlhPMEZCUTNSQ0xGRkJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNWMEZCVnl4RlFVRkZMRU5CUVVNN1IwRkRNVUk3UVVGRFJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdVVUZCVFN4VFFVRlRMRVZCUVVNc2QwSkJRWGRDTEVWQlFVTXNSMEZCUnl4RlFVRkRMR05CUVdNc1JVRkJReXhMUVVGTExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRUZCUVVNc1JVRkJReXhIUVVGSExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRUZCUVVNc1JVRkJReXhKUVVGSkxFVkJRVU1zVVVGQlVTeEZRVUZETEU5QlFVOHNSVUZCUlN4SlFVRkpMRU5CUVVNc1YwRkJWeXhCUVVGRE8wMUJRM1pLTEVsQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZSTEVOQlFVTTdTMEZEYUVNc1EwRkRVRHRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0QlFVVklMRWxCUVVrc2MwSkJRWE5DTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlF6ZERMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4UlFVRkpMRzFDUVVGdFFpeEhRVUZITEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0QlFVTTFSQ3hSUVVGSkxIRkNRVUZ4UWl4SFFVRkhMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEdWQlFXVXNRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJReXhWUVVGVExGZEJRVmNzUlVGQlJUdEJRVU42Uml4aFFVRlBMRzFDUVVGdFFpeERRVUZETEU5QlFVOHNRMEZCUXl4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6dExRVU4yUkN4RFFVRkRMRU5CUVVNN1FVRkRTQ3hSUVVGSkxHRkJRV0VzUjBGQlJ5eERRVUZETEZsQlFWa3NSVUZCUlN4bFFVRmxMRU5CUVVNc1EwRkJRenRCUVVOd1JDeFJRVUZKTEhOQ1FVRnpRaXhIUVVGSExIRkNRVUZ4UWl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVExGRkJRVkVzUlVGQlJUdEJRVU40UlN4aFFVTkZMRzlDUVVGRExEQkNRVUV3UWl4SlFVRkRMR2xDUVVGcFFpeEZRVUZGTEZGQlFWRXNRVUZCUXl4SFFVRkhMRU5CUXpORU8wdEJRMGdzUTBGQlF5eERRVUZETzBGQlEwZ3NVVUZCUnl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUlVGQlJUdEJRVU4wUWl4dFFrRkJZU3hEUVVGRExFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXp0TFFVTm9RenRCUVVORUxGZEJRMFU3TzFGQlFVc3NVMEZCVXl4RlFVRkZMR0ZCUVdFc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVGQlFVTXNSVUZCUXl4RlFVRkZMRVZCUVVNc1pVRkJaVHROUVVONlJEczdWVUZCVHl4VFFVRlRMRVZCUVVNc2QwSkJRWGRDT3p0UFFVRnRRanROUVVNMVJEczdWVUZCU3l4VFFVRlRMRVZCUVVNc1ZVRkJWVHRSUVVOMFFpeHpRa0ZCYzBJN1QwRkRia0k3UzBGRFJpeERRVU5PTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzU1VGQlNTd3dRa0ZCTUVJc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkRha1FzWVVGQlZ5eEZRVUZGTEhWQ1FVRlhPMEZCUTNSQ0xGRkJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRPMEZCUXk5RExGbEJRVkVzUlVGQlJTeERRVUZETzBkQlExbzdRVUZEUkN4UlFVRk5MRVZCUVVVc2EwSkJRVmM3UVVGRGFrSXNWMEZEUlRzN1VVRkJUU3hUUVVGVExFVkJRVU1zZDBKQlFYZENMRVZCUVVNc1IwRkJSeXhGUVVGRExHTkJRV01zUlVGQlF5eExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhwUWtGQmFVSXNRVUZCUXl4RlFVRkRMRWRCUVVjc1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEdsQ1FVRnBRaXhCUVVGRExFVkJRVU1zU1VGQlNTeEZRVUZETEZGQlFWRXNSVUZCUXl4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExGZEJRVmNzUVVGQlF6dE5RVU42U3l4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU03UzBGRGVrTXNRMEZEVUR0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdRVUYxUTBnc1NVRkJTU3h2UWtGQmIwSXNSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZETTBNc1owSkJRV01zUlVGQlJTd3dRa0ZCVnpzN1FVRkZla0lzVVVGQlNTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNaVUZCWlN4RFFVRkRMRU5CUVVNN1FVRkRiRVFzV1VGQlVTeEZRVUZGTEVOQlFVTTdSMEZEV2p0QlFVTkVMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4UlFVRkpMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU03UVVGRGFFSXNVVUZCU1N4dlFrRkJiMElzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMR2RDUVVGblFpeERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlRMRkZCUVZFc1JVRkJSVHRCUVVNMVJUczdRVUZGU1N3MFFrRkJReXgzUWtGQmQwSXNTVUZCUXl4bFFVRmxMRVZCUVVVc1VVRkJVU3hCUVVGRExFZEJRVWM3VVVGRGVrUTdTMEZEU0N4RFFVRkRMRU5CUVVNN1FVRkRTQ3hSUVVGSkxHRkJRV0VzUjBGQlJ5eERRVUZETEZsQlFWa3NSVUZCUlN4bFFVRmxMRU5CUVVNc1EwRkJRenRCUVVOd1JDeFJRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hGUVVGRk8wRkJRM1JDTEcxQ1FVRmhMRU5CUVVNc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzB0QlEyaERPMEZCUTBRc1VVRkJTU3hKUVVGSkxFTkJRVU03UVVGRFZDeFJRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1pVRkJaU3hGUVVGRk8wRkJRemRDTEZWQlFVa3NSMEZEUmpzN1ZVRkJTeXhUUVVGVExFVkJRVVVzWVVGQllTeERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1FVRkJReXhGUVVGRExFVkJRVVVzUlVGQlF5eGhRVUZoTzFGQlEzWkVPenRaUVVGTExGTkJRVk1zUlVGQlF5d3dRa0ZCTUVJN1ZVRkRka003TzJOQlFVc3NVMEZCVXl4RlFVRkRMR05CUVdNN1dVRkRNMEk3TzJkQ1FVRkxMRk5CUVZNc1JVRkJReXhMUVVGTE8yTkJRMnhDT3p0clFrRkJTeXhUUVVGVExFVkJRVU1zVlVGQlZUdG5Ra0ZEZGtJN08yOUNRVUZSTEVsQlFVa3NSVUZCUXl4UlFVRlJMRVZCUVVNc1UwRkJVeXhGUVVGRExIZENRVUYzUWp0clFrRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEdWQlFXVTdhVUpCUVZVN1pVRkRNVVk3WTBGRFRqczdhMEpCUVVzc1UwRkJVeXhGUVVGRExGVkJRVlU3WjBKQlEzWkNPenR2UWtGQlNTeFRRVUZUTEVWQlFVTXNZVUZCWVR0clFrRkRla0k3T3p0dlFrRkRSVHM3TzNOQ1FVVkZPenM3TzNWQ1FVRTRRanM3YzBKQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhqUVVGakxFTkJRVU1zVVVGQlVTeERRVUZETzNGQ1FVTTNSRHR0UWtGRFREdHJRa0ZEVERzN08yOUNRVU5GT3pzN2MwSkJRMFU3T3pzN2RVSkJRWGRDT3p0elFrRkJaMElzU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHTkJRV01zUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0elFrRkJReXdyUWtGQlRUczdjMEpCUTNwR0xFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMR05CUVdNc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4aFFVRmhMRU5CUVVNN2NVSkJRM0JGTzIxQ1FVTk1PMmxDUVVOR08yVkJRMFE3WVVGRFJqdFhRVU5HTzFWQlEwNDdPenRaUVVORk96czdPMkZCUVcxRE8xbEJRMnhETEc5Q1FVRnZRanRYUVVOdVFqdFRRVU5CTzFGQlEwNDdPMWxCUVVzc1UwRkJVeXhGUVVGRExGVkJRVlU3VlVGRGRrSTdPMk5CUVZFc1NVRkJTU3hGUVVGRExGRkJRVkVzUlVGQlF5eEpRVUZKTEVWQlFVTXNVVUZCVVN4RlFVRkRMRk5CUVZNc1JVRkJReXh2UTBGQmIwTXNSVUZCUXl4cFFrRkJZeXhOUVVGTkxFVkJRVU1zYVVKQlFXTXNXVUZCV1N4RlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zWTBGQll5eEJRVUZET3p0WFFVRm5RanRUUVVNMVN6dFBRVU5HTEVOQlFVTTdTMEZEVml4TlFVRk5PMEZCUTB3c1ZVRkJTU3hIUVVGSExEWkNRVUZMTEZOQlFWTXNSVUZCUlN4aFFVRmhMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEJRVUZETEVWQlFVTXNSVUZCUlN4RlFVRkRMR0ZCUVdFc1IwRkJUeXhEUVVGRE8wdEJRM3BGTzBGQlEwUXNWMEZEUlRzN08wMUJRMGNzU1VGQlNUdExRVU5HTEVOQlEwdzdSMEZEU0R0RFFVTkdMRU5CUVVNc1EwRkJRenM3UVVGRlNDeEpRVUZKTEhkQ1FVRjNRaXhIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVNdlF5eGhRVUZYTEVWQlFVVXNkVUpCUVZjN08wRkJSWFJDTEZGQlFVa3NRMEZCUXl4clFrRkJhMElzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMR1ZCUVdVc1EwRkJReXhEUVVGRE8wRkJRM0JFTEZsQlFWRXNSVUZCUlN4RFFVRkRPMGRCUTFvN1FVRkRSQ3hSUVVGTkxFVkJRVVVzYTBKQlFWYzdRVUZEYWtJc1YwRkRSVHM3VVVGQlRTeFRRVUZUTEVWQlFVTXNkMEpCUVhkQ0xFVkJRVU1zUjBGQlJ5eEZRVUZETEdOQlFXTXNSVUZCUXl4TFFVRkxMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eGxRVUZsTEVGQlFVTXNSVUZCUXl4SFFVRkhMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eGxRVUZsTEVGQlFVTXNSVUZCUXl4SlFVRkpMRVZCUVVNc1VVRkJVU3hGUVVGRExFOUJRVThzUlVGQlJTeEpRVUZKTEVOQlFVTXNWMEZCVnl4QlFVRkRPMDFCUTNKTExFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhsUVVGbExFTkJRVU03UzBGRGRrTXNRMEZEVUR0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dEJRVVZJTEVsQlFVa3NVMEZCVXl4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVTm9ReXhwUWtGQlpTeEZRVUZGTERKQ1FVRlhPMEZCUXpGQ0xGZEJRVTg3T3p0QlFVZE1MR1ZCUVZNc1JVRkJSU3hKUVVGSkxFTkJRVU1zWlVGQlpUdExRVU5vUXl4RFFVRkRPMGRCUTBnN1FVRkRSQ3h4UWtGQmJVSXNSVUZCUlN3MlFrRkJVeXhSUVVGUkxFVkJRVVU3UVVGRGRFTXNWMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzWkVMRkZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVVXNVVUZCVVR0QlFVTnNRaXhsUVVGVExFVkJRVVVzU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4UlFVRlJMRU5CUVVNc1JVRkJReXhEUVVGRExFTkJRVU03UjBGRGRrUTdRVUZEUkN4UlFVRk5MRVZCUVVVc2EwSkJRVmM3UVVGRGFrSXNWMEZEUlRzN1VVRkJTeXhKUVVGSkxFVkJRVU1zVlVGQlZTeEZRVUZETEZOQlFWTXNSVUZCUXl4NVFrRkJlVUlzUlVGQlF5eEZRVUZGTEVWQlFVTXNVMEZCVXp0TlFVTnVSVHM3VlVGQlN5eFRRVUZUTEVWQlFVTXNWMEZCVnp0UlFVVjRRaXh2UWtGQlF5eGxRVUZsTEU5QlFVYzdVVUZGYmtJN08xbEJRVXNzVTBGQlV5eEZRVUZETEdsQ1FVRnBRanRWUVVjNVFpeHZRa0ZCUXl4blFrRkJaMElzVDBGQlJ6dFZRVVZ3UWl4dlFrRkJReXhyUWtGQmEwSXNTVUZCUXl4VFFVRlRMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVGQlFVTXNSVUZCUXl4WlFVRlpMRVZCUVVVc1NVRkJTU3hEUVVGRExGbEJRVmtzUVVGQlF5eEhRVUZITzFOQlJYQkdPMDlCUTBZN1MwRkRSaXhEUVVOT08wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPMEZCUlVnc1NVRkJTU3hoUVVGaExFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJRM0JETEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFhRVU5GT3p0UlFVRlRMRWxCUVVrc1JVRkJReXhWUVVGVkxFVkJRVU1zVTBGQlV5eEZRVUZETEhsQ1FVRjVRaXhGUVVGRExFVkJRVVVzUlVGQlF5eGxRVUZsTzAxQlF6ZEZPenRWUVVGTExGTkJRVk1zUlVGQlF5eFhRVUZYTzFGQlEzaENPenRaUVVGUkxGTkJRVk1zUlVGQlF5eGhRVUZoTzFWQlF6ZENPenM3TzFsQlFXdENPenM3TzJGQlFXMUNPenRYUVVGblFqdFRRVU01UXp0UlFVTlVPenRaUVVGTExGTkJRVk1zUlVGQlF5eExRVUZMTzFWQlEyeENPenRqUVVGTExGTkJRVk1zUlVGQlF5eFhRVUZYTzFsQlEzaENPenRuUWtGQlR5eFRRVUZUTEVWQlFVTXNNa0pCUVRKQ08yTkJRekZET3pzN1owSkJRMFU3T3p0clFrRkRSVHM3YzBKQlFVa3NUMEZCVHl4RlFVRkRMRWRCUVVjN2IwSkJRMkk3T3pzN2MwSkJRMjlGTEN0Q1FVRk5PM05DUVVONFJUczdPenQzUWtGQlZ6czdORUpCUVVjc1NVRkJTU3hGUVVGRExFZEJRVWM3TzNsQ1FVRmhPenQxUWtGQmQwUTdjVUpCUTNwR08yMUNRVU5FTzJ0Q1FVTk1PenM3YjBKQlEwVTdPM2RDUVVGTExGTkJRVk1zUlVGQlF5eDVRa0ZCZVVJN2MwSkJRM1JET3pzd1FrRkJTU3hUUVVGVExFVkJRVU1zWVVGQllUdDNRa0ZEZWtJN096UkNRVUZKTEZOQlFWTXNSVUZCUXl4WlFVRlpPenQ1UWtGQlZ6dDNRa0ZEY2tNN096c3dRa0ZCU1RzN09FSkJRVWNzU1VGQlNTeEZRVUZETEVkQlFVYzdPekpDUVVGWk8zbENRVUZMTzNkQ1FVTm9RenM3T3pCQ1FVRkpPenM0UWtGQlJ5eEpRVUZKTEVWQlFVTXNSMEZCUnpzN01rSkJRV0U3ZVVKQlFVczdkMEpCUTJwRE96czdNRUpCUVVrN096aENRVUZITEVsQlFVa3NSVUZCUXl4SFFVRkhPenN5UWtGQllUdDVRa0ZCU3p0M1FrRkRha003T3pSQ1FVRkpMRk5CUVZNc1JVRkJReXhSUVVGUk96QkNRVUZET3pzNFFrRkJSeXhKUVVGSkxFVkJRVU1zUjBGQlJ6czdNa0pCUVZFN2VVSkJRVXM3ZFVKQlF6VkRPM0ZDUVVORU8yMUNRVU5JTzJsQ1FVTkdPMlZCUTBNN1kwRkRVanM3TzJkQ1FVTkZPenM3YTBKQlEwVTdPM05DUVVGSkxFdEJRVXNzUlVGQlF5eExRVUZMTzI5Q1FVTmlPenQzUWtGQlRTeFRRVUZUTEVWQlFVTXNORUpCUVRSQ096dHhRa0ZCWXp0dFFrRkRka1E3YTBKQlEwdzdPenR2UWtGRFJUczdkMEpCUVVrc1UwRkJVeXhGUVVGRExHRkJRV0U3YzBKQlEzcENPenM3ZDBKQlEwVTdPenM3TUVKQlExazdPenM3TWtKQlFYVkNPM2xDUVVNelFqdDFRa0ZEVER0elFrRkRURHM3TzNkQ1FVTkZPenM3T3pCQ1FVTjNRanM3T3pzeVFrRkJlVUk3ZVVKQlEzcERPM1ZDUVVOTU8zTkNRVU5NT3pzN2QwSkJRMFU3T3pzN2VVSkJSVkU3ZFVKQlEwdzdjVUpCUTBZN2JVSkJRMFk3YTBKQlEwdzdPM05DUVVGSkxGTkJRVk1zUlVGQlF5eFpRVUZaTzI5Q1FVTjRRanM3ZDBKQlFVc3NVMEZCVXl4RlFVRkRMRmRCUVZjc1JVRkJReXhKUVVGSkxFVkJRVU1zVDBGQlR5eEZRVUZETEdOQlFWY3NTMEZCU3p0elFrRkRkRVE3T3pCQ1FVRlJMRWxCUVVrc1JVRkJReXhSUVVGUkxFVkJRVU1zVTBGQlV5eEZRVUZETERCQ1FVRXdRanQzUWtGRGVFUXNPRUpCUVUwc1UwRkJVeXhGUVVGRExHRkJRV0VzUjBGQlVUdDNRa0ZEY2tNN096UkNRVUZOTEZOQlFWTXNSVUZCUXl4WFFVRlhPenQ1UWtGQlpUdDFRa0ZEYmtNN2MwSkJRMVE3T3pCQ1FVRlJMRWxCUVVrc1JVRkJReXhSUVVGUkxFVkJRVU1zVTBGQlV5eEZRVUZETEhsQ1FVRjVRanQzUWtGRGRrUXNPRUpCUVUwc1UwRkJVeXhGUVVGRExHTkJRV01zUjBGQlVUdDNRa0ZEZEVNN096UkNRVUZOTEZOQlFWTXNSVUZCUXl4WFFVRlhPenQ1UWtGQll6dDFRa0ZEYkVNN2NVSkJRMHc3YlVKQlEwZzdhVUpCUTBZN1owSkJRMHc3T3p0clFrRkRSVHM3YzBKQlFVa3NTMEZCU3l4RlFVRkRMRXRCUVVzN2IwSkJRMkk3TzNkQ1FVRk5MRk5CUVZNc1JVRkJReXgzUWtGQmQwSTdPM0ZDUVVGak8yMUNRVU51UkR0clFrRkRURHM3TzI5Q1FVTkZPenQzUWtGQlNTeFRRVUZUTEVWQlFVTXNZVUZCWVR0elFrRkRla0k3T3p0M1FrRkRSVHM3T3pzd1FrRkRXVHM3T3pzeVFrRkJkVUk3ZVVKQlF6TkNPM1ZDUVVOTU8zTkNRVU5NT3pzN2QwSkJRMFU3T3pzN01FSkJRM2RDT3pzN096SkNRVUY1UWp0NVFrRkRla003ZFVKQlEwdzdjMEpCUTB3N096dDNRa0ZEUlRzN096dDVRa0ZGVVR0MVFrRkRURHR4UWtGRFJqdHRRa0ZEUmp0clFrRkRURHM3YzBKQlFVa3NVMEZCVXl4RlFVRkRMRmxCUVZrN2IwSkJRM2hDT3p0M1FrRkJTeXhUUVVGVExFVkJRVU1zVjBGQlZ5eEZRVUZETEVsQlFVa3NSVUZCUXl4UFFVRlBMRVZCUVVNc1kwRkJWeXhMUVVGTE8zTkNRVU4wUkRzN01FSkJRVkVzU1VGQlNTeEZRVUZETEZGQlFWRXNSVUZCUXl4VFFVRlRMRVZCUVVNc01FSkJRVEJDTzNkQ1FVTjRSQ3c0UWtGQlRTeFRRVUZUTEVWQlFVTXNZVUZCWVN4SFFVRlJPM2RDUVVOeVF6czdORUpCUVUwc1UwRkJVeXhGUVVGRExGZEJRVmM3TzNsQ1FVRmxPM1ZDUVVOdVF6dHpRa0ZEVkRzN01FSkJRVkVzU1VGQlNTeEZRVUZETEZGQlFWRXNSVUZCUXl4VFFVRlRMRVZCUVVNc2VVSkJRWGxDTzNkQ1FVTjJSQ3c0UWtGQlRTeFRRVUZUTEVWQlFVTXNZMEZCWXl4SFFVRlJPM2RDUVVOMFF6czdORUpCUVUwc1UwRkJVeXhGUVVGRExGZEJRVmM3TzNsQ1FVRmpPM1ZDUVVOc1F6dHhRa0ZEVER0dFFrRkRTRHRwUWtGRFJqdG5Ra0ZEVERzN08ydENRVU5GT3p0elFrRkJTU3hMUVVGTExFVkJRVU1zUzBGQlN6dHZRa0ZEWWpzN2QwSkJRVTBzVTBGQlV5eEZRVUZETERSQ1FVRTBRanM3Y1VKQlFXMUNPMjFDUVVNMVJEdHJRa0ZEVERzN08yOUNRVU5GT3p0M1FrRkJTU3hUUVVGVExFVkJRVU1zWVVGQllUdHpRa0ZEZWtJN096dDNRa0ZEUlRzN096c3dRa0ZEV1RzN096c3lRa0ZCZFVJN2VVSkJRek5DTzNWQ1FVTk1PM05DUVVOTU96czdkMEpCUTBVN096czdNRUpCUTNkQ096czdPekpDUVVGNVFqdDVRa0ZEZWtNN2RVSkJRMHc3YzBKQlEwdzdPenQzUWtGRFJUczdPenQ1UWtGRlVUdDFRa0ZEVER0eFFrRkRSanR0UWtGRFJqdHJRa0ZEVERzN2MwSkJRVWtzVTBGQlV5eEZRVUZETEZsQlFWazdiMEpCUTNoQ096dDNRa0ZCU3l4VFFVRlRMRVZCUVVNc1YwRkJWeXhGUVVGRExFbEJRVWtzUlVGQlF5eFBRVUZQTEVWQlFVTXNZMEZCVnl4TFFVRkxPM05DUVVOMFJEczdNRUpCUVZFc1NVRkJTU3hGUVVGRExGRkJRVkVzUlVGQlF5eFRRVUZUTEVWQlFVTXNNRUpCUVRCQ08zZENRVU40UkN3NFFrRkJUU3hUUVVGVExFVkJRVU1zWVVGQllTeEhRVUZSTzNkQ1FVTnlRenM3TkVKQlFVMHNVMEZCVXl4RlFVRkRMRmRCUVZjN08zbENRVUZsTzNWQ1FVTnVRenR6UWtGRFZEczdNRUpCUVZFc1NVRkJTU3hGUVVGRExGRkJRVkVzUlVGQlF5eFRRVUZUTEVWQlFVTXNlVUpCUVhsQ08zZENRVU4yUkN3NFFrRkJUU3hUUVVGVExFVkJRVU1zWTBGQll5eEhRVUZSTzNkQ1FVTjBRenM3TkVKQlFVMHNVMEZCVXl4RlFVRkRMRmRCUVZjN08zbENRVUZqTzNWQ1FVTnNRenR4UWtGRFREdHRRa0ZEU0R0cFFrRkRSanRsUVVORE8yRkJRMFk3V1VGRFVqczdaMEpCUVVzc1UwRkJVeXhGUVVGRExGbEJRVms3WTBGRGVrSTdPMnRDUVVGSkxGTkJRVk1zUlVGQlF5eFpRVUZaTzJkQ1FVTjRRanM3YjBKQlFVa3NVMEZCVXl4RlFVRkRMRlZCUVZVN2EwSkJRVU03TzNOQ1FVRkhMR05CUVZjc1ZVRkJWU3hGUVVGRExFbEJRVWtzUlVGQlF5eEhRVUZITzI5Q1FVRkRPenQzUWtGQlRTeGxRVUZaTEUxQlFVMDdPM0ZDUVVGclFqdHRRa0ZCU1R0cFFrRkJTenRuUWtGRE9VYzdPMjlDUVVGSkxGTkJRVk1zUlVGQlF5eFJRVUZSTzJ0Q1FVRkRPenR6UWtGQlJ5eEpRVUZKTEVWQlFVTXNSMEZCUnpzN2IwSkJRVWM3TzNkQ1FVRk5MRk5CUVZNc1JVRkJReXhUUVVGVE96dHhRa0ZCYVVJN2JVSkJRVWs3YVVKQlFVczdaMEpCUTNoR096czdhMEpCUVVrN08zTkNRVUZITEVsQlFVa3NSVUZCUXl4SFFVRkhPenR0UWtGQlRUdHBRa0ZCU3p0blFrRkRNVUk3T3p0clFrRkJTVHM3YzBKQlFVY3NTVUZCU1N4RlFVRkRMRWRCUVVjN08yMUNRVUZOTzJsQ1FVRkxPMmRDUVVNeFFqczdPMnRDUVVGSk96dHpRa0ZCUnl4SlFVRkpMRVZCUVVNc1IwRkJSenM3YlVKQlFVMDdhVUpCUVVzN1owSkJRekZDT3pzN2EwSkJRVWs3TzNOQ1FVRkhMRWxCUVVrc1JVRkJReXhIUVVGSE96dHRRa0ZCVFR0cFFrRkJTenRuUWtGRE1VSTdPenRyUWtGQlNUczdjMEpCUVVjc1kwRkJWeXhOUVVGTkxFVkJRVU1zU1VGQlNTeEZRVUZETEVkQlFVYzdiMEpCUVVNN08zZENRVUZOTEdWQlFWa3NUVUZCVFRzN2NVSkJRV003YlVKQlFVazdhVUpCUVVzN1pVRkRPVVU3WVVGRFJEdFhRVU5HTzFOQlEwWTdUMEZEUmp0TFFVTkZMRU5CUTFZN1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4SlFVRkpMRTFCUVUwc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkROMElzVVVGQlRTeEZRVUZGTEd0Q1FVRlhPMEZCUTJwQ0xGZEJRMFU3TzFGQlFWTXNTVUZCU1N4RlFVRkRMRlZCUVZVc1JVRkJReXhUUVVGVExFVkJRVU1zZVVKQlFYbENMRVZCUVVNc1JVRkJSU3hGUVVGRExGRkJRVkU3VFVGRGRFVTdPMVZCUVVzc1UwRkJVeXhGUVVGRExGZEJRVmM3VVVGRGVFSTdPMWxCUVZFc1UwRkJVeXhGUVVGRExHRkJRV0U3VlVGRE4wSTdPenM3VjBGQmJVUTdVMEZETlVNN1VVRkRWRHM3V1VGQlN5eFRRVUZUTEVWQlFVTXNTMEZCU3p0VlFVTnNRanM3WTBGQlN5eFRRVUZUTEVWQlFVTXNiVUpCUVcxQ08xbEJRMmhET3p0blFrRkJSeXhUUVVGVExFVkJRVU1zVFVGQlRUczdZVUZCTWtJN1dVRkRPVU03TzJkQ1FVRkxMRk5CUVZNc1JVRkJReXhYUVVGWE8yTkJRM2hDT3pzN08yVkJRVEpDT3p0alFVRnhRaXdyUWtGQlRUdGpRVU4wUkRzN096dGxRVUZuUXpzN1lVRkROVUk3V1VGRFRqczdaMEpCUVVjc1NVRkJTU3hGUVVGRExFZEJRVWNzUlVGQlF5eFRRVUZUTEVWQlFVTXNiVU5CUVcxRE96dGhRVUZaTzFkQlEycEZPMVZCUTA0N08yTkJRVXNzVTBGQlV5eEZRVUZETEcxRFFVRnRRenRaUVVOb1JEczdaMEpCUVVjc1UwRkJVeXhGUVVGRExFMUJRVTA3TzJGQlFYRkRPMWxCUTNoRU96dG5Ra0ZCU3l4VFFVRlRMRVZCUVVNc1YwRkJWenRqUVVONFFqczdPenRsUVVFeVFqczdZMEZCY1VJc0swSkJRVTA3WTBGRGRFUTdPenM3WlVGQlowTTdPMkZCUXpWQ08xbEJRMDQ3TzJkQ1FVRkhMRWxCUVVrc1JVRkJReXhIUVVGSExFVkJRVU1zVTBGQlV5eEZRVUZETEcxRFFVRnRRenM3WVVGQlZ6dFhRVU5vUlR0VFFVTkdPMUZCUTA0c0swSkJRVTA3VVVGRFRqczdXVUZCU3l4VFFVRlRMRVZCUVVNc1MwRkJTenRWUVVOc1FqczdZMEZCU3l4VFFVRlRMRVZCUVVNc2IwSkJRVzlDTzFsQlEycERPenM3TzJGQlFYTkNPMWxCUTNSQ096czdPMkZCUVhOUU8xbEJRM1JRT3p0blFrRkJTeXhUUVVGVExFVkJRVU1zVjBGQlZ6dGpRVU40UWpzN2EwSkJRVWNzU1VGQlNTeEZRVUZETEVkQlFVY3NSVUZCUXl4VFFVRlRMRVZCUVVNc2QwSkJRWGRDT3p0bFFVRjVRanRqUVVOMlJUczdhMEpCUVVjc1NVRkJTU3hGUVVGRExFZEJRVWNzUlVGQlF5eFRRVUZUTEVWQlFVTXNkMEpCUVhkQ096dGxRVUYzUWp0aFFVTnNSVHRaUVVOT096dG5Ra0ZCU3l4VFFVRlRMRVZCUVVNc1dVRkJXVHM3WTBGRFZEczdhMEpCUVVjc1NVRkJTU3hGUVVGRExFZEJRVWNzUlVGQlF5eFRRVUZUTEVWQlFVTXNkMEpCUVhkQ096dGxRVUV3UWp0aFFVTndSanRYUVVOR08xTkJRMFk3VDBGRFJqdExRVU5GTEVOQlExWTdSMEZEU0R0RFFVTkdMRU5CUVVNc1EwRkJRenM3UVVGRlNDeEpRVUZKTEZGQlFWRXNSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZETDBJc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRmRCUTBVN08xRkJRVk1zU1VGQlNTeEZRVUZETEZWQlFWVXNSVUZCUXl4VFFVRlRMRVZCUVVNc2VVSkJRWGxDTEVWQlFVTXNSVUZCUlN4RlFVRkRMRlZCUVZVN1RVRkRlRVU3TzFWQlFVc3NVMEZCVXl4RlFVRkRMRmRCUVZjN1VVRkRlRUk3TzFsQlFWRXNVMEZCVXl4RlFVRkRMR0ZCUVdFN1ZVRkROMEk3T3pzN1dVRkJZVHM3T3p0aFFVRnBRanM3VjBGQlowSTdWVUZET1VNN096czdWMEZCY1VRN1UwRkRPVU03VVVGRFZEczdXVUZCU3l4VFFVRlRMRVZCUVVNc2FVSkJRV2xDTzFWQlF6bENPenRqUVVGTExGTkJRVk1zUlVGQlF5d3dRa0ZCTUVJN1dVRkRka003TzJkQ1FVRlBMRTlCUVU4c1JVRkJReXhwUWtGQmFVSXNSVUZCUXl4VFFVRlRMRVZCUVVNc2JVUkJRVzFFT3p0aFFVRjNRanRaUVVOMFNEczdaMEpCUVVzc1UwRkJVeXhGUVVGRExIRkRRVUZ4UXp0alFVTnNSQ3dyUWtGQlR5eEpRVUZKTEVWQlFVTXNWVUZCVlN4RlFVRkRMRWxCUVVrc1JVRkJReXhwUWtGQmFVSXNSVUZCUXl4VFFVRlRMRVZCUVVNc1VVRkJVU3hIUVVGSE8yRkJReTlFTzFkQlEwWTdWVUZEVGl3clFrRkJUVHRWUVVOT096dGpRVUZMTEZOQlFWTXNSVUZCUXl3d1FrRkJNRUk3V1VGRGRrTTdPMmRDUVVGUExFOUJRVThzUlVGQlF5eFRRVUZUTEVWQlFVTXNVMEZCVXl4RlFVRkRMRzFFUVVGdFJEczdZVUZCWjBJN1dVRkRkRWM3TzJkQ1FVRkxMRk5CUVZNc1JVRkJReXh4UTBGQmNVTTdZMEZEYkVRN08ydENRVUZSTEZOQlFVMHNZMEZCWXl4RlFVRkRMRVZCUVVVc1JVRkJReXhUUVVGVE8yZENRVU4yUXpzN096dHBRa0ZCSzBJN1owSkJReTlDT3pzN08ybENRVUUyUWp0bFFVTjBRanRoUVVOTU8xZEJRMFk3VlVGRFRpd3JRa0ZCVFR0VlFVTk9PenRqUVVGTExGTkJRVk1zUlVGQlF5d3dRa0ZCTUVJN1dVRkRka003TzJkQ1FVRlBMRTlCUVU4c1JVRkJReXhWUVVGVkxFVkJRVU1zVTBGQlV5eEZRVUZETEcxRVFVRnRSRHM3WVVGQmFVSTdXVUZEZUVjN08yZENRVUZMTEZOQlFWTXNSVUZCUXl4eFEwRkJjVU03WTBGRGJFUXNLMEpCUVU4c1NVRkJTU3hGUVVGRExGVkJRVlVzUlVGQlF5eEpRVUZKTEVWQlFVTXNWVUZCVlN4RlFVRkRMRk5CUVZNc1JVRkJReXhSUVVGUkxFZEJRVWM3WVVGRGVFUTdWMEZEUmp0VlFVTk9MQ3RDUVVGTk8xVkJRMDQ3TzJOQlFVc3NVMEZCVXl4RlFVRkRMREJDUVVFd1FqdFpRVU4yUXpzN1owSkJRVThzVDBGQlR5eEZRVUZETEZGQlFWRXNSVUZCUXl4VFFVRlRMRVZCUVVNc2JVUkJRVzFFT3p0alFVRnRRanM3T3p0bFFVRnBRanM3WTBGQlF6czdPenRsUVVGcFFqdGhRVUZSTzFsQlEyNUtPenRuUWtGQlN5eFRRVUZUTEVWQlFVTXNjVU5CUVhGRE8yTkJRMnhFT3p0clFrRkJSeXhKUVVGSkxFVkJRVU1zUjBGQlJ5eEZRVUZETEZOQlFWTXNSVUZCUXl4MVFrRkJkVUk3TzJWQlFWYzdZVUZEY0VRN1YwRkRSanRUUVVOR08wOUJRMFk3UzBGRFJTeERRVU5XTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzU1VGQlNTeFBRVUZQTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlF6bENMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4WFFVTkZPenRSUVVGVExFbEJRVWtzUlVGQlF5eFZRVUZWTEVWQlFVTXNVMEZCVXl4RlFVRkRMSGxDUVVGNVFpeEZRVUZETEVWQlFVVXNSVUZCUXl4VFFVRlRPMDFCUTNaRk96dFZRVUZMTEZOQlFWTXNSVUZCUXl4WFFVRlhPMUZCUTNoQ096dFpRVUZSTEZOQlFWTXNSVUZCUXl4aFFVRmhPMVZCUXpkQ096czdPMWRCUVdkQ08xTkJRMVE3VVVGRFZEczdXVUZCU3l4VFFVRlRMRVZCUVVNc1MwRkJTenRWUVVOc1FqczdZMEZCU3l4VFFVRlRMRVZCUVVNc1YwRkJWenRaUVVONFFqczdaMEpCUVVjc1UwRkJVeXhGUVVGRExFMUJRVTA3TzJGQlFXOU1PMWxCUTNaTk96czdPMkZCUVhOTU8xZEJRMnhNTzFOQlEwWTdUMEZEUmp0TFFVTkZMRU5CUTFZN1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4SlFVRkpMRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkROVUlzVVVGQlRTeEZRVUZGTEd0Q1FVRlhPMEZCUTJwQ0xGZEJRMFU3TzFGQlFWTXNTVUZCU1N4RlFVRkRMRlZCUVZVc1JVRkJReXhUUVVGVExFVkJRVU1zZVVKQlFYbENMRVZCUVVNc1JVRkJSU3hGUVVGRExFOUJRVTg3VFVGRGNrVTdPMVZCUVVzc1UwRkJVeXhGUVVGRExGZEJRVmM3VVVGRGVFSTdPMWxCUVZFc1UwRkJVeXhGUVVGRExHRkJRV0U3VlVGRE4wSXNOa0pCUVVzc1IwRkJSeXhGUVVGRExIbENRVUY1UWl4RlFVRkRMRWRCUVVjc1JVRkJReXhGUVVGRkxFZEJRVWM3VTBGRGNrTTdUMEZEVER0TFFVTkZMRU5CUTFZN1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4UlFVRlJMRVZCUVVVc1EwRkJReUlzSW1acGJHVWlPaUl2YUc5dFpTOXdiMnhoY21sekwzSjFiVzFoWjJsdVoxOXliM1Z1WkM5dWIyUmxMbXB6TDNSd0xYSmxZV04wTDNCMVlteHBZeTlxY3k5MlpHNWhiV1Z1ZFM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJblpoY2lCTmIyMWxiblFnUFNCeVpYRjFhWEpsS0NkdGIyMWxiblFuS1R0Y2NseHVkbUZ5SUdSaGRHRWdQU0J5WlhGMWFYSmxLQ2QyWkc1aEwzTjBZWFJwWTE5a1lYUmhKeWs3WEhKY2JpOHZJSFpoY2lCQmRYUnZZMjl0Y0d4bGRHVWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDMWhkWFJ2WTI5dGNHeGxkR1V2YkdsaUwyMWhhVzR1YW5NbktUdGNjbHh1THk4Z2RtRnlJRU52YldKdlltOTRJRDBnUVhWMGIyTnZiWEJzWlhSbExrTnZiV0p2WW05NE8xeHlYRzR2THlCMllYSWdRMjl0WW05aWIzaFBjSFJwYjI0Z1BTQkJkWFJ2WTI5dGNHeGxkR1V1UTI5dFltOWliM2hQY0hScGIyNDdYSEpjYmx4eVhHNHZMeUF0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFhISmNiaTh2SUVGMWRHOWpiMjF3YkdWMFpTQmpiMlJsWEhKY2JpOHZJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMxY2NseHVYSEpjYm5aaGNpQkJkWFJ2WTI5dGNHeGxkR1VnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hISmNiaUFnWTI5dGNHOXVaVzUwUkdsa1RXOTFiblE2SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ2RHaHBjeTVmYzJWMFNXNXdkWFJHY205dFZtRnNkV1VvS1R0Y2NseHVJQ0FnSUhaaGNpQm9hV2RvYkdsbmFIUmxaRWx1WkdWNE8xeHlYRzRnSUNBZ2RtRnlJSFJvWVhRZ1BTQjBhR2x6TzF4eVhHNGdJQ0FnWkc5amRXMWxiblF1YjI1clpYbGtiM2R1SUQwZ1puVnVZM1JwYjI0b1pTa2dlMXh5WEc0Z0lDQWdJQ0J6ZDJsMFkyZ29aUzVyWlhsRGIyUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ1kyRnpaU0F4TXpvZ0x5OGdaVzUwWlhJdVhISmNiaUFnSUNBZ0lDQWdJQ0JqYjI1emIyeGxMbXh2WnlnblJVNVVSVkloSnlrN1hISmNiaUFnSUNBZ0lDQWdJQ0IwYUdGMExuQnliM0J6TG1Ga1pFeHBhMlZFYjI1bEtDazdYSEpjYmlBZ0lDQWdJQ0FnSUNCaWNtVmhhenRjY2x4dUlDQWdJQ0FnSUNCallYTmxJRGs2SUM4dklIUmhZbHh5WEc0Z0lDQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1c2IyY29KMVJCUWlFbktUdGNjbHh1SUNBZ0lDQWdJQ0FnSUhSb1lYUXVYM05sZEVaeWIyMUlhV2RvYkdsbmFIUmxaQ2dwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdZbkpsWVdzN1hISmNiaUFnSUNBZ0lDQWdZMkZ6WlNBek9Eb2dMeThnZFhCY2NseHVJQ0FnSUNBZ0lDQWdJR2hwWjJoc2FXZG9kR1ZrU1c1a1pYZ2dQU0IwYUdGMExsOW9hV2RvYkdsbmFIUmxaRWx1WkdWNEtDazdYSEpjYmlBZ0lDQWdJQ0FnSUNCamIyNXpiMnhsTG14dlp5Z25WVkFoSUNjZ0t5Qm9hV2RvYkdsbmFIUmxaRWx1WkdWNEtUdGNjbHh1SUNBZ0lDQWdJQ0FnSUdsbUtHaHBaMmhzYVdkb2RHVmtTVzVrWlhnZ1BpQXdLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvWVhRdWMyVjBVM1JoZEdVb2UyaHBaMmhzYVdkb2RHVmtWbUZzZFdVNklIUm9ZWFF1WDJOMWNuSmxiblJOWVhSamFHVnpLQ2xiYUdsbmFHeHBaMmgwWldSSmJtUmxlQ0F0SURGZGZTazdYSEpjYmlBZ0lDQWdJQ0FnSUNCOVhISmNiaUFnSUNBZ0lDQWdJQ0JpY21WaGF6dGNjbHh1SUNBZ0lDQWdJQ0JqWVhObElEUXdPaUF2THlCa2IzZHVYSEpjYmlBZ0lDQWdJQ0FnSUNCb2FXZG9iR2xuYUhSbFpFbHVaR1Y0SUQwZ2RHaGhkQzVmYUdsbmFHeHBaMmgwWldSSmJtUmxlQ2dwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdZMjl1YzI5c1pTNXNiMmNvSjBSUFYwNGhJQ2NnS3lCb2FXZG9iR2xuYUhSbFpFbHVaR1Y0S1R0Y2NseHVJQ0FnSUNBZ0lDQWdJR2xtS0docFoyaHNhV2RvZEdWa1NXNWtaWGdnUFQwOUlDMHhLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvWVhRdWMyVjBVM1JoZEdVb2UyaHBaMmhzYVdkb2RHVmtWbUZzZFdVNklIUm9ZWFF1WDJOMWNuSmxiblJOWVhSamFHVnpLQ2xiTUYxOUtUdGNjbHh1SUNBZ0lDQWdJQ0FnSUgwZ1pXeHpaU0JwWmlob2FXZG9iR2xuYUhSbFpFbHVaR1Y0SUR3Z2RHaGhkQzVmWTNWeWNtVnVkRTFoZEdOb1pYTW9LUzVzWlc1bmRHZ2dMU0F4S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb1lYUXVjMlYwVTNSaGRHVW9lMmhwWjJoc2FXZG9kR1ZrVm1Gc2RXVTZJSFJvWVhRdVgyTjFjbkpsYm5STllYUmphR1Z6S0NsYmFHbG5hR3hwWjJoMFpXUkpibVJsZUNBcklERmRmU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQWdJQ0FnSUNCaWNtVmhhenRjY2x4dUlDQWdJQ0FnZlZ4eVhHNGdJQ0FnZlR0Y2NseHVJQ0I5TEZ4eVhHNGdJR2RsZEVSbFptRjFiSFJRY205d2N6b2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdlMXh5WEc0Z0lDQWdJQ0JrWldaaGRXeDBWbUZzZFdVNklDZGhjSEJzWlNjc1hISmNiaUFnSUNBZ0lHeHBiV2wwVkc5TWFYTjBPaUIwY25WbExGeHlYRzRnSUNBZ0lDQnRZWGhKZEdWdGMxTm9iM2R1T2lBNExGeHlYRzRnSUNBZ0lDQnpiM1Z5WTJWVmNtdzZJRzUxYkd3c1hISmNiaUFnSUNBZ0lHUmxabUYxYkhSTWFYTjBPaUJiSUNkaGNIQnNaU2NzSUNkaVlXNWhibUVuTENBbmIzSmhibWRsSnl3Z0oyZHlZWEJsSnl3Z0oyTm9aWEp5ZVNjZ1hTeGNjbHh1SUNBZ0lDQWdZV3h6YjFObFlYSmphRlpoYkhWbGN6b2dabUZzYzJVc1hISmNiaUFnSUNBZ0lHeHZZV1JWY214UGJtTmxPaUIwY25WbExGeHlYRzRnSUNBZ0lDQnpaV3hsWTNSQmJHeFVaWGgwVDI1RGJHbGphem9nZEhKMVpTeGNjbHh1SUNBZ0lDQWdiMjVPYjAxaGRHTm9PaUJtZFc1amRHbHZiaWh6ZEdGMFpTa2dlMzFjY2x4dUlDQWdJSDA3WEhKY2JpQWdmU3hjY2x4dUlDQm5aWFJKYm1sMGFXRnNVM1JoZEdVNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdjbVYwZFhKdUlIdGNjbHh1SUNBZ0lDQWdiR2x6ZERvZ2RHaHBjeTV3Y205d2N5NWtaV1poZFd4MFRHbHpkQ3hjY2x4dUlDQWdJQ0FnWTNWeWNtVnVkRlpoYkhWbE9pQjBhR2x6TG5CeWIzQnpMbVJsWm1GMWJIUldZV3gxWlN4Y2NseHVJQ0FnSUNBZ2FHbG5hR3hwWjJoMFpXUldZV3gxWlRvZ2RHaHBjeTV3Y205d2N5NWtaV1poZFd4MFZtRnNkV1VzWEhKY2JpQWdJQ0FnSUhOb2IzZEZiblJ5YVdWek9pQm1ZV3h6WlZ4eVhHNGdJQ0FnZlR0Y2NseHVJQ0I5TEZ4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0IyWVhJZ1pXNTBjbWxsY3lBOUlIUm9hWE11YzNSaGRHVXVjMmh2ZDBWdWRISnBaWE1nUDF4eVhHNGdJQ0FnSUNBZ0lDQWdQRzlzSUhOMGVXeGxQWHQ3Y0c5emFYUnBiMjQ2SUNkaFluTnZiSFYwWlNjc0lHSmhZMnRuY205MWJtUkRiMnh2Y2pvZ0ozZG9hWFJsSnl3Z1kyOXNiM0k2SUNkaWJHRmpheWNzSUd4cGMzUlRkSGxzWlRvZ0oyNXZibVVuTENCd1lXUmthVzVuT2lBd0xDQnRZWEpuYVc0NklEQjlmU0J2YmsxdmRYTmxUR1ZoZG1VOWUzUm9hWE11WDI5dVJXNTBjbmxOYjNWelpVOTFkSDArZTNSb2FYTXVYM0psYm1SbGNrMWhkR05vWlhNb0tYMDhMMjlzUGlBNklDY25PMXh5WEc0Z0lDQWdjbVYwZFhKdUlDaGNjbHh1SUNBZ0lDQWdQR1JwZGo1Y2NseHVJQ0FnSUNBZ0lDQThhVzV3ZFhRZ2FXUTllM1JvYVhNdWNISnZjSE11YVc1d2RYUkpaSDBnWTJ4aGMzTk9ZVzFsUFh0MGFHbHpMbkJ5YjNCekxtTnNZWE56VG1GdFpYMGdjbVZtUFZ3aVlYVjBiMGx1Y0hWMFhDSWdiMjVEYUdGdVoyVTllM1JvYVhNdVgyOXVRMmhoYm1kbGZTQnZia1p2WTNWelBYdDBhR2x6TGw5dmJrWnZZM1Z6ZlNCdmJrSnNkWEk5ZTNSb2FYTXVYMjl1UW14MWNuMGdiMjVEYkdsamF6MTdkR2hwY3k1ZmIyNUpibkIxZEVOc2FXTnJmU0F2UGx4eVhHNGdJQ0FnSUNBZ0lIdGxiblJ5YVdWemZWeHlYRzRnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNrN1hISmNiaUFnZlN4Y2NseHVJQ0JmWTNWeWNtVnVkRTFoZEdOb1pYTTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnZG1GeUlIUm9ZWFFnUFNCMGFHbHpPMXh5WEc0Z0lDQWdkbUZ5SUdOdElEMGdkR2hwY3k1emRHRjBaUzVzYVhOMExtWnBiSFJsY2lobWRXNWpkR2x2YmlobGJuUnllU2tnZTF4eVhHNGdJQ0FnSUNCeVpYUjFjbTRnWlc1MGNua3VhVzVrWlhoUFppaDBhR0YwTGw5cGJuQjFkQ2dwS1NBK0lDMHhPMXh5WEc0Z0lDQWdmU2s3WEhKY2JpQWdJQ0J5WlhSMWNtNGdZMjA3WEhKY2JpQWdmU3hjY2x4dUlDQmZhVzV3ZFhRNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdhV1lvSVhSb2FYTXVhWE5OYjNWdWRHVmtLQ2twSUh0Y2NseHVJQ0FnSUNBZ2NtVjBkWEp1SUNjbk8xeHlYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2NseHVJQ0FnSUNBZ2NtVjBkWEp1SUZKbFlXTjBMbVpwYm1SRVQwMU9iMlJsS0hSb2FYTXVjbVZtY3k1aGRYUnZTVzV3ZFhRcExuWmhiSFZsTzF4eVhHNGdJQ0FnZlZ4eVhHNGdJSDBzWEhKY2JpQWdYM0psYm1SbGNrMWhkR05vWlhNNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdkbUZ5SUhSb1lYUWdQU0IwYUdsek8xeHlYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYMk4xY25KbGJuUk5ZWFJqYUdWektDa3VjMnhwWTJVb01Dd2dkR2hwY3k1d2NtOXdjeTV0WVhoSmRHVnRjMU5vYjNkdUtTNXRZWEFvWm5WdVkzUnBiMjRvWlc1MGNua3NJR2x1WkdWNEtTQjdYSEpjYmlBZ0lDQWdJSEpsZEhWeWJpQW9YSEpjYmlBZ0lDQWdJQ0FnUEVGMWRHOWpiMjF3YkdWMFpVVnVkSEo1SUdocFoyaHNhV2RvZEdWa1BYdGxiblJ5ZVNBOVBUMGdkR2hoZEM1emRHRjBaUzVvYVdkb2JHbG5hSFJsWkZaaGJIVmxmU0JyWlhrOWUyVnVkSEo1ZlNCMllXeDFaVDE3Wlc1MGNubDlJRzl1Ulc1MGNubERiR2xqYXoxN2RHaGhkQzVmYjI1RmJuUnllVU5zYVdOcmZTQnZia1Z1ZEhKNVRXOTFjMlZQZG1WeVBYdDBhR0YwTGw5dmJrVnVkSEo1VFc5MWMyVlBkbVZ5ZlNBdlBseHlYRzRnSUNBZ0lDQXBPMXh5WEc0Z0lDQWdmU2s3WEhKY2JpQWdmU3hjY2x4dUlDQmZhR2xuYUd4cFoyaDBaV1JKYm1SbGVEb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0IyWVhJZ2RHaGhkQ0E5SUhSb2FYTTdYSEpjYmlBZ0lDQjJZWElnWm05MWJtUkpibVJsZUNBOUlDMHhPMXh5WEc0Z0lDQWdkR2hwY3k1ZlkzVnljbVZ1ZEUxaGRHTm9aWE1vS1M1bWIzSkZZV05vS0daMWJtTjBhVzl1S0dWdWRISjVMQ0JwYm1SbGVDa2dlMXh5WEc0Z0lDQWdJQ0JwWmlobGJuUnllU0E5UFQwZ2RHaGhkQzV6ZEdGMFpTNW9hV2RvYkdsbmFIUmxaRlpoYkhWbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnWm05MWJtUkpibVJsZUNBOUlHbHVaR1Y0TzF4eVhHNGdJQ0FnSUNCOVhISmNiaUFnSUNCOUtUdGNjbHh1SUNBZ0lISmxkSFZ5YmlCbWIzVnVaRWx1WkdWNE8xeHlYRzRnSUgwc1hISmNiaUFnWDNWd1pHRjBaVWhwWjJoc2FXZG9kR1ZrVm1Gc2RXVTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnZG1GeUlHNWxkMVpoYkhWbE8xeHlYRzRnSUNBZ2RtRnlJR2hwWjJoc2FXZG9kR1ZrU1c1a1pYZ2dQU0IwYUdsekxsOW9hV2RvYkdsbmFIUmxaRWx1WkdWNEtDazdYSEpjYmlBZ0lDQnBaaWhvYVdkb2JHbG5hSFJsWkVsdVpHVjRJRHdnTUNrZ2UxeHlYRzRnSUNBZ0lDQnVaWGRXWVd4MVpTQTlJSFJvYVhNdWMzUmhkR1V1YkdsemRGc3dYVHRjY2x4dUlDQWdJSDBnWld4elpTQjdYSEpjYmlBZ0lDQWdJRzVsZDFaaGJIVmxJRDBnZEdocGN5NXpkR0YwWlM1c2FYTjBXMmhwWjJoc2FXZG9kR1ZrU1c1a1pYaGRPMXh5WEc0Z0lDQWdmVnh5WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN2FHbG5hR3hwWjJoMFpXUldZV3gxWlRvZ2JtVjNWbUZzZFdWOUtUdGNjbHh1SUNCOUxGeHlYRzRnSUY5elpYUkpibkIxZEVaeWIyMVdZV3gxWlRvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQlNaV0ZqZEM1bWFXNWtSRTlOVG05a1pTaDBhR2x6TG5KbFpuTXVZWFYwYjBsdWNIVjBLUzUyWVd4MVpTQTlJSFJvYVhNdWMzUmhkR1V1WTNWeWNtVnVkRlpoYkhWbE8xeHlYRzRnSUgwc1hISmNiaUFnWDNObGRGWmhiSFZsUm5KdmJVbHVjSFYwT2lCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lIWmhjaUJwYm5CMWRGUmxlSFFnUFNCU1pXRmpkQzVtYVc1a1JFOU5UbTlrWlNoMGFHbHpMbkpsWm5NdVlYVjBiMGx1Y0hWMEtTNTJZV3gxWlR0Y2NseHVJQ0FnSUhaaGNpQm1iM1Z1WkVWdWRISnBaWE1nUFNCMGFHbHpMbk4wWVhSbExteHBjM1F1Wm1sc2RHVnlLR1oxYm1OMGFXOXVLR1Z1ZEhKNUtTQjdYSEpjYmlBZ0lDQWdJSEpsZEhWeWJpQmxiblJ5ZVM1cGJtUmxlRTltS0dsdWNIVjBWR1Y0ZENrZ1BpQXRNVHRjY2x4dUlDQWdJSDBwTzF4eVhHNGdJQ0FnYVdZb1ptOTFibVJGYm5SeWFXVnpMbXhsYm1kMGFDQStJREFwSUh0Y2NseHVJQ0FnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WEhKY2JpQWdJQ0FnSUNBZ1kzVnljbVZ1ZEZaaGJIVmxPaUJtYjNWdVpFVnVkSEpwWlhOYk1GMHNYSEpjYmlBZ0lDQWdJQ0FnYUdsbmFHeHBaMmgwWldSV1lXeDFaVG9nWm05MWJtUkZiblJ5YVdWeld6QmRYSEpjYmlBZ0lDQWdJSDBwTzF4eVhHNGdJQ0FnZlNCbGJITmxJSHRjY2x4dUlDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1dmJrNXZUV0YwWTJnb2RHaHBjeTV6ZEdGMFpTazdYSEpjYmlBZ0lDQWdJR2xtS0hSb2FYTXVjSEp2Y0hNdWJHbHRhWFJVYjB4cGMzUXBJSHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRjY2x4dUlDQWdJQ0FnSUNBZ0lHTjFjbkpsYm5SV1lXeDFaVG9nZEdocGN5NXdjbTl3Y3k1a1pXWmhkV3gwVm1Gc2RXVXNYSEpjYmlBZ0lDQWdJQ0FnSUNCb2FXZG9iR2xuYUhSbFpGWmhiSFZsT2lCMGFHbHpMbkJ5YjNCekxtUmxabUYxYkhSV1lXeDFaVnh5WEc0Z0lDQWdJQ0FnSUgwcE8xeHlYRzRnSUNBZ0lDQjlYSEpjYmlBZ0lDQjlYSEpjYmlBZ2ZTeGNjbHh1SUNCZmMyVjBSbkp2YlVocFoyaHNhV2RvZEdWa09pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJSFJvYVhNdWMyVjBVM1JoZEdVb2UxeHlYRzRnSUNBZ0lDQmpkWEp5Wlc1MFZtRnNkV1U2SUhSb2FYTXVjM1JoZEdVdWFHbG5hR3hwWjJoMFpXUldZV3gxWlZ4eVhHNGdJQ0FnZlN3Z1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQWdJSFJvYVhNdVgzTmxkRWx1Y0hWMFJuSnZiVlpoYkhWbEtDazdYSEpjYmlBZ0lDQjlLVHRjY2x4dUlDQjlMRnh5WEc0Z0lGOXZia05vWVc1blpUb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0IwYUdsekxsOXpaWFJXWVd4MVpVWnliMjFKYm5CMWRDZ3BPMXh5WEc0Z0lIMHNYSEpjYmlBZ1gyOXVSbTlqZFhNNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN2MyaHZkMFZ1ZEhKcFpYTTZJSFJ5ZFdWOUtUdGNjbHh1SUNCOUxGeHlYRzRnSUY5dmJrSnNkWEk2SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ2RHaHBjeTVmYzJWMFJuSnZiVWhwWjJoc2FXZG9kR1ZrS0NrN1hISmNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHR6YUc5M1JXNTBjbWxsY3pvZ1ptRnNjMlY5S1R0Y2NseHVJQ0I5TEZ4eVhHNGdJRjl2YmtWdWRISjVRMnhwWTJzNklHWjFibU4wYVc5dUtHVnVkSEo1S1NCN1hISmNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRjY2x4dUlDQWdJQ0FnWTNWeWNtVnVkRlpoYkhWbE9pQmxiblJ5ZVZ4eVhHNGdJQ0FnZlN3Z1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQWdJSFJvYVhNdVgzTmxkRWx1Y0hWMFJuSnZiVlpoYkhWbEtDazdYSEpjYmlBZ0lDQjlLVHRjY2x4dUlDQjlMRnh5WEc0Z0lGOXZia1Z1ZEhKNVRXOTFjMlZQZG1WeU9pQm1kVzVqZEdsdmJpaGxiblJ5ZVNrZ2UxeHlYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3YUdsbmFHeHBaMmgwWldSV1lXeDFaVG9nWlc1MGNubDlLVHRjY2x4dUlDQjlMRnh5WEc0Z0lGOXZia1Z1ZEhKNVRXOTFjMlZQZFhRNklHWjFibU4wYVc5dUtHVnVkSEo1S1NCN1hISmNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRvYVdkb2JHbG5hSFJsWkZaaGJIVmxPaUIwYUdsekxtTjFjbkpsYm5SV1lXeDFaWDBwTzF4eVhHNGdJSDBzWEhKY2JpQWdYMjl1U1c1d2RYUkRiR2xqYXpvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQlNaV0ZqZEM1bWFXNWtSRTlOVG05a1pTaDBhR2x6TG5KbFpuTXVZWFYwYjBsdWNIVjBLUzV6Wld4bFkzUW9LVHRjY2x4dUlDQjlYSEpjYm4wcE8xeHlYRzVjY2x4dWRtRnlJRUYxZEc5amIyMXdiR1YwWlVWdWRISjVJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJR2RsZEVsdWFYUnBZV3hUZEdGMFpUb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdlMmh2ZG1WeU9pQm1ZV3h6WlgwN1hISmNiaUFnZlN4Y2NseHVJQ0JmYjI1RGJHbGphem9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCMGFHbHpMbkJ5YjNCekxtOXVSVzUwY25sRGJHbGpheWgwYUdsekxuQnliM0J6TG5aaGJIVmxLVHRjY2x4dUlDQjlMRnh5WEc0Z0lGOXZiazF2ZFhObFQzWmxjam9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCMGFHbHpMbkJ5YjNCekxtOXVSVzUwY25sTmIzVnpaVTkyWlhJb2RHaHBjeTV3Y205d2N5NTJZV3gxWlNrN1hISmNiaUFnZlN4Y2NseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnY21WMGRYSnVJQ2hjY2x4dUlDQWdJQ0FnUEd4cElITjBlV3hsUFh0N1ltRmphMmR5YjNWdVpFTnZiRzl5T2lCMGFHbHpMbkJ5YjNCekxtaHBaMmhzYVdkb2RHVmtJRDhnSjJoemJDZzVNQ3dnTlRBbExDQTFNQ1VwSnlBNklDY25MQ0I2U1c1a1pYZzZJRGs1T1Rrc0lHTjFjbk52Y2pvZ0ozQnZhVzUwWlhJbmZYMGdiMjVOYjNWelpVUnZkMjQ5ZTNSb2FYTXVYMjl1UTJ4cFkydDlJRzl1VFc5MWMyVlBkbVZ5UFh0MGFHbHpMbDl2YmsxdmRYTmxUM1psY24wK2UzUm9hWE11Y0hKdmNITXVkbUZzZFdWOVBDOXNhVDVjY2x4dUlDQWdJQ2s3WEhKY2JpQWdmVnh5WEc1OUtUdGNjbHh1WEhKY2JpOHZJQzB0TFMwdExTMHRMUzB0TFMwdExWeHlYRzR2THlCbGJtUWdRWFYwYjJOdmJYQnNaWFJsWEhKY2JpOHZJQzB0TFMwdExTMHRMUzB0TFMwdExWeHlYRzVjY2x4dVpuVnVZM1JwYjI0Z2NtVlNaVzVrWlhJb0tTQjdYSEpjYmlBZ1VtVmhZM1F1Y21WdVpHVnlLRnh5WEc0Z0lDQWdQRlprYm1GTlpXNTFJSFJoWWt4cGMzUTllM1JoWWt4cGMzUjlJQzgrTEZ4eVhHNGdJQ0FnWkc5amRXMWxiblF1WjJWMFJXeGxiV1Z1ZEVKNVNXUW9KM1prYm1GdFpXNTFKeWxjY2x4dUlDQXBPMXh5WEc1OU8xeHlYRzVjY2x4dWRtRnlJSFJoWWt4cGMzUWdQU0JiWEhKY2JpQWdleUJwWkRvZ01Td2dhSEpsWmpvZ0ozQnliMlpwYkdVbkxDQjBaWGgwT2lBblJXUnBkQ0JOZVNCUWNtOW1hV3hsSnl3Z2MyVnNaV04wWldRNklIUnlkV1VnZlN4Y2NseHVJQ0I3SUdsa09pQXlMQ0JvY21WbU9pQW5ibTkwYVdacFkyRjBhVzl1Y3ljc0lIUmxlSFE2SUNkV2FXVjNJRTV2ZEdsbWFXTmhkR2x2Ym5NbkxDQnpaV3hsWTNSbFpEb2dabUZzYzJVZ2ZTeGNjbHh1SUNCN0lHbGtPaUF6TENCb2NtVm1PaUFuYVcxd2IzSjBKeXdnZEdWNGREb2dKMGx0Y0c5eWRDQmhibVFnVTNsdVl5Y3NJSE5sYkdWamRHVmtPaUJtWVd4elpTQjlMRnh5WEc0Z0lIc2dhV1E2SURRc0lHaHlaV1k2SUNkelpYUjBhVzVuY3ljc0lIUmxlSFE2SUNkRGFHRnVaMlVnVTJWMGRHbHVaM01uTENCelpXeGxZM1JsWkRvZ1ptRnNjMlVnZlN4Y2NseHVJQ0I3SUdsa09pQTFMQ0JvY21WbU9pQW5jSEpwZG1GamVTY3NJSFJsZUhRNklDZFFjbWwyWVdONUp5d2djMlZzWldOMFpXUTZJR1poYkhObElIMHNYSEpjYmlBZ2V5QnBaRG9nTml3Z2FISmxaam9nSjJGaWIzVjBKeXdnZEdWNGREb2dKMEZpYjNWMEp5d2djMlZzWldOMFpXUTZJR1poYkhObElIMWNjbHh1WFR0Y2NseHVYSEpjYm5aaGNpQldaRzVoVFdWdWRTQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjY2x4dUlDQm5aWFJKYm1sMGFXRnNVM1JoZEdVNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdjbVYwZFhKdUlIdGNjbHh1SUNBZ0lDQWdkR0ZpVEdsemREb2dkR2hwY3k1d2NtOXdjeTUwWVdKTWFYTjBMRnh5WEc0Z0lDQWdJQ0JqZFhKeVpXNTBWR0ZpT2lBeFhISmNiaUFnSUNCOU8xeHlYRzRnSUgwc1hISmNiaUFnWTJoaGJtZGxWR0ZpT2lCbWRXNWpkR2x2YmloMFlXSkpaQ2tnZTF4eVhHNGdJQ0FnZG1GeUlHNWxkMVJoWWt4cGMzUWdQU0IwWVdKTWFYTjBMbTFoY0NobWRXNWpkR2x2YmloMFlXSXBJSHRjY2x4dUlDQWdJQ0FnZEdGaUxuTmxiR1ZqZEdWa0lEMGdkR0ZpTG1sa0lEMDlQU0IwWVdKSlpEdGNjbHh1SUNBZ0lDQWdjbVYwZFhKdUlIUmhZanRjY2x4dUlDQWdJSDBwTzF4eVhHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdYSEpjYmlBZ0lDQWdJSFJoWWt4cGMzUTZJRzVsZDFSaFlreHBjM1FzWEhKY2JpQWdJQ0FnSUdOMWNuSmxiblJVWVdJNklIUmhZa2xrWEhKY2JpQWdJQ0I5S1R0Y2NseHVJQ0I5TEZ4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0IyWVhJZ2RHRmlRMjl1ZEdWdWREdGNjbHh1SUNBZ0lITjNhWFJqYUNoMGFHbHpMbk4wWVhSbExtTjFjbkpsYm5SVVlXSXBJSHRjY2x4dUlDQWdJQ0FnWTJGelpTQXhPbHh5WEc0Z0lDQWdJQ0FnSUhSaFlrTnZiblJsYm5RZ1BTQThUWGxRY205bWFXeGxJQzgrTzF4eVhHNGdJQ0FnSUNBZ0lHSnlaV0ZyTzF4eVhHNGdJQ0FnSUNCallYTmxJREk2WEhKY2JpQWdJQ0FnSUNBZ2RHRmlRMjl1ZEdWdWRDQTlJRHhPYjNScFptbGpZWFJwYjI1eklDOCtPMXh5WEc0Z0lDQWdJQ0FnSUdKeVpXRnJPMXh5WEc0Z0lDQWdJQ0JqWVhObElETTZYSEpjYmlBZ0lDQWdJQ0FnZEdGaVEyOXVkR1Z1ZENBOUlEeEpiWEJ2Y25RZ0x6NDdYSEpjYmlBZ0lDQWdJQ0FnWW5KbFlXczdYSEpjYmlBZ0lDQWdJR05oYzJVZ05EcGNjbHh1SUNBZ0lDQWdJQ0IwWVdKRGIyNTBaVzUwSUQwZ1BGTmxkSFJwYm1keklDOCtPMXh5WEc0Z0lDQWdJQ0FnSUdKeVpXRnJPMXh5WEc0Z0lDQWdJQ0JqWVhObElEVTZYSEpjYmlBZ0lDQWdJQ0FnZEdGaVEyOXVkR1Z1ZENBOUlEeFFjbWwyWVdONUlDOCtPMXh5WEc0Z0lDQWdJQ0FnSUdKeVpXRnJPMXh5WEc0Z0lDQWdJQ0JqWVhObElEWTZYSEpjYmlBZ0lDQWdJQ0FnZEdGaVEyOXVkR1Z1ZENBOUlEeEJZbTkxZENBdlBqdGNjbHh1SUNBZ0lDQWdJQ0JpY21WaGF6dGNjbHh1SUNBZ0lDQWdaR1ZtWVhWc2REcGNjbHh1SUNBZ0lDQWdJQ0IwWVdKRGIyNTBaVzUwSUQwZ1BFMTVVSEp2Wm1sc1pTQXZQanRjY2x4dUlDQWdJSDFjY2x4dUlDQWdJSEpsZEhWeWJpQW9YSEpjYmlBZ0lDQWdJRHh6WldOMGFXOXVJR05zWVhOelRtRnRaVDFjSW5aa2JtRmNJajVjY2x4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5aa2JtRXRZbTlrZVZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjI1MFlXbHVaWEpjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0p5YjNkY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThWR0ZpY3lCMFlXSk1hWE4wUFh0MGFHbHpMbk4wWVhSbExuUmhZa3hwYzNSOUlHTm9ZVzVuWlZSaFlqMTdkR2hwY3k1amFHRnVaMlZVWVdKOUlDOCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSnRZV2x1TFdOdmJuUmxiblFnWTI5c0xYaHpMVGdnWTI5c0xYaHpMVzltWm5ObGRDMDBJR052YkMxemJTMDVJR052YkMxemJTMXZabVp6WlhRdE15QmpiMnd0YkdjdE1UQWdZMjlzTFd4bkxXOW1abk5sZEMweVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJblJoWWkxamIyNTBaVzUwWENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSHQwWVdKRGIyNTBaVzUwZlZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0E4UTJ4dmMyVldaRzVoSUM4K1hISmNiaUFnSUNBZ0lDQWdJQ0I3THlvZ1BFOXdaVzVXWkc1aElDOCtJQ292ZlZ4eVhHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBOEwzTmxZM1JwYjI0K1hISmNiaUFnSUNBcE8xeHlYRzRnSUgxY2NseHVmU2s3WEhKY2JseHlYRzUyWVhJZ1QzQmxibFprYm1FZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYSEpjYmlBZ2FHRnVaR3hsUTJ4cFkyczZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnSkNoY0lpTjJaRzVoYldWdWRWd2lLUzV6YUc5M0tDazdYSEpjYmlBZ0lDQWtLRndpSTI5d1pXNVdaRzVoWENJcExtaHBaR1VvS1R0Y2NseHVJQ0I5TEZ4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4WkdsMlBseHlYRzVjZER4emNHRnVJR1JoZEdFdGRHOW5aMnhsUFZ3aWRHOXZiSFJwY0Z3aUlIUnBkR3hsUFZ3aVEyeHBZMnNnZEc4Z2IzQmxiaUJXUkU1QlhDSWdhV1E5WENKdmNHVnVWbVJ1WVZ3aUlHTnNZWE56VG1GdFpUMWNJbUowYmlCaWRHNHRjMjBnWW5SdUxYQnlhVzFoY25rZ2IzQmxibFprYm1GY0lpQnZia05zYVdOclBYdDBhR2x6TG1oaGJtUnNaVU5zYVdOcmZUNWNjbHh1SUNBZ0lDQWdJQ0FnSUU5d1pXNGdka1JPUVZ4eVhHNGdJQ0FnSUNBZ0lEd3ZjM0JoYmo1Y2NseHVJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FwTzF4eVhHNGdJSDFjY2x4dWZTazdYSEpjYmx4eVhHNTJZWElnUTJ4dmMyVldaRzVoSUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHlYRzRnSUdoaGJtUnNaVU5zYVdOck9pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJQ1FvWENJamRtUnVZVzFsYm5WY0lpa3VhR2xrWlNncE8xeHlYRzRnSUNBZ0pDaGNJaU52Y0dWdVZtUnVZVndpS1M1emFHOTNLQ2s3WEhKY2JpQWdmU3hjY2x4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdjbVYwZFhKdUlDaGNjbHh1SUNBZ0lDQWdQR1JwZGo1Y2NseHVYSFE4YzNCaGJpQmtZWFJoTFhSdloyZHNaVDFjSW5SdmIyeDBhWEJjSWlCMGFYUnNaVDFjSWtOc2FXTnJJSFJ2SUdOc2IzTmxYQ0lnWTJ4aGMzTk9ZVzFsUFZ3aVkyeHZjMlZXWkc1aFhDSWdjM1I1YkdVOWUzdGpkWEp6YjNJNklDZHdiMmx1ZEdWeUozMTlJRzl1UTJ4cFkyczllM1JvYVhNdWFHRnVaR3hsUTJ4cFkydDlQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aVptRWdabUV0Y0c5M1pYSXRiMlptWENJK1BDOXpjR0Z1UGx4eVhHNGdJQ0FnSUNBZ0lEd3ZjM0JoYmo1Y2NseHVJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FwTzF4eVhHNGdJSDFjY2x4dWZTazdYSEpjYmx4eVhHNTJZWElnVkdGaWN5QTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjY2x4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdkbUZ5SUhSb1lYUWdQU0IwYUdsek8xeHlYRzRnSUNBZ2RtRnlJSFJoWWt4cGMzUk9iMlJsY3lBOUlIUm9hWE11Y0hKdmNITXVkR0ZpVEdsemRDNXRZWEFvWm5WdVkzUnBiMjRvZEdGaUxDQnBibVJsZUNrZ2UxeHlYRzRnSUNBZ0lDQnlaWFIxY200Z0tGeHlYRzRnSUNBZ0lDQWdJRHhVWVdJZ1kyaGhibWRsVkdGaVBYdDBhR0YwTG5CeWIzQnpMbU5vWVc1blpWUmhZbjBnYTJWNVBYdDBZV0l1YUhKbFpuMGdhV1E5ZTNSaFlpNW9jbVZtZlNCMFlXSTllM1JoWW4wZ0x6NWNjbHh1SUNBZ0lDQWdLVHRjY2x4dUlDQWdJSDBwTzF4eVhHNGdJQ0FnY21WMGRYSnVJQ2hjY2x4dUlDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0p6YVdSbFltRnlJR052YkMxNGN5MDBJR052YkMxemJTMHpJR052YkMxc1p5MHlYQ0krWEhKY2JpQWdJQ0FnSUNBZ1BHNWhkaUJqYkdGemMwNWhiV1U5WENKdVlYWmlZWElnYm1GMlltRnlMV1JsWm1GMWJIUmNJaUJ5YjJ4bFBWd2libUYyYVdkaGRHbHZibHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdQSFZzSUdOc1lYTnpUbUZ0WlQxY0ltNWhkaUJ1WVhaaVlYSXRibUYyWENJZ2NtOXNaVDFjSW5SaFlteHBjM1JjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZTNSaFlreHBjM1JPYjJSbGMzMWNjbHh1SUNBZ0lDQWdJQ0FnSUR3dmRXdytYSEpjYmlBZ0lDQWdJQ0FnUEM5dVlYWStYSEpjYmlBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0tUdGNjbHh1SUNCOVhISmNibjBwTzF4eVhHNWNjbHh1ZG1GeUlGUmhZaUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2NseHVJQ0JvWVc1a2JHVkRiR2xqYXpvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjBhR2x6TG5CeWIzQnpMbU5vWVc1blpWUmhZaWgwYUdsekxuQnliM0J6TG5SaFlpNXBaQ2s3WEhKY2JpQWdmU3hjY2x4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdjbVYwZFhKdUlDaGNjbHh1SUNBZ0lDQWdQR3hwSUhKdmJHVTlYQ0p3Y21WelpXNTBZWFJwYjI1Y0lpQmpiR0Z6YzA1aGJXVTllM1JvYVhNdWNISnZjSE11ZEdGaUxuTmxiR1ZqZEdWa0lEOGdKMkZqZEdsMlpTY2dPaUFuSjMwK1hISmNiaUFnSUNBZ0lDQWdQR0VnYUhKbFpqMTdkR2hwY3k1d2NtOXdjeTUwWVdJdWFISmxabjBnWVhKcFlTMWpiMjUwY205c2N6MTdkR2hwY3k1d2NtOXdjeTUwWVdJdWFISmxabjBnY205c1pUMWNJblJoWWx3aUlHUmhkR0V0ZEc5bloyeGxQVndpZEdGaVhDSWdiMjVEYkdsamF6MTdkR2hwY3k1b1lXNWtiR1ZEYkdsamEzMCtYSEpjYmlBZ0lDQWdJQ0FnSUNCN2RHaHBjeTV3Y205d2N5NTBZV0l1ZEdWNGRIMWNjbHh1SUNBZ0lDQWdJQ0E4TDJFK1hISmNiaUFnSUNBZ0lEd3ZiR2srWEhKY2JpQWdJQ0FwTzF4eVhHNGdJSDFjY2x4dWZTazdYSEpjYmx4eVhHNTJZWElnVFhsUWNtOW1hV3hsU0dWaFpHVnlJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4YUdWaFpHVnlJR05zWVhOelRtRnRaVDFjSW5CaFoyVXRhR1ZoWkdWeVhDSStYSEpjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0p0WldScFlWd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKdFpXUnBZUzFzWldaMFhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltWmhJR1poTFRKNElHWmhMWFZ6WlhKY0lqNDhMM053WVc0K1hISmNiaUFnSUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpYldWa2FXRXRZbTlrZVZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOGFERWdZMnhoYzNOT1lXMWxQVndpYldWa2FXRXRhR1ZoWkdsdVoxd2lQbGx2ZFhJZ2NISnZabWxzWlNBOGMyMWhiR3crWVhROEwzTnRZV3hzUGlCYmMybDBaUzVqYjIxZFBDOW9NVDVjY2x4dUlDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBOEwyaGxZV1JsY2o1Y2NseHVJQ0FnSUNrN1hISmNiaUFnZlZ4eVhHNTlLVHRjY2x4dVhISmNiblpoY2lCTmVWQnliMlpwYkdWRFlYUmxaMjl5YVdWeklEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh5WEc0Z0lHaGhibVJzWlVOb1lXNW5aVG9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCamIyNXpiMnhsTG14dlp5aFNaV0ZqZEM1bWFXNWtSRTlOVG05a1pTaDBhR2x6TG5KbFpuTXVZMkYwWldkdmNua3BMblpoYkhWbEtUdGNjbHh1SUNBZ0lIUm9hWE11Y0hKdmNITXVaMlYwUTJGMFpXZHZjbmxQYmtOb1lXNW5aU2hTWldGamRDNW1hVzVrUkU5TlRtOWtaU2gwYUdsekxuSmxabk11WTJGMFpXZHZjbmtwTG5aaGJIVmxLVHRjY2x4dUlDQjlMRnh5WEc0Z0lHZGxkRWx1YVhScFlXeFRkR0YwWlRvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQnlaWFIxY200Z2UxeHlYRzRnSUNBZ0lDQmpZWFJsWjI5eWFXVnpPaUIwYUdsekxuQnliM0J6TG1OaGRHVm5iM0pwWlhOY2NseHVJQ0FnSUgwN1hISmNiaUFnZlN4Y2NseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnZG1GeUlIUm9ZWFFnUFNCMGFHbHpPMXh5WEc0Z0lDQWdkbUZ5SUdOaGRHVm5iM0o1VG05a1pYTWdQU0IwYUdsekxuTjBZWFJsTG1OaGRHVm5iM0pwWlhNdWJXRndLR1oxYm1OMGFXOXVLR05oZEdWbmIzSjVLU0I3WEhKY2JpQWdJQ0FnSUhKbGRIVnliaWhjY2x4dUlDQWdJQ0FnSUNBOFRYbFFjbTltYVd4bFEyRjBaV2R2Y25rZ1kyRjBaV2R2Y25rOWUyTmhkR1ZuYjNKNWZTQXZQbHh5WEc0Z0lDQWdJQ0FwTzF4eVhHNGdJQ0FnZlNrN1hISmNiaUFnSUNCeVpYUjFjbTRnS0Z4eVhHNGdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1admNtMHRaM0p2ZFhBZ1ptOXliUzFuY205MWNDMXpiVndpUGx4eVhHNGdJQ0FnSUNBZ0lEeHNZV0psYkNCb2RHMXNSbTl5UFZ3aVkyRjBaV2R2Y25sY0lpQmpiR0Z6YzA1aGJXVTlYQ0pqYjJ3dGMyMHRNaUJqYjI1MGNtOXNMV3hoWW1Wc1hDSStRMkYwWldkdmNuazhMMnhoWW1Wc1BseHlYRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lZMjlzTFhOdExURXdYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQThjMlZzWldOMElHTnNZWE56VG1GdFpUMWNJbk5sYkdWamRIQnBZMnRsY2x3aUlHbGtQVndpWTJGMFpXZHZjbmxjSWlCeVpXWTlYQ0pqWVhSbFoyOXllVndpSUc5dVEyaGhibWRsUFh0MGFHbHpMbWhoYm1Sc1pVTm9ZVzVuWlgwK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUh0allYUmxaMjl5ZVU1dlpHVnpmVnh5WEc0Z0lDQWdJQ0FnSUNBZ1BDOXpaV3hsWTNRK1hISmNiaUFnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnS1R0Y2NseHVJQ0I5WEhKY2JuMHBPMXh5WEc1Y2NseHVkbUZ5SUUxNVVISnZabWxzWlVOaGRHVm5iM0o1SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHlYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCeVpYUjFjbTRnS0Z4eVhHNGdJQ0FnSUNBOGIzQjBhVzl1SUhaaGJIVmxQWHQwYUdsekxuQnliM0J6TG1OaGRHVm5iM0o1ZlNCeVpXWTllM1JvYVhNdWNISnZjSE11WTJGMFpXZHZjbmw5UGx4eVhHNGdJQ0FnSUNBZ0lIdGtZWFJoTG1OaGNHbDBZV3hwZW1Vb2RHaHBjeTV3Y205d2N5NWpZWFJsWjI5eWVTbDlYSEpjYmlBZ0lDQWdJRHd2YjNCMGFXOXVQbHh5WEc0Z0lDQWdLVHRjY2x4dUlDQjlYSEpjYm4wcE8xeHlYRzVjY2x4dWRtRnlJRTE1VUhKdlptbHNaVkJ5YVhaaFkza2dQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEhKY2JpQWdZMjl0Y0c5dVpXNTBSR2xrVFc5MWJuUTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnSkNoY0lpTndjbWwyWVdONVUyVjBkR2x1WjFOc2FXUmxjbHdpS1M1emJHbGtaWElvZTIxcGJqb3hMRzFoZURvMUxITjBaWEE2TVN4MllXeDFaVG96ZlNrN1hISmNiaUFnSUNBa0tGd2lJM0J5YVhaaFkzbFRaWFIwYVc1blUyeHBaR1Z5WENJcExtOXVLRndpYzJ4cFpHVmNJaXdnWm5WdVkzUnBiMjRvYmlrZ2UxeHlYRzRnSUNBZ0lDQnVMblpoYkhWbElEMDlQU0F4SUQ5Y2NseHVJQ0FnSUNBZ0lDQWtLRndpSTNCeWFYWmhZM2xUWlhSMGFXNW5VMnhwWkdWeVZtRnNYQ0lwTG5SbGVIUW9YQ0l5TUZ3aUtTQTZYSEpjYmlBZ0lDQWdJQ0FnYmk1MllXeDFaVDA5UFRJZ1AxeHlYRzRnSUNBZ0lDQWdJQ1FvWENJamNISnBkbUZqZVZObGRIUnBibWRUYkdsa1pYSldZV3hjSWlrdWRHVjRkQ2hjSWpRd1hDSXBJRHBjY2x4dUlDQWdJQ0FnSUNCdUxuWmhiSFZsUFQwOU15QS9YSEpjYmlBZ0lDQWdJQ0FnSkNoY0lpTndjbWwyWVdONVUyVjBkR2x1WjFOc2FXUmxjbFpoYkZ3aUtTNTBaWGgwS0Z3aU5qQmNJaWtnT2x4eVhHNGdJQ0FnSUNBZ0lHNHVkbUZzZFdVOVBUMDBJRDljY2x4dUlDQWdJQ0FnSUNBa0tGd2lJM0J5YVhaaFkzbFRaWFIwYVc1blUyeHBaR1Z5Vm1Gc1hDSXBMblJsZUhRb1hDSTRNRndpS1NBNlhISmNiaUFnSUNBZ0lDQWdiaTUyWVd4MVpUMDlQVFVnSmlZZ0pDaGNJaU53Y21sMllXTjVVMlYwZEdsdVoxTnNhV1JsY2xaaGJGd2lLUzUwWlhoMEtGd2lNVEF3WENJcE8xeHlYRzRnSUNBZ2ZTazdYSEpjYmlBZ2ZTeGNjbHh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ2NtVjBkWEp1SUNoY2NseHVJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKbWIzSnRMV2R5YjNWd0lHWnZjbTB0WjNKdmRYQXRjMjFjSWo1Y2NseHVJQ0FnSUNBZ0lDQThiR0ZpWld3Z2FIUnRiRVp2Y2oxY0ltbHVjSFYwUlcxaGFXd3pYQ0lnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXNMWE50TFRJZ1kyOXVkSEp2YkMxc1lXSmxiRndpUGxCeWFYWmhZM2s4TDJ4aFltVnNQbHh5WEc0Z0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWTI5c0xYTnRMVFpjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJRHhwYm5CMWRDQnBaRDFjSW5CeWFYWmhZM2xUWlhSMGFXNW5VMnhwWkdWeVhDSWdkSGx3WlQxY0luUmxlSFJjSWlBdlBseHlYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lZMjlzTFhOdExUSmNJajVUYUdGeWFXNW5JRHh6Y0dGdUlHbGtQVndpY0hKcGRtRmplVk5sZEhScGJtZFRiR2xrWlhKV1lXeGNJajQyTUR3dmMzQmhiajRsUEM5a2FYWStYSEpjYmlBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0tUdGNjbHh1SUNCOVhISmNibjBwTzF4eVhHNWNjbHh1ZG1GeUlFMTVVSEp2Wm1sc1pVbHVkR1Z5WlhOMGN5QTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjY2x4dUlDQnphRzkzUkdWMFlXbHNjem9nWm5WdVkzUnBiMjRvYVc1MFpYSmxjM1FzSUdSbGRHRnBiSE1wSUh0Y2NseHVJQ0FnSUdOdmJuTnZiR1V1Ykc5bktHbHVkR1Z5WlhOMElDc2dYQ0k2SUZ3aUlDc2dTbE5QVGk1emRISnBibWRwWm5rb1pHVjBZV2xzY3lrcE8xeHlYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WTNWeWNtVnVkRWx1ZEdWeVpYTjBPaUJwYm5SbGNtVnpkQ3dnWTNWeWNtVnVkRVJsZEdGcGJITTZJR1JsZEdGcGJITjlLVHRjY2x4dUlDQjlMRnh5WEc0Z0lHZGxkRWx1YVhScFlXeFRkR0YwWlRvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQnlaWFIxY200Z2UyTjFjbkpsYm5SSmJuUmxjbVZ6ZERvZ2JuVnNiQ3hjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdZM1Z5Y21WdWRFUmxkR0ZwYkhNNklIdDlMRnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmhaR1JKYm5SbGNtVnpkRU52Ykd4aGNITmxaRG9nZEhKMVpYMDdYSEpjYmlBZ2ZTeGNjbHh1SUNCamIyMXdiMjVsYm5SRWFXUk5iM1Z1ZERvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQmtZWFJoTG1Kc2FXNXJUbTlrWlhNb0tUdGNjbHh1SUNCOUxGeHlYRzRnSUhOb2IzZEJaR1JNYVd0bE9pQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJSFJvYVhNdWMyVjBVM1JoZEdVb2UyRmtaRWx1ZEdWeVpYTjBRMjlzYkdGd2MyVmtPaUJtWVd4elpYMHBPMXh5WEc0Z0lIMHNYSEpjYmlBZ2FHbGtaVUZrWkV4cGEyVTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdZV1JrU1c1MFpYSmxjM1JEYjJ4c1lYQnpaV1E2SUhSeWRXVjlLVHRjY2x4dUlDQjlMRnh5WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjJZWElnZEdoaGRDQTlJSFJvYVhNN1hISmNiaUFnSUNCMllYSWdZM1Z5Y21WdWRFbHVkR1Z5WlhOMGN5QTlJRTlpYW1WamRDNXJaWGx6S0hSb2FYTXVjSEp2Y0hNdWFXNTBaWEpsYzNSektTNXlaV1IxWTJVb1puVnVZM1JwYjI0b2FYTXNJR2twSUh0Y2NseHVJQ0FnSUNBZ2FXWW9kR2hoZEM1d2NtOXdjeTVwYm5SbGNtVnpkSE5iYVYxYkozTmxiR1ZqZEdWa0oxMHBJSHRjY2x4dUlDQWdJQ0FnSUNCcGMxdHBYU0E5SUhSb1lYUXVjSEp2Y0hNdWFXNTBaWEpsYzNSelcybGRPMXh5WEc0Z0lDQWdJQ0I5WEhKY2JpQWdJQ0FnSUhKbGRIVnliaUJwY3p0Y2NseHVJQ0FnSUgwc0lIdDlLVHRjY2x4dUlDQWdJSFpoY2lCcGJuUmxjbVZ6ZEU1dlpHVnpJRDBnVDJKcVpXTjBMbXRsZVhNb2RHaHBjeTV3Y205d2N5NXBiblJsY21WemRITXBMbVpwYkhSbGNpaG1kVzVqZEdsdmJpaHBiblJsY21WemRDa2dlMXh5WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkR2hoZEM1d2NtOXdjeTVwYm5SbGNtVnpkSE5iYVc1MFpYSmxjM1JkV3lkelpXeGxZM1JsWkNkZE8xeHlYRzRnSUNBZ2ZTa3ViV0Z3S0daMWJtTjBhVzl1S0dsdWRHVnlaWE4wS1NCN1hISmNiaUFnSUNBZ0lISmxkSFZ5YmlBb1hISmNiaUFnSUNBZ0lDQWdQRTE1VUhKdlptbHNaVWx1ZEdWeVpYTjBJR3RsZVQxN2FXNTBaWEpsYzNSOUlHbHVkR1Z5WlhOMFBYdHBiblJsY21WemRIMGdjMmh2ZDBSbGRHRnBiSE05ZTNSb1lYUXVjMmh2ZDBSbGRHRnBiSE11WW1sdVpDaDBhR0YwTENCcGJuUmxjbVZ6ZEN3Z2RHaGhkQzV3Y205d2N5NXBiblJsY21WemRITmJhVzUwWlhKbGMzUmRLWDBnTHo1Y2NseHVJQ0FnSUNBZ0tUdGNjbHh1SUNBZ0lIMHBPMXh5WEc0Z0lDQWdMeXBjY2x4dUlDQWdJSFpoY2lCeVpXeGhkR1ZrU1c1MFpYSmxjM1J6SUQwZ1QySnFaV04wTG10bGVYTW9kR2hwY3k1d2NtOXdjeTVwYm5SbGNtVnpkSE1wTG1acGJIUmxjaWhtZFc1amRHbHZiaWhwYm5SbGNtVnpkQ2tnZTF4eVhHNGdJQ0FnSUNCeVpYUjFjbTRnSVhSb1lYUXVjSEp2Y0hNdWFXNTBaWEpsYzNSelcybHVkR1Z5WlhOMFhWc25jMlZzWldOMFpXUW5YVHRjY2x4dUlDQWdJSDBwTzF4eVhHNGdJQ0FnSUNvdlhISmNiaUFnSUNCMllYSWdjbVZzWVhSbFpFbHVkR1Z5WlhOMGN5QTlJSFJvYVhNdWMzUmhkR1V1WTNWeWNtVnVkRWx1ZEdWeVpYTjBJRDhnZEdocGN5NXpkR0YwWlM1amRYSnlaVzUwUkdWMFlXbHNjMXNuY21Wc1lYUmxaQ2RkTG5Od2JHbDBLQzhzTHlrZ09pQmJYVHRjY2x4dUlDQWdJSEpsZEhWeWJpQW9YSEpjYmlBZ0lDQWdJRHhrYVhZK1hISmNiaUFnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSm1iM0p0TFdkeWIzVndJR1p2Y20wdFozSnZkWEF0YzIxY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR4c1lXSmxiQ0JqYkdGemMwNWhiV1U5WENKamIyd3RjMjB0TWlCamIyNTBjbTlzTFd4aFltVnNYQ0krU1c1MFpYSmxjM1J6UEM5c1lXSmxiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXNMWE50TFRaY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKd1lXNWxiQ0J3WVc1bGJDMXBiblJsY21WemRITmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbkJoYm1Wc0xXSnZaSGxjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2UybHVkR1Z5WlhOMFRtOWtaWE45WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbU52YkMxemJTMDBJR052YkMxaWIzUjBiMjFjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEdKMWRIUnZiaUIwZVhCbFBWd2ljM1ZpYldsMFhDSWdZMnhoYzNOT1lXMWxQVndpWW5SdUlHSjBiaTF6YlNCaWRHNHRaR1ZtWVhWc2RGd2lQa2x0Y0c5eWREd3ZZblYwZEc5dVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOFluVjBkRzl1SUdsa1BWd2lZV1JrVEdsclpWd2lJRzl1UTJ4cFkyczllM1JvYVhNdWMyaHZkMEZrWkV4cGEyVjlJSFI1Y0dVOVhDSnpkV0p0YVhSY0lpQnliMnhsUFZ3aVluVjBkRzl1WENJZ1kyeGhjM05PWVcxbFBWd2lZblJ1SUdKMGJpMXpiU0JpZEc0dGMzVmpZMlZ6YzF3aUlHRnlhV0V0Wlhod1lXNWtaV1E5WENKbVlXeHpaVndpSUdGeWFXRXRZMjl1ZEhKdmJITTlYQ0poWkdSTWFXdGxYQ0krUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpWjJ4NWNHaHBZMjl1SUdkc2VYQm9hV052Ymkxd2JIVnpYQ0krUEM5emNHRnVQaUJCWkdROEwySjFkSFJ2Ymo1Y2NseHVJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJRHhOZVZCeWIyWnBiR1ZCWkdSQmJrbHVkR1Z5WlhOMElHbHVkR1Z5WlhOMGN6MTdZM1Z5Y21WdWRFbHVkR1Z5WlhOMGMzMGdZMjlzYkdGd2MyVTllM1JvYVhNdWMzUmhkR1V1WVdSa1NXNTBaWEpsYzNSRGIyeHNZWEJ6WldSOUlHaHBaR1ZCWkdSTWFXdGxQWHQwYUdsekxtaHBaR1ZCWkdSTWFXdGxmU0F2UGx4eVhHNGdJQ0FnSUNBZ0lEeE5lVkJ5YjJacGJHVk1hV3RsUkdWMFlXbHNjeUJqZFhKeVpXNTBTVzUwWlhKbGMzUTllM1JvYVhNdWMzUmhkR1V1WTNWeWNtVnVkRWx1ZEdWeVpYTjBmU0JqZFhKeVpXNTBSR1YwWVdsc2N6MTdkR2hwY3k1emRHRjBaUzVqZFhKeVpXNTBSR1YwWVdsc2MzMGdjbVZzWVhSbFpFbHVkR1Z5WlhOMGN6MTdjbVZzWVhSbFpFbHVkR1Z5WlhOMGMzMGdZMjlzYkdGd2MyVTllMlpoYkhObGZTQXZQbHh5WEc0Z0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDazdYSEpjYmlBZ2ZWeHlYRzU5S1R0Y2NseHVYSEpjYm5aaGNpQk5lVkJ5YjJacGJHVkpiblJsY21WemRDQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjY2x4dUlDQm9ZVzVrYkdWRGJHbGphem9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCMGFHbHpMbkJ5YjNCekxuTm9iM2RFWlhSaGFXeHpLQ2s3WEhKY2JpQWdmU3hjY2x4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdjbVYwZFhKdUlDaGNjbHh1SUNBZ0lDQWdQSE53WVc0Z1kyeGhjM05PWVcxbFBWd2lZblJ1SUdKMGJpMXpiU0JpZEc0dFpHVm1ZWFZzZEZ3aUlISmxaajFjSW1sdWRHVnlaWE4wVTNCaGJsd2lJSFJwZEd4bFBYdDBhR2x6TG5CeWIzQnpMbWx1ZEdWeVpYTjBmU0JyWlhrOWUzUm9hWE11Y0hKdmNITXVhVzUwWlhKbGMzUjlJSEp2YkdVOVhDSmlkWFIwYjI1Y0lpQnZia05zYVdOclBYdDBhR2x6TG1oaGJtUnNaVU5zYVdOcmZUNWNjbHh1SUNBZ0lDQWdJQ0I3WkdGMFlTNWpZWEJwZEdGc2FYcGxLSFJvYVhNdWNISnZjSE11YVc1MFpYSmxjM1FwZlZ4eVhHNGdJQ0FnSUNBOEwzTndZVzQrWEhKY2JpQWdJQ0FwTzF4eVhHNGdJSDFjY2x4dWZTazdYSEpjYmx4eVhHNTJZWElnVFhsUWNtOW1hV3hsUVdSa1FXNUpiblJsY21WemRDQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjY2x4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdkbUZ5SUdOMWNuSmxiblJKYm5SbGNtVnpkRXRsZVhNZ1BTQlBZbXBsWTNRdWEyVjVjeWgwYUdsekxuQnliM0J6TG1sdWRHVnlaWE4wY3lrN1hISmNiaUFnSUNCMllYSWdZWFpoYVd4aFlteGxTVzUwWlhKbGMzUkxaWGx6SUQwZ1QySnFaV04wTG10bGVYTW9aR0YwWVM1emRHRjBhV05KYm5SbGNtVnpkSE1wTG1acGJIUmxjaWhtZFc1amRHbHZiaWhwYm5SbGNtVnpkRXRsZVNrZ2UxeHlYRzRnSUNBZ0lDQnlaWFIxY200Z1kzVnljbVZ1ZEVsdWRHVnlaWE4wUzJWNWN5NXBibVJsZUU5bUtHbHVkR1Z5WlhOMFMyVjVLU0E5UFNBdE1UdGNjbHh1SUNBZ0lIMHBPMXh5WEc0Z0lDQWdkbUZ5SUdKaGMyVkVhWFpUZEhsc1pYTWdQU0JiSjJadmNtMHRaM0p2ZFhBbkxDQW5abTl5YlMxbmNtOTFjQzF6YlNkZE8xeHlYRzRnSUNBZ2RtRnlJR0YyWVdsc1lXSnNaVWx1ZEdWeVpYTjBUbTlrWlhNZ1BTQmhkbUZwYkdGaWJHVkpiblJsY21WemRFdGxlWE11YldGd0tHWjFibU4wYVc5dUtHbHVkR1Z5WlhOMEtTQjdYSEpjYmlBZ0lDQWdJSEpsZEhWeWJpQW9YSEpjYmlBZ0lDQWdJQ0FnUEUxNVVISnZabWxzWlVGMllXbHNZV0pzWlVsdWRHVnlaWE4wSUdGMllXbHNZV0pzWlVsdWRHVnlaWE4wUFh0cGJuUmxjbVZ6ZEgwZ0x6NWNjbHh1SUNBZ0lDQWdLVHRjY2x4dUlDQWdJSDBwTzF4eVhHNGdJQ0FnYVdZb2RHaHBjeTV3Y205d2N5NWpiMnhzWVhCelpTa2dlMXh5WEc0Z0lDQWdJQ0JpWVhObFJHbDJVM1I1YkdWekxuQjFjMmdvSjJOdmJHeGhjSE5sSnlrN1hISmNiaUFnSUNCOVhISmNiaUFnSUNCeVpYUjFjbTRnS0Z4eVhHNGdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDE3WW1GelpVUnBkbE4wZVd4bGN5NXFiMmx1S0NjZ0p5bDlJR2xrUFZ3aVlXUmtRVzVKYm5SbGNtVnpkRndpUGx4eVhHNGdJQ0FnSUNBZ0lEeHNZV0psYkNCamJHRnpjMDVoYldVOVhDSmpiMnd0YzIwdE1pQmpiMjUwY205c0xXeGhZbVZzWENJK1FXUmtJR0VnYkdsclpUd3ZiR0ZpWld3K1hISmNiaUFnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmpiMnd0YzIwdE5sd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ2UyRjJZV2xzWVdKc1pVbHVkR1Z5WlhOMFRtOWtaWE45WEhKY2JpQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdLVHRjY2x4dUlDQjlYSEpjYm4wcE8xeHlYRzVjY2x4dWRtRnlJRTE1VUhKdlptbHNaVUYyWVdsc1lXSnNaVWx1ZEdWeVpYTjBJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJR0ZrWkVsdWRHVnlaWE4wT2lCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lHUmhkR0V1WVdSa1NXNTBaWEpsYzNRb2RHaHBjeTV3Y205d2N5NWhkbUZwYkdGaWJHVkpiblJsY21WemRDazdYSEpjYmlBZ0lDQnlaVkpsYm1SbGNpZ3BPMXh5WEc0Z0lIMHNYSEpjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lISmxkSFZ5YmlBb1hISmNiaUFnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltSjBiaUJpZEc0dGMyMGdZblJ1TFdSbFptRjFiSFJjSWlCeVpXWTlYQ0pwYm5SbGNtVnpkRk53WVc1Y0lpQjBhWFJzWlQxN2RHaHBjeTV3Y205d2N5NWhkbUZwYkdGaWJHVkpiblJsY21WemRIMGdhMlY1UFh0MGFHbHpMbkJ5YjNCekxtRjJZV2xzWVdKc1pVbHVkR1Z5WlhOMGZTQnliMnhsUFZ3aVluVjBkRzl1WENJZ2IyNURiR2xqYXoxN2RHaHBjeTVoWkdSSmJuUmxjbVZ6ZEgwK1hISmNiaUFnSUNBZ0lDQWdlMlJoZEdFdVkyRndhWFJoYkdsNlpTaDBhR2x6TG5CeWIzQnpMbUYyWVdsc1lXSnNaVWx1ZEdWeVpYTjBLWDFjY2x4dUlDQWdJQ0FnUEM5emNHRnVQbHh5WEc0Z0lDQWdLVHRjY2x4dUlDQjlYSEpjYm4wcE8xeHlYRzVjY2x4dUx5b2dTWFFuY3lCeGRXbDBaU0JoSUhCcGRIa2dkRzhnYUdGMlpTQjBieUJqYjIxdFpXNTBJSFJvYVhNZ2IzVjBMaTR1WEhKY2JuWmhjaUJOZVZCeWIyWnBiR1ZCWkdSQmJrbHVkR1Z5WlhOMElEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh5WEc0Z0lHRmtaRXhwYTJWRWIyNWxPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUdOdmJuTnZiR1V1Ykc5bktDUW9YQ0lqWVdSa1NXNTBaWEpsYzNSSmJuQjFkRndpS1M1MllXd29LU2s3WEhKY2JpQWdJQ0JwWmloa1lYUmhMbUZrWkVsdWRHVnlaWE4wS0NRb1hDSWpZV1JrU1c1MFpYSmxjM1JKYm5CMWRGd2lLUzUyWVd3b0tTa3BJSHRjY2x4dUlDQWdJQ0FnZEdocGN5NXdjbTl3Y3k1b2FXUmxRV1JrVEdsclpTZ3BPMXh5WEc0Z0lDQWdmVnh5WEc0Z0lDQWdKQ2hjSWlOaFpHUkpiblJsY21WemRFbHVjSFYwWENJcExuWmhiQ2hjSWx3aUtUdGNjbHh1SUNBZ0lISmxVbVZ1WkdWeUtDazdYSEpjYmlBZ2ZTeGNjbHh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ2RtRnlJR04xY25KbGJuUkpiblJsY21WemRFdGxlWE1nUFNCUFltcGxZM1F1YTJWNWN5aDBhR2x6TG5CeWIzQnpMbWx1ZEdWeVpYTjBjeWs3WEhKY2JpQWdJQ0JqYjI1emIyeGxMbXh2WnlnblkzVnljbVZ1ZENCcGJuUmxjbVZ6ZEhNNklDY2dLeUJLVTA5T0xuTjBjbWx1WjJsbWVTaGpkWEp5Wlc1MFNXNTBaWEpsYzNSTFpYbHpLU2s3WEhKY2JpQWdJQ0IyWVhJZ1lYWmhhV3hoWW14bFNXNTBaWEpsYzNSTFpYbHpJRDBnVDJKcVpXTjBMbXRsZVhNb1pHRjBZUzV6ZEdGMGFXTkpiblJsY21WemRITXBMbVpwYkhSbGNpaG1kVzVqZEdsdmJpaHBiblJsY21WemRFdGxlU2tnZTF4eVhHNGdJQ0FnSUNCeVpYUjFjbTRnWTNWeWNtVnVkRWx1ZEdWeVpYTjBTMlY1Y3k1cGJtUmxlRTltS0dsdWRHVnlaWE4wUzJWNUtTQTlQU0F0TVR0Y2NseHVJQ0FnSUgwcE8xeHlYRzRnSUNBZ1kyOXVjMjlzWlM1c2IyY29KMkYyWVdsc1lXSnNaU0JwYm5SbGNtVnpkSE02SUNjZ0t5QktVMDlPTG5OMGNtbHVaMmxtZVNoaGRtRnBiR0ZpYkdWSmJuUmxjbVZ6ZEV0bGVYTXBLVHRjY2x4dUlDQWdJSFpoY2lCaVlYTmxSR2wyVTNSNWJHVnpJRDBnV3lkbWIzSnRMV2R5YjNWd0p5d2dKMlp2Y20wdFozSnZkWEF0YzIwblhUdGNjbHh1SUNBZ0lHbG1LSFJvYVhNdWNISnZjSE11WTI5c2JHRndjMlVwSUh0Y2NseHVJQ0FnSUNBZ1ltRnpaVVJwZGxOMGVXeGxjeTV3ZFhOb0tDZGpiMnhzWVhCelpTY3BPMXh5WEc0Z0lDQWdmVnh5WEc0Z0lDQWdZMjl1YzI5c1pTNXNiMmNvSjBGa1pDQmhJR3hwYTJVNklGd2lKeUFySUdKaGMyVkVhWFpUZEhsc1pYTXVhbTlwYmlnbklDY3BJQ3NnSjF3aUp5azdYSEpjYmlBZ0lDQnlaWFIxY200Z0tGeHlYRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxN1ltRnpaVVJwZGxOMGVXeGxjeTVxYjJsdUtDY2dKeWw5SUdsa1BWd2lZV1JrUVc1SmJuUmxjbVZ6ZEZ3aVBseHlYRzRnSUNBZ0lDQWdJRHhzWVdKbGJDQmpiR0Z6YzA1aGJXVTlYQ0pqYjJ3dGMyMHRNaUJqYjI1MGNtOXNMV3hoWW1Wc1hDSStRV1JrSUdFZ2JHbHJaVHd2YkdGaVpXdytYSEpjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjJ3dGMyMHRObHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdQRUYxZEc5amIyMXdiR1YwWlNCcGJuQjFkRWxrUFZ3aVlXUmtTVzUwWlhKbGMzUkpibkIxZEZ3aUlHUmxabUYxYkhSV1lXeDFaVDE3SnlkOUlHUmxabUYxYkhSTWFYTjBQWHRoZG1GcGJHRmliR1ZKYm5SbGNtVnpkRXRsZVhOOUlHTnNZWE56VG1GdFpUMWNJbVp2Y20wdFkyOXVkSEp2YkZ3aUlHRmtaRXhwYTJWRWIyNWxQWHQwYUdsekxtRmtaRXhwYTJWRWIyNWxmU0F2UGx4eVhHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXNMWE50TFRKY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR4aWRYUjBiMjRnZEhsd1pUMWNJbUoxZEhSdmJsd2lJR05zWVhOelRtRnRaVDFjSW1KMGJpQmlkRzR0YzIwZ1luUnVMV1JsWm1GMWJIUmNJaUJ2YmtOc2FXTnJQWHQwYUdsekxtRmtaRXhwYTJWRWIyNWxmVDVFYjI1bFBDOWlkWFIwYjI0K1hISmNiaUFnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnS1R0Y2NseHVJQ0I5WEhKY2JuMHBPMXh5WEc0cUwxeHlYRzVjY2x4dWRtRnlJRTE1VUhKdlptbHNaVXhwYTJWRVpYUmhhV3h6SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHlYRzRnSUhKbGJXOTJaVWx1ZEdWeVpYTjBPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUM4dklHUmhkR0V1ZFc1TWFXdGxRVzVKYm5SbGNtVnpkQ2gwYUdsekxuQnliM0J6TG1OaGRHVm5iM0o1TENCMGFHbHpMbkJ5YjNCekxtTjFjbkpsYm5SSmJuUmxjbVZ6ZENrN1hISmNiaUFnSUNCa1lYUmhMblZ1VEdsclpVRnVTVzUwWlhKbGMzUW9kR2hwY3k1d2NtOXdjeTVqZFhKeVpXNTBTVzUwWlhKbGMzUXBPMXh5WEc0Z0lDQWdjbVZTWlc1a1pYSW9LVHRjY2x4dUlDQjlMRnh5WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjJZWElnZEdoaGRDQTlJSFJvYVhNN1hISmNiaUFnSUNCMllYSWdjbVZzWVhSbFpFbHVkR1Z5WlhOMFRtOWtaWE1nUFNCMGFHbHpMbkJ5YjNCekxuSmxiR0YwWldSSmJuUmxjbVZ6ZEhNdWJXRndLR1oxYm1OMGFXOXVLR2x1ZEdWeVpYTjBLU0I3WEhKY2JpQWdJQ0FnSUhKbGRIVnliaUFvWEhKY2JpQWdJQ0FnSUNBZ0x5OGdQRTE1VUhKdlptbHNaVkpsYkdGMFpXUkpiblJsY21WemRDQmpZWFJsWjI5eWVUMTdkR2hoZEM1d2NtOXdjeTVqWVhSbFoyOXllWDBnY21Wc1lYUmxaRWx1ZEdWeVpYTjBQWHRwYm5SbGNtVnpkSDBnTHo1Y2NseHVJQ0FnSUNBZ0lDQWdJRHhOZVZCeWIyWnBiR1ZTWld4aGRHVmtTVzUwWlhKbGMzUWdjbVZzWVhSbFpFbHVkR1Z5WlhOMFBYdHBiblJsY21WemRIMGdMejVjY2x4dUlDQWdJQ0FnS1R0Y2NseHVJQ0FnSUgwcE8xeHlYRzRnSUNBZ2RtRnlJR0poYzJWRWFYWlRkSGxzWlhNZ1BTQmJKMlp2Y20wdFozSnZkWEFuTENBblptOXliUzFuY205MWNDMXpiU2RkTzF4eVhHNGdJQ0FnYVdZb2RHaHBjeTV3Y205d2N5NWpiMnhzWVhCelpTa2dlMXh5WEc0Z0lDQWdJQ0JpWVhObFJHbDJVM1I1YkdWekxuQjFjMmdvSjJOdmJHeGhjSE5sSnlrN1hISmNiaUFnSUNCOVhISmNiaUFnSUNCMllYSWdhSFJ0YkR0Y2NseHVJQ0FnSUdsbUtIUm9hWE11Y0hKdmNITXVZM1Z5Y21WdWRFbHVkR1Z5WlhOMEtTQjdYSEpjYmlBZ0lDQWdJR2gwYld3Z1BWeHlYRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBYdGlZWE5sUkdsMlUzUjViR1Z6TG1wdmFXNG9KeUFuS1gwZ2FXUTlYQ0pzYVd0bFJHVjBZV2xzYzF3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjJ3dGMyMHROaUJqYjJ3dGMyMHRiMlptYzJWMExUSmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSjNaV3hzSUhkbGJHd3RjMjFjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5KdmQxd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjJ3dGVITXRORndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThZblYwZEc5dUlIUjVjR1U5WENKaWRYUjBiMjVjSWlCamJHRnpjMDVoYldVOVhDSmlkRzRnWW5SdUxYTnRJR0owYmkxd2NtbHRZWEo1WENJK2UzUm9hWE11Y0hKdmNITXVZM1Z5Y21WdWRFbHVkR1Z5WlhOMGZUd3ZZblYwZEc5dVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltTnZiQzE0Y3kwNFhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MWJDQmpiR0Z6YzA1aGJXVTlYQ0pzYVhOMExXbHViR2x1WlZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4c2FUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2V5OHFQSE4wY205dVp6NURZWFJsWjI5eWVUbzhMM04wY205dVp6NGdlMlJoZEdFdVkyRndhWFJoYkdsNlpTaDBhR2x6TG5CeWIzQnpMbU4xY25KbGJuUkVaWFJoYVd4eld5ZGpZWFJsWjI5eWVTZGRLWDA4WW5JZ0x6NHFMMzFjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMGNtOXVaejVVYjNSaGJDQmpiR2xqYTNNNlBDOXpkSEp2Ym1jK0lIdDBhR2x6TG5CeWIzQnpMbU4xY25KbGJuUkVaWFJoYVd4eld5ZGpiR2xqYTNNblhYMWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjMjFoYkd3K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5c2FUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGJHaytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjMjFoYkd3K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkSEp2Ym1jK1UyOTFjbU5sT2p3dmMzUnliMjVuUGlCSmJYQnZjblJsWkNCbWNtOXRJSHRrWVhSaExtTmhjR2wwWVd4cGVtVW9kR2hwY3k1d2NtOXdjeTVqZFhKeVpXNTBSR1YwWVdsc2Mxc25jMjkxY21ObEoxMHBmVHhpY2lBdlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQkJaR1JsWkNCdmJpQjdUVzl0Wlc1MEtIUm9hWE11Y0hKdmNITXVZM1Z5Y21WdWRFUmxkR0ZwYkhOYkoyRmtaR1ZrSjEwcExtWnZjbTFoZENoY0lrUkVJRTFOVFNCWldWbFpYQ0lwZlZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMMnhwUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMM1ZzUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4Y0Q1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzUnliMjVuUGxKbGJHRjBaV1FnYVc1MFpYSmxjM1J6T2p3dmMzUnliMjVuUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUh0eVpXeGhkR1ZrU1c1MFpYSmxjM1JPYjJSbGMzMWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BDOXdQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltTnZiQzF6YlMwMFhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGlkWFIwYjI0Z2RIbHdaVDFjSW5OMVltMXBkRndpSUhKdmJHVTlYQ0ppZFhSMGIyNWNJaUJqYkdGemMwNWhiV1U5WENKaWRHNGdZblJ1TFhOdElHSjBiaTFrWldaaGRXeDBJSEpsYlc5MlpTMXNhV3RsWENJZ1lYSnBZUzFsZUhCaGJtUmxaRDFjSW5SeWRXVmNJaUJoY21saExXTnZiblJ5YjJ4elBWd2ljbVZ0YjNabFRHbHJaVndpSUc5dVEyeHBZMnM5ZTNSb2FYTXVjbVZ0YjNabFNXNTBaWEpsYzNSOVBsSmxiVzkyWlR3dlluVjBkRzl1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdQQzlrYVhZK08xeHlYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2NseHVJQ0FnSUNBZ2FIUnRiQ0E5SUR4a2FYWWdZMnhoYzNOT1lXMWxQWHRpWVhObFJHbDJVM1I1YkdWekxtcHZhVzRvSnlBbktYMGdhV1E5WENKc2FXdGxSR1YwWVdsc2Mxd2lQand2WkdsMlBqdGNjbHh1SUNBZ0lIMWNjbHh1SUNBZ0lISmxkSFZ5YmlBb1hISmNiaUFnSUNBZ0lEeGthWFkrWEhKY2JpQWdJQ0FnSUNBZ2UyaDBiV3g5WEhKY2JpQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQXBPMXh5WEc0Z0lIMWNjbHh1ZlNrN1hISmNibHh5WEc1MllYSWdUWGxRY205bWFXeGxVbVZzWVhSbFpFbHVkR1Z5WlhOMElEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh5WEc0Z0lHRmtaRWx1ZEdWeVpYTjBPaUJtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUM4dklHUmhkR0V1WVdSa1VtVnNZWFJsWkVsdWRHVnlaWE4wS0hSb2FYTXVjSEp2Y0hNdVkyRjBaV2R2Y25rc0lIUm9hWE11Y0hKdmNITXVjbVZzWVhSbFpFbHVkR1Z5WlhOMEtUdGNjbHh1SUNBZ0lHUmhkR0V1WVdSa1VtVnNZWFJsWkVsdWRHVnlaWE4wS0hSb2FYTXVjSEp2Y0hNdWNtVnNZWFJsWkVsdWRHVnlaWE4wS1R0Y2NseHVJQ0FnSUhKbFVtVnVaR1Z5S0NrN1hISmNiaUFnZlN4Y2NseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnY21WMGRYSnVJQ2hjY2x4dUlDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpWW5SdUlHSjBiaTF6YlNCaWRHNHRaR1ZtWVhWc2RGd2lJSEpsWmoxY0ltbHVkR1Z5WlhOMFUzQmhibHdpSUhScGRHeGxQWHQwYUdsekxuQnliM0J6TG5KbGJHRjBaV1JKYm5SbGNtVnpkSDBnYTJWNVBYdDBhR2x6TG5CeWIzQnpMbkpsYkdGMFpXUkpiblJsY21WemRIMGdjbTlzWlQxY0ltSjFkSFJ2Ymx3aUlHOXVRMnhwWTJzOWUzUm9hWE11WVdSa1NXNTBaWEpsYzNSOVBseHlYRzRnSUNBZ0lDQWdJSHRrWVhSaExtTmhjR2wwWVd4cGVtVW9kR2hwY3k1d2NtOXdjeTV5Wld4aGRHVmtTVzUwWlhKbGMzUXBmVnh5WEc0Z0lDQWdJQ0E4TDNOd1lXNCtYSEpjYmlBZ0lDQXBPMXh5WEc0Z0lIMWNjbHh1ZlNrN1hISmNibHh5WEc1MllYSWdUWGxRY205bWFXeGxJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJR2RsZEVsdWFYUnBZV3hUZEdGMFpUb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdlMXh5WEc0Z0lDQWdJQ0F2THlCallYUmxaMjl5ZVRvZ1QySnFaV04wTG10bGVYTW9jM1JoZEdsalJHRjBZU2xiTUYwc1hISmNiaUFnSUNBZ0lDOHZJR2x1ZEdWeVpYTjBjem9nYzNSaGRHbGpSR0YwWVZ0UFltcGxZM1F1YTJWNWN5aHpkR0YwYVdORVlYUmhLVnN3WFYxY2NseHVJQ0FnSUNBZ2FXNTBaWEpsYzNSek9pQmtZWFJoTG5OMFlYUnBZMGx1ZEdWeVpYTjBjMXh5WEc0Z0lDQWdmVHRjY2x4dUlDQjlMRnh5WEc0Z0lHZGxkRU5oZEdWbmIzSjVUMjVEYUdGdVoyVTZJR1oxYm1OMGFXOXVLR05oZEdWbmIzSjVLU0I3WEhKY2JpQWdJQ0JqYjI1emIyeGxMbXh2WnloS1UwOU9Mbk4wY21sdVoybG1lU2hrWVhSaExuTjBZWFJwWTBSaGRHRmJZMkYwWldkdmNubGRLU2s3WEhKY2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGpZWFJsWjI5eWVUb2dZMkYwWldkdmNua3NYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcGJuUmxjbVZ6ZEhNNklHUmhkR0V1YzNSaGRHbGpSR0YwWVZ0allYUmxaMjl5ZVYxOUtUdGNjbHh1SUNCOUxGeHlYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCeVpYUjFjbTRnS0Z4eVhHNGdJQ0FnSUNBOFpHbDJJSEp2YkdVOVhDSjBZV0p3WVc1bGJGd2lJR05zWVhOelRtRnRaVDFjSW5SaFlpMXdZVzVsSUdaaFpHVWdZV04wYVhabElHbHVYQ0lnYVdROVhDSndjbTltYVd4bFhDSStYSEpjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjI1MFlXbHVaWEpjSWo1Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNBOFRYbFFjbTltYVd4bFNHVmhaR1Z5SUM4K1hISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKbWIzSnRMV2h2Y21sNmIyNTBZV3hjSWo1Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIc3ZLanhOZVZCeWIyWnBiR1ZEWVhSbFoyOXlhV1Z6SUdOaGRHVm5iM0pwWlhNOWUwOWlhbVZqZEM1clpYbHpLR1JoZEdFdWMzUmhkR2xqUkdGMFlTbDlJR2RsZEVOaGRHVm5iM0o1VDI1RGFHRnVaMlU5ZTNSb2FYTXVaMlYwUTJGMFpXZHZjbmxQYmtOb1lXNW5aWDBnTHo0cUwzMWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BFMTVVSEp2Wm1sc1pWQnlhWFpoWTNrZ0x6NWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2V5OHFQRTE1VUhKdlptbHNaVWx1ZEdWeVpYTjBjeUJqWVhSbFoyOXllVDE3ZEdocGN5NXpkR0YwWlM1allYUmxaMjl5ZVgwZ2FXNTBaWEpsYzNSelBYdDBhR2x6TG5OMFlYUmxMbWx1ZEdWeVpYTjBjMzBnYzJWMFNXNTBaWEpsYzNSelBYdDBhR2x6TG5ObGRFbHVkR1Z5WlhOMGMzMGdMejRxTDMxY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEUxNVVISnZabWxzWlVsdWRHVnlaWE4wY3lCcGJuUmxjbVZ6ZEhNOWUzUm9hWE11YzNSaGRHVXVhVzUwWlhKbGMzUnpmU0J6WlhSSmJuUmxjbVZ6ZEhNOWUzUm9hWE11YzJWMFNXNTBaWEpsYzNSemZTQXZQbHh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNrN1hISmNiaUFnZlZ4eVhHNTlLVHRjY2x4dVhISmNiblpoY2lCT2IzUnBabWxqWVhScGIyNXpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4YzJWamRHbHZiaUJ5YjJ4bFBWd2lkR0ZpY0dGdVpXeGNJaUJqYkdGemMwNWhiV1U5WENKMFlXSXRjR0Z1WlNCbVlXUmxJR0ZqZEdsMlpTQnBibHdpSUdsa1BWd2libTkwYVdacFkyRjBhVzl1YzF3aVBseHlYRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lZMjl1ZEdGcGJtVnlYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQThhR1ZoWkdWeUlHTnNZWE56VG1GdFpUMWNJbkJoWjJVdGFHVmhaR1Z5WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4b01UNU9iM1JwWm1sallYUnBiMjV6SUR4emJXRnNiRDVtY205dFBDOXpiV0ZzYkQ0Z1czTnBkR1V1WTI5dFhUd3ZhREUrWEhKY2JpQWdJQ0FnSUNBZ0lDQThMMmhsWVdSbGNqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpY205M1hDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXNMWGh6TFRFeVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQSFJoWW14bElHTnNZWE56VG1GdFpUMWNJblJoWW14bElIUmhZbXhsTFc1dmRHbG1hV05oZEdsdmJuTmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MGFHVmhaRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BIUnlQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeDBhQ0JqYjJ4VGNHRnVQVndpTWx3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BIQStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRk5wZEdVdVkyOXRJR2hoY3lCeVpYRjFaWE4wWldRZ2RHOGdZV1JrSUdadmJHeHZkMmx1WnlCcGJuUmxjbVZ6ZEhNZ2RHOGdlVzkxY2lCd2NtOW1hV3hsTGp4aWNpQXZQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzIxaGJHdytVMlZsSUR4aElHaHlaV1k5WENJalhDSStjMlYwZEdsdVozTThMMkUrSUhSdklHTm9ZVzVuWlNCMGFHVWdaR1ZtWVhWc2RDQmlaV2hoZG1sdmNpQm1iM0lnZEdocGN5QjNhVzVrYjNjdVBDOXpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmNENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzUm9QbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeDBhRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh1WVhZZ1kyeGhjM05PWVcxbFBWd2lkR0ZpYkdVdFptbHNkR1Z5SUhSbGVIUXRjbWxuYUhSY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSFZzSUdOc1lYTnpUbUZ0WlQxY0lteHBjM1F0YVc1c2FXNWxYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHeHBJR05zWVhOelRtRnRaVDFjSW5SbGVIUXRiWFYwWldSY0lqNVRhRzkzT2p3dmJHaytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBqeGhJR2h5WldZOVhDSWpYQ0krVUdWdVpHbHVaend2WVQ0OEwyeHBQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4c2FUNDhZU0JvY21WbVBWd2lJMXdpUGtGalkyVndkR1ZrUEM5aFBqd3ZiR2srWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHeHBQanhoSUdoeVpXWTlYQ0lqWENJK1VtVnFaV04wWldROEwyRStQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThiR2tnWTJ4aGMzTk9ZVzFsUFZ3aVlXTjBhWFpsWENJK1BHRWdhSEpsWmoxY0lpTmNJajVCYkd3OEwyRStQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOTFiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Ym1GMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmRHZytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmRISStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDNSb1pXRmtQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhSaWIyUjVQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGRISStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BIUm9JSE5qYjNCbFBWd2ljbTkzWENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzQmhiaUJqYkdGemMwNWhiV1U5WENKaWRHNGdZblJ1SUdKMGJpMXpiU0JpZEc0dFpHVm1ZWFZzZEZ3aVBsUmxibTVwY3p3dmMzQmhiajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMM1JvUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHgwWkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MWJDQmpiR0Z6YzA1aGJXVTlYQ0pzYVhOMExXbHViR2x1WlZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThiR2srWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITnRZV3hzUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdRMkYwWldkdmNuazZJRHh6ZEhKdmJtYytVM0J2Y25SelBDOXpkSEp2Ym1jK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzl6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHeHBQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGTnZkWEpqWlRvZ1NXMXdiM0owWldRZ1puSnZiU0E4YzNSeWIyNW5Qa1poWTJWaWIyOXJQQzl6ZEhKdmJtYytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5c2FUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR3hwUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRkpsY1hWbGMzUmxaQ0J2YmlCQVJHRjBaVlJwYldVdVRtOTNYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5c2FUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZkV3crWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzkwWkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4ZEdRZ1kyeGhjM05PWVcxbFBWd2lkR1Y0ZEMxeWFXZG9kRndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0ppZEc0dFozSnZkWEJjSWlCeWIyeGxQVndpWjNKdmRYQmNJaUJoY21saExXeGhZbVZzUFZ3aUxpNHVYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4aWRYUjBiMjRnZEhsd1pUMWNJbUoxZEhSdmJsd2lJR05zWVhOelRtRnRaVDFjSW1KMGJpQmlkRzR0YkdsdWF5QmlkRzR0YzNWalkyVnpjMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltWmhJR1poTFdOb1pXTnJYQ0krUEM5emNHRnVQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emNHRnVJR05zWVhOelRtRnRaVDFjSW1ocFpHUmxiaTE0YzF3aVBrRndjSEp2ZG1VOEwzTndZVzQrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlluVjBkRzl1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFluVjBkRzl1SUhSNWNHVTlYQ0ppZFhSMGIyNWNJaUJqYkdGemMwNWhiV1U5WENKaWRHNGdZblJ1TFd4cGJtc2dZblJ1TFdSaGJtZGxjbHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltWmhJR1poTFhKbGJXOTJaVndpUGp3dmMzQmhiajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzQmhiaUJqYkdGemMwNWhiV1U5WENKb2FXUmtaVzR0ZUhOY0lqNVNaVzF2ZG1VOEwzTndZVzQrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlluVjBkRzl1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOTBaRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOTBjajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BIUnlQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeDBhQ0J6WTI5d1pUMWNJbkp2ZDF3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aVluUnVJR0owYmkxemJTQmlkRzR0WkdWbVlYVnNkRndpUGxOcmFXbHVaend2YzNCaGJqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzUm9QbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeDBaRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHgxYkNCamJHRnpjMDVoYldVOVhDSnNhWE4wTFdsdWJHbHVaVndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGJHaytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOdFlXeHNQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1EyRjBaV2R2Y25rNklEeHpkSEp2Ym1jK1UzQnZjblJ6UEM5emRISnZibWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXNhVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZOdmRYSmpaVG9nU1cxd2IzSjBaV1FnWm5KdmJTQThjM1J5YjI1blBrWmhZMlZpYjI5clBDOXpkSEp2Ym1jK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzl6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHeHBQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGSmxjWFZsYzNSbFpDQnZiaUJBUkdGMFpWUnBiV1V1VG05M1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzl6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmRXdytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOTBaRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThkR1FnWTJ4aGMzTk9ZVzFsUFZ3aWRHVjRkQzF5YVdkb2RGd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmlkRzR0WjNKdmRYQmNJaUJ5YjJ4bFBWd2laM0p2ZFhCY0lpQmhjbWxoTFd4aFltVnNQVndpTGk0dVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhpZFhSMGIyNGdkSGx3WlQxY0ltSjFkSFJ2Ymx3aUlHTnNZWE56VG1GdFpUMWNJbUowYmlCaWRHNHRiR2x1YXlCaWRHNHRjM1ZqWTJWemMxd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emNHRnVJR05zWVhOelRtRnRaVDFjSW1aaElHWmhMV05vWldOclhDSStQQzl6Y0dGdVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6Y0dGdUlHTnNZWE56VG1GdFpUMWNJbWhwWkdSbGJpMTRjMXdpUGtGd2NISnZkbVU4TDNOd1lXNCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WW5WMGRHOXVQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4WW5WMGRHOXVJSFI1Y0dVOVhDSmlkWFIwYjI1Y0lpQmpiR0Z6YzA1aGJXVTlYQ0ppZEc0Z1luUnVMV3hwYm1zZ1luUnVMV1JoYm1kbGNsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emNHRnVJR05zWVhOelRtRnRaVDFjSW1aaElHWmhMWEpsYlc5MlpWd2lQand2YzNCaGJqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNCaGJpQmpiR0Z6YzA1aGJXVTlYQ0pvYVdSa1pXNHRlSE5jSWo1U1pXMXZkbVU4TDNOd1lXNCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WW5WMGRHOXVQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5MFpENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5MGNqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhSeVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MGFDQnpZMjl3WlQxY0luSnZkMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpWW5SdUlHSjBiaUJpZEc0dGMyMGdZblJ1TFdSbFptRjFiSFJjSWo1WGFXNWtjM1Z5Wm1sdVp6d3ZjM0JoYmo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDNSb1BseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MFpENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeDFiQ0JqYkdGemMwNWhiV1U5WENKc2FYTjBMV2x1YkdsdVpWd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YkdrK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE50WVd4c1BseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUTJGMFpXZHZjbms2SUR4emRISnZibWMrVTNCdmNuUnpQQzl6ZEhKdmJtYytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emJXRnNiRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5c2FUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR3hwUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRk52ZFhKalpUb2dTVzF3YjNKMFpXUWdabkp2YlNBOGMzUnliMjVuUGtaaFkyVmliMjlyUEM5emRISnZibWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXNhVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6YldGc2JENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUZKbGNYVmxjM1JsWkNCdmJpQkFSR0YwWlZScGJXVXVUbTkzWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpiV0ZzYkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXNhVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2ZFd3K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5MFpENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGRHUWdZMnhoYzNOT1lXMWxQVndpZEdWNGRDMXlhV2RvZEZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKaWRHNHRaM0p2ZFhCY0lpQnliMnhsUFZ3aVozSnZkWEJjSWlCaGNtbGhMV3hoWW1Wc1BWd2lMaTR1WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGlkWFIwYjI0Z2RIbHdaVDFjSW1KMWRIUnZibHdpSUdOc1lYTnpUbUZ0WlQxY0ltSjBiaUJpZEc0dGJHbHVheUJpZEc0dGMzVmpZMlZ6YzF3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6Y0dGdUlHTnNZWE56VG1GdFpUMWNJbVpoSUdaaExXTm9aV05yWENJK1BDOXpjR0Z1UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltaHBaR1JsYmkxNGMxd2lQa0Z3Y0hKdmRtVThMM053WVc0K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZZblYwZEc5dVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThZblYwZEc5dUlIUjVjR1U5WENKaWRYUjBiMjVjSWlCamJHRnpjMDVoYldVOVhDSmlkRzRnWW5SdUxXeHBibXNnWW5SdUxXUmhibWRsY2x3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6Y0dGdUlHTnNZWE56VG1GdFpUMWNJbVpoSUdaaExYSmxiVzkyWlZ3aVBqd3ZjM0JoYmo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM0JoYmlCamJHRnpjMDVoYldVOVhDSm9hV1JrWlc0dGVITmNJajVTWlcxdmRtVThMM053WVc0K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZZblYwZEc5dVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzkwWkQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzkwY2o1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZkR0p2WkhrK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BDOTBZV0pzWlQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGJtRjJJR05zWVhOelRtRnRaVDFjSW5SbGVIUXRjbWxuYUhSY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHgxYkNCamJHRnpjMDVoYldVOVhDSndZV2RwYm1GMGFXOXVYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHNhU0JqYkdGemMwNWhiV1U5WENKa2FYTmhZbXhsWkZ3aVBqeGhJR0Z5YVdFdGJHRmlaV3c5WENKUWNtVjJhVzkxYzF3aUlHaHlaV1k5WENJalhDSStQSE53WVc0Z1lYSnBZUzFvYVdSa1pXNDlYQ0owY25WbFhDSSt3cXNnVUhKbGRtbHZkWE04TDNOd1lXNCtQQzloUGp3dmJHaytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4c2FTQmpiR0Z6YzA1aGJXVTlYQ0poWTNScGRtVmNJajQ4WVNCb2NtVm1QVndpSTF3aVBqRWdQSE53WVc0Z1kyeGhjM05PWVcxbFBWd2ljM0l0YjI1c2VWd2lQaWhqZFhKeVpXNTBLVHd2YzNCaGJqNDhMMkUrUEM5c2FUNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBqeGhJR2h5WldZOVhDSWpYQ0krTWp3dllUNDhMMnhwUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThiR2srUEdFZ2FISmxaajFjSWlOY0lqNHpQQzloUGp3dmJHaytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4c2FUNDhZU0JvY21WbVBWd2lJMXdpUGpROEwyRStQQzlzYVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR3hwUGp4aElHaHlaV1k5WENJalhDSStOVHd2WVQ0OEwyeHBQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGJHaytQR0VnWVhKcFlTMXNZV0psYkQxY0lrNWxlSFJjSWlCb2NtVm1QVndpSTF3aVBqeHpjR0Z1SUdGeWFXRXRhR2xrWkdWdVBWd2lkSEoxWlZ3aVBrNWxlSFFnd3JzOEwzTndZVzQrUEM5aFBqd3ZiR2srWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzVnNQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHd2Ym1GMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBOEwzTmxZM1JwYjI0K1hISmNiaUFnSUNBcE8xeHlYRzRnSUgxY2NseHVmU2s3WEhKY2JseHlYRzUyWVhJZ1NXMXdiM0owSUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHlYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCeVpYUjFjbTRnS0Z4eVhHNGdJQ0FnSUNBOGMyVmpkR2x2YmlCeWIyeGxQVndpZEdGaWNHRnVaV3hjSWlCamJHRnpjMDVoYldVOVhDSjBZV0l0Y0dGdVpTQm1ZV1JsSUdGamRHbDJaU0JwYmx3aUlHbGtQVndpYVcxd2IzSjBYQ0krWEhKY2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKamIyNTBZV2x1WlhKY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR4b1pXRmtaWElnWTJ4aGMzTk9ZVzFsUFZ3aWNHRm5aUzFvWldGa1pYSmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQR2d6UGk0dUxubHZkWElnYVc1MFpYSmxjM1J6SUdGamNtOXpjeUJoY0hCeklHRnVaQ0JrWlhacFkyVnpMand2YURNK1hISmNiaUFnSUNBZ0lDQWdJQ0E4TDJobFlXUmxjajVjY2x4dUlDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWNtOTNYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lZMjlzTFhoekxUWWdZMjlzTFd4bkxUUmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4Y0NCamJHRnpjMDVoYldVOVhDSnNaV0ZrWENJK1EyOXVibVZqZENCM2FYUm9JRVpoWTJWaWIyOXJJVHd2Y0Q1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5CMWJHd3RiR1ZtZEZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wY205dVp6NU1ZWE4wSUhONWJtTTZQQzl6ZEhKdmJtYytJREkxSUdsdWRHVnlaWE4wY3lBb05TQnVaWGNwUEdKeUlDOCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSeWIyNW5Qa3hoYzNRZ2MzbHVZMlZrSUc5dU9qd3ZjM1J5YjI1blBpQkFSR0YwWlZScGJXVXVUbTkzWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQR0VnYUhKbFpqMWNJaU5jSWlCamJHRnpjMDVoYldVOVhDSmlkRzRnWW5SdUxYTnRJR0owYmkxa1pXWmhkV3gwSUhCMWJHd3RjbWxuYUhSY0lqNURiMjV1WldOMFBDOWhQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjJ3dGVITXROaUJqYjJ3dGJHY3ROQ0JqYjJ3dGJHY3RiMlptYzJWMExURmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4Y0NCamJHRnpjMDVoYldVOVhDSnNaV0ZrWENJK1NXMXdiM0owSUhsdmRYSWdjR2x1Y3lCbWNtOXRJRkJwYm5SbGNtVnpkQ0U4TDNBK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKd2RXeHNMV3hsWm5SY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEhKdmJtYytUR0Z6ZENCemVXNWpPand2YzNSeWIyNW5QaUF5TlNCcGJuUmxjbVZ6ZEhNZ0tEVWdibVYzS1R4aWNpQXZQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMGNtOXVaejVNWVhOMElITjVibU5sWkNCdmJqbzhMM04wY205dVp6NGdRRVJoZEdWVWFXMWxMazV2ZDF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHhoSUdoeVpXWTlYQ0lqWENJZ1kyeGhjM05PWVcxbFBWd2lZblJ1SUdKMGJpMXpiU0JpZEc0dFpHVm1ZWFZzZENCd2RXeHNMWEpwWjJoMFhDSStTVzF3YjNKMFBDOWhQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnUEdoeUlDOCtYSEpjYmlBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5KdmQxd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltTnZiQzE0Y3kweE1pQmpiMnd0YkdjdE9Wd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHhvTXo1VWNua2dlVzkxY2lCaGNIQWhQQzlvTXo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGNENU1hV3RsSUdOdmJuUnliMnhzYVc1bklIUm9aU0IzWldJL1B6OGdWMlVnZEdodmRXZG9kQ0J6Ynk0Z1QzVnlJRzVwWm5SNUlHRndjQ0JzWlhSeklIbHZkU0IwWVd0bElHbDBJSFJ2SUhSb1pTQnVaWGgwSUd4bGRtVnNJR0Z1WkNCd2RYUnpJR0ZzYkNCNWIzVnlJR2x1ZEdWeWJtVjBMWGRwWkdVZ2NISmxabVZ5Wlc1alpYTWdhVzRnYjI1bElHTmxiblJ5WVd3Z2NHeGhZMlVnYzI4Z2VXOTFJR05oYmlCeGRXbGphMng1SUdGdVpDQmxZWE5wYkhrZ2RtbGxkeUJoYm1RZ1lXTmpaWEIwSUhsdmRYSWdibTkwYVdacFkyRjBhVzl1Y3lCM2FYUm9JR0VnWm1WM0lITjBaWEJ6TGp3dmNENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0luQjFiR3d0YkdWbWRGd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdFZ2FISmxaajFjSWlOY0lpQmpiR0Z6YzA1aGJXVTlYQ0ppZEc0Z1luUnVMWE50SUdKMGJpMWtaV1poZFd4MFhDSStaRzkzYm14dllXUWdabTl5SUdGdVpISnZhV1E4TDJFK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThZU0JvY21WbVBWd2lJMXdpSUdOc1lYTnpUbUZ0WlQxY0ltSjBiaUJpZEc0dGMyMGdZblJ1TFdSbFptRjFiSFJjSWo1a2IzZHViRzloWkNCbWIzSWdhWEJvYjI1bFBDOWhQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWNIVnNiQzF5YVdkb2RGd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUjI5MElHRnVJR0Z3Y0Q4Z1RtOTNJRHhoSUdoeVpXWTlYQ0lqWENJZ1kyeGhjM05PWVcxbFBWd2lZblJ1SUdKMGJpMXpiU0JpZEc0dFpHVm1ZWFZzZEZ3aVBrZGxibVZ5WVhSbElHRWdjM2x1WXlCamIyUmxJVHd2WVQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdQQzl6WldOMGFXOXVQbHh5WEc0Z0lDQWdLVHRjY2x4dUlDQjlYSEpjYm4wcE8xeHlYRzVjY2x4dWRtRnlJRk5sZEhScGJtZHpJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4YzJWamRHbHZiaUJ5YjJ4bFBWd2lkR0ZpY0dGdVpXeGNJaUJqYkdGemMwNWhiV1U5WENKMFlXSXRjR0Z1WlNCbVlXUmxJR0ZqZEdsMlpTQnBibHdpSUdsa1BWd2ljMlYwZEdsdVozTmNJajVjY2x4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW1OdmJuUmhhVzVsY2x3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnUEdobFlXUmxjaUJqYkdGemMwNWhiV1U5WENKd1lXZGxMV2hsWVdSbGNsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThhREUrVTJWMGRHbHVaM01nUEhOdFlXeHNQbTl1UEM5emJXRnNiRDRnVzNOcGRHVXVZMjl0WFR3dmFERStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeHdQbGx2ZFNCaGNtVWdhVzRnWTI5dWRISnZiQ0VnUTJoaGJtZGxJSGx2ZFhJZ2MyVjBkR2x1WjNNZ2FHVnlaUzQ4TDNBK1hISmNiaUFnSUNBZ0lDQWdJQ0E4TDJobFlXUmxjajVjY2x4dUlDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVptOXliUzFvYjNKcGVtOXVkR0ZzWENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWm05eWJTMW5jbTkxY0NCbWIzSnRMV2R5YjNWd0xYTnRYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4aFltVnNJR2gwYld4R2IzSTlYQ0p3WlhKemIyNWhiR2w2WVhScGIyNWNJaUJqYkdGemMwNWhiV1U5WENKamIyd3RlSE10TnlCamIyd3RjMjB0TlNCamIyd3RiV1F0TkNCamIyd3RiR2N0TXlCamIyNTBjbTlzTFd4aFltVnNYQ0krVUdWeWMyOXVZV3hwZW1GMGFXOXVQQzlzWVdKbGJENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltTnZiQzE0Y3kwMUlHTnZiQzF6YlMwM0lHTnZiQzF0WkMwNElHTnZiQzFzWnkwNVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YVc1d2RYUWdkSGx3WlQxY0ltTm9aV05yWW05NFhDSWdibUZ0WlQxY0luQmxjbk52Ym1Gc2FYcGhkR2x2Ymx3aUlHTnNZWE56VG1GdFpUMWNJbk4zYVhSamFGd2lJQzgrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4YUhJZ0x6NWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKbWIzSnRMV2R5YjNWd0lHWnZjbTB0WjNKdmRYQXRjMjFjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGJHRmlaV3dnYUhSdGJFWnZjajFjSW5OdmNuUnBibWRjSWlCamJHRnpjMDVoYldVOVhDSmpiMnd0ZUhNdE55QmpiMnd0YzIwdE5TQmpiMnd0YldRdE5DQmpiMnd0YkdjdE15QmpiMjUwY205c0xXeGhZbVZzWENJK1UyOXlkR2x1Wnp3dmJHRmlaV3crWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjJ3dGVITXROU0JqYjJ3dGMyMHROeUJqYjJ3dGJXUXRPQ0JqYjJ3dGJHY3RPVndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITmxiR1ZqZENCamJHRnpjejFjSW5ObGJHVmpkSEJwWTJ0bGNsd2lJR2xrUFZ3aWMyOXlkR2x1WjF3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YjNCMGFXOXVQbGx2ZFhJZ2FXNTBaWEpsYzNSelBDOXZjSFJwYjI0K1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh2Y0hScGIyNCtVMmwwWlNCa1pXWmhkV3gwUEM5dmNIUnBiMjQrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzTmxiR1ZqZEQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4b2NpQXZQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltWnZjbTB0WjNKdmRYQWdabTl5YlMxbmNtOTFjQzF6YlZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHNZV0psYkNCb2RHMXNSbTl5UFZ3aVlYVjBiM05oZG1WY0lpQmpiR0Z6YzA1aGJXVTlYQ0pqYjJ3dGVITXROeUJqYjJ3dGMyMHROU0JqYjJ3dGJXUXROQ0JqYjJ3dGJHY3RNeUJqYjI1MGNtOXNMV3hoWW1Wc1hDSStRWFYwYjNOaGRtVThMMnhoWW1Wc1BseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXNMWGh6TFRVZ1kyOXNMWE50TFRjZ1kyOXNMVzFrTFRnZ1kyOXNMV3huTFRsY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhwYm5CMWRDQjBlWEJsUFZ3aVkyaGxZMnRpYjNoY0lpQnVZVzFsUFZ3aVlYVjBiM05oZG1WY0lpQmpiR0Z6YzA1aGJXVTlYQ0p6ZDJsMFkyaGNJaUF2UGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEdoeUlDOCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVptOXliUzFuY205MWNDQm1iM0p0TFdkeWIzVndMWE50WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ1BHeGhZbVZzSUdoMGJXeEdiM0k5WENKa1pXeGxkR1ZjSWlCamJHRnpjMDVoYldVOVhDSmpiMnd0ZUhNdE55QmpiMnd0YzIwdE5TQmpiMnd0YldRdE5DQmpiMnd0YkdjdE15QmpiMjUwY205c0xXeGhZbVZzWENJK1JHVnNaWFJsSUcxNUlIQnliMlpwYkdVZ1BITnRZV3hzUG1GMFBDOXpiV0ZzYkQ0Z1BHaytXM05wZEdVdVkyOXRYVHd2YVQ0OEwyeGhZbVZzUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWTI5c0xYaHpMVFVnWTI5c0xYTnRMVGNnWTI5c0xXMWtMVGdnWTI5c0xXeG5MVGxjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGhJR2h5WldZOVhDSWpYQ0lnWTJ4aGMzTk9ZVzFsUFZ3aVluUnVJR0owYmkxemJTQmlkRzR0WkdGdVoyVnlYQ0krUkdWc1pYUmxQQzloUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQThMM05sWTNScGIyNCtYSEpjYmlBZ0lDQXBPMXh5WEc0Z0lIMWNjbHh1ZlNrN1hISmNibHh5WEc1MllYSWdVSEpwZG1GamVTQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjY2x4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdjbVYwZFhKdUlDaGNjbHh1SUNBZ0lDQWdQSE5sWTNScGIyNGdjbTlzWlQxY0luUmhZbkJoYm1Wc1hDSWdZMnhoYzNOT1lXMWxQVndpZEdGaUxYQmhibVVnWm1Ga1pTQmhZM1JwZG1VZ2FXNWNJaUJwWkQxY0luQnlhWFpoWTNsY0lqNWNjbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbU52Ym5SaGFXNWxjbHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdQR2hsWVdSbGNpQmpiR0Z6YzA1aGJXVTlYQ0p3WVdkbExXaGxZV1JsY2x3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOGFERStVSEpwZG1GamVUd3ZhREUrWEhKY2JpQWdJQ0FnSUNBZ0lDQThMMmhsWVdSbGNqNWNjbHh1SUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpY205M1hDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aVkyOXNMWGh6TFRFd1hDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdQSEFnWTJ4aGMzTk9ZVzFsUFZ3aWJHVmhaRndpUGt4dmNtVnRJR2x3YzNWdElHUnZiRzl5SUhOcGRDQmhiV1YwTENCamIyNXpaV04wWlhSMWNpQmhaR2x3YVhOamFXNW5JR1ZzYVhRdUlFbHVkR1ZuWlhJZ2JtVmpJRzlrYVc4dUlGQnlZV1Z6Wlc1MElHeHBZbVZ5Ynk0Z1UyVmtJR04xY25OMWN5QmhiblJsSUdSaGNHbGlkWE1nWkdsaGJTNGdVMlZrSUc1cGMya3VJRTUxYkd4aElIRjFhWE1nYzJWdElHRjBJRzVwWW1nZ1pXeGxiV1Z1ZEhWdElHbHRjR1Z5WkdsbGRDNDhMM0ErWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhBK1RHOXlaVzBnYVhCemRXMGdaRzlzYjNJZ2MybDBJR0Z0WlhRc0lHTnZibk5sWTNSbGRIVnlJR0ZrYVhCcGMyTnBibWNnWld4cGRDNGdTVzUwWldkbGNpQnVaV01nYjJScGJ5NGdVSEpoWlhObGJuUWdiR2xpWlhKdkxpQlRaV1FnWTNWeWMzVnpJR0Z1ZEdVZ1pHRndhV0oxY3lCa2FXRnRMaUJUWldRZ2JtbHphUzRnVG5Wc2JHRWdjWFZwY3lCelpXMGdZWFFnYm1saWFDQmxiR1Z0Wlc1MGRXMGdhVzF3WlhKa2FXVjBMand2Y0Q1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnUEM5elpXTjBhVzl1UGx4eVhHNGdJQ0FnS1R0Y2NseHVJQ0I5WEhKY2JuMHBPMXh5WEc1Y2NseHVkbUZ5SUVGaWIzVjBJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4eVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdLRnh5WEc0Z0lDQWdJQ0E4YzJWamRHbHZiaUJ5YjJ4bFBWd2lkR0ZpY0dGdVpXeGNJaUJqYkdGemMwNWhiV1U5WENKMFlXSXRjR0Z1WlNCbVlXUmxJR0ZqZEdsMlpTQnBibHdpSUdsa1BWd2lZV0p2ZFhSY0lqNWNjbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbU52Ym5SaGFXNWxjbHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdQR2hsWVdSbGNpQmpiR0Z6YzA1aGJXVTlYQ0p3WVdkbExXaGxZV1JsY2x3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOGFXMW5JSE55WXoxY0lpOXBiV0ZuWlhNdmJHOW5ieTE2YVhaMFpYSXVjRzVuWENJZ1lXeDBQVndpWENJZ0x6NWNjbHh1SUNBZ0lDQWdJQ0FnSUR3dmFHVmhaR1Z5UGx4eVhHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBOEwzTmxZM1JwYjI0K1hISmNiaUFnSUNBcE8xeHlYRzRnSUgxY2NseHVmU2s3WEhKY2JseHlYRzV5WlZKbGJtUmxjaWdwTzF4eVhHNWNjbHh1THlwY2NseHVQQ0ZFVDBOVVdWQkZJR2gwYld3K1hISmNianhvZEcxc1BseHlYRzRnSUR4b1pXRmtQbHh5WEc0Z0lDQWdQRzFsZEdFZ1kyaGhjbk5sZEQxY0luVjBaaTA0WENJZ0x6NWNjbHh1SUNBZ0lEeHRaWFJoSUc1aGJXVTlYQ0oyYVdWM2NHOXlkRndpSUdOdmJuUmxiblE5WENKM2FXUjBhRDFrWlhacFkyVXRkMmxrZEdnc0lHbHVhWFJwWVd3dGMyTmhiR1U5TVM0d1hDSStYSEpjYmlBZ0lDQThkR2wwYkdVK1BDOTBhWFJzWlQ1Y2NseHVJQ0FnSUR4c2FXNXJJSEpsYkQxY0luTjBlV3hsYzJobFpYUmNJaUIwZVhCbFBWd2lkR1Y0ZEM5amMzTmNJaUJvY21WbVBWd2lRMjl1ZEdWdWRDOTJaRzVoTG0xcGJpNWpjM05jSWo1Y2NseHVJQ0FnSUR4elkzSnBjSFFnZEhsd1pUMWNJblJsZUhRdmFtRjJZWE5qY21sd2RGd2lJSE55WXoxY0lsTmpjbWx3ZEhNdmJXOWtaWEp1YVhweUxUSXVOaTR5TG1welhDSStQQzl6WTNKcGNIUStYSEpjYmlBZ1BDOW9aV0ZrUGx4eVhHNGdJRHhpYjJSNVBseHlYRzVjY2x4dUlDQWdJRHdoTFMwZ2RtUnVZU0JoY0hBZ0xTMCtYSEpjYmlBZ0lDQThjMlZqZEdsdmJpQmpiR0Z6Y3oxY0luWmtibUZjSWo1Y2NseHVJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNJblprYm1FdFltOWtlVndpUGx4eVhHNWNjbHh1WEhROElTMHRJR052Ym5SaGFXNWxjaUF0TFQ1Y2NseHVYSFE4WkdsMklHTnNZWE56UFZ3aVkyOXVkR0ZwYm1WeVhDSStYSEpjYmx4MElDQThaR2wySUdOc1lYTnpQVndpY205M1hDSStYSEpjYmx4eVhHNWNkQ0FnSUNBOElTMHRJSE5wWkdWaVlYSWdMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMCtYSEpjYmx4MElDQWdJRHhrYVhZZ1kyeGhjM005WENKemFXUmxZbUZ5SUdOdmJDMTRjeTAwSUdOdmJDMXpiUzB6SUdOdmJDMXNaeTB5WENJK1hISmNibHh5WEc1Y2RDQWdJQ0E4TDJScGRqNDhJUzB0SUM5emFXUmxZbUZ5SUMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwK1hISmNibHh5WEc1Y2RDQWdJQ0E4SVMwdElHMWhhVzRnWTI5dWRHVnVkQ0F0TFQ1Y2NseHVYSFFnSUNBZ1BHUnBkaUJqYkdGemN6MWNJbTFoYVc0dFkyOXVkR1Z1ZENCamIyd3RlSE10T0NCamIyd3RlSE10YjJabWMyVjBMVFFnWTI5c0xYTnRMVGtnWTI5c0xYTnRMVzltWm5ObGRDMHpJR052YkMxc1p5MHhNQ0JqYjJ3dGJHY3RiMlptYzJWMExUSmNJajVjY2x4dVhIUWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWd2lkR0ZpTFdOdmJuUmxiblJjSWo1Y2NseHVYSEpjYmx4MFhIUThJUzB0SUhObFkzUnBiMjQ2SUcxNUlIQnliMlpwYkdVZ0xTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFBseHlYRzVjY2x4dVhIUmNkQ0FnSUNBOEwyUnBkajQ4SVMwdElDOXRlU0J3Y205bWFXeGxJR1p2Y20wZ0xTMCtYSEpjYmx4eVhHNWNkRngwSUNBOEwyUnBkajVjY2x4dVhIUmNkRHd2YzJWamRHbHZiajQ4SVMwdElDOXpaV04wYVc5dU9pQnRlU0J3Y205bWFXeGxJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRQbHh5WEc1Y2NseHVYSFJjZER3aExTMGdjMlZqZEdsdmJqb2dibTkwYVdacFkyRjBhVzl1Y3lBdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThJUzB0SUM5elpXTjBhVzl1T2lCdWIzUnBabWxqWVhScGIyNXpJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRQbHh5WEc1Y2NseHVYSFJjZER3aExTMGdjMlZqZEdsdmJqb2dhVzF3YjNKMElDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUENFdExTQXZjMlZqZEdsdmJqb2dhVzF3YjNKMElDMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMCtYSEpjYmx4eVhHNWNkRngwUENFdExTQnpaV04wYVc5dU9pQnpaWFIwYVc1bmN5QXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzArWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOElTMHRJSE5sWTNScGIyNDZJSE5sZEhScGJtZHpJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFQ1Y2NseHVYSEpjYmx4MFhIUThJUzB0SUhObFkzUnBiMjQ2SUhCeWFYWmhZM2tnTFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMVDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3aExTMGdMM05sWTNScGIyNDZJSEJ5YVhaaFkza2dMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFQ1Y2NseHVYSEpjYmx4MFhIUThJUzB0SUhObFkzUnBiMjQ2SUdGaWIzVjBJQzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzArWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOElTMHRJQzl6WldOMGFXOXVPaUJoWW05MWRDQXRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdExTMHRMUzB0TFMwdFBseHlYRzVjY2x4dVhIUWdJQ0FnSUNBOEwyUnBkajVjY2x4dVhIUWdJQ0FnUEM5a2FYWStQQ0V0TFNBdmJXRnBiaUJqYjI1MFpXNTBJQzB0UGx4eVhHNWNjbHh1WEhRZ0lEd3ZaR2wyUGx4eVhHNWNjbHh1WEhRZ0lEd2hMUzBnWTJ4dmMyVWdZWEJ3SUMwdFBseHlYRzVjZENBZ1BHRWdhSEpsWmoxY0lpTmpiRzl6WlZaa2JtRmNJaUJrWVhSaExYUnZaMmRzWlQxY0luUnZiMngwYVhCY0lpQjBhWFJzWlQxY0lrTnNhV05ySUhSdklHTnNiM05sWENJZ1kyeGhjM005WENKamJHOXpaVlprYm1GY0lqNDhjM0JoYmlCamJHRnpjejFjSW1aaElHWmhMWEJ2ZDJWeUxXOW1abHdpUGp3dmMzQmhiajQ4TDJFK1hISmNibHh5WEc1Y2REd3ZaR2wyUGp3aExTMGdMMk52Ym5SaGFXNWxjaUF0TFQ1Y2NseHVYSEpjYmx4MFBDRXRMU0J2Y0dWdUlHRndjQ0F0TFQ1Y2NseHVYSFE4WVNCb2NtVm1QVndpSTI5d1pXNVdaRzVoWENJZ1pHRjBZUzEwYjJkbmJHVTlYQ0owYjI5c2RHbHdYQ0lnZEdsMGJHVTlYQ0pEYkdsamF5QjBieUJ2Y0dWdUlGWkVUa0ZjSWlCamJHRnpjejFjSW1KMGJpQmlkRzR0YzIwZ1luUnVMWEJ5YVcxaGNua2diM0JsYmxaa2JtRmNJajVQY0dWdUlIWkVUa0U4TDJFK1hISmNiaUFnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnUEM5elpXTjBhVzl1UGp3aExTMGdMM1prYm1FZ1lYQndJQzB0UGx4eVhHNWNjbHh1SUNBZ0lEd2hMUzBnVjJWaWMybDBaU0J3YkdGalpXaHZiR1JsY2lBdExUNWNjbHh1SUNBZ0lEeHBiV2NnYzNKalBWd2lRMjl1ZEdWdWRDOXBiV0ZuWlhNdmRHbGphMlYwY0hKdkxuQnVaMXdpSUdGc2REMWNJbHdpSUM4K1hISmNibHh5WEc0Z0lDQWdQQ0V0TFNCVFkzSnBjSFJ6SUMwdFBseHlYRzRnSUNBZ1BITmpjbWx3ZENCMGVYQmxQVndpZEdWNGRDOXFZWFpoYzJOeWFYQjBYQ0lnYzNKalBWd2lVMk55YVhCMGN5OWlkVzVrYkdWekwycHhkV1Z5ZVM1cWMxd2lQand2YzJOeWFYQjBQbHh5WEc0Z0lDQWdQSE5qY21sd2RDQjBlWEJsUFZ3aWRHVjRkQzlxWVhaaGMyTnlhWEIwWENJZ2MzSmpQVndpVTJOeWFYQjBjeTlpZFc1a2JHVnpMMkp2YjNSemRISmhjQzVxYzF3aVBqd3ZjMk55YVhCMFBseHlYRzRnSUNBZ1BITmpjbWx3ZENCMGVYQmxQVndpZEdWNGRDOXFZWFpoYzJOeWFYQjBYQ0lnYzNKalBWd2lVMk55YVhCMGN5OWlkVzVrYkdWekwzWmtibUV1YW5OY0lqNDhMM05qY21sd2RENWNjbHh1WEhKY2JpQWdQQzlpYjJSNVBseHlYRzQ4TDJoMGJXdytYSEpjYmlvdlhISmNiaUpkZlE9PSJdfQ==
