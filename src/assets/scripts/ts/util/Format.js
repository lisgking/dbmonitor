define(
		"ts/util/Format",
		[ "jsm/util/MessageBundle", "dojo/nls", "dojo/nls!./nls/Format.json" ],
		function(MessageBundle, nls, json) {
			"use strict";
			/**
			 * @namespace ts.util
			 * @static
			 * @class Format
			 */
			function Format() {

			}
			// --------------------------------
			// date
			// --------------------------------
			/**
			 * Convert date object, utc string, milliseconds to formatted string
			 * 
			 * @static
			 * @method toDateString
			 * @param {String|Number|Date}
			 *            v
			 * @return {String} formatted date string (blank str)
			 */
			var dateOptions = {
				year : "numeric",
				month : "2-digit",
				day : "2-digit",
				hour : "2-digit",
				minute : "2-digit",
				second : "2-digit"
			};
			var timeDateOptions = {
				hour : "2-digit",
				minute : "2-digit",
				second : "2-digit"
			};
			function toDateString(v) {
				var d = new Date(v);
				if (d.valueOf() !== d.valueOf()) {
					return "";
				}
				return d.toLocaleString(nls.config.lang, dateOptions);
			}
			function toTimeDateString(v) {
				var d = new Date(v);
				if (d.valueOf() !== d.valueOf()) {
					return "";
				}
				return d.toLocaleTimeString(nls.config.lang, timeDateOptions);
			}
			function toPrettyDateString(v) {
				return toPrettyDate.call(new Date(v));
			}
			function formatMillisecondString(v) {
				var result = "";
				var ms = parseInt(v);//毫秒
				var s = 0;	// 秒
				var m = 0;// 分
				var h = 0;// 小时
				if (ms > 1000) {
					s = parseInt(ms / 1000);
					ms = parseInt(ms % 1000);
					if (s > 60) {
						m = parseInt(s / 60);
						s = parseInt(s % 60);
						if(m > 60){
							h = parseInt(m / 60);
							m = parseInt(m % 60);
						}
					}
				}
				return h+":"+m+":"+s+" "+ms;
				/*var obj = {h:h,m:m,s:s,ms:ms};
				if(h>0){
					return i18n.getMessage("hour_time_string",obj);
				}else if(m>0){
					return i18n.getMessage("min_time_string",obj);
				}else if(s>0){
					return i18n.getMessage("s_time_string",obj);
				}else{
					return i18n.getMessage("ms_time_string",obj);
				}*/
			}
			var formatters = [ {
				millis : 1,
				"threshold" : 1000,
				unit : "millisecond"
			}, {
				millis : 1000,
				"threshold" : 60 * 1000,
				unit : "second"
			}, {
				millis : 60 * 1000,
				"threshold" : 60 * 60 * 1000,
				unit : "minute"
			}, {
				millis : 60 * 60 * 1000,
				"threshold" : 24 * 60 * 60 * 1000,
				unit : "hour"
			}, {
				millis : 24 * 60 * 60 * 1000,
				"threshold" : 30 * 24 * 60 * 60 * 1000,
				unit : "day"
			}, {
				millis : 30 * 24 * 60 * 60 * 1000,
				"threshold" : 365 * 24 * 60 * 60 * 1000,
				unit : "month"
			}, {
				millis : 365 * 24 * 60 * 60 * 1000,
				"threshold" : 1 / 0,
				unit : "year"
			} ];
			var i18n = new MessageBundle(json);
			function toPrettyDate() {
				var t, d, i, f, v;
				t = this.valueOf();
				if (t !== t || 1 / t === -1 / t) {
					return "";
				}
				d = Date.now() - t;
				//add by lisg start 2015-8-6
				/*if (d < 0) {
					return "Invalid Date";
				}*/
				//add by lisg end 2015-8-6
				if (d < 60 * 1000) {
					return i18n.getMessage("just_now");
				}
				for (i = 2; i < formatters.length; i++) {
					f = formatters[i];
					if (d < f.threshold) {
						v = d / (f.millis) >>> 0;
						if (v === 1) {
							return i18n.getMessage((f.unit === "hour" ? "an_"
									: "a_")
									+ f.unit + "_ago", [ v ]);
						} else {
							return i18n.getMessage("n_" + f.unit + "s_ago",
									[ v ]);
						}
					}
				}
			}
			function toDurationString(v) {
				var d = new Date(v);
				v = d.valueOf();
				if (v !== v) {
					return "";
				}
				if (v < 86400000) {
					return d.toISOString().substring(11, 19);
				} else {
					d.setTime(v % 86400000);
					return +Math.floor(v / 86400000) + "D "
							+ d.toISOString().substring(11, 19);
				}
			}
			// --------------------------------
			// byteLength
			// --------------------------------
			/**
			 * Convert content length to fixed string
			 * 
			 * @static
			 * @param {Number}
			 *            n - number of byte kibibyte or mibi..., cannot not be
			 *            NaN, indefinite or negative
			 * @param {Number}
			 *            [f=0] - max fraction digits in range of 0..20
			 * @param {Number}
			 *            [e=0] - exponent based 1024, Math.pow(1024,e) stands
			 *            for the unit of n
			 * @return {String}
			 * @throws {RangeError}
			 */
			function toSizeString(n, f, e) {
				n = parseFloat(n);
				f >>>= 0;
				e >>>= 0;
				if (n !== n || 1 / n < 0 || 1 / n === -1 / n || f < 0 || f > 20
						|| e < 0) {
					throw new RangeError(
							"One of the three argument (number, fraction, exponent) is out of range");
				}
				var kibi = 0x400, mibi = 0x100000, gibi = 0x40000000, tebi = 0x10000000000;
				var v, u;
				n *= Math.pow(1024, e);
				if (n < kibi) {
					v = n.toFixed(0);
					u = "B";
				} else if (n < mibi) {
					v = (n / kibi).toFixed(f);
					u = "KiB";
				} else if (n < gibi) {
					v = (n / mibi).toFixed(f);
					u = "MiB";
				} else if (n < tebi) {
					v = (n / gibi).toFixed(f);
					u = "GiB";
				} else {
					v = (n / tebi).toFixed(f);
					u = "TiB";
				}
				return v + " " + u;
			}
			// --------------------------------
			// percent
			// --------------------------------
			/**
			 * 设置比率单位,默认百分比
			 * 
			 * @static
			 * @param {Number}
			 *            n - number of byte kibibyte or mibi..., cannot not be
			 *            NaN, indefinite or negative
			 * @param {Number}
			 *            [f=0] - max fraction digits in range of 0..20
			 * @param {Number}
			 *            [r=0] - 比率：百分比(100)和千分比(1000)
			 * @return {String}
			 * @throws {RangeError}
			 */
			function toRateUnit(n, f, r) {
				if (!r) {
					r = 100;
				}
				if (!f) {
					f = 2;
				}
				var value = "", unit = "";
				if (r == 100) {
					value = (n * r).toFixed(f);
					unit = "%";
				} else if (r == 1000) {
					value = (n * r).toFixed(f);
					unit = "‰";
				}
				return value + " " + unit;
			}

			var toLocaleStringSupportsLocales = (function() {
				var number = 0;
				try {
					number.toLocaleString("i");
				} catch (e) {
					return e.name === "RangeError";
				}
				return false;
			});

			/**
			 * 将数字转成百分比
			 * 
			 * @param {Number}
			 * @return {String}
			 */
			var toPercentString = toLocaleStringSupportsLocales && false ? function toPercentString(
					n) {
				return n.toLocaleString("zh-CN", {
					style : "percent",
					useGrouping : false,
					maximumFractionDigits : 2
				});
			}
					: function toPercentString(n) {
						if (n !== n) {
							return "NaN";
						}
						return +(n * 100).toFixed(2) + "%";
					};
			// --------------------------------
			// url
			// --------------------------------
			/**
			 * @method parseURL
			 */
			function parseURL(s) {
				var o = null;
				s.replace(parseURL.REGEXP, function(href, origin, protocol,
						host, hostname, port, pathname, search, hash) {
					o = {
						hash : hash,
						host : host,
						hostname : hostname,
						href : href,
						origin : origin,
						pathname : pathname,
						port : port ? port.substr(1) : "",
						protocol : protocol,
						search : search
					};
					return "";
				});
				return o;
			}
			parseURL.REGEXP = /^(([a-z\-]+:)\/\/(([^:\/]+)(:\d+)?))([^?#]*)([^#]*)(.*)$/;
			/**
			 * 填充字符,和trim相反
			 * 
			 * @private
			 * @method pad
			 * @param {String}
			 *            str
			 * @param {Number}
			 *            len
			 * @param {String}
			 *            cha
			 * @param {Number}
			 *            pos
			 */
			function pad(str, len, cha, pos) {
				cha = cha ? (String(cha).charAt(0) || " ") : " ";
				len = Number(len);
				str = String(str);
				var off, leftOff;
				if (str.length < len) {
					off = len - str.length;
					switch (pos) {
					case "before":
						return cha.repeat(off) + str;
					case "after":
						return str + cha.repeat(off);
					case "both":
						leftOff = off / 2 >>> 0;
						return cha.repeat(leftOff) + str
								+ cha.repeat(off - leftOff);
					default:
						throw new TypeError("Invalid position");
					}
				}
				return str;
			}
			/**
			 * 在左侧填充字符，和trimLeft相反
			 * 
			 * @method pad
			 * @param {String}
			 *            str
			 * @param {Number}
			 *            [len=0]
			 * @param {String}
			 *            [cha=" "]
			 */
			function padLeft(str, len, cha) {
				return pad(str, len, cha, "before");
			}
			/**
			 * 在右侧填充字符，和trimRight相反
			 * 
			 * @param {String}
			 *            str
			 * @param {Number}
			 *            [len=0]
			 * @param {String}
			 *            [cha=" "]
			 */
			function padRight(str, len, cha) {
				return pad(str, len, cha, "after");
			}
			/**
			 * 在两端填充字符,尝试平均分布,若总共填充奇数个字符，则左侧会比右侧少一个
			 * 
			 * @param {Object}
			 *            str
			 * @param {Object}
			 *            [len=0]
			 * @param {Object}
			 *            [cha=" "]
			 */
			function padBoth(str, len, cha) {
				return pad(str, len, cha, "both");
			}
			InstallFunctions(Format, DONT_ENUM, [ "toSizeString", toSizeString,
					"toDateString", toDateString, "toTimeDateString",
					toTimeDateString, "toPrettyDateString", toPrettyDateString,
					"formatMillisecondString", formatMillisecondString,
					"toDurationString", toDurationString, "toRateUnit",
					toRateUnit, "toPercentString", toPercentString, "parseURL",
					parseURL, "padLeft", padLeft, "padRight", padRight,
					"padBoth", padBoth ]);
			SetProperties(Format, NONE, [ "PD_DATE_FORMAT", {
				format : toDateString
			} ]);
			return Format;
		});