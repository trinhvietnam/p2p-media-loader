require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (!window.p2pml) {
    window.p2pml = {};
}

window.p2pml.hlsjs = require("p2p-media-loader-hlsjs");

},{"p2p-media-loader-hlsjs":"p2p-media-loader-hlsjs"}],2:[function(require,module,exports){
function createHlsJsLoaderClass(HlsJsLoader, segmentManager) {
	if (!segmentManager.isSupported()) {
		return Hls.DefaultConfig.loader;
	}

    function HlsJsLoaderClass(settings) {
        this.impl = new HlsJsLoader(segmentManager, settings);
        this.stats = this.impl.stats;
    }

    HlsJsLoaderClass.prototype.load = function (context, config, callbacks) {
        return this.impl.load(context, config, callbacks);
    };

    HlsJsLoaderClass.prototype.abort = function () {
        return this.impl.abort();
    };

    HlsJsLoaderClass.prototype.destroy = function () {
        return this.impl.destroy();
    };

    HlsJsLoaderClass.getSegmentManager = function () {
        return segmentManager;
    };

    return HlsJsLoaderClass;
}

module.exports.createHlsJsLoaderClass = createHlsJsLoaderClass;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_DOWNLOAD_LATENCY = 1;
var DEFAULT_DOWNLOAD_SPEED = 12500; // bytes per millisecond
var HlsJsLoader = /** @class */ (function () {
    function HlsJsLoader(segmentManager, settings) {
        this.stats = {}; // required for older versions of hls.js
        this.segmentManager = segmentManager;
    }
    HlsJsLoader.prototype.load = function (context, config_unused, callbacks) {
        var _this = this;
        this.context = context;
        this.callbacks = callbacks;
        this.url = context.url;
        if (context.type) {
            this.segmentManager.loadPlaylist(this.url, context.type)
                .then(function (content) { return _this.successPlaylist(content); })
                .catch(function (error) { return _this.error(error); });
        }
        else if (context.frag) {
            this.segmentManager.loadSegment(this.url, function (content, downloadSpeed) { return setTimeout(function () { return _this.successSegment(content, downloadSpeed); }, 0); }, function (error) { return setTimeout(function () { return _this.error(error); }, 0); });
        }
        else {
            console.warn("Unknown load request", context);
        }
    };
    HlsJsLoader.prototype.abort = function () {
        this.segmentManager.abortSegment(this.url);
    };
    HlsJsLoader.prototype.destroy = function () {
        this.abort();
    };
    HlsJsLoader.prototype.successPlaylist = function (content) {
        var now = performance.now();
        this.stats.trequest = now - 300;
        this.stats.tfirst = now - 200;
        this.stats.tload = now;
        this.stats.loaded = content.length;
        this.callbacks.onSuccess({
            url: this.url,
            data: content
        }, this.stats, this.context);
    };
    HlsJsLoader.prototype.successSegment = function (content, downloadSpeed) {
        var now = performance.now();
        var downloadTime = content.byteLength / ((downloadSpeed <= 0) ? DEFAULT_DOWNLOAD_SPEED : downloadSpeed);
        this.stats.trequest = now - DEFAULT_DOWNLOAD_LATENCY - downloadTime;
        this.stats.tfirst = now - downloadTime;
        this.stats.tload = now;
        this.stats.loaded = content.byteLength;
        this.callbacks.onSuccess({
            url: this.url,
            data: content
        }, this.stats, this.context);
    };
    HlsJsLoader.prototype.error = function (error) {
        this.callbacks.onError(error, this.context);
    };
    return HlsJsLoader;
}());
exports.default = HlsJsLoader;

},{}],4:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var p2p_media_loader_core_1 = require("p2p-media-loader-core");
var utils_1 = require("./utils");
var m3u8_parser_1 = require("m3u8-parser");
var SegmentManager = /** @class */ (function () {
    function SegmentManager(loader) {
        this.playlists = new Map();
        this.task = undefined;
        this.prevLoadUrl = undefined;
        this.playQueue = [];
        this.loader = loader;
        this.loader.on(p2p_media_loader_core_1.LoaderEvents.SegmentLoaded, this.onSegmentLoaded.bind(this));
        this.loader.on(p2p_media_loader_core_1.LoaderEvents.SegmentError, this.onSegmentError.bind(this));
        this.loader.on(p2p_media_loader_core_1.LoaderEvents.SegmentAbort, this.onSegmentAbort.bind(this));
    }
    SegmentManager.prototype.isSupported = function () {
        return this.loader.isSupported();
    };
    SegmentManager.prototype.processPlaylist = function (url, type, content) {
        var parser = new m3u8_parser_1.Parser();
        parser.push(content);
        parser.end();
        var playlist = new Playlist(url, type, parser.manifest);
        this.playlists.set(url, playlist);
    };
    SegmentManager.prototype.loadPlaylist = function (url, type, loadChildPlaylists) {
        if (loadChildPlaylists === void 0) { loadChildPlaylists = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var content, e_1, playlist, _loop_1, _i, _a, childUrl;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, utils_1.default.fetchContentAsText(url)];
                    case 1:
                        content = _b.sent();
                        this.processPlaylist(url, type, content);
                        this.setCurrentSegment();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _b.sent();
                        this.playlists.delete(url);
                        throw e_1;
                    case 3:
                        if (loadChildPlaylists) {
                            playlist = this.playlists.get(url);
                            if (playlist) {
                                _loop_1 = function (childUrl) {
                                    utils_1.default.fetchContentAsText(childUrl)
                                        .then(function (childContent) { return _this.processPlaylist(childUrl, "level", childContent); });
                                };
                                for (_i = 0, _a = playlist.getChildPlaylistAbsoluteUrls(); _i < _a.length; _i++) {
                                    childUrl = _a[_i];
                                    _loop_1(childUrl);
                                }
                            }
                        }
                        return [2 /*return*/, content];
                }
            });
        });
    };
    SegmentManager.prototype.loadSegment = function (url, onSuccess, onError) {
        var _a = this.getSegmentLocation(url), loadingPlaylist = _a.playlist, loadingSegmentIndex = _a.segmentIndex;
        if (!loadingPlaylist || loadingPlaylist.type !== "level") {
            this.fetchSegment(url, onSuccess, onError);
            return;
        }
        if (this.playQueue.length > 0) {
            var prevSegmentUrl = this.playQueue[this.playQueue.length - 1];
            var _b = this.getSegmentLocation(prevSegmentUrl), prevLoadingPlaylist = _b.playlist, prevLoadingSegmentIndex = _b.segmentIndex;
            if (prevLoadingPlaylist && prevLoadingSegmentIndex !== loadingSegmentIndex - 1) {
                this.playQueue = [];
            }
        }
        this.task = new Task(url, onSuccess, onError);
        this.loadSegments(loadingPlaylist, loadingSegmentIndex, url);
        this.prevLoadUrl = url;
    };
    SegmentManager.prototype.setCurrentSegment = function (url) {
        if (url === void 0) { url = ""; }
        var urlIndex = this.playQueue.indexOf(url);
        if (urlIndex >= 0) {
            this.playQueue = this.playQueue.slice(urlIndex);
        }
        if (this.prevLoadUrl) {
            var _a = this.getSegmentLocation(this.prevLoadUrl), loadingPlaylist = _a.playlist, loadingSegmentIndex = _a.segmentIndex;
            if (loadingPlaylist) {
                this.loadSegments(loadingPlaylist, loadingSegmentIndex);
            }
        }
    };
    SegmentManager.prototype.abortSegment = function (url) {
        if (this.task && this.task.url === url) {
            this.task = undefined;
        }
    };
    SegmentManager.prototype.destroy = function () {
        this.loader.destroy();
        if (this.task && this.task.onError) {
            this.task.onError("Loading aborted: object destroyed");
        }
        this.task = undefined;
        this.prevLoadUrl = undefined;
        this.playlists.clear();
        this.playQueue = [];
    };
    SegmentManager.prototype.onSegmentLoaded = function (segment) {
        if (this.task && this.task.url === segment.url) {
            this.playQueue.push(segment.url);
            if (this.task.onSuccess) {
                this.task.onSuccess(segment.data.slice(0), segment.downloadSpeed);
            }
            this.task = undefined;
        }
    };
    SegmentManager.prototype.onSegmentError = function (url, error) {
        if (this.task && this.task.url === url) {
            if (this.task.onError) {
                this.task.onError(error);
            }
            this.task = undefined;
        }
    };
    SegmentManager.prototype.onSegmentAbort = function (url) {
        if (this.task && this.task.url === url) {
            if (this.task.onError) {
                this.task.onError("Loading aborted: internal abort");
            }
            this.task = undefined;
        }
    };
    SegmentManager.prototype.getSegmentLocation = function (url) {
        if (url) {
            for (var _i = 0, _a = Array.from(this.playlists.values()); _i < _a.length; _i++) {
                var playlist = _a[_i];
                var segmentIndex = playlist.getSegmentIndex(url);
                if (segmentIndex >= 0) {
                    return { playlist: playlist, segmentIndex: segmentIndex };
                }
            }
        }
        return { playlist: undefined, segmentIndex: -1 };
    };
    SegmentManager.prototype.loadSegments = function (playlist, segmentIndex, loadUrl) {
        var segments = [];
        var playlistSegments = playlist.manifest.segments;
        var priority = Math.max(0, this.playQueue.length - 1);
        for (var i = segmentIndex; i < playlistSegments.length; ++i) {
            var segmentUrl = playlist.getSegmentAbsoluteUrl(i);
            segments.push(new p2p_media_loader_core_1.Segment(segmentUrl, priority++));
        }
        this.loader.load(segments, this.getSwarmId(playlist), loadUrl);
    };
    SegmentManager.prototype.getSwarmId = function (playlist) {
        var master = this.getMasterPlaylist();
        if (master && master.url !== playlist.url) {
            var urls = master.getChildPlaylistAbsoluteUrls();
            for (var i = 0; i < urls.length; ++i) {
                if (urls[i] === playlist.url) {
                    return master.url + "+" + i;
                }
            }
        }
        return playlist.url;
    };
    SegmentManager.prototype.getMasterPlaylist = function () {
        for (var _i = 0, _a = Array.from(this.playlists.values()); _i < _a.length; _i++) {
            var playlist = _a[_i];
            if (!!playlist.manifest.playlists) {
                return playlist;
            }
        }
        return undefined;
    };
    SegmentManager.prototype.fetchSegment = function (url, onSuccess, onError) {
        utils_1.default.fetchContentAsArrayBuffer(url).then(function (content) {
            if (onSuccess) {
                onSuccess(content, 0);
            }
        }).catch(function (error) {
            if (onError) {
                onError(error);
            }
        });
    };
    return SegmentManager;
}());
exports.default = SegmentManager;
var Playlist = /** @class */ (function () {
    function Playlist(url, type, manifest) {
        this.url = url;
        this.type = type;
        this.manifest = manifest;
        var pos = url.lastIndexOf("/");
        if (pos === -1) {
            throw "Unexpected playlist URL format";
        }
        this.baseUrl = url.substring(0, pos + 1);
    }
    Playlist.prototype.getSegmentIndex = function (url) {
        for (var i = 0; i < this.manifest.segments.length; ++i) {
            if (url === this.getSegmentAbsoluteUrl(i)) {
                return i;
            }
        }
        return -1;
    };
    Playlist.prototype.getSegmentAbsoluteUrl = function (index) {
        var uri = this.manifest.segments[index].uri;
        return utils_1.default.isAbsoluteUrl(uri) ? uri : this.baseUrl + uri;
    };
    Playlist.prototype.getChildPlaylistAbsoluteUrls = function () {
        var urls = [];
        if (!this.manifest.playlists) {
            return urls;
        }
        for (var _i = 0, _a = this.manifest.playlists; _i < _a.length; _i++) {
            var playlist = _a[_i];
            var url = playlist.uri;
            urls.push(utils_1.default.isAbsoluteUrl(url) ? url : this.baseUrl + url);
        }
        return urls;
    };
    return Playlist;
}());
var Task = /** @class */ (function () {
    function Task(url, onSuccess, onError) {
        this.url = url;
        this.onSuccess = onSuccess;
        this.onError = onError;
    }
    return Task;
}());

},{"./utils":5,"m3u8-parser":6,"p2p-media-loader-core":undefined}],5:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.fetchContentAsAny = function (url, responseType) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", url, true);
                        xhr.responseType = responseType;
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState !== 4) {
                                return;
                            }
                            if (xhr.status >= 200 && xhr.status < 300) {
                                resolve(xhr.response);
                            }
                            else {
                                reject(xhr.statusText);
                            }
                        };
                        xhr.send();
                    })];
            });
        });
    };
    Utils.fetchContentAsText = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Utils.fetchContentAsAny(url, "text")];
            });
        });
    };
    Utils.fetchContentAsArrayBuffer = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Utils.fetchContentAsAny(url, "arraybuffer")];
            });
        });
    };
    Utils.isAbsoluteUrl = function (url) {
        return url.startsWith("http://") || url.startsWith("https://");
    };
    return Utils;
}());
exports.default = Utils;

},{}],6:[function(require,module,exports){
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * @file stream.js
 */
/**
 * A lightweight readable stream implemention that handles event dispatching.
 *
 * @class Stream
 */
var Stream = function () {
  function Stream() {
    classCallCheck(this, Stream);

    this.listeners = {};
  }

  /**
   * Add a listener for a specified event type.
   *
   * @param {String} type the event name
   * @param {Function} listener the callback to be invoked when an event of
   * the specified type occurs
   */


  Stream.prototype.on = function on(type, listener) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  };

  /**
   * Remove a listener for a specified event type.
   *
   * @param {String} type the event name
   * @param {Function} listener  a function previously registered for this
   * type of event through `on`
   * @return {Boolean} if we could turn it off or not
   */


  Stream.prototype.off = function off(type, listener) {
    if (!this.listeners[type]) {
      return false;
    }

    var index = this.listeners[type].indexOf(listener);

    this.listeners[type].splice(index, 1);
    return index > -1;
  };

  /**
   * Trigger an event of the specified type on this stream. Any additional
   * arguments to this function are passed as parameters to event listeners.
   *
   * @param {String} type the event name
   */


  Stream.prototype.trigger = function trigger(type) {
    var callbacks = this.listeners[type];
    var i = void 0;
    var length = void 0;
    var args = void 0;

    if (!callbacks) {
      return;
    }
    // Slicing the arguments on every invocation of this method
    // can add a significant amount of overhead. Avoid the
    // intermediate object creation for the common case of a
    // single callback argument
    if (arguments.length === 2) {
      length = callbacks.length;
      for (i = 0; i < length; ++i) {
        callbacks[i].call(this, arguments[1]);
      }
    } else {
      args = Array.prototype.slice.call(arguments, 1);
      length = callbacks.length;
      for (i = 0; i < length; ++i) {
        callbacks[i].apply(this, args);
      }
    }
  };

  /**
   * Destroys the stream and cleans up.
   */


  Stream.prototype.dispose = function dispose() {
    this.listeners = {};
  };
  /**
   * Forwards all `data` events on this stream to the destination stream. The
   * destination stream should provide a method `push` to receive the data
   * events as they arrive.
   *
   * @param {Stream} destination the stream that will receive all `data` events
   * @see http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
   */


  Stream.prototype.pipe = function pipe(destination) {
    this.on('data', function (data) {
      destination.push(data);
    });
  };

  return Stream;
}();

/**
 * @file m3u8/line-stream.js
 */
/**
 * A stream that buffers string input and generates a `data` event for each
 * line.
 *
 * @class LineStream
 * @extends Stream
 */

var LineStream = function (_Stream) {
  inherits(LineStream, _Stream);

  function LineStream() {
    classCallCheck(this, LineStream);

    var _this = possibleConstructorReturn(this, _Stream.call(this));

    _this.buffer = '';
    return _this;
  }

  /**
   * Add new data to be parsed.
   *
   * @param {String} data the text to process
   */


  LineStream.prototype.push = function push(data) {
    var nextNewline = void 0;

    this.buffer += data;
    nextNewline = this.buffer.indexOf('\n');

    for (; nextNewline > -1; nextNewline = this.buffer.indexOf('\n')) {
      this.trigger('data', this.buffer.substring(0, nextNewline));
      this.buffer = this.buffer.substring(nextNewline + 1);
    }
  };

  return LineStream;
}(Stream);

/**
 * @file m3u8/parse-stream.js
 */
/**
 * "forgiving" attribute list psuedo-grammar:
 * attributes -> keyvalue (',' keyvalue)*
 * keyvalue   -> key '=' value
 * key        -> [^=]*
 * value      -> '"' [^"]* '"' | [^,]*
 */
var attributeSeparator = function attributeSeparator() {
  var key = '[^=]*';
  var value = '"[^"]*"|[^,]*';
  var keyvalue = '(?:' + key + ')=(?:' + value + ')';

  return new RegExp('(?:^|,)(' + keyvalue + ')');
};

/**
 * Parse attributes from a line given the seperator
 *
 * @param {String} attributes the attibute line to parse
 */
var parseAttributes = function parseAttributes(attributes) {
  // split the string using attributes as the separator
  var attrs = attributes.split(attributeSeparator());
  var result = {};
  var i = attrs.length;
  var attr = void 0;

  while (i--) {
    // filter out unmatched portions of the string
    if (attrs[i] === '') {
      continue;
    }

    // split the key and value
    attr = /([^=]*)=(.*)/.exec(attrs[i]).slice(1);
    // trim whitespace and remove optional quotes around the value
    attr[0] = attr[0].replace(/^\s+|\s+$/g, '');
    attr[1] = attr[1].replace(/^\s+|\s+$/g, '');
    attr[1] = attr[1].replace(/^['"](.*)['"]$/g, '$1');
    result[attr[0]] = attr[1];
  }
  return result;
};

/**
 * A line-level M3U8 parser event stream. It expects to receive input one
 * line at a time and performs a context-free parse of its contents. A stream
 * interpretation of a manifest can be useful if the manifest is expected to
 * be too large to fit comfortably into memory or the entirety of the input
 * is not immediately available. Otherwise, it's probably much easier to work
 * with a regular `Parser` object.
 *
 * Produces `data` events with an object that captures the parser's
 * interpretation of the input. That object has a property `tag` that is one
 * of `uri`, `comment`, or `tag`. URIs only have a single additional
 * property, `line`, which captures the entirety of the input without
 * interpretation. Comments similarly have a single additional property
 * `text` which is the input without the leading `#`.
 *
 * Tags always have a property `tagType` which is the lower-cased version of
 * the M3U8 directive without the `#EXT` or `#EXT-X-` prefix. For instance,
 * `#EXT-X-MEDIA-SEQUENCE` becomes `media-sequence` when parsed. Unrecognized
 * tags are given the tag type `unknown` and a single additional property
 * `data` with the remainder of the input.
 *
 * @class ParseStream
 * @extends Stream
 */

var ParseStream = function (_Stream) {
  inherits(ParseStream, _Stream);

  function ParseStream() {
    classCallCheck(this, ParseStream);
    return possibleConstructorReturn(this, _Stream.call(this));
  }

  /**
   * Parses an additional line of input.
   *
   * @param {String} line a single line of an M3U8 file to parse
   */


  ParseStream.prototype.push = function push(line) {
    var match = void 0;
    var event = void 0;

    // strip whitespace
    line = line.replace(/^[\u0000\s]+|[\u0000\s]+$/g, '');
    if (line.length === 0) {
      // ignore empty lines
      return;
    }

    // URIs
    if (line[0] !== '#') {
      this.trigger('data', {
        type: 'uri',
        uri: line
      });
      return;
    }

    // Comments
    if (line.indexOf('#EXT') !== 0) {
      this.trigger('data', {
        type: 'comment',
        text: line.slice(1)
      });
      return;
    }

    // strip off any carriage returns here so the regex matching
    // doesn't have to account for them.
    line = line.replace('\r', '');

    // Tags
    match = /^#EXTM3U/.exec(line);
    if (match) {
      this.trigger('data', {
        type: 'tag',
        tagType: 'm3u'
      });
      return;
    }
    match = /^#EXTINF:?([0-9\.]*)?,?(.*)?$/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'inf'
      };
      if (match[1]) {
        event.duration = parseFloat(match[1]);
      }
      if (match[2]) {
        event.title = match[2];
      }
      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-TARGETDURATION:?([0-9.]*)?/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'targetduration'
      };
      if (match[1]) {
        event.duration = parseInt(match[1], 10);
      }
      this.trigger('data', event);
      return;
    }
    match = /^#ZEN-TOTAL-DURATION:?([0-9.]*)?/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'totalduration'
      };
      if (match[1]) {
        event.duration = parseInt(match[1], 10);
      }
      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-VERSION:?([0-9.]*)?/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'version'
      };
      if (match[1]) {
        event.version = parseInt(match[1], 10);
      }
      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-MEDIA-SEQUENCE:?(\-?[0-9.]*)?/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'media-sequence'
      };
      if (match[1]) {
        event.number = parseInt(match[1], 10);
      }
      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-DISCONTINUITY-SEQUENCE:?(\-?[0-9.]*)?/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'discontinuity-sequence'
      };
      if (match[1]) {
        event.number = parseInt(match[1], 10);
      }
      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-PLAYLIST-TYPE:?(.*)?$/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'playlist-type'
      };
      if (match[1]) {
        event.playlistType = match[1];
      }
      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-BYTERANGE:?([0-9.]*)?@?([0-9.]*)?/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'byterange'
      };
      if (match[1]) {
        event.length = parseInt(match[1], 10);
      }
      if (match[2]) {
        event.offset = parseInt(match[2], 10);
      }
      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-ALLOW-CACHE:?(YES|NO)?/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'allow-cache'
      };
      if (match[1]) {
        event.allowed = !/NO/.test(match[1]);
      }
      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-MAP:?(.*)$/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'map'
      };

      if (match[1]) {
        var attributes = parseAttributes(match[1]);

        if (attributes.URI) {
          event.uri = attributes.URI;
        }
        if (attributes.BYTERANGE) {
          var _attributes$BYTERANGE = attributes.BYTERANGE.split('@'),
              length = _attributes$BYTERANGE[0],
              offset = _attributes$BYTERANGE[1];

          event.byterange = {};
          if (length) {
            event.byterange.length = parseInt(length, 10);
          }
          if (offset) {
            event.byterange.offset = parseInt(offset, 10);
          }
        }
      }

      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-STREAM-INF:?(.*)$/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'stream-inf'
      };
      if (match[1]) {
        event.attributes = parseAttributes(match[1]);

        if (event.attributes.RESOLUTION) {
          var split = event.attributes.RESOLUTION.split('x');
          var resolution = {};

          if (split[0]) {
            resolution.width = parseInt(split[0], 10);
          }
          if (split[1]) {
            resolution.height = parseInt(split[1], 10);
          }
          event.attributes.RESOLUTION = resolution;
        }
        if (event.attributes.BANDWIDTH) {
          event.attributes.BANDWIDTH = parseInt(event.attributes.BANDWIDTH, 10);
        }
        if (event.attributes['PROGRAM-ID']) {
          event.attributes['PROGRAM-ID'] = parseInt(event.attributes['PROGRAM-ID'], 10);
        }
      }
      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-MEDIA:?(.*)$/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'media'
      };
      if (match[1]) {
        event.attributes = parseAttributes(match[1]);
      }
      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-ENDLIST/.exec(line);
    if (match) {
      this.trigger('data', {
        type: 'tag',
        tagType: 'endlist'
      });
      return;
    }
    match = /^#EXT-X-DISCONTINUITY/.exec(line);
    if (match) {
      this.trigger('data', {
        type: 'tag',
        tagType: 'discontinuity'
      });
      return;
    }
    match = /^#EXT-X-PROGRAM-DATE-TIME:?(.*)$/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'program-date-time'
      };
      if (match[1]) {
        event.dateTimeString = match[1];
        event.dateTimeObject = new Date(match[1]);
      }
      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-KEY:?(.*)$/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'key'
      };
      if (match[1]) {
        event.attributes = parseAttributes(match[1]);
        // parse the IV string into a Uint32Array
        if (event.attributes.IV) {
          if (event.attributes.IV.substring(0, 2).toLowerCase() === '0x') {
            event.attributes.IV = event.attributes.IV.substring(2);
          }

          event.attributes.IV = event.attributes.IV.match(/.{8}/g);
          event.attributes.IV[0] = parseInt(event.attributes.IV[0], 16);
          event.attributes.IV[1] = parseInt(event.attributes.IV[1], 16);
          event.attributes.IV[2] = parseInt(event.attributes.IV[2], 16);
          event.attributes.IV[3] = parseInt(event.attributes.IV[3], 16);
          event.attributes.IV = new Uint32Array(event.attributes.IV);
        }
      }
      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-CUE-OUT-CONT:?(.*)?$/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'cue-out-cont'
      };
      if (match[1]) {
        event.data = match[1];
      } else {
        event.data = '';
      }
      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-CUE-OUT:?(.*)?$/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'cue-out'
      };
      if (match[1]) {
        event.data = match[1];
      } else {
        event.data = '';
      }
      this.trigger('data', event);
      return;
    }
    match = /^#EXT-X-CUE-IN:?(.*)?$/.exec(line);
    if (match) {
      event = {
        type: 'tag',
        tagType: 'cue-in'
      };
      if (match[1]) {
        event.data = match[1];
      } else {
        event.data = '';
      }
      this.trigger('data', event);
      return;
    }

    // unknown tag type
    this.trigger('data', {
      type: 'tag',
      data: line.slice(4)
    });
  };

  return ParseStream;
}(Stream);

/**
 * @file m3u8/parser.js
 */
/**
 * A parser for M3U8 files. The current interpretation of the input is
 * exposed as a property `manifest` on parser objects. It's just two lines to
 * create and parse a manifest once you have the contents available as a string:
 *
 * ```js
 * var parser = new m3u8.Parser();
 * parser.push(xhr.responseText);
 * ```
 *
 * New input can later be applied to update the manifest object by calling
 * `push` again.
 *
 * The parser attempts to create a usable manifest object even if the
 * underlying input is somewhat nonsensical. It emits `info` and `warning`
 * events during the parse if it encounters input that seems invalid or
 * requires some property of the manifest object to be defaulted.
 *
 * @class Parser
 * @extends Stream
 */

var Parser = function (_Stream) {
  inherits(Parser, _Stream);

  function Parser() {
    classCallCheck(this, Parser);

    var _this = possibleConstructorReturn(this, _Stream.call(this));

    _this.lineStream = new LineStream();
    _this.parseStream = new ParseStream();
    _this.lineStream.pipe(_this.parseStream);
    /* eslint-disable consistent-this */
    var self = _this;
    /* eslint-enable consistent-this */
    var uris = [];
    var currentUri = {};
    // if specified, the active EXT-X-MAP definition
    var currentMap = void 0;
    // if specified, the active decryption key
    var _key = void 0;
    var noop = function noop() {};
    var defaultMediaGroups = {
      'AUDIO': {},
      'VIDEO': {},
      'CLOSED-CAPTIONS': {},
      'SUBTITLES': {}
    };
    // group segments into numbered timelines delineated by discontinuities
    var currentTimeline = 0;

    // the manifest is empty until the parse stream begins delivering data
    _this.manifest = {
      allowCache: true,
      discontinuityStarts: [],
      segments: []
    };

    // update the manifest with the m3u8 entry from the parse stream
    _this.parseStream.on('data', function (entry) {
      var mediaGroup = void 0;
      var rendition = void 0;

      ({
        tag: function tag() {
          // switch based on the tag type
          (({
            'allow-cache': function allowCache() {
              this.manifest.allowCache = entry.allowed;
              if (!('allowed' in entry)) {
                this.trigger('info', {
                  message: 'defaulting allowCache to YES'
                });
                this.manifest.allowCache = true;
              }
            },
            byterange: function byterange() {
              var byterange = {};

              if ('length' in entry) {
                currentUri.byterange = byterange;
                byterange.length = entry.length;

                if (!('offset' in entry)) {
                  this.trigger('info', {
                    message: 'defaulting offset to zero'
                  });
                  entry.offset = 0;
                }
              }
              if ('offset' in entry) {
                currentUri.byterange = byterange;
                byterange.offset = entry.offset;
              }
            },
            endlist: function endlist() {
              this.manifest.endList = true;
            },
            inf: function inf() {
              if (!('mediaSequence' in this.manifest)) {
                this.manifest.mediaSequence = 0;
                this.trigger('info', {
                  message: 'defaulting media sequence to zero'
                });
              }
              if (!('discontinuitySequence' in this.manifest)) {
                this.manifest.discontinuitySequence = 0;
                this.trigger('info', {
                  message: 'defaulting discontinuity sequence to zero'
                });
              }
              if (entry.duration > 0) {
                currentUri.duration = entry.duration;
              }

              if (entry.duration === 0) {
                currentUri.duration = 0.01;
                this.trigger('info', {
                  message: 'updating zero segment duration to a small value'
                });
              }

              this.manifest.segments = uris;
            },
            key: function key() {
              if (!entry.attributes) {
                this.trigger('warn', {
                  message: 'ignoring key declaration without attribute list'
                });
                return;
              }
              // clear the active encryption key
              if (entry.attributes.METHOD === 'NONE') {
                _key = null;
                return;
              }
              if (!entry.attributes.URI) {
                this.trigger('warn', {
                  message: 'ignoring key declaration without URI'
                });
                return;
              }
              if (!entry.attributes.METHOD) {
                this.trigger('warn', {
                  message: 'defaulting key method to AES-128'
                });
              }

              // setup an encryption key for upcoming segments
              _key = {
                method: entry.attributes.METHOD || 'AES-128',
                uri: entry.attributes.URI
              };

              if (typeof entry.attributes.IV !== 'undefined') {
                _key.iv = entry.attributes.IV;
              }
            },
            'media-sequence': function mediaSequence() {
              if (!isFinite(entry.number)) {
                this.trigger('warn', {
                  message: 'ignoring invalid media sequence: ' + entry.number
                });
                return;
              }
              this.manifest.mediaSequence = entry.number;
            },
            'discontinuity-sequence': function discontinuitySequence() {
              if (!isFinite(entry.number)) {
                this.trigger('warn', {
                  message: 'ignoring invalid discontinuity sequence: ' + entry.number
                });
                return;
              }
              this.manifest.discontinuitySequence = entry.number;
              currentTimeline = entry.number;
            },
            'playlist-type': function playlistType() {
              if (!/VOD|EVENT/.test(entry.playlistType)) {
                this.trigger('warn', {
                  message: 'ignoring unknown playlist type: ' + entry.playlist
                });
                return;
              }
              this.manifest.playlistType = entry.playlistType;
            },
            map: function map() {
              currentMap = {};
              if (entry.uri) {
                currentMap.uri = entry.uri;
              }
              if (entry.byterange) {
                currentMap.byterange = entry.byterange;
              }
            },
            'stream-inf': function streamInf() {
              this.manifest.playlists = uris;
              this.manifest.mediaGroups = this.manifest.mediaGroups || defaultMediaGroups;

              if (!entry.attributes) {
                this.trigger('warn', {
                  message: 'ignoring empty stream-inf attributes'
                });
                return;
              }

              if (!currentUri.attributes) {
                currentUri.attributes = {};
              }
              _extends(currentUri.attributes, entry.attributes);
            },
            media: function media() {
              this.manifest.mediaGroups = this.manifest.mediaGroups || defaultMediaGroups;

              if (!(entry.attributes && entry.attributes.TYPE && entry.attributes['GROUP-ID'] && entry.attributes.NAME)) {
                this.trigger('warn', {
                  message: 'ignoring incomplete or missing media group'
                });
                return;
              }

              // find the media group, creating defaults as necessary
              var mediaGroupType = this.manifest.mediaGroups[entry.attributes.TYPE];

              mediaGroupType[entry.attributes['GROUP-ID']] = mediaGroupType[entry.attributes['GROUP-ID']] || {};
              mediaGroup = mediaGroupType[entry.attributes['GROUP-ID']];

              // collect the rendition metadata
              rendition = {
                'default': /yes/i.test(entry.attributes.DEFAULT)
              };
              if (rendition['default']) {
                rendition.autoselect = true;
              } else {
                rendition.autoselect = /yes/i.test(entry.attributes.AUTOSELECT);
              }
              if (entry.attributes.LANGUAGE) {
                rendition.language = entry.attributes.LANGUAGE;
              }
              if (entry.attributes.URI) {
                rendition.uri = entry.attributes.URI;
              }
              if (entry.attributes['INSTREAM-ID']) {
                rendition.instreamId = entry.attributes['INSTREAM-ID'];
              }
              if (entry.attributes.CHARACTERISTICS) {
                rendition.characteristics = entry.attributes.CHARACTERISTICS;
              }
              if (entry.attributes.FORCED) {
                rendition.forced = /yes/i.test(entry.attributes.FORCED);
              }

              // insert the new rendition
              mediaGroup[entry.attributes.NAME] = rendition;
            },
            discontinuity: function discontinuity() {
              currentTimeline += 1;
              currentUri.discontinuity = true;
              this.manifest.discontinuityStarts.push(uris.length);
            },
            'program-date-time': function programDateTime() {
              this.manifest.dateTimeString = entry.dateTimeString;
              this.manifest.dateTimeObject = entry.dateTimeObject;
            },
            targetduration: function targetduration() {
              if (!isFinite(entry.duration) || entry.duration < 0) {
                this.trigger('warn', {
                  message: 'ignoring invalid target duration: ' + entry.duration
                });
                return;
              }
              this.manifest.targetDuration = entry.duration;
            },
            totalduration: function totalduration() {
              if (!isFinite(entry.duration) || entry.duration < 0) {
                this.trigger('warn', {
                  message: 'ignoring invalid total duration: ' + entry.duration
                });
                return;
              }
              this.manifest.totalDuration = entry.duration;
            },
            'cue-out': function cueOut() {
              currentUri.cueOut = entry.data;
            },
            'cue-out-cont': function cueOutCont() {
              currentUri.cueOutCont = entry.data;
            },
            'cue-in': function cueIn() {
              currentUri.cueIn = entry.data;
            }
          })[entry.tagType] || noop).call(self);
        },
        uri: function uri() {
          currentUri.uri = entry.uri;
          uris.push(currentUri);

          // if no explicit duration was declared, use the target duration
          if (this.manifest.targetDuration && !('duration' in currentUri)) {
            this.trigger('warn', {
              message: 'defaulting segment duration to the target duration'
            });
            currentUri.duration = this.manifest.targetDuration;
          }
          // annotate with encryption information, if necessary
          if (_key) {
            currentUri.key = _key;
          }
          currentUri.timeline = currentTimeline;
          // annotate with initialization segment information, if necessary
          if (currentMap) {
            currentUri.map = currentMap;
          }

          // prepare for the next URI
          currentUri = {};
        },
        comment: function comment() {
          // comments are not important for playback
        }
      })[entry.type].call(self);
    });

    return _this;
  }

  /**
   * Parse the input string and update the manifest object.
   *
   * @param {String} chunk a potentially incomplete portion of the manifest
   */


  Parser.prototype.push = function push(chunk) {
    this.lineStream.push(chunk);
  };

  /**
   * Flush any remaining input. This can be handy if the last line of an M3U8
   * manifest did not contain a trailing newline but the file has been
   * completely received.
   */


  Parser.prototype.end = function end() {
    // flush any buffered input
    this.lineStream.push('\n');
  };

  return Parser;
}(Stream);

/**
 * @file m3u8/index.js
 *
 * Utilities for parsing M3U8 files. If the entire manifest is available,
 * `Parser` will create an object representation with enough detail for managing
 * playback. `ParseStream` and `LineStream` are lower-level parsing primitives
 * that do not assume the entirety of the manifest is ready and expose a
 * ReadableStream-like interface.
 */

exports.LineStream = LineStream;
exports.ParseStream = ParseStream;
exports.Parser = Parser;

},{}],"p2p-media-loader-hlsjs":[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var p2p_media_loader_core_1 = require("p2p-media-loader-core");
var segment_manager_1 = require("./segment-manager");
var hlsjs_loader_1 = require("./hlsjs-loader");
var hlsjs_loader_class_1 = require("./hlsjs-loader-class");
function initHlsJsEvents(player, segmentManager) {
    player.on("hlsFragChanged", function (event, data) {
        var url = data && data.frag ? data.frag.url : undefined;
        segmentManager.setCurrentSegment(url);
    });
    player.on("hlsDestroying", function () {
        segmentManager.destroy();
    });
}
function createLoaderClass(settings) {
    if (settings === void 0) { settings = {}; }
    var manager = settings.segmentManager || new segment_manager_1.default(new p2p_media_loader_core_1.HybridLoader(settings.loaderSettings));
    return hlsjs_loader_class_1.createHlsJsLoaderClass(hlsjs_loader_1.default, manager);
}
exports.createLoaderClass = createLoaderClass;
function initHlsJsPlayer(player) {
    if (player && player.config && player.config.loader && typeof player.config.loader.getSegmentManager === "function") {
        initHlsJsEvents(player, player.config.loader.getSegmentManager());
    }
}
exports.initHlsJsPlayer = initHlsJsPlayer;
function initClapprPlayer(player) {
    player.on("play", function () {
        var playback = player.core.getCurrentPlayback();
        if (playback._hls && !playback._hls._p2pm_linitialized) {
            playback._hls._p2pm_linitialized = true;
            initHlsJsPlayer(player.core.getCurrentPlayback()._hls);
        }
    });
}
exports.initClapprPlayer = initClapprPlayer;
function initFlowplayerHlsJsPlayer(player) {
    player.on("ready", function () { return initHlsJsPlayer(player.engine.hlsjs); });
}
exports.initFlowplayerHlsJsPlayer = initFlowplayerHlsJsPlayer;
function initVideoJsContribHlsJsPlayer(player) {
    player.ready(function () {
        var options = player.tech_.options_;
        if (options && options.hlsjsConfig && options.hlsjsConfig.loader && typeof options.hlsjsConfig.loader.getSegmentManager === "function") {
            initHlsJsEvents(player.tech_, options.hlsjsConfig.loader.getSegmentManager());
        }
    });
}
exports.initVideoJsContribHlsJsPlayer = initVideoJsContribHlsJsPlayer;
function initMediaElementJsPlayer(mediaElement) {
    mediaElement.addEventListener("hlsFragChanged", function (event) {
        var url = event.data && event.data.length > 1 && event.data[1].frag ? event.data[1].frag.url : undefined;
        var hls = mediaElement.hlsPlayer;
        if (hls && hls.config && hls.config.loader && typeof hls.config.loader.getSegmentManager === "function") {
            var segmentManager = hls.config.loader.getSegmentManager();
            segmentManager.setCurrentSegment(url);
        }
    });
    mediaElement.addEventListener("hlsDestroying", function () {
        var hls = mediaElement.hlsPlayer;
        if (hls && hls.config && hls.config.loader && typeof hls.config.loader.getSegmentManager === "function") {
            var segmentManager = hls.config.loader.getSegmentManager();
            segmentManager.destroy();
        }
    });
}
exports.initMediaElementJsPlayer = initMediaElementJsPlayer;
var segment_manager_2 = require("./segment-manager");
exports.SegmentManager = segment_manager_2.default;

},{"./hlsjs-loader":3,"./hlsjs-loader-class":2,"./segment-manager":4,"p2p-media-loader-core":undefined}]},{},[1]);
