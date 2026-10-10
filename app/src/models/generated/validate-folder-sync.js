// GENERATED FILE - DO NOT EDIT. Regenerate with npm run json-schema.
// oxlint-disable
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) =>
  function __require() {
    try {
      return (mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports);
    } catch (e) {
      throw ((mod = 0), e);
    }
  };

// ../../node_modules/ajv-formats/dist/formats.js
var require_formats = __commonJS({
  '../../node_modules/ajv-formats/dist/formats.js'(exports) {
    'use strict';
    Object.defineProperty(exports, '__esModule', { value: true });
    exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
    function fmtDef(validate, compare) {
      return { validate, compare };
    }
    exports.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: fmtDef(date, compareDate),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: fmtDef(getTime(true), compareTime),
      'date-time': fmtDef(getDateTime(true), compareDateTime),
      'iso-time': fmtDef(getTime(), compareIsoTime),
      'iso-date-time': fmtDef(getDateTime(), compareIsoDateTime),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri,
      'uri-reference':
        /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      'uri-template':
        /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email:
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      'json-pointer': /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      'json-pointer-uri-fragment': /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      'relative-json-pointer': /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte,
      // signed 32 bit integer
      int32: { type: 'number', validate: validateInt32 },
      // signed 64 bit integer
      int64: { type: 'number', validate: validateInt64 },
      // C-type float
      float: { type: 'number', validate: validateNumber },
      // C-type double
      double: { type: 'number', validate: validateNumber },
      // hint to the UI to hide input strings
      password: true,
      // unchecked string payload
      binary: true,
    };
    exports.fastFormats = {
      ...exports.fullFormats,
      date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
      time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
      'date-time': fmtDef(
        /^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,
        compareDateTime,
      ),
      'iso-time': fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
      'iso-date-time': fmtDef(
        /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,
        compareIsoDateTime,
      ),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      'uri-reference': /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email:
        /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
    };
    exports.formatNames = Object.keys(exports.fullFormats);
    function isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
    var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function date(str) {
      const matches = DATE.exec(str);
      if (!matches) return false;
      const year = +matches[1];
      const month = +matches[2];
      const day = +matches[3];
      return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
    }
    function compareDate(d1, d2) {
      if (!(d1 && d2)) return void 0;
      if (d1 > d2) return 1;
      if (d1 < d2) return -1;
      return 0;
    }
    var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function getTime(strictTimeZone) {
      return function time(str) {
        const matches = TIME.exec(str);
        if (!matches) return false;
        const hr = +matches[1];
        const min = +matches[2];
        const sec = +matches[3];
        const tz = matches[4];
        const tzSign = matches[5] === '-' ? -1 : 1;
        const tzH = +(matches[6] || 0);
        const tzM = +(matches[7] || 0);
        if (tzH > 23 || tzM > 59 || (strictTimeZone && !tz)) return false;
        if (hr <= 23 && min <= 59 && sec < 60) return true;
        const utcMin = min - tzM * tzSign;
        const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
        return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
      };
    }
    function compareTime(s1, s2) {
      if (!(s1 && s2)) return void 0;
      const t1 = /* @__PURE__ */ new Date('2020-01-01T' + s1).valueOf();
      const t2 = /* @__PURE__ */ new Date('2020-01-01T' + s2).valueOf();
      if (!(t1 && t2)) return void 0;
      return t1 - t2;
    }
    function compareIsoTime(t1, t2) {
      if (!(t1 && t2)) return void 0;
      const a1 = TIME.exec(t1);
      const a2 = TIME.exec(t2);
      if (!(a1 && a2)) return void 0;
      t1 = a1[1] + a1[2] + a1[3];
      t2 = a2[1] + a2[2] + a2[3];
      if (t1 > t2) return 1;
      if (t1 < t2) return -1;
      return 0;
    }
    var DATE_TIME_SEPARATOR = /t|\s/i;
    function getDateTime(strictTimeZone) {
      const time = getTime(strictTimeZone);
      return function date_time(str) {
        const dateTime = str.split(DATE_TIME_SEPARATOR);
        return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1]);
      };
    }
    function compareDateTime(dt1, dt2) {
      if (!(dt1 && dt2)) return void 0;
      const d1 = new Date(dt1).valueOf();
      const d2 = new Date(dt2).valueOf();
      if (!(d1 && d2)) return void 0;
      return d1 - d2;
    }
    function compareIsoDateTime(dt1, dt2) {
      if (!(dt1 && dt2)) return void 0;
      const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
      const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
      const res = compareDate(d1, d2);
      if (res === void 0) return void 0;
      return res || compareTime(t1, t2);
    }
    var NOT_URI_FRAGMENT = /\/|:/;
    var URI =
      /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function uri(str) {
      return NOT_URI_FRAGMENT.test(str) && URI.test(str);
    }
    var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function byte(str) {
      BYTE.lastIndex = 0;
      return BYTE.test(str);
    }
    var MIN_INT32 = -(2 ** 31);
    var MAX_INT32 = 2 ** 31 - 1;
    function validateInt32(value) {
      return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
    }
    function validateInt64(value) {
      return Number.isInteger(value);
    }
    function validateNumber() {
      return true;
    }
    var Z_ANCHOR = /[^\\]\\Z/;
    function regex(str) {
      if (Z_ANCHOR.test(str)) return false;
      try {
        new RegExp(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  },
});

// validator.js
var require_validator = __commonJS({
  'validator.js'(exports, module) {
    module.exports = validate10;
    module.exports.default = validate10;
    var schema57 = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        force: { type: ['string', 'null'] },
        level: { type: 'string' },
        mechanic: { type: ['string', 'null'] },
        equipment: { type: ['string', 'null'] },
        muscles: { type: 'array', items: { type: 'string' } },
        instructions: { type: 'string' },
        category: { type: 'string' },
      },
      required: ['name', 'force', 'level', 'mechanic', 'equipment', 'muscles', 'instructions', 'category'],
    };
    var schema58 = { type: 'string', enum: ['session', 'program', 'exercise', 'exercise-visibility'] };
    var formats0 = /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/;
    function validate17(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.type === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'type' },
            message: "must have required property 'type'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.value === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'value' },
            message: "must have required property 'value'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.type !== void 0) {
          let data0 = data.type;
          if (typeof data0 !== 'string') {
            const err2 = {
              instancePath: instancePath + '/type',
              schemaPath: '#/properties/type/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err2];
            } else {
              vErrors.push(err2);
            }
            errors++;
          }
          if ('time' !== data0) {
            const err3 = {
              instancePath: instancePath + '/type',
              schemaPath: '#/properties/type/const',
              keyword: 'const',
              params: { allowedValue: 'time' },
              message: 'must be equal to constant',
            };
            if (vErrors === null) {
              vErrors = [err3];
            } else {
              vErrors.push(err3);
            }
            errors++;
          }
        }
        if (data.value !== void 0) {
          let data1 = data.value;
          if (typeof data1 === 'string') {
            if (!formats0.test(data1)) {
              const err4 = {
                instancePath: instancePath + '/value',
                schemaPath: '#/definitions/Duration/format',
                keyword: 'format',
                params: { format: 'duration' },
                message: 'must match format "duration"',
              };
              if (vErrors === null) {
                vErrors = [err4];
              } else {
                vErrors.push(err4);
              }
              errors++;
            }
          } else {
            const err5 = {
              instancePath: instancePath + '/value',
              schemaPath: '#/definitions/Duration/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
        }
      } else {
        const err6 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
      }
      validate17.errors = vErrors;
      return errors === 0;
    }
    var schema23 = { type: 'string', enum: ['metre', 'yard', 'mile', 'kilometre'] };
    var pattern0 = new RegExp('^-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?$', 'u');
    function validate19(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.value === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'value' },
            message: "must have required property 'value'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.unit === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'unit' },
            message: "must have required property 'unit'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.value !== void 0) {
          let data0 = data.value;
          if (typeof data0 === 'string') {
            if (!pattern0.test(data0)) {
              const err2 = {
                instancePath: instancePath + '/value',
                schemaPath: '#/definitions/BigNumber/pattern',
                keyword: 'pattern',
                params: { pattern: '^-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?$' },
                message: 'must match pattern "^-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?$"',
              };
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
          } else {
            const err3 = {
              instancePath: instancePath + '/value',
              schemaPath: '#/definitions/BigNumber/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err3];
            } else {
              vErrors.push(err3);
            }
            errors++;
          }
        }
        if (data.unit !== void 0) {
          let data1 = data.unit;
          if (typeof data1 !== 'string') {
            const err4 = {
              instancePath: instancePath + '/unit',
              schemaPath: '#/definitions/DistanceUnit/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
          if (!(data1 === 'metre' || data1 === 'yard' || data1 === 'mile' || data1 === 'kilometre')) {
            const err5 = {
              instancePath: instancePath + '/unit',
              schemaPath: '#/definitions/DistanceUnit/enum',
              keyword: 'enum',
              params: { allowedValues: schema23.enum },
              message: 'must be equal to one of the allowed values',
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
        }
      } else {
        const err6 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
      }
      validate19.errors = vErrors;
      return errors === 0;
    }
    function validate18(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.type === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'type' },
            message: "must have required property 'type'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.value === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'value' },
            message: "must have required property 'value'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.type !== void 0) {
          let data0 = data.type;
          if (typeof data0 !== 'string') {
            const err2 = {
              instancePath: instancePath + '/type',
              schemaPath: '#/properties/type/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err2];
            } else {
              vErrors.push(err2);
            }
            errors++;
          }
          if ('distance' !== data0) {
            const err3 = {
              instancePath: instancePath + '/type',
              schemaPath: '#/properties/type/const',
              keyword: 'const',
              params: { allowedValue: 'distance' },
              message: 'must be equal to constant',
            };
            if (vErrors === null) {
              vErrors = [err3];
            } else {
              vErrors.push(err3);
            }
            errors++;
          }
        }
        if (data.value !== void 0) {
          if (
            !validate19(data.value, {
              instancePath: instancePath + '/value',
              parentData: data,
              parentDataProperty: 'value',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate19.errors : vErrors.concat(validate19.errors);
            errors = vErrors.length;
          }
        }
      } else {
        const err4 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err4];
        } else {
          vErrors.push(err4);
        }
        errors++;
      }
      validate18.errors = vErrors;
      return errors === 0;
    }
    function validate16(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.type === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'type' },
            message: "must have required property 'type'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        const tag0 = data.type;
        if (typeof tag0 == 'string') {
          if (tag0 === 'time') {
            if (!validate17(data, { instancePath, parentData, parentDataProperty, rootData })) {
              vErrors = vErrors === null ? validate17.errors : vErrors.concat(validate17.errors);
              errors = vErrors.length;
            }
          } else if (tag0 === 'distance') {
            if (!validate18(data, { instancePath, parentData, parentDataProperty, rootData })) {
              vErrors = vErrors === null ? validate18.errors : vErrors.concat(validate18.errors);
              errors = vErrors.length;
            }
          } else {
            const err1 = {
              instancePath,
              schemaPath: '#/discriminator',
              keyword: 'discriminator',
              params: { error: 'mapping', tag: 'type', tagValue: tag0 },
              message: 'value of tag "type" must be in oneOf',
            };
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          }
        } else {
          const err2 = {
            instancePath,
            schemaPath: '#/discriminator',
            keyword: 'discriminator',
            params: { error: 'tag', tag: 'type', tagValue: tag0 },
            message: 'tag "type" must be string',
          };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
      } else {
        const err3 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err3];
        } else {
          vErrors.push(err3);
        }
        errors++;
      }
      validate16.errors = vErrors;
      return errors === 0;
    }
    function validate24(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.minRest === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'minRest' },
            message: "must have required property 'minRest'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.maxRest === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'maxRest' },
            message: "must have required property 'maxRest'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.failureRest === void 0) {
          const err2 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'failureRest' },
            message: "must have required property 'failureRest'",
          };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if (data.minRest !== void 0) {
          let data0 = data.minRest;
          if (typeof data0 === 'string') {
            if (!formats0.test(data0)) {
              const err3 = {
                instancePath: instancePath + '/minRest',
                schemaPath: '#/definitions/Duration/format',
                keyword: 'format',
                params: { format: 'duration' },
                message: 'must match format "duration"',
              };
              if (vErrors === null) {
                vErrors = [err3];
              } else {
                vErrors.push(err3);
              }
              errors++;
            }
          } else {
            const err4 = {
              instancePath: instancePath + '/minRest',
              schemaPath: '#/definitions/Duration/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
        }
        if (data.maxRest !== void 0) {
          let data1 = data.maxRest;
          if (typeof data1 === 'string') {
            if (!formats0.test(data1)) {
              const err5 = {
                instancePath: instancePath + '/maxRest',
                schemaPath: '#/definitions/Duration/format',
                keyword: 'format',
                params: { format: 'duration' },
                message: 'must match format "duration"',
              };
              if (vErrors === null) {
                vErrors = [err5];
              } else {
                vErrors.push(err5);
              }
              errors++;
            }
          } else {
            const err6 = {
              instancePath: instancePath + '/maxRest',
              schemaPath: '#/definitions/Duration/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err6];
            } else {
              vErrors.push(err6);
            }
            errors++;
          }
        }
        if (data.failureRest !== void 0) {
          let data2 = data.failureRest;
          if (typeof data2 === 'string') {
            if (!formats0.test(data2)) {
              const err7 = {
                instancePath: instancePath + '/failureRest',
                schemaPath: '#/definitions/Duration/format',
                keyword: 'format',
                params: { format: 'duration' },
                message: 'must match format "duration"',
              };
              if (vErrors === null) {
                vErrors = [err7];
              } else {
                vErrors.push(err7);
              }
              errors++;
            }
          } else {
            const err8 = {
              instancePath: instancePath + '/failureRest',
              schemaPath: '#/definitions/Duration/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err8];
            } else {
              vErrors.push(err8);
            }
            errors++;
          }
        }
      } else {
        const err9 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err9];
        } else {
          vErrors.push(err9);
        }
        errors++;
      }
      validate24.errors = vErrors;
      return errors === 0;
    }
    function validate15(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.target === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'target' },
            message: "must have required property 'target'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.trackDuration === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'trackDuration' },
            message: "must have required property 'trackDuration'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.trackDistance === void 0) {
          const err2 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'trackDistance' },
            message: "must have required property 'trackDistance'",
          };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if (data.trackResistance === void 0) {
          const err3 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'trackResistance' },
            message: "must have required property 'trackResistance'",
          };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        if (data.trackIncline === void 0) {
          const err4 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'trackIncline' },
            message: "must have required property 'trackIncline'",
          };
          if (vErrors === null) {
            vErrors = [err4];
          } else {
            vErrors.push(err4);
          }
          errors++;
        }
        if (data.trackWeight === void 0) {
          const err5 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'trackWeight' },
            message: "must have required property 'trackWeight'",
          };
          if (vErrors === null) {
            vErrors = [err5];
          } else {
            vErrors.push(err5);
          }
          errors++;
        }
        if (data.trackSteps === void 0) {
          const err6 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'trackSteps' },
            message: "must have required property 'trackSteps'",
          };
          if (vErrors === null) {
            vErrors = [err6];
          } else {
            vErrors.push(err6);
          }
          errors++;
        }
        if (data.target !== void 0) {
          if (
            !validate16(data.target, {
              instancePath: instancePath + '/target',
              parentData: data,
              parentDataProperty: 'target',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate16.errors : vErrors.concat(validate16.errors);
            errors = vErrors.length;
          }
        }
        if (data.trackDuration !== void 0) {
          if (typeof data.trackDuration !== 'boolean') {
            const err7 = {
              instancePath: instancePath + '/trackDuration',
              schemaPath: '#/properties/trackDuration/type',
              keyword: 'type',
              params: { type: 'boolean' },
              message: 'must be boolean',
            };
            if (vErrors === null) {
              vErrors = [err7];
            } else {
              vErrors.push(err7);
            }
            errors++;
          }
        }
        if (data.trackDistance !== void 0) {
          if (typeof data.trackDistance !== 'boolean') {
            const err8 = {
              instancePath: instancePath + '/trackDistance',
              schemaPath: '#/properties/trackDistance/type',
              keyword: 'type',
              params: { type: 'boolean' },
              message: 'must be boolean',
            };
            if (vErrors === null) {
              vErrors = [err8];
            } else {
              vErrors.push(err8);
            }
            errors++;
          }
        }
        if (data.trackResistance !== void 0) {
          if (typeof data.trackResistance !== 'boolean') {
            const err9 = {
              instancePath: instancePath + '/trackResistance',
              schemaPath: '#/properties/trackResistance/type',
              keyword: 'type',
              params: { type: 'boolean' },
              message: 'must be boolean',
            };
            if (vErrors === null) {
              vErrors = [err9];
            } else {
              vErrors.push(err9);
            }
            errors++;
          }
        }
        if (data.trackIncline !== void 0) {
          if (typeof data.trackIncline !== 'boolean') {
            const err10 = {
              instancePath: instancePath + '/trackIncline',
              schemaPath: '#/properties/trackIncline/type',
              keyword: 'type',
              params: { type: 'boolean' },
              message: 'must be boolean',
            };
            if (vErrors === null) {
              vErrors = [err10];
            } else {
              vErrors.push(err10);
            }
            errors++;
          }
        }
        if (data.trackWeight !== void 0) {
          if (typeof data.trackWeight !== 'boolean') {
            const err11 = {
              instancePath: instancePath + '/trackWeight',
              schemaPath: '#/properties/trackWeight/type',
              keyword: 'type',
              params: { type: 'boolean' },
              message: 'must be boolean',
            };
            if (vErrors === null) {
              vErrors = [err11];
            } else {
              vErrors.push(err11);
            }
            errors++;
          }
        }
        if (data.trackSteps !== void 0) {
          if (typeof data.trackSteps !== 'boolean') {
            const err12 = {
              instancePath: instancePath + '/trackSteps',
              schemaPath: '#/properties/trackSteps/type',
              keyword: 'type',
              params: { type: 'boolean' },
              message: 'must be boolean',
            };
            if (vErrors === null) {
              vErrors = [err12];
            } else {
              vErrors.push(err12);
            }
            errors++;
          }
        }
        if (data.restBetweenSets !== void 0) {
          if (
            !validate24(data.restBetweenSets, {
              instancePath: instancePath + '/restBetweenSets',
              parentData: data,
              parentDataProperty: 'restBetweenSets',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate24.errors : vErrors.concat(validate24.errors);
            errors = vErrors.length;
          }
        }
      } else {
        const err13 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err13];
        } else {
          vErrors.push(err13);
        }
        errors++;
      }
      validate15.errors = vErrors;
      return errors === 0;
    }
    function validate14(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.type === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'type' },
            message: "must have required property 'type'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.name === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'name' },
            message: "must have required property 'name'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.sets === void 0) {
          const err2 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'sets' },
            message: "must have required property 'sets'",
          };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if (data.notes === void 0) {
          const err3 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'notes' },
            message: "must have required property 'notes'",
          };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        if (data.link === void 0) {
          const err4 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'link' },
            message: "must have required property 'link'",
          };
          if (vErrors === null) {
            vErrors = [err4];
          } else {
            vErrors.push(err4);
          }
          errors++;
        }
        if (data.type !== void 0) {
          let data0 = data.type;
          if (typeof data0 !== 'string') {
            const err5 = {
              instancePath: instancePath + '/type',
              schemaPath: '#/properties/type/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
          if ('CardioExerciseBlueprint' !== data0) {
            const err6 = {
              instancePath: instancePath + '/type',
              schemaPath: '#/properties/type/const',
              keyword: 'const',
              params: { allowedValue: 'CardioExerciseBlueprint' },
              message: 'must be equal to constant',
            };
            if (vErrors === null) {
              vErrors = [err6];
            } else {
              vErrors.push(err6);
            }
            errors++;
          }
        }
        if (data.name !== void 0) {
          if (typeof data.name !== 'string') {
            const err7 = {
              instancePath: instancePath + '/name',
              schemaPath: '#/properties/name/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err7];
            } else {
              vErrors.push(err7);
            }
            errors++;
          }
        }
        if (data.sets !== void 0) {
          let data2 = data.sets;
          if (Array.isArray(data2)) {
            const len0 = data2.length;
            for (let i0 = 0; i0 < len0; i0++) {
              if (
                !validate15(data2[i0], {
                  instancePath: instancePath + '/sets/' + i0,
                  parentData: data2,
                  parentDataProperty: i0,
                  rootData,
                })
              ) {
                vErrors = vErrors === null ? validate15.errors : vErrors.concat(validate15.errors);
                errors = vErrors.length;
              }
            }
          } else {
            const err8 = {
              instancePath: instancePath + '/sets',
              schemaPath: '#/properties/sets/type',
              keyword: 'type',
              params: { type: 'array' },
              message: 'must be array',
            };
            if (vErrors === null) {
              vErrors = [err8];
            } else {
              vErrors.push(err8);
            }
            errors++;
          }
        }
        if (data.notes !== void 0) {
          if (typeof data.notes !== 'string') {
            const err9 = {
              instancePath: instancePath + '/notes',
              schemaPath: '#/properties/notes/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err9];
            } else {
              vErrors.push(err9);
            }
            errors++;
          }
        }
        if (data.link !== void 0) {
          if (typeof data.link !== 'string') {
            const err10 = {
              instancePath: instancePath + '/link',
              schemaPath: '#/properties/link/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err10];
            } else {
              vErrors.push(err10);
            }
            errors++;
          }
        }
      } else {
        const err11 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err11];
        } else {
          vErrors.push(err11);
        }
        errors++;
      }
      validate14.errors = vErrors;
      return errors === 0;
    }
    var schema34 = { type: 'string', enum: ['kilograms', 'pounds', 'nil'] };
    function validate31(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.unit === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'unit' },
            message: "must have required property 'unit'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.value === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'value' },
            message: "must have required property 'value'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.unit !== void 0) {
          let data0 = data.unit;
          if (typeof data0 !== 'string') {
            const err2 = {
              instancePath: instancePath + '/unit',
              schemaPath: '#/definitions/WeightUnit/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err2];
            } else {
              vErrors.push(err2);
            }
            errors++;
          }
          if (!(data0 === 'kilograms' || data0 === 'pounds' || data0 === 'nil')) {
            const err3 = {
              instancePath: instancePath + '/unit',
              schemaPath: '#/definitions/WeightUnit/enum',
              keyword: 'enum',
              params: { allowedValues: schema34.enum },
              message: 'must be equal to one of the allowed values',
            };
            if (vErrors === null) {
              vErrors = [err3];
            } else {
              vErrors.push(err3);
            }
            errors++;
          }
        }
        if (data.value !== void 0) {
          let data1 = data.value;
          if (typeof data1 === 'string') {
            if (!pattern0.test(data1)) {
              const err4 = {
                instancePath: instancePath + '/value',
                schemaPath: '#/definitions/BigNumber/pattern',
                keyword: 'pattern',
                params: { pattern: '^-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?$' },
                message: 'must match pattern "^-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?$"',
              };
              if (vErrors === null) {
                vErrors = [err4];
              } else {
                vErrors.push(err4);
              }
              errors++;
            }
          } else {
            const err5 = {
              instancePath: instancePath + '/value',
              schemaPath: '#/definitions/BigNumber/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
        }
      } else {
        const err6 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
      }
      validate31.errors = vErrors;
      return errors === 0;
    }
    var formats8 = require_formats().fullFormats['date-time'];
    function validate28(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.blueprint === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'blueprint' },
            message: "must have required property 'blueprint'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.blueprint !== void 0) {
          if (
            !validate15(data.blueprint, {
              instancePath: instancePath + '/blueprint',
              parentData: data,
              parentDataProperty: 'blueprint',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate15.errors : vErrors.concat(validate15.errors);
            errors = vErrors.length;
          }
        }
        if (data.completionDateTime !== void 0) {
          let data1 = data.completionDateTime;
          if (typeof data1 === 'string') {
            if (!formats8.validate(data1)) {
              const err1 = {
                instancePath: instancePath + '/completionDateTime',
                schemaPath: '#/definitions/OffsetDateTime/format',
                keyword: 'format',
                params: { format: 'date-time' },
                message: 'must match format "date-time"',
              };
              if (vErrors === null) {
                vErrors = [err1];
              } else {
                vErrors.push(err1);
              }
              errors++;
            }
          } else {
            const err2 = {
              instancePath: instancePath + '/completionDateTime',
              schemaPath: '#/definitions/OffsetDateTime/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err2];
            } else {
              vErrors.push(err2);
            }
            errors++;
          }
        }
        if (data.duration !== void 0) {
          let data2 = data.duration;
          if (typeof data2 === 'string') {
            if (!formats0.test(data2)) {
              const err3 = {
                instancePath: instancePath + '/duration',
                schemaPath: '#/definitions/Duration/format',
                keyword: 'format',
                params: { format: 'duration' },
                message: 'must match format "duration"',
              };
              if (vErrors === null) {
                vErrors = [err3];
              } else {
                vErrors.push(err3);
              }
              errors++;
            }
          } else {
            const err4 = {
              instancePath: instancePath + '/duration',
              schemaPath: '#/definitions/Duration/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
        }
        if (data.distance !== void 0) {
          if (
            !validate19(data.distance, {
              instancePath: instancePath + '/distance',
              parentData: data,
              parentDataProperty: 'distance',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate19.errors : vErrors.concat(validate19.errors);
            errors = vErrors.length;
          }
        }
        if (data.resistance !== void 0) {
          let data4 = data.resistance;
          if (typeof data4 === 'string') {
            if (!pattern0.test(data4)) {
              const err5 = {
                instancePath: instancePath + '/resistance',
                schemaPath: '#/definitions/BigNumber/pattern',
                keyword: 'pattern',
                params: { pattern: '^-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?$' },
                message: 'must match pattern "^-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?$"',
              };
              if (vErrors === null) {
                vErrors = [err5];
              } else {
                vErrors.push(err5);
              }
              errors++;
            }
          } else {
            const err6 = {
              instancePath: instancePath + '/resistance',
              schemaPath: '#/definitions/BigNumber/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err6];
            } else {
              vErrors.push(err6);
            }
            errors++;
          }
        }
        if (data.incline !== void 0) {
          let data5 = data.incline;
          if (typeof data5 === 'string') {
            if (!pattern0.test(data5)) {
              const err7 = {
                instancePath: instancePath + '/incline',
                schemaPath: '#/definitions/BigNumber/pattern',
                keyword: 'pattern',
                params: { pattern: '^-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?$' },
                message: 'must match pattern "^-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?$"',
              };
              if (vErrors === null) {
                vErrors = [err7];
              } else {
                vErrors.push(err7);
              }
              errors++;
            }
          } else {
            const err8 = {
              instancePath: instancePath + '/incline',
              schemaPath: '#/definitions/BigNumber/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err8];
            } else {
              vErrors.push(err8);
            }
            errors++;
          }
        }
        if (data.weight !== void 0) {
          if (
            !validate31(data.weight, {
              instancePath: instancePath + '/weight',
              parentData: data,
              parentDataProperty: 'weight',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate31.errors : vErrors.concat(validate31.errors);
            errors = vErrors.length;
          }
        }
        if (data.steps !== void 0) {
          let data7 = data.steps;
          if (!(typeof data7 == 'number' && !(data7 % 1) && !isNaN(data7) && isFinite(data7))) {
            const err9 = {
              instancePath: instancePath + '/steps',
              schemaPath: '#/properties/steps/type',
              keyword: 'type',
              params: { type: 'integer' },
              message: 'must be integer',
            };
            if (vErrors === null) {
              vErrors = [err9];
            } else {
              vErrors.push(err9);
            }
            errors++;
          }
        }
      } else {
        const err10 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err10];
        } else {
          vErrors.push(err10);
        }
        errors++;
      }
      validate28.errors = vErrors;
      return errors === 0;
    }
    function validate13(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.type === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'type' },
            message: "must have required property 'type'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.blueprint === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'blueprint' },
            message: "must have required property 'blueprint'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.sets === void 0) {
          const err2 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'sets' },
            message: "must have required property 'sets'",
          };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if (data.type !== void 0) {
          let data0 = data.type;
          if (typeof data0 !== 'string') {
            const err3 = {
              instancePath: instancePath + '/type',
              schemaPath: '#/properties/type/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err3];
            } else {
              vErrors.push(err3);
            }
            errors++;
          }
          if ('RecordedCardioExercise' !== data0) {
            const err4 = {
              instancePath: instancePath + '/type',
              schemaPath: '#/properties/type/const',
              keyword: 'const',
              params: { allowedValue: 'RecordedCardioExercise' },
              message: 'must be equal to constant',
            };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
        }
        if (data.blueprint !== void 0) {
          if (
            !validate14(data.blueprint, {
              instancePath: instancePath + '/blueprint',
              parentData: data,
              parentDataProperty: 'blueprint',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate14.errors : vErrors.concat(validate14.errors);
            errors = vErrors.length;
          }
        }
        if (data.sets !== void 0) {
          let data2 = data.sets;
          if (Array.isArray(data2)) {
            const len0 = data2.length;
            for (let i0 = 0; i0 < len0; i0++) {
              if (
                !validate28(data2[i0], {
                  instancePath: instancePath + '/sets/' + i0,
                  parentData: data2,
                  parentDataProperty: i0,
                  rootData,
                })
              ) {
                vErrors = vErrors === null ? validate28.errors : vErrors.concat(validate28.errors);
                errors = vErrors.length;
              }
            }
          } else {
            const err5 = {
              instancePath: instancePath + '/sets',
              schemaPath: '#/properties/sets/type',
              keyword: 'type',
              params: { type: 'array' },
              message: 'must be array',
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
        }
        if (data.notes !== void 0) {
          if (typeof data.notes !== 'string') {
            const err6 = {
              instancePath: instancePath + '/notes',
              schemaPath: '#/properties/notes/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err6];
            } else {
              vErrors.push(err6);
            }
            errors++;
          }
        }
      } else {
        const err7 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err7];
        } else {
          vErrors.push(err7);
        }
        errors++;
      }
      validate13.errors = vErrors;
      return errors === 0;
    }
    var schema48 = { type: 'string', enum: ['none', 'external', 'bodyweight'] };
    function validate36(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.reps === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'reps' },
            message: "must have required property 'reps'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.reps !== void 0) {
          let data0 = data.reps;
          if (data0 && typeof data0 == 'object' && !Array.isArray(data0)) {
            if (data0.min === void 0) {
              const err1 = {
                instancePath: instancePath + '/reps',
                schemaPath: '#/definitions/RepsTarget/required',
                keyword: 'required',
                params: { missingProperty: 'min' },
                message: "must have required property 'min'",
              };
              if (vErrors === null) {
                vErrors = [err1];
              } else {
                vErrors.push(err1);
              }
              errors++;
            }
            if (data0.max === void 0) {
              const err2 = {
                instancePath: instancePath + '/reps',
                schemaPath: '#/definitions/RepsTarget/required',
                keyword: 'required',
                params: { missingProperty: 'max' },
                message: "must have required property 'max'",
              };
              if (vErrors === null) {
                vErrors = [err2];
              } else {
                vErrors.push(err2);
              }
              errors++;
            }
            if (data0.min !== void 0) {
              let data1 = data0.min;
              if (!(typeof data1 == 'number' && !(data1 % 1) && !isNaN(data1) && isFinite(data1))) {
                const err3 = {
                  instancePath: instancePath + '/reps/min',
                  schemaPath: '#/definitions/RepsTarget/properties/min/type',
                  keyword: 'type',
                  params: { type: 'integer' },
                  message: 'must be integer',
                };
                if (vErrors === null) {
                  vErrors = [err3];
                } else {
                  vErrors.push(err3);
                }
                errors++;
              }
            }
            if (data0.max !== void 0) {
              let data2 = data0.max;
              if (!(typeof data2 == 'number' && !(data2 % 1) && !isNaN(data2) && isFinite(data2))) {
                const err4 = {
                  instancePath: instancePath + '/reps/max',
                  schemaPath: '#/definitions/RepsTarget/properties/max/type',
                  keyword: 'type',
                  params: { type: 'integer' },
                  message: 'must be integer',
                };
                if (vErrors === null) {
                  vErrors = [err4];
                } else {
                  vErrors.push(err4);
                }
                errors++;
              }
            }
          } else {
            const err5 = {
              instancePath: instancePath + '/reps',
              schemaPath: '#/definitions/RepsTarget/type',
              keyword: 'type',
              params: { type: 'object' },
              message: 'must be object',
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
        }
      } else {
        const err6 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err6];
        } else {
          vErrors.push(err6);
        }
        errors++;
      }
      validate36.errors = vErrors;
      return errors === 0;
    }
    var schema41 = { type: 'string', enum: ['reps', 'load'], description: 'Which number a rule moves.' };
    var schema45 = {
      type: 'object',
      properties: {
        type: { type: 'string', const: 'lowestSets' },
        pick: { type: 'string', enum: ['first', 'middle', 'last', 'all'] },
      },
      required: ['type', 'pick'],
      description:
        "Ranks by the rule's own axis, so a reps rule picks the smallest target rather than the smallest weight.",
    };
    function validate40(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.type === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'type' },
            message: "must have required property 'type'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        const tag0 = data.type;
        if (typeof tag0 == 'string') {
          if (tag0 === 'allSets') {
            if (data && typeof data == 'object' && !Array.isArray(data)) {
              if (data.type === void 0) {
                const err1 = {
                  instancePath,
                  schemaPath: '#/definitions/AllSetsScope/required',
                  keyword: 'required',
                  params: { missingProperty: 'type' },
                  message: "must have required property 'type'",
                };
                if (vErrors === null) {
                  vErrors = [err1];
                } else {
                  vErrors.push(err1);
                }
                errors++;
              }
              if (data.type !== void 0) {
                let data0 = data.type;
                if (typeof data0 !== 'string') {
                  const err2 = {
                    instancePath: instancePath + '/type',
                    schemaPath: '#/definitions/AllSetsScope/properties/type/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  };
                  if (vErrors === null) {
                    vErrors = [err2];
                  } else {
                    vErrors.push(err2);
                  }
                  errors++;
                }
                if ('allSets' !== data0) {
                  const err3 = {
                    instancePath: instancePath + '/type',
                    schemaPath: '#/definitions/AllSetsScope/properties/type/const',
                    keyword: 'const',
                    params: { allowedValue: 'allSets' },
                    message: 'must be equal to constant',
                  };
                  if (vErrors === null) {
                    vErrors = [err3];
                  } else {
                    vErrors.push(err3);
                  }
                  errors++;
                }
              }
            } else {
              const err4 = {
                instancePath,
                schemaPath: '#/definitions/AllSetsScope/type',
                keyword: 'type',
                params: { type: 'object' },
                message: 'must be object',
              };
              if (vErrors === null) {
                vErrors = [err4];
              } else {
                vErrors.push(err4);
              }
              errors++;
            }
          } else if (tag0 === 'lowestSets') {
            if (data && typeof data == 'object' && !Array.isArray(data)) {
              if (data.type === void 0) {
                const err5 = {
                  instancePath,
                  schemaPath: '#/definitions/LowestSetsScope/required',
                  keyword: 'required',
                  params: { missingProperty: 'type' },
                  message: "must have required property 'type'",
                };
                if (vErrors === null) {
                  vErrors = [err5];
                } else {
                  vErrors.push(err5);
                }
                errors++;
              }
              if (data.pick === void 0) {
                const err6 = {
                  instancePath,
                  schemaPath: '#/definitions/LowestSetsScope/required',
                  keyword: 'required',
                  params: { missingProperty: 'pick' },
                  message: "must have required property 'pick'",
                };
                if (vErrors === null) {
                  vErrors = [err6];
                } else {
                  vErrors.push(err6);
                }
                errors++;
              }
              if (data.type !== void 0) {
                let data1 = data.type;
                if (typeof data1 !== 'string') {
                  const err7 = {
                    instancePath: instancePath + '/type',
                    schemaPath: '#/definitions/LowestSetsScope/properties/type/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  };
                  if (vErrors === null) {
                    vErrors = [err7];
                  } else {
                    vErrors.push(err7);
                  }
                  errors++;
                }
                if ('lowestSets' !== data1) {
                  const err8 = {
                    instancePath: instancePath + '/type',
                    schemaPath: '#/definitions/LowestSetsScope/properties/type/const',
                    keyword: 'const',
                    params: { allowedValue: 'lowestSets' },
                    message: 'must be equal to constant',
                  };
                  if (vErrors === null) {
                    vErrors = [err8];
                  } else {
                    vErrors.push(err8);
                  }
                  errors++;
                }
              }
              if (data.pick !== void 0) {
                let data2 = data.pick;
                if (typeof data2 !== 'string') {
                  const err9 = {
                    instancePath: instancePath + '/pick',
                    schemaPath: '#/definitions/LowestSetsScope/properties/pick/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  };
                  if (vErrors === null) {
                    vErrors = [err9];
                  } else {
                    vErrors.push(err9);
                  }
                  errors++;
                }
                if (!(data2 === 'first' || data2 === 'middle' || data2 === 'last' || data2 === 'all')) {
                  const err10 = {
                    instancePath: instancePath + '/pick',
                    schemaPath: '#/definitions/LowestSetsScope/properties/pick/enum',
                    keyword: 'enum',
                    params: { allowedValues: schema45.properties.pick.enum },
                    message: 'must be equal to one of the allowed values',
                  };
                  if (vErrors === null) {
                    vErrors = [err10];
                  } else {
                    vErrors.push(err10);
                  }
                  errors++;
                }
              }
            } else {
              const err11 = {
                instancePath,
                schemaPath: '#/definitions/LowestSetsScope/type',
                keyword: 'type',
                params: { type: 'object' },
                message: 'must be object',
              };
              if (vErrors === null) {
                vErrors = [err11];
              } else {
                vErrors.push(err11);
              }
              errors++;
            }
          } else {
            const err12 = {
              instancePath,
              schemaPath: '#/discriminator',
              keyword: 'discriminator',
              params: { error: 'mapping', tag: 'type', tagValue: tag0 },
              message: 'value of tag "type" must be in oneOf',
            };
            if (vErrors === null) {
              vErrors = [err12];
            } else {
              vErrors.push(err12);
            }
            errors++;
          }
        } else {
          const err13 = {
            instancePath,
            schemaPath: '#/discriminator',
            keyword: 'discriminator',
            params: { error: 'tag', tag: 'type', tagValue: tag0 },
            message: 'tag "type" must be string',
          };
          if (vErrors === null) {
            vErrors = [err13];
          } else {
            vErrors.push(err13);
          }
          errors++;
        }
      } else {
        const err14 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err14];
        } else {
          vErrors.push(err14);
        }
        errors++;
      }
      validate40.errors = vErrors;
      return errors === 0;
    }
    function validate39(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.axis === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'axis' },
            message: "must have required property 'axis'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.step === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'step' },
            message: "must have required property 'step'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.scope === void 0) {
          const err2 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'scope' },
            message: "must have required property 'scope'",
          };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if (data.trigger === void 0) {
          const err3 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'trigger' },
            message: "must have required property 'trigger'",
          };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        if (data.axis !== void 0) {
          let data0 = data.axis;
          if (typeof data0 !== 'string') {
            const err4 = {
              instancePath: instancePath + '/axis',
              schemaPath: '#/definitions/ProgressionAxis/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
          if (!(data0 === 'reps' || data0 === 'load')) {
            const err5 = {
              instancePath: instancePath + '/axis',
              schemaPath: '#/definitions/ProgressionAxis/enum',
              keyword: 'enum',
              params: { allowedValues: schema41.enum },
              message: 'must be equal to one of the allowed values',
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
        }
        if (data.step !== void 0) {
          let data1 = data.step;
          if (typeof data1 === 'string') {
            if (!pattern0.test(data1)) {
              const err6 = {
                instancePath: instancePath + '/step',
                schemaPath: '#/definitions/BigNumber/pattern',
                keyword: 'pattern',
                params: { pattern: '^-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?$' },
                message: 'must match pattern "^-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?$"',
              };
              if (vErrors === null) {
                vErrors = [err6];
              } else {
                vErrors.push(err6);
              }
              errors++;
            }
          } else {
            const err7 = {
              instancePath: instancePath + '/step',
              schemaPath: '#/definitions/BigNumber/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err7];
            } else {
              vErrors.push(err7);
            }
            errors++;
          }
        }
        if (data.scope !== void 0) {
          if (
            !validate40(data.scope, {
              instancePath: instancePath + '/scope',
              parentData: data,
              parentDataProperty: 'scope',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate40.errors : vErrors.concat(validate40.errors);
            errors = vErrors.length;
          }
        }
        if (data.ceiling !== void 0) {
          let data3 = data.ceiling;
          if (typeof data3 === 'string') {
            if (!pattern0.test(data3)) {
              const err8 = {
                instancePath: instancePath + '/ceiling',
                schemaPath: '#/definitions/BigNumber/pattern',
                keyword: 'pattern',
                params: { pattern: '^-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?$' },
                message: 'must match pattern "^-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?$"',
              };
              if (vErrors === null) {
                vErrors = [err8];
              } else {
                vErrors.push(err8);
              }
              errors++;
            }
          } else {
            const err9 = {
              instancePath: instancePath + '/ceiling',
              schemaPath: '#/definitions/BigNumber/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err9];
            } else {
              vErrors.push(err9);
            }
            errors++;
          }
        }
        if (data.onCeiling !== void 0) {
          let data4 = data.onCeiling;
          if (typeof data4 !== 'string') {
            const err10 = {
              instancePath: instancePath + '/onCeiling',
              schemaPath: '#/properties/onCeiling/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err10];
            } else {
              vErrors.push(err10);
            }
            errors++;
          }
          if ('reset' !== data4) {
            const err11 = {
              instancePath: instancePath + '/onCeiling',
              schemaPath: '#/properties/onCeiling/const',
              keyword: 'const',
              params: { allowedValue: 'reset' },
              message: 'must be equal to constant',
            };
            if (vErrors === null) {
              vErrors = [err11];
            } else {
              vErrors.push(err11);
            }
            errors++;
          }
        }
        if (data.trigger !== void 0) {
          let data5 = data.trigger;
          if (typeof data5 !== 'string') {
            const err12 = {
              instancePath: instancePath + '/trigger',
              schemaPath: '#/definitions/SuccessRule/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err12];
            } else {
              vErrors.push(err12);
            }
            errors++;
          }
          if ('allSetsMetTarget' !== data5) {
            const err13 = {
              instancePath: instancePath + '/trigger',
              schemaPath: '#/definitions/SuccessRule/const',
              keyword: 'const',
              params: { allowedValue: 'allSetsMetTarget' },
              message: 'must be equal to constant',
            };
            if (vErrors === null) {
              vErrors = [err13];
            } else {
              vErrors.push(err13);
            }
            errors++;
          }
        }
      } else {
        const err14 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err14];
        } else {
          vErrors.push(err14);
        }
        errors++;
      }
      validate39.errors = vErrors;
      return errors === 0;
    }
    function validate35(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.type === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'type' },
            message: "must have required property 'type'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.name === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'name' },
            message: "must have required property 'name'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.plannedSets === void 0) {
          const err2 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'plannedSets' },
            message: "must have required property 'plannedSets'",
          };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if (data.restBetweenSets === void 0) {
          const err3 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'restBetweenSets' },
            message: "must have required property 'restBetweenSets'",
          };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        if (data.supersetWithNext === void 0) {
          const err4 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'supersetWithNext' },
            message: "must have required property 'supersetWithNext'",
          };
          if (vErrors === null) {
            vErrors = [err4];
          } else {
            vErrors.push(err4);
          }
          errors++;
        }
        if (data.notes === void 0) {
          const err5 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'notes' },
            message: "must have required property 'notes'",
          };
          if (vErrors === null) {
            vErrors = [err5];
          } else {
            vErrors.push(err5);
          }
          errors++;
        }
        if (data.link === void 0) {
          const err6 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'link' },
            message: "must have required property 'link'",
          };
          if (vErrors === null) {
            vErrors = [err6];
          } else {
            vErrors.push(err6);
          }
          errors++;
        }
        if (data.progression === void 0) {
          const err7 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'progression' },
            message: "must have required property 'progression'",
          };
          if (vErrors === null) {
            vErrors = [err7];
          } else {
            vErrors.push(err7);
          }
          errors++;
        }
        if (data.resistance === void 0) {
          const err8 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'resistance' },
            message: "must have required property 'resistance'",
          };
          if (vErrors === null) {
            vErrors = [err8];
          } else {
            vErrors.push(err8);
          }
          errors++;
        }
        if (data.type !== void 0) {
          let data0 = data.type;
          if (typeof data0 !== 'string') {
            const err9 = {
              instancePath: instancePath + '/type',
              schemaPath: '#/properties/type/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err9];
            } else {
              vErrors.push(err9);
            }
            errors++;
          }
          if ('WeightedExerciseBlueprint' !== data0) {
            const err10 = {
              instancePath: instancePath + '/type',
              schemaPath: '#/properties/type/const',
              keyword: 'const',
              params: { allowedValue: 'WeightedExerciseBlueprint' },
              message: 'must be equal to constant',
            };
            if (vErrors === null) {
              vErrors = [err10];
            } else {
              vErrors.push(err10);
            }
            errors++;
          }
        }
        if (data.name !== void 0) {
          if (typeof data.name !== 'string') {
            const err11 = {
              instancePath: instancePath + '/name',
              schemaPath: '#/properties/name/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err11];
            } else {
              vErrors.push(err11);
            }
            errors++;
          }
        }
        if (data.plannedSets !== void 0) {
          let data2 = data.plannedSets;
          if (Array.isArray(data2)) {
            const len0 = data2.length;
            for (let i0 = 0; i0 < len0; i0++) {
              if (
                !validate36(data2[i0], {
                  instancePath: instancePath + '/plannedSets/' + i0,
                  parentData: data2,
                  parentDataProperty: i0,
                  rootData,
                })
              ) {
                vErrors = vErrors === null ? validate36.errors : vErrors.concat(validate36.errors);
                errors = vErrors.length;
              }
            }
          } else {
            const err12 = {
              instancePath: instancePath + '/plannedSets',
              schemaPath: '#/properties/plannedSets/type',
              keyword: 'type',
              params: { type: 'array' },
              message: 'must be array',
            };
            if (vErrors === null) {
              vErrors = [err12];
            } else {
              vErrors.push(err12);
            }
            errors++;
          }
        }
        if (data.restBetweenSets !== void 0) {
          if (
            !validate24(data.restBetweenSets, {
              instancePath: instancePath + '/restBetweenSets',
              parentData: data,
              parentDataProperty: 'restBetweenSets',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate24.errors : vErrors.concat(validate24.errors);
            errors = vErrors.length;
          }
        }
        if (data.supersetWithNext !== void 0) {
          if (typeof data.supersetWithNext !== 'boolean') {
            const err13 = {
              instancePath: instancePath + '/supersetWithNext',
              schemaPath: '#/properties/supersetWithNext/type',
              keyword: 'type',
              params: { type: 'boolean' },
              message: 'must be boolean',
            };
            if (vErrors === null) {
              vErrors = [err13];
            } else {
              vErrors.push(err13);
            }
            errors++;
          }
        }
        if (data.notes !== void 0) {
          if (typeof data.notes !== 'string') {
            const err14 = {
              instancePath: instancePath + '/notes',
              schemaPath: '#/properties/notes/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err14];
            } else {
              vErrors.push(err14);
            }
            errors++;
          }
        }
        if (data.link !== void 0) {
          if (typeof data.link !== 'string') {
            const err15 = {
              instancePath: instancePath + '/link',
              schemaPath: '#/properties/link/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err15];
            } else {
              vErrors.push(err15);
            }
            errors++;
          }
        }
        if (data.progression !== void 0) {
          let data8 = data.progression;
          if (Array.isArray(data8)) {
            const len1 = data8.length;
            for (let i1 = 0; i1 < len1; i1++) {
              if (
                !validate39(data8[i1], {
                  instancePath: instancePath + '/progression/' + i1,
                  parentData: data8,
                  parentDataProperty: i1,
                  rootData,
                })
              ) {
                vErrors = vErrors === null ? validate39.errors : vErrors.concat(validate39.errors);
                errors = vErrors.length;
              }
            }
          } else {
            const err16 = {
              instancePath: instancePath + '/progression',
              schemaPath: '#/properties/progression/type',
              keyword: 'type',
              params: { type: 'array' },
              message: 'must be array',
            };
            if (vErrors === null) {
              vErrors = [err16];
            } else {
              vErrors.push(err16);
            }
            errors++;
          }
        }
        if (data.resistance !== void 0) {
          let data10 = data.resistance;
          if (typeof data10 !== 'string') {
            const err17 = {
              instancePath: instancePath + '/resistance',
              schemaPath: '#/definitions/Resistance/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err17];
            } else {
              vErrors.push(err17);
            }
            errors++;
          }
          if (!(data10 === 'none' || data10 === 'external' || data10 === 'bodyweight')) {
            const err18 = {
              instancePath: instancePath + '/resistance',
              schemaPath: '#/definitions/Resistance/enum',
              keyword: 'enum',
              params: { allowedValues: schema48.enum },
              message: 'must be equal to one of the allowed values',
            };
            if (vErrors === null) {
              vErrors = [err18];
            } else {
              vErrors.push(err18);
            }
            errors++;
          }
        }
      } else {
        const err19 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err19];
        } else {
          vErrors.push(err19);
        }
        errors++;
      }
      validate35.errors = vErrors;
      return errors === 0;
    }
    function validate46(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.repsCompleted === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'repsCompleted' },
            message: "must have required property 'repsCompleted'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.completionDateTime === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'completionDateTime' },
            message: "must have required property 'completionDateTime'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.repsCompleted !== void 0) {
          let data0 = data.repsCompleted;
          if (!(typeof data0 == 'number' && !(data0 % 1) && !isNaN(data0) && isFinite(data0))) {
            const err2 = {
              instancePath: instancePath + '/repsCompleted',
              schemaPath: '#/properties/repsCompleted/type',
              keyword: 'type',
              params: { type: 'integer' },
              message: 'must be integer',
            };
            if (vErrors === null) {
              vErrors = [err2];
            } else {
              vErrors.push(err2);
            }
            errors++;
          }
        }
        if (data.completionDateTime !== void 0) {
          let data1 = data.completionDateTime;
          if (typeof data1 === 'string') {
            if (!formats8.validate(data1)) {
              const err3 = {
                instancePath: instancePath + '/completionDateTime',
                schemaPath: '#/definitions/OffsetDateTime/format',
                keyword: 'format',
                params: { format: 'date-time' },
                message: 'must match format "date-time"',
              };
              if (vErrors === null) {
                vErrors = [err3];
              } else {
                vErrors.push(err3);
              }
              errors++;
            }
          } else {
            const err4 = {
              instancePath: instancePath + '/completionDateTime',
              schemaPath: '#/definitions/OffsetDateTime/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
        }
      } else {
        const err5 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err5];
        } else {
          vErrors.push(err5);
        }
        errors++;
      }
      validate46.errors = vErrors;
      return errors === 0;
    }
    function validate44(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.target === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'target' },
            message: "must have required property 'target'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.weight === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'weight' },
            message: "must have required property 'weight'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.target !== void 0) {
          if (
            !validate36(data.target, {
              instancePath: instancePath + '/target',
              parentData: data,
              parentDataProperty: 'target',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate36.errors : vErrors.concat(validate36.errors);
            errors = vErrors.length;
          }
        }
        if (data.set !== void 0) {
          if (
            !validate46(data.set, {
              instancePath: instancePath + '/set',
              parentData: data,
              parentDataProperty: 'set',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
            errors = vErrors.length;
          }
        }
        if (data.weight !== void 0) {
          if (
            !validate31(data.weight, {
              instancePath: instancePath + '/weight',
              parentData: data,
              parentDataProperty: 'weight',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate31.errors : vErrors.concat(validate31.errors);
            errors = vErrors.length;
          }
        }
      } else {
        const err2 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err2];
        } else {
          vErrors.push(err2);
        }
        errors++;
      }
      validate44.errors = vErrors;
      return errors === 0;
    }
    function validate34(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.type === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'type' },
            message: "must have required property 'type'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.blueprint === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'blueprint' },
            message: "must have required property 'blueprint'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.potentialSets === void 0) {
          const err2 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'potentialSets' },
            message: "must have required property 'potentialSets'",
          };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if (data.type !== void 0) {
          let data0 = data.type;
          if (typeof data0 !== 'string') {
            const err3 = {
              instancePath: instancePath + '/type',
              schemaPath: '#/properties/type/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err3];
            } else {
              vErrors.push(err3);
            }
            errors++;
          }
          if ('RecordedWeightedExercise' !== data0) {
            const err4 = {
              instancePath: instancePath + '/type',
              schemaPath: '#/properties/type/const',
              keyword: 'const',
              params: { allowedValue: 'RecordedWeightedExercise' },
              message: 'must be equal to constant',
            };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
        }
        if (data.blueprint !== void 0) {
          if (
            !validate35(data.blueprint, {
              instancePath: instancePath + '/blueprint',
              parentData: data,
              parentDataProperty: 'blueprint',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate35.errors : vErrors.concat(validate35.errors);
            errors = vErrors.length;
          }
        }
        if (data.potentialSets !== void 0) {
          let data2 = data.potentialSets;
          if (Array.isArray(data2)) {
            const len0 = data2.length;
            for (let i0 = 0; i0 < len0; i0++) {
              if (
                !validate44(data2[i0], {
                  instancePath: instancePath + '/potentialSets/' + i0,
                  parentData: data2,
                  parentDataProperty: i0,
                  rootData,
                })
              ) {
                vErrors = vErrors === null ? validate44.errors : vErrors.concat(validate44.errors);
                errors = vErrors.length;
              }
            }
          } else {
            const err5 = {
              instancePath: instancePath + '/potentialSets',
              schemaPath: '#/properties/potentialSets/type',
              keyword: 'type',
              params: { type: 'array' },
              message: 'must be array',
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
        }
        if (data.notes !== void 0) {
          if (typeof data.notes !== 'string') {
            const err6 = {
              instancePath: instancePath + '/notes',
              schemaPath: '#/properties/notes/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err6];
            } else {
              vErrors.push(err6);
            }
            errors++;
          }
        }
      } else {
        const err7 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err7];
        } else {
          vErrors.push(err7);
        }
        errors++;
      }
      validate34.errors = vErrors;
      return errors === 0;
    }
    function validate12(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.type === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'type' },
            message: "must have required property 'type'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        const tag0 = data.type;
        if (typeof tag0 == 'string') {
          if (tag0 === 'RecordedCardioExercise') {
            if (!validate13(data, { instancePath, parentData, parentDataProperty, rootData })) {
              vErrors = vErrors === null ? validate13.errors : vErrors.concat(validate13.errors);
              errors = vErrors.length;
            }
          } else if (tag0 === 'RecordedWeightedExercise') {
            if (!validate34(data, { instancePath, parentData, parentDataProperty, rootData })) {
              vErrors = vErrors === null ? validate34.errors : vErrors.concat(validate34.errors);
              errors = vErrors.length;
            }
          } else {
            const err1 = {
              instancePath,
              schemaPath: '#/discriminator',
              keyword: 'discriminator',
              params: { error: 'mapping', tag: 'type', tagValue: tag0 },
              message: 'value of tag "type" must be in oneOf',
            };
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          }
        } else {
          const err2 = {
            instancePath,
            schemaPath: '#/discriminator',
            keyword: 'discriminator',
            params: { error: 'tag', tag: 'type', tagValue: tag0 },
            message: 'tag "type" must be string',
          };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
      } else {
        const err3 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err3];
        } else {
          vErrors.push(err3);
        }
        errors++;
      }
      validate12.errors = vErrors;
      return errors === 0;
    }
    var formats14 = require_formats().fullFormats.date;
    function validate11(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.version === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'version' },
            message: "must have required property 'version'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.id === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'id' },
            message: "must have required property 'id'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.blueprint === void 0) {
          const err2 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'blueprint' },
            message: "must have required property 'blueprint'",
          };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if (data.recordedExercises === void 0) {
          const err3 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'recordedExercises' },
            message: "must have required property 'recordedExercises'",
          };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        if (data.date === void 0) {
          const err4 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'date' },
            message: "must have required property 'date'",
          };
          if (vErrors === null) {
            vErrors = [err4];
          } else {
            vErrors.push(err4);
          }
          errors++;
        }
        if (data.version !== void 0) {
          let data0 = data.version;
          if (!(typeof data0 == 'number' && isFinite(data0))) {
            const err5 = {
              instancePath: instancePath + '/version',
              schemaPath: '#/properties/version/type',
              keyword: 'type',
              params: { type: 'number' },
              message: 'must be number',
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
          if (7 !== data0) {
            const err6 = {
              instancePath: instancePath + '/version',
              schemaPath: '#/properties/version/const',
              keyword: 'const',
              params: { allowedValue: 7 },
              message: 'must be equal to constant',
            };
            if (vErrors === null) {
              vErrors = [err6];
            } else {
              vErrors.push(err6);
            }
            errors++;
          }
        }
        if (data.id !== void 0) {
          if (typeof data.id !== 'string') {
            const err7 = {
              instancePath: instancePath + '/id',
              schemaPath: '#/properties/id/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err7];
            } else {
              vErrors.push(err7);
            }
            errors++;
          }
        }
        if (data.blueprint !== void 0) {
          let data2 = data.blueprint;
          if (data2 && typeof data2 == 'object' && !Array.isArray(data2)) {
            if (data2.name === void 0) {
              const err8 = {
                instancePath: instancePath + '/blueprint',
                schemaPath: '#/properties/blueprint/required',
                keyword: 'required',
                params: { missingProperty: 'name' },
                message: "must have required property 'name'",
              };
              if (vErrors === null) {
                vErrors = [err8];
              } else {
                vErrors.push(err8);
              }
              errors++;
            }
            if (data2.notes === void 0) {
              const err9 = {
                instancePath: instancePath + '/blueprint',
                schemaPath: '#/properties/blueprint/required',
                keyword: 'required',
                params: { missingProperty: 'notes' },
                message: "must have required property 'notes'",
              };
              if (vErrors === null) {
                vErrors = [err9];
              } else {
                vErrors.push(err9);
              }
              errors++;
            }
            if (data2.name !== void 0) {
              if (typeof data2.name !== 'string') {
                const err10 = {
                  instancePath: instancePath + '/blueprint/name',
                  schemaPath: '#/properties/blueprint/properties/name/type',
                  keyword: 'type',
                  params: { type: 'string' },
                  message: 'must be string',
                };
                if (vErrors === null) {
                  vErrors = [err10];
                } else {
                  vErrors.push(err10);
                }
                errors++;
              }
            }
            if (data2.notes !== void 0) {
              if (typeof data2.notes !== 'string') {
                const err11 = {
                  instancePath: instancePath + '/blueprint/notes',
                  schemaPath: '#/properties/blueprint/properties/notes/type',
                  keyword: 'type',
                  params: { type: 'string' },
                  message: 'must be string',
                };
                if (vErrors === null) {
                  vErrors = [err11];
                } else {
                  vErrors.push(err11);
                }
                errors++;
              }
            }
          } else {
            const err12 = {
              instancePath: instancePath + '/blueprint',
              schemaPath: '#/properties/blueprint/type',
              keyword: 'type',
              params: { type: 'object' },
              message: 'must be object',
            };
            if (vErrors === null) {
              vErrors = [err12];
            } else {
              vErrors.push(err12);
            }
            errors++;
          }
        }
        if (data.recordedExercises !== void 0) {
          let data5 = data.recordedExercises;
          if (Array.isArray(data5)) {
            const len0 = data5.length;
            for (let i0 = 0; i0 < len0; i0++) {
              if (
                !validate12(data5[i0], {
                  instancePath: instancePath + '/recordedExercises/' + i0,
                  parentData: data5,
                  parentDataProperty: i0,
                  rootData,
                })
              ) {
                vErrors = vErrors === null ? validate12.errors : vErrors.concat(validate12.errors);
                errors = vErrors.length;
              }
            }
          } else {
            const err13 = {
              instancePath: instancePath + '/recordedExercises',
              schemaPath: '#/properties/recordedExercises/type',
              keyword: 'type',
              params: { type: 'array' },
              message: 'must be array',
            };
            if (vErrors === null) {
              vErrors = [err13];
            } else {
              vErrors.push(err13);
            }
            errors++;
          }
        }
        if (data.date !== void 0) {
          let data7 = data.date;
          if (typeof data7 === 'string') {
            if (!formats14.validate(data7)) {
              const err14 = {
                instancePath: instancePath + '/date',
                schemaPath: '#/definitions/LocalDate/format',
                keyword: 'format',
                params: { format: 'date' },
                message: 'must match format "date"',
              };
              if (vErrors === null) {
                vErrors = [err14];
              } else {
                vErrors.push(err14);
              }
              errors++;
            }
          } else {
            const err15 = {
              instancePath: instancePath + '/date',
              schemaPath: '#/definitions/LocalDate/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err15];
            } else {
              vErrors.push(err15);
            }
            errors++;
          }
        }
        if (data.bodyweight !== void 0) {
          if (
            !validate31(data.bodyweight, {
              instancePath: instancePath + '/bodyweight',
              parentData: data,
              parentDataProperty: 'bodyweight',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate31.errors : vErrors.concat(validate31.errors);
            errors = vErrors.length;
          }
        }
      } else {
        const err16 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err16];
        } else {
          vErrors.push(err16);
        }
        errors++;
      }
      validate11.errors = vErrors;
      return errors === 0;
    }
    function validate57(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.type === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'type' },
            message: "must have required property 'type'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        const tag0 = data.type;
        if (typeof tag0 == 'string') {
          if (tag0 === 'WeightedExerciseBlueprint') {
            if (!validate35(data, { instancePath, parentData, parentDataProperty, rootData })) {
              vErrors = vErrors === null ? validate35.errors : vErrors.concat(validate35.errors);
              errors = vErrors.length;
            }
          } else if (tag0 === 'CardioExerciseBlueprint') {
            if (!validate14(data, { instancePath, parentData, parentDataProperty, rootData })) {
              vErrors = vErrors === null ? validate14.errors : vErrors.concat(validate14.errors);
              errors = vErrors.length;
            }
          } else {
            const err1 = {
              instancePath,
              schemaPath: '#/discriminator',
              keyword: 'discriminator',
              params: { error: 'mapping', tag: 'type', tagValue: tag0 },
              message: 'value of tag "type" must be in oneOf',
            };
            if (vErrors === null) {
              vErrors = [err1];
            } else {
              vErrors.push(err1);
            }
            errors++;
          }
        } else {
          const err2 = {
            instancePath,
            schemaPath: '#/discriminator',
            keyword: 'discriminator',
            params: { error: 'tag', tag: 'type', tagValue: tag0 },
            message: 'tag "type" must be string',
          };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
      } else {
        const err3 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err3];
        } else {
          vErrors.push(err3);
        }
        errors++;
      }
      validate57.errors = vErrors;
      return errors === 0;
    }
    function validate56(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.version === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'version' },
            message: "must have required property 'version'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.name === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'name' },
            message: "must have required property 'name'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.exercises === void 0) {
          const err2 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'exercises' },
            message: "must have required property 'exercises'",
          };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if (data.notes === void 0) {
          const err3 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'notes' },
            message: "must have required property 'notes'",
          };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        if (data.version !== void 0) {
          let data0 = data.version;
          if (!(typeof data0 == 'number' && isFinite(data0))) {
            const err4 = {
              instancePath: instancePath + '/version',
              schemaPath: '#/properties/version/type',
              keyword: 'type',
              params: { type: 'number' },
              message: 'must be number',
            };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
          if (6 !== data0) {
            const err5 = {
              instancePath: instancePath + '/version',
              schemaPath: '#/properties/version/const',
              keyword: 'const',
              params: { allowedValue: 6 },
              message: 'must be equal to constant',
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
        }
        if (data.name !== void 0) {
          if (typeof data.name !== 'string') {
            const err6 = {
              instancePath: instancePath + '/name',
              schemaPath: '#/properties/name/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err6];
            } else {
              vErrors.push(err6);
            }
            errors++;
          }
        }
        if (data.exercises !== void 0) {
          let data2 = data.exercises;
          if (Array.isArray(data2)) {
            const len0 = data2.length;
            for (let i0 = 0; i0 < len0; i0++) {
              if (
                !validate57(data2[i0], {
                  instancePath: instancePath + '/exercises/' + i0,
                  parentData: data2,
                  parentDataProperty: i0,
                  rootData,
                })
              ) {
                vErrors = vErrors === null ? validate57.errors : vErrors.concat(validate57.errors);
                errors = vErrors.length;
              }
            }
          } else {
            const err7 = {
              instancePath: instancePath + '/exercises',
              schemaPath: '#/properties/exercises/type',
              keyword: 'type',
              params: { type: 'array' },
              message: 'must be array',
            };
            if (vErrors === null) {
              vErrors = [err7];
            } else {
              vErrors.push(err7);
            }
            errors++;
          }
        }
        if (data.notes !== void 0) {
          if (typeof data.notes !== 'string') {
            const err8 = {
              instancePath: instancePath + '/notes',
              schemaPath: '#/properties/notes/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err8];
            } else {
              vErrors.push(err8);
            }
            errors++;
          }
        }
      } else {
        const err9 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err9];
        } else {
          vErrors.push(err9);
        }
        errors++;
      }
      validate56.errors = vErrors;
      return errors === 0;
    }
    function validate55(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.version === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'version' },
            message: "must have required property 'version'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.name === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'name' },
            message: "must have required property 'name'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.sessions === void 0) {
          const err2 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'sessions' },
            message: "must have required property 'sessions'",
          };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if (data.lastEdited === void 0) {
          const err3 = {
            instancePath,
            schemaPath: '#/required',
            keyword: 'required',
            params: { missingProperty: 'lastEdited' },
            message: "must have required property 'lastEdited'",
          };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        if (data.version !== void 0) {
          let data0 = data.version;
          if (!(typeof data0 == 'number' && isFinite(data0))) {
            const err4 = {
              instancePath: instancePath + '/version',
              schemaPath: '#/properties/version/type',
              keyword: 'type',
              params: { type: 'number' },
              message: 'must be number',
            };
            if (vErrors === null) {
              vErrors = [err4];
            } else {
              vErrors.push(err4);
            }
            errors++;
          }
          if (3 !== data0) {
            const err5 = {
              instancePath: instancePath + '/version',
              schemaPath: '#/properties/version/const',
              keyword: 'const',
              params: { allowedValue: 3 },
              message: 'must be equal to constant',
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
        }
        if (data.name !== void 0) {
          if (typeof data.name !== 'string') {
            const err6 = {
              instancePath: instancePath + '/name',
              schemaPath: '#/properties/name/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err6];
            } else {
              vErrors.push(err6);
            }
            errors++;
          }
        }
        if (data.sessions !== void 0) {
          let data2 = data.sessions;
          if (Array.isArray(data2)) {
            const len0 = data2.length;
            for (let i0 = 0; i0 < len0; i0++) {
              if (
                !validate56(data2[i0], {
                  instancePath: instancePath + '/sessions/' + i0,
                  parentData: data2,
                  parentDataProperty: i0,
                  rootData,
                })
              ) {
                vErrors = vErrors === null ? validate56.errors : vErrors.concat(validate56.errors);
                errors = vErrors.length;
              }
            }
          } else {
            const err7 = {
              instancePath: instancePath + '/sessions',
              schemaPath: '#/properties/sessions/type',
              keyword: 'type',
              params: { type: 'array' },
              message: 'must be array',
            };
            if (vErrors === null) {
              vErrors = [err7];
            } else {
              vErrors.push(err7);
            }
            errors++;
          }
        }
        if (data.lastEdited !== void 0) {
          let data4 = data.lastEdited;
          if (typeof data4 === 'string') {
            if (!formats14.validate(data4)) {
              const err8 = {
                instancePath: instancePath + '/lastEdited',
                schemaPath: '#/definitions/LocalDate/format',
                keyword: 'format',
                params: { format: 'date' },
                message: 'must match format "date"',
              };
              if (vErrors === null) {
                vErrors = [err8];
              } else {
                vErrors.push(err8);
              }
              errors++;
            }
          } else {
            const err9 = {
              instancePath: instancePath + '/lastEdited',
              schemaPath: '#/definitions/LocalDate/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err9];
            } else {
              vErrors.push(err9);
            }
            errors++;
          }
        }
      } else {
        const err10 = {
          instancePath,
          schemaPath: '#/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err10];
        } else {
          vErrors.push(err10);
        }
        errors++;
      }
      validate55.errors = vErrors;
      return errors === 0;
    }
    function validate10(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
      let vErrors = null;
      let errors = 0;
      const _errs0 = errors;
      let valid0 = false;
      const _errs1 = errors;
      if (data && typeof data == 'object' && !Array.isArray(data)) {
        if (data.data === void 0) {
          const err0 = {
            instancePath,
            schemaPath: '#/anyOf/0/required',
            keyword: 'required',
            params: { missingProperty: 'data' },
            message: "must have required property 'data'",
          };
          if (vErrors === null) {
            vErrors = [err0];
          } else {
            vErrors.push(err0);
          }
          errors++;
        }
        if (data.deleted === void 0) {
          const err1 = {
            instancePath,
            schemaPath: '#/anyOf/0/required',
            keyword: 'required',
            params: { missingProperty: 'deleted' },
            message: "must have required property 'deleted'",
          };
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
        if (data.id === void 0) {
          const err2 = {
            instancePath,
            schemaPath: '#/anyOf/0/required',
            keyword: 'required',
            params: { missingProperty: 'id' },
            message: "must have required property 'id'",
          };
          if (vErrors === null) {
            vErrors = [err2];
          } else {
            vErrors.push(err2);
          }
          errors++;
        }
        if (data.kind === void 0) {
          const err3 = {
            instancePath,
            schemaPath: '#/anyOf/0/required',
            keyword: 'required',
            params: { missingProperty: 'kind' },
            message: "must have required property 'kind'",
          };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
        if (data.version === void 0) {
          const err4 = {
            instancePath,
            schemaPath: '#/anyOf/0/required',
            keyword: 'required',
            params: { missingProperty: 'version' },
            message: "must have required property 'version'",
          };
          if (vErrors === null) {
            vErrors = [err4];
          } else {
            vErrors.push(err4);
          }
          errors++;
        }
        if (data.kind !== void 0) {
          let data0 = data.kind;
          if (typeof data0 !== 'string') {
            const err5 = {
              instancePath: instancePath + '/kind',
              schemaPath: '#/anyOf/0/properties/kind/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err5];
            } else {
              vErrors.push(err5);
            }
            errors++;
          }
          if ('session' !== data0) {
            const err6 = {
              instancePath: instancePath + '/kind',
              schemaPath: '#/anyOf/0/properties/kind/const',
              keyword: 'const',
              params: { allowedValue: 'session' },
              message: 'must be equal to constant',
            };
            if (vErrors === null) {
              vErrors = [err6];
            } else {
              vErrors.push(err6);
            }
            errors++;
          }
        }
        if (data.deleted !== void 0) {
          let data1 = data.deleted;
          if (typeof data1 !== 'boolean') {
            const err7 = {
              instancePath: instancePath + '/deleted',
              schemaPath: '#/anyOf/0/properties/deleted/type',
              keyword: 'type',
              params: { type: 'boolean' },
              message: 'must be boolean',
            };
            if (vErrors === null) {
              vErrors = [err7];
            } else {
              vErrors.push(err7);
            }
            errors++;
          }
          if (false !== data1) {
            const err8 = {
              instancePath: instancePath + '/deleted',
              schemaPath: '#/anyOf/0/properties/deleted/const',
              keyword: 'const',
              params: { allowedValue: false },
              message: 'must be equal to constant',
            };
            if (vErrors === null) {
              vErrors = [err8];
            } else {
              vErrors.push(err8);
            }
            errors++;
          }
        }
        if (data.data !== void 0) {
          if (
            !validate11(data.data, {
              instancePath: instancePath + '/data',
              parentData: data,
              parentDataProperty: 'data',
              rootData,
            })
          ) {
            vErrors = vErrors === null ? validate11.errors : vErrors.concat(validate11.errors);
            errors = vErrors.length;
          }
        }
        if (data.version !== void 0) {
          let data3 = data.version;
          if (!(typeof data3 == 'number' && isFinite(data3))) {
            const err9 = {
              instancePath: instancePath + '/version',
              schemaPath: '#/anyOf/0/properties/version/type',
              keyword: 'type',
              params: { type: 'number' },
              message: 'must be number',
            };
            if (vErrors === null) {
              vErrors = [err9];
            } else {
              vErrors.push(err9);
            }
            errors++;
          }
          if (1 !== data3) {
            const err10 = {
              instancePath: instancePath + '/version',
              schemaPath: '#/anyOf/0/properties/version/const',
              keyword: 'const',
              params: { allowedValue: 1 },
              message: 'must be equal to constant',
            };
            if (vErrors === null) {
              vErrors = [err10];
            } else {
              vErrors.push(err10);
            }
            errors++;
          }
        }
        if (data.id !== void 0) {
          if (typeof data.id !== 'string') {
            const err11 = {
              instancePath: instancePath + '/id',
              schemaPath: '#/anyOf/0/properties/id/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
            };
            if (vErrors === null) {
              vErrors = [err11];
            } else {
              vErrors.push(err11);
            }
            errors++;
          }
        }
      } else {
        const err12 = {
          instancePath,
          schemaPath: '#/anyOf/0/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
        };
        if (vErrors === null) {
          vErrors = [err12];
        } else {
          vErrors.push(err12);
        }
        errors++;
      }
      var _valid0 = _errs1 === errors;
      valid0 = valid0 || _valid0;
      if (!valid0) {
        const _errs12 = errors;
        if (data && typeof data == 'object' && !Array.isArray(data)) {
          if (data.data === void 0) {
            const err13 = {
              instancePath,
              schemaPath: '#/anyOf/1/required',
              keyword: 'required',
              params: { missingProperty: 'data' },
              message: "must have required property 'data'",
            };
            if (vErrors === null) {
              vErrors = [err13];
            } else {
              vErrors.push(err13);
            }
            errors++;
          }
          if (data.deleted === void 0) {
            const err14 = {
              instancePath,
              schemaPath: '#/anyOf/1/required',
              keyword: 'required',
              params: { missingProperty: 'deleted' },
              message: "must have required property 'deleted'",
            };
            if (vErrors === null) {
              vErrors = [err14];
            } else {
              vErrors.push(err14);
            }
            errors++;
          }
          if (data.id === void 0) {
            const err15 = {
              instancePath,
              schemaPath: '#/anyOf/1/required',
              keyword: 'required',
              params: { missingProperty: 'id' },
              message: "must have required property 'id'",
            };
            if (vErrors === null) {
              vErrors = [err15];
            } else {
              vErrors.push(err15);
            }
            errors++;
          }
          if (data.kind === void 0) {
            const err16 = {
              instancePath,
              schemaPath: '#/anyOf/1/required',
              keyword: 'required',
              params: { missingProperty: 'kind' },
              message: "must have required property 'kind'",
            };
            if (vErrors === null) {
              vErrors = [err16];
            } else {
              vErrors.push(err16);
            }
            errors++;
          }
          if (data.version === void 0) {
            const err17 = {
              instancePath,
              schemaPath: '#/anyOf/1/required',
              keyword: 'required',
              params: { missingProperty: 'version' },
              message: "must have required property 'version'",
            };
            if (vErrors === null) {
              vErrors = [err17];
            } else {
              vErrors.push(err17);
            }
            errors++;
          }
          if (data.kind !== void 0) {
            let data5 = data.kind;
            if (typeof data5 !== 'string') {
              const err18 = {
                instancePath: instancePath + '/kind',
                schemaPath: '#/anyOf/1/properties/kind/type',
                keyword: 'type',
                params: { type: 'string' },
                message: 'must be string',
              };
              if (vErrors === null) {
                vErrors = [err18];
              } else {
                vErrors.push(err18);
              }
              errors++;
            }
            if ('program' !== data5) {
              const err19 = {
                instancePath: instancePath + '/kind',
                schemaPath: '#/anyOf/1/properties/kind/const',
                keyword: 'const',
                params: { allowedValue: 'program' },
                message: 'must be equal to constant',
              };
              if (vErrors === null) {
                vErrors = [err19];
              } else {
                vErrors.push(err19);
              }
              errors++;
            }
          }
          if (data.deleted !== void 0) {
            let data6 = data.deleted;
            if (typeof data6 !== 'boolean') {
              const err20 = {
                instancePath: instancePath + '/deleted',
                schemaPath: '#/anyOf/1/properties/deleted/type',
                keyword: 'type',
                params: { type: 'boolean' },
                message: 'must be boolean',
              };
              if (vErrors === null) {
                vErrors = [err20];
              } else {
                vErrors.push(err20);
              }
              errors++;
            }
            if (false !== data6) {
              const err21 = {
                instancePath: instancePath + '/deleted',
                schemaPath: '#/anyOf/1/properties/deleted/const',
                keyword: 'const',
                params: { allowedValue: false },
                message: 'must be equal to constant',
              };
              if (vErrors === null) {
                vErrors = [err21];
              } else {
                vErrors.push(err21);
              }
              errors++;
            }
          }
          if (data.data !== void 0) {
            if (
              !validate55(data.data, {
                instancePath: instancePath + '/data',
                parentData: data,
                parentDataProperty: 'data',
                rootData,
              })
            ) {
              vErrors = vErrors === null ? validate55.errors : vErrors.concat(validate55.errors);
              errors = vErrors.length;
            }
          }
          if (data.version !== void 0) {
            let data8 = data.version;
            if (!(typeof data8 == 'number' && isFinite(data8))) {
              const err22 = {
                instancePath: instancePath + '/version',
                schemaPath: '#/anyOf/1/properties/version/type',
                keyword: 'type',
                params: { type: 'number' },
                message: 'must be number',
              };
              if (vErrors === null) {
                vErrors = [err22];
              } else {
                vErrors.push(err22);
              }
              errors++;
            }
            if (1 !== data8) {
              const err23 = {
                instancePath: instancePath + '/version',
                schemaPath: '#/anyOf/1/properties/version/const',
                keyword: 'const',
                params: { allowedValue: 1 },
                message: 'must be equal to constant',
              };
              if (vErrors === null) {
                vErrors = [err23];
              } else {
                vErrors.push(err23);
              }
              errors++;
            }
          }
          if (data.id !== void 0) {
            if (typeof data.id !== 'string') {
              const err24 = {
                instancePath: instancePath + '/id',
                schemaPath: '#/anyOf/1/properties/id/type',
                keyword: 'type',
                params: { type: 'string' },
                message: 'must be string',
              };
              if (vErrors === null) {
                vErrors = [err24];
              } else {
                vErrors.push(err24);
              }
              errors++;
            }
          }
        } else {
          const err25 = {
            instancePath,
            schemaPath: '#/anyOf/1/type',
            keyword: 'type',
            params: { type: 'object' },
            message: 'must be object',
          };
          if (vErrors === null) {
            vErrors = [err25];
          } else {
            vErrors.push(err25);
          }
          errors++;
        }
        var _valid0 = _errs12 === errors;
        valid0 = valid0 || _valid0;
        if (!valid0) {
          const _errs23 = errors;
          if (data && typeof data == 'object' && !Array.isArray(data)) {
            if (data.data === void 0) {
              const err26 = {
                instancePath,
                schemaPath: '#/anyOf/2/required',
                keyword: 'required',
                params: { missingProperty: 'data' },
                message: "must have required property 'data'",
              };
              if (vErrors === null) {
                vErrors = [err26];
              } else {
                vErrors.push(err26);
              }
              errors++;
            }
            if (data.deleted === void 0) {
              const err27 = {
                instancePath,
                schemaPath: '#/anyOf/2/required',
                keyword: 'required',
                params: { missingProperty: 'deleted' },
                message: "must have required property 'deleted'",
              };
              if (vErrors === null) {
                vErrors = [err27];
              } else {
                vErrors.push(err27);
              }
              errors++;
            }
            if (data.id === void 0) {
              const err28 = {
                instancePath,
                schemaPath: '#/anyOf/2/required',
                keyword: 'required',
                params: { missingProperty: 'id' },
                message: "must have required property 'id'",
              };
              if (vErrors === null) {
                vErrors = [err28];
              } else {
                vErrors.push(err28);
              }
              errors++;
            }
            if (data.kind === void 0) {
              const err29 = {
                instancePath,
                schemaPath: '#/anyOf/2/required',
                keyword: 'required',
                params: { missingProperty: 'kind' },
                message: "must have required property 'kind'",
              };
              if (vErrors === null) {
                vErrors = [err29];
              } else {
                vErrors.push(err29);
              }
              errors++;
            }
            if (data.version === void 0) {
              const err30 = {
                instancePath,
                schemaPath: '#/anyOf/2/required',
                keyword: 'required',
                params: { missingProperty: 'version' },
                message: "must have required property 'version'",
              };
              if (vErrors === null) {
                vErrors = [err30];
              } else {
                vErrors.push(err30);
              }
              errors++;
            }
            if (data.kind !== void 0) {
              let data10 = data.kind;
              if (typeof data10 !== 'string') {
                const err31 = {
                  instancePath: instancePath + '/kind',
                  schemaPath: '#/anyOf/2/properties/kind/type',
                  keyword: 'type',
                  params: { type: 'string' },
                  message: 'must be string',
                };
                if (vErrors === null) {
                  vErrors = [err31];
                } else {
                  vErrors.push(err31);
                }
                errors++;
              }
              if ('exercise' !== data10) {
                const err32 = {
                  instancePath: instancePath + '/kind',
                  schemaPath: '#/anyOf/2/properties/kind/const',
                  keyword: 'const',
                  params: { allowedValue: 'exercise' },
                  message: 'must be equal to constant',
                };
                if (vErrors === null) {
                  vErrors = [err32];
                } else {
                  vErrors.push(err32);
                }
                errors++;
              }
            }
            if (data.deleted !== void 0) {
              let data11 = data.deleted;
              if (typeof data11 !== 'boolean') {
                const err33 = {
                  instancePath: instancePath + '/deleted',
                  schemaPath: '#/anyOf/2/properties/deleted/type',
                  keyword: 'type',
                  params: { type: 'boolean' },
                  message: 'must be boolean',
                };
                if (vErrors === null) {
                  vErrors = [err33];
                } else {
                  vErrors.push(err33);
                }
                errors++;
              }
              if (false !== data11) {
                const err34 = {
                  instancePath: instancePath + '/deleted',
                  schemaPath: '#/anyOf/2/properties/deleted/const',
                  keyword: 'const',
                  params: { allowedValue: false },
                  message: 'must be equal to constant',
                };
                if (vErrors === null) {
                  vErrors = [err34];
                } else {
                  vErrors.push(err34);
                }
                errors++;
              }
            }
            if (data.data !== void 0) {
              let data12 = data.data;
              if (data12 && typeof data12 == 'object' && !Array.isArray(data12)) {
                if (data12.name === void 0) {
                  const err35 = {
                    instancePath: instancePath + '/data',
                    schemaPath: '#/definitions/ExerciseDescriptor/required',
                    keyword: 'required',
                    params: { missingProperty: 'name' },
                    message: "must have required property 'name'",
                  };
                  if (vErrors === null) {
                    vErrors = [err35];
                  } else {
                    vErrors.push(err35);
                  }
                  errors++;
                }
                if (data12.force === void 0) {
                  const err36 = {
                    instancePath: instancePath + '/data',
                    schemaPath: '#/definitions/ExerciseDescriptor/required',
                    keyword: 'required',
                    params: { missingProperty: 'force' },
                    message: "must have required property 'force'",
                  };
                  if (vErrors === null) {
                    vErrors = [err36];
                  } else {
                    vErrors.push(err36);
                  }
                  errors++;
                }
                if (data12.level === void 0) {
                  const err37 = {
                    instancePath: instancePath + '/data',
                    schemaPath: '#/definitions/ExerciseDescriptor/required',
                    keyword: 'required',
                    params: { missingProperty: 'level' },
                    message: "must have required property 'level'",
                  };
                  if (vErrors === null) {
                    vErrors = [err37];
                  } else {
                    vErrors.push(err37);
                  }
                  errors++;
                }
                if (data12.mechanic === void 0) {
                  const err38 = {
                    instancePath: instancePath + '/data',
                    schemaPath: '#/definitions/ExerciseDescriptor/required',
                    keyword: 'required',
                    params: { missingProperty: 'mechanic' },
                    message: "must have required property 'mechanic'",
                  };
                  if (vErrors === null) {
                    vErrors = [err38];
                  } else {
                    vErrors.push(err38);
                  }
                  errors++;
                }
                if (data12.equipment === void 0) {
                  const err39 = {
                    instancePath: instancePath + '/data',
                    schemaPath: '#/definitions/ExerciseDescriptor/required',
                    keyword: 'required',
                    params: { missingProperty: 'equipment' },
                    message: "must have required property 'equipment'",
                  };
                  if (vErrors === null) {
                    vErrors = [err39];
                  } else {
                    vErrors.push(err39);
                  }
                  errors++;
                }
                if (data12.muscles === void 0) {
                  const err40 = {
                    instancePath: instancePath + '/data',
                    schemaPath: '#/definitions/ExerciseDescriptor/required',
                    keyword: 'required',
                    params: { missingProperty: 'muscles' },
                    message: "must have required property 'muscles'",
                  };
                  if (vErrors === null) {
                    vErrors = [err40];
                  } else {
                    vErrors.push(err40);
                  }
                  errors++;
                }
                if (data12.instructions === void 0) {
                  const err41 = {
                    instancePath: instancePath + '/data',
                    schemaPath: '#/definitions/ExerciseDescriptor/required',
                    keyword: 'required',
                    params: { missingProperty: 'instructions' },
                    message: "must have required property 'instructions'",
                  };
                  if (vErrors === null) {
                    vErrors = [err41];
                  } else {
                    vErrors.push(err41);
                  }
                  errors++;
                }
                if (data12.category === void 0) {
                  const err42 = {
                    instancePath: instancePath + '/data',
                    schemaPath: '#/definitions/ExerciseDescriptor/required',
                    keyword: 'required',
                    params: { missingProperty: 'category' },
                    message: "must have required property 'category'",
                  };
                  if (vErrors === null) {
                    vErrors = [err42];
                  } else {
                    vErrors.push(err42);
                  }
                  errors++;
                }
                if (data12.name !== void 0) {
                  if (typeof data12.name !== 'string') {
                    const err43 = {
                      instancePath: instancePath + '/data/name',
                      schemaPath: '#/definitions/ExerciseDescriptor/properties/name/type',
                      keyword: 'type',
                      params: { type: 'string' },
                      message: 'must be string',
                    };
                    if (vErrors === null) {
                      vErrors = [err43];
                    } else {
                      vErrors.push(err43);
                    }
                    errors++;
                  }
                }
                if (data12.force !== void 0) {
                  let data14 = data12.force;
                  if (typeof data14 !== 'string' && data14 !== null) {
                    const err44 = {
                      instancePath: instancePath + '/data/force',
                      schemaPath: '#/definitions/ExerciseDescriptor/properties/force/type',
                      keyword: 'type',
                      params: { type: schema57.properties.force.type },
                      message: 'must be string,null',
                    };
                    if (vErrors === null) {
                      vErrors = [err44];
                    } else {
                      vErrors.push(err44);
                    }
                    errors++;
                  }
                }
                if (data12.level !== void 0) {
                  if (typeof data12.level !== 'string') {
                    const err45 = {
                      instancePath: instancePath + '/data/level',
                      schemaPath: '#/definitions/ExerciseDescriptor/properties/level/type',
                      keyword: 'type',
                      params: { type: 'string' },
                      message: 'must be string',
                    };
                    if (vErrors === null) {
                      vErrors = [err45];
                    } else {
                      vErrors.push(err45);
                    }
                    errors++;
                  }
                }
                if (data12.mechanic !== void 0) {
                  let data16 = data12.mechanic;
                  if (typeof data16 !== 'string' && data16 !== null) {
                    const err46 = {
                      instancePath: instancePath + '/data/mechanic',
                      schemaPath: '#/definitions/ExerciseDescriptor/properties/mechanic/type',
                      keyword: 'type',
                      params: { type: schema57.properties.mechanic.type },
                      message: 'must be string,null',
                    };
                    if (vErrors === null) {
                      vErrors = [err46];
                    } else {
                      vErrors.push(err46);
                    }
                    errors++;
                  }
                }
                if (data12.equipment !== void 0) {
                  let data17 = data12.equipment;
                  if (typeof data17 !== 'string' && data17 !== null) {
                    const err47 = {
                      instancePath: instancePath + '/data/equipment',
                      schemaPath: '#/definitions/ExerciseDescriptor/properties/equipment/type',
                      keyword: 'type',
                      params: { type: schema57.properties.equipment.type },
                      message: 'must be string,null',
                    };
                    if (vErrors === null) {
                      vErrors = [err47];
                    } else {
                      vErrors.push(err47);
                    }
                    errors++;
                  }
                }
                if (data12.muscles !== void 0) {
                  let data18 = data12.muscles;
                  if (Array.isArray(data18)) {
                    const len0 = data18.length;
                    for (let i0 = 0; i0 < len0; i0++) {
                      if (typeof data18[i0] !== 'string') {
                        const err48 = {
                          instancePath: instancePath + '/data/muscles/' + i0,
                          schemaPath: '#/definitions/ExerciseDescriptor/properties/muscles/items/type',
                          keyword: 'type',
                          params: { type: 'string' },
                          message: 'must be string',
                        };
                        if (vErrors === null) {
                          vErrors = [err48];
                        } else {
                          vErrors.push(err48);
                        }
                        errors++;
                      }
                    }
                  } else {
                    const err49 = {
                      instancePath: instancePath + '/data/muscles',
                      schemaPath: '#/definitions/ExerciseDescriptor/properties/muscles/type',
                      keyword: 'type',
                      params: { type: 'array' },
                      message: 'must be array',
                    };
                    if (vErrors === null) {
                      vErrors = [err49];
                    } else {
                      vErrors.push(err49);
                    }
                    errors++;
                  }
                }
                if (data12.instructions !== void 0) {
                  if (typeof data12.instructions !== 'string') {
                    const err50 = {
                      instancePath: instancePath + '/data/instructions',
                      schemaPath: '#/definitions/ExerciseDescriptor/properties/instructions/type',
                      keyword: 'type',
                      params: { type: 'string' },
                      message: 'must be string',
                    };
                    if (vErrors === null) {
                      vErrors = [err50];
                    } else {
                      vErrors.push(err50);
                    }
                    errors++;
                  }
                }
                if (data12.category !== void 0) {
                  if (typeof data12.category !== 'string') {
                    const err51 = {
                      instancePath: instancePath + '/data/category',
                      schemaPath: '#/definitions/ExerciseDescriptor/properties/category/type',
                      keyword: 'type',
                      params: { type: 'string' },
                      message: 'must be string',
                    };
                    if (vErrors === null) {
                      vErrors = [err51];
                    } else {
                      vErrors.push(err51);
                    }
                    errors++;
                  }
                }
              } else {
                const err52 = {
                  instancePath: instancePath + '/data',
                  schemaPath: '#/definitions/ExerciseDescriptor/type',
                  keyword: 'type',
                  params: { type: 'object' },
                  message: 'must be object',
                };
                if (vErrors === null) {
                  vErrors = [err52];
                } else {
                  vErrors.push(err52);
                }
                errors++;
              }
            }
            if (data.version !== void 0) {
              let data22 = data.version;
              if (!(typeof data22 == 'number' && isFinite(data22))) {
                const err53 = {
                  instancePath: instancePath + '/version',
                  schemaPath: '#/anyOf/2/properties/version/type',
                  keyword: 'type',
                  params: { type: 'number' },
                  message: 'must be number',
                };
                if (vErrors === null) {
                  vErrors = [err53];
                } else {
                  vErrors.push(err53);
                }
                errors++;
              }
              if (1 !== data22) {
                const err54 = {
                  instancePath: instancePath + '/version',
                  schemaPath: '#/anyOf/2/properties/version/const',
                  keyword: 'const',
                  params: { allowedValue: 1 },
                  message: 'must be equal to constant',
                };
                if (vErrors === null) {
                  vErrors = [err54];
                } else {
                  vErrors.push(err54);
                }
                errors++;
              }
            }
            if (data.id !== void 0) {
              if (typeof data.id !== 'string') {
                const err55 = {
                  instancePath: instancePath + '/id',
                  schemaPath: '#/anyOf/2/properties/id/type',
                  keyword: 'type',
                  params: { type: 'string' },
                  message: 'must be string',
                };
                if (vErrors === null) {
                  vErrors = [err55];
                } else {
                  vErrors.push(err55);
                }
                errors++;
              }
            }
          } else {
            const err56 = {
              instancePath,
              schemaPath: '#/anyOf/2/type',
              keyword: 'type',
              params: { type: 'object' },
              message: 'must be object',
            };
            if (vErrors === null) {
              vErrors = [err56];
            } else {
              vErrors.push(err56);
            }
            errors++;
          }
          var _valid0 = _errs23 === errors;
          valid0 = valid0 || _valid0;
          if (!valid0) {
            const _errs54 = errors;
            if (data && typeof data == 'object' && !Array.isArray(data)) {
              if (data.data === void 0) {
                const err57 = {
                  instancePath,
                  schemaPath: '#/anyOf/3/required',
                  keyword: 'required',
                  params: { missingProperty: 'data' },
                  message: "must have required property 'data'",
                };
                if (vErrors === null) {
                  vErrors = [err57];
                } else {
                  vErrors.push(err57);
                }
                errors++;
              }
              if (data.deleted === void 0) {
                const err58 = {
                  instancePath,
                  schemaPath: '#/anyOf/3/required',
                  keyword: 'required',
                  params: { missingProperty: 'deleted' },
                  message: "must have required property 'deleted'",
                };
                if (vErrors === null) {
                  vErrors = [err58];
                } else {
                  vErrors.push(err58);
                }
                errors++;
              }
              if (data.id === void 0) {
                const err59 = {
                  instancePath,
                  schemaPath: '#/anyOf/3/required',
                  keyword: 'required',
                  params: { missingProperty: 'id' },
                  message: "must have required property 'id'",
                };
                if (vErrors === null) {
                  vErrors = [err59];
                } else {
                  vErrors.push(err59);
                }
                errors++;
              }
              if (data.kind === void 0) {
                const err60 = {
                  instancePath,
                  schemaPath: '#/anyOf/3/required',
                  keyword: 'required',
                  params: { missingProperty: 'kind' },
                  message: "must have required property 'kind'",
                };
                if (vErrors === null) {
                  vErrors = [err60];
                } else {
                  vErrors.push(err60);
                }
                errors++;
              }
              if (data.version === void 0) {
                const err61 = {
                  instancePath,
                  schemaPath: '#/anyOf/3/required',
                  keyword: 'required',
                  params: { missingProperty: 'version' },
                  message: "must have required property 'version'",
                };
                if (vErrors === null) {
                  vErrors = [err61];
                } else {
                  vErrors.push(err61);
                }
                errors++;
              }
              if (data.kind !== void 0) {
                let data24 = data.kind;
                if (typeof data24 !== 'string') {
                  const err62 = {
                    instancePath: instancePath + '/kind',
                    schemaPath: '#/anyOf/3/properties/kind/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  };
                  if (vErrors === null) {
                    vErrors = [err62];
                  } else {
                    vErrors.push(err62);
                  }
                  errors++;
                }
                if ('exercise-visibility' !== data24) {
                  const err63 = {
                    instancePath: instancePath + '/kind',
                    schemaPath: '#/anyOf/3/properties/kind/const',
                    keyword: 'const',
                    params: { allowedValue: 'exercise-visibility' },
                    message: 'must be equal to constant',
                  };
                  if (vErrors === null) {
                    vErrors = [err63];
                  } else {
                    vErrors.push(err63);
                  }
                  errors++;
                }
              }
              if (data.deleted !== void 0) {
                let data25 = data.deleted;
                if (typeof data25 !== 'boolean') {
                  const err64 = {
                    instancePath: instancePath + '/deleted',
                    schemaPath: '#/anyOf/3/properties/deleted/type',
                    keyword: 'type',
                    params: { type: 'boolean' },
                    message: 'must be boolean',
                  };
                  if (vErrors === null) {
                    vErrors = [err64];
                  } else {
                    vErrors.push(err64);
                  }
                  errors++;
                }
                if (false !== data25) {
                  const err65 = {
                    instancePath: instancePath + '/deleted',
                    schemaPath: '#/anyOf/3/properties/deleted/const',
                    keyword: 'const',
                    params: { allowedValue: false },
                    message: 'must be equal to constant',
                  };
                  if (vErrors === null) {
                    vErrors = [err65];
                  } else {
                    vErrors.push(err65);
                  }
                  errors++;
                }
              }
              if (data.data !== void 0) {
                let data26 = data.data;
                if (data26 && typeof data26 == 'object' && !Array.isArray(data26)) {
                  if (data26.hidden === void 0) {
                    const err66 = {
                      instancePath: instancePath + '/data',
                      schemaPath: '#/anyOf/3/properties/data/required',
                      keyword: 'required',
                      params: { missingProperty: 'hidden' },
                      message: "must have required property 'hidden'",
                    };
                    if (vErrors === null) {
                      vErrors = [err66];
                    } else {
                      vErrors.push(err66);
                    }
                    errors++;
                  }
                  if (data26.hidden !== void 0) {
                    if (typeof data26.hidden !== 'boolean') {
                      const err67 = {
                        instancePath: instancePath + '/data/hidden',
                        schemaPath: '#/anyOf/3/properties/data/properties/hidden/type',
                        keyword: 'type',
                        params: { type: 'boolean' },
                        message: 'must be boolean',
                      };
                      if (vErrors === null) {
                        vErrors = [err67];
                      } else {
                        vErrors.push(err67);
                      }
                      errors++;
                    }
                  }
                } else {
                  const err68 = {
                    instancePath: instancePath + '/data',
                    schemaPath: '#/anyOf/3/properties/data/type',
                    keyword: 'type',
                    params: { type: 'object' },
                    message: 'must be object',
                  };
                  if (vErrors === null) {
                    vErrors = [err68];
                  } else {
                    vErrors.push(err68);
                  }
                  errors++;
                }
              }
              if (data.version !== void 0) {
                let data28 = data.version;
                if (!(typeof data28 == 'number' && isFinite(data28))) {
                  const err69 = {
                    instancePath: instancePath + '/version',
                    schemaPath: '#/anyOf/3/properties/version/type',
                    keyword: 'type',
                    params: { type: 'number' },
                    message: 'must be number',
                  };
                  if (vErrors === null) {
                    vErrors = [err69];
                  } else {
                    vErrors.push(err69);
                  }
                  errors++;
                }
                if (1 !== data28) {
                  const err70 = {
                    instancePath: instancePath + '/version',
                    schemaPath: '#/anyOf/3/properties/version/const',
                    keyword: 'const',
                    params: { allowedValue: 1 },
                    message: 'must be equal to constant',
                  };
                  if (vErrors === null) {
                    vErrors = [err70];
                  } else {
                    vErrors.push(err70);
                  }
                  errors++;
                }
              }
              if (data.id !== void 0) {
                if (typeof data.id !== 'string') {
                  const err71 = {
                    instancePath: instancePath + '/id',
                    schemaPath: '#/anyOf/3/properties/id/type',
                    keyword: 'type',
                    params: { type: 'string' },
                    message: 'must be string',
                  };
                  if (vErrors === null) {
                    vErrors = [err71];
                  } else {
                    vErrors.push(err71);
                  }
                  errors++;
                }
              }
            } else {
              const err72 = {
                instancePath,
                schemaPath: '#/anyOf/3/type',
                keyword: 'type',
                params: { type: 'object' },
                message: 'must be object',
              };
              if (vErrors === null) {
                vErrors = [err72];
              } else {
                vErrors.push(err72);
              }
              errors++;
            }
            var _valid0 = _errs54 === errors;
            valid0 = valid0 || _valid0;
            if (!valid0) {
              const _errs68 = errors;
              if (data && typeof data == 'object' && !Array.isArray(data)) {
                if (data.data === void 0) {
                  const err73 = {
                    instancePath,
                    schemaPath: '#/anyOf/4/required',
                    keyword: 'required',
                    params: { missingProperty: 'data' },
                    message: "must have required property 'data'",
                  };
                  if (vErrors === null) {
                    vErrors = [err73];
                  } else {
                    vErrors.push(err73);
                  }
                  errors++;
                }
                if (data.deleted === void 0) {
                  const err74 = {
                    instancePath,
                    schemaPath: '#/anyOf/4/required',
                    keyword: 'required',
                    params: { missingProperty: 'deleted' },
                    message: "must have required property 'deleted'",
                  };
                  if (vErrors === null) {
                    vErrors = [err74];
                  } else {
                    vErrors.push(err74);
                  }
                  errors++;
                }
                if (data.id === void 0) {
                  const err75 = {
                    instancePath,
                    schemaPath: '#/anyOf/4/required',
                    keyword: 'required',
                    params: { missingProperty: 'id' },
                    message: "must have required property 'id'",
                  };
                  if (vErrors === null) {
                    vErrors = [err75];
                  } else {
                    vErrors.push(err75);
                  }
                  errors++;
                }
                if (data.kind === void 0) {
                  const err76 = {
                    instancePath,
                    schemaPath: '#/anyOf/4/required',
                    keyword: 'required',
                    params: { missingProperty: 'kind' },
                    message: "must have required property 'kind'",
                  };
                  if (vErrors === null) {
                    vErrors = [err76];
                  } else {
                    vErrors.push(err76);
                  }
                  errors++;
                }
                if (data.version === void 0) {
                  const err77 = {
                    instancePath,
                    schemaPath: '#/anyOf/4/required',
                    keyword: 'required',
                    params: { missingProperty: 'version' },
                    message: "must have required property 'version'",
                  };
                  if (vErrors === null) {
                    vErrors = [err77];
                  } else {
                    vErrors.push(err77);
                  }
                  errors++;
                }
                if (data.kind !== void 0) {
                  let data30 = data.kind;
                  if (typeof data30 !== 'string') {
                    const err78 = {
                      instancePath: instancePath + '/kind',
                      schemaPath: '#/definitions/SyncKind/type',
                      keyword: 'type',
                      params: { type: 'string' },
                      message: 'must be string',
                    };
                    if (vErrors === null) {
                      vErrors = [err78];
                    } else {
                      vErrors.push(err78);
                    }
                    errors++;
                  }
                  if (
                    !(
                      data30 === 'session' ||
                      data30 === 'program' ||
                      data30 === 'exercise' ||
                      data30 === 'exercise-visibility'
                    )
                  ) {
                    const err79 = {
                      instancePath: instancePath + '/kind',
                      schemaPath: '#/definitions/SyncKind/enum',
                      keyword: 'enum',
                      params: { allowedValues: schema58.enum },
                      message: 'must be equal to one of the allowed values',
                    };
                    if (vErrors === null) {
                      vErrors = [err79];
                    } else {
                      vErrors.push(err79);
                    }
                    errors++;
                  }
                }
                if (data.deleted !== void 0) {
                  let data31 = data.deleted;
                  if (typeof data31 !== 'boolean') {
                    const err80 = {
                      instancePath: instancePath + '/deleted',
                      schemaPath: '#/anyOf/4/properties/deleted/type',
                      keyword: 'type',
                      params: { type: 'boolean' },
                      message: 'must be boolean',
                    };
                    if (vErrors === null) {
                      vErrors = [err80];
                    } else {
                      vErrors.push(err80);
                    }
                    errors++;
                  }
                  if (true !== data31) {
                    const err81 = {
                      instancePath: instancePath + '/deleted',
                      schemaPath: '#/anyOf/4/properties/deleted/const',
                      keyword: 'const',
                      params: { allowedValue: true },
                      message: 'must be equal to constant',
                    };
                    if (vErrors === null) {
                      vErrors = [err81];
                    } else {
                      vErrors.push(err81);
                    }
                    errors++;
                  }
                }
                if (data.data !== void 0) {
                  if (data.data !== null) {
                    const err82 = {
                      instancePath: instancePath + '/data',
                      schemaPath: '#/anyOf/4/properties/data/type',
                      keyword: 'type',
                      params: { type: 'null' },
                      message: 'must be null',
                    };
                    if (vErrors === null) {
                      vErrors = [err82];
                    } else {
                      vErrors.push(err82);
                    }
                    errors++;
                  }
                }
                if (data.version !== void 0) {
                  let data33 = data.version;
                  if (!(typeof data33 == 'number' && isFinite(data33))) {
                    const err83 = {
                      instancePath: instancePath + '/version',
                      schemaPath: '#/anyOf/4/properties/version/type',
                      keyword: 'type',
                      params: { type: 'number' },
                      message: 'must be number',
                    };
                    if (vErrors === null) {
                      vErrors = [err83];
                    } else {
                      vErrors.push(err83);
                    }
                    errors++;
                  }
                  if (1 !== data33) {
                    const err84 = {
                      instancePath: instancePath + '/version',
                      schemaPath: '#/anyOf/4/properties/version/const',
                      keyword: 'const',
                      params: { allowedValue: 1 },
                      message: 'must be equal to constant',
                    };
                    if (vErrors === null) {
                      vErrors = [err84];
                    } else {
                      vErrors.push(err84);
                    }
                    errors++;
                  }
                }
                if (data.id !== void 0) {
                  if (typeof data.id !== 'string') {
                    const err85 = {
                      instancePath: instancePath + '/id',
                      schemaPath: '#/anyOf/4/properties/id/type',
                      keyword: 'type',
                      params: { type: 'string' },
                      message: 'must be string',
                    };
                    if (vErrors === null) {
                      vErrors = [err85];
                    } else {
                      vErrors.push(err85);
                    }
                    errors++;
                  }
                }
              } else {
                const err86 = {
                  instancePath,
                  schemaPath: '#/anyOf/4/type',
                  keyword: 'type',
                  params: { type: 'object' },
                  message: 'must be object',
                };
                if (vErrors === null) {
                  vErrors = [err86];
                } else {
                  vErrors.push(err86);
                }
                errors++;
              }
              var _valid0 = _errs68 === errors;
              valid0 = valid0 || _valid0;
            }
          }
        }
      }
      if (!valid0) {
        const err87 = {
          instancePath,
          schemaPath: '#/anyOf',
          keyword: 'anyOf',
          params: {},
          message: 'must match a schema in anyOf',
        };
        if (vErrors === null) {
          vErrors = [err87];
        } else {
          vErrors.push(err87);
        }
        errors++;
      } else {
        errors = _errs0;
        if (vErrors !== null) {
          if (_errs0) {
            vErrors.length = _errs0;
          } else {
            vErrors = null;
          }
        }
      }
      validate10.errors = vErrors;
      return errors === 0;
    }
  },
});
export default require_validator();
