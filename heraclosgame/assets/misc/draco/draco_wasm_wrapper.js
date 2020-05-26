var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(d, k, f) {
    d != Array.prototype && d != Object.prototype && (d[k] = f.value)
};
$jscomp.getGlobal = function(d) {
    return "undefined" != typeof window && window === d ? d : "undefined" != typeof global && null != global ? global : d
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(d, k, f, v) {
    if (k) {
        f = $jscomp.global;
        d = d.split(".");
        for (v = 0; v < d.length - 1; v++) {
            var h = d[v];
            h in f || (f[h] = {});
            f = f[h]
        }
        d = d[d.length - 1];
        v = f[d];
        k = k(v);
        k != v && null != k && $jscomp.defineProperty(f, d, {
            configurable: !0,
            writable: !0,
            value: k
        })
    }
};
$jscomp.polyfill("Math.imul", function(d) {
    return d ? d : function(d, f) {
        d = Number(d);
        f = Number(f);
        var k = d & 65535,
            h = f & 65535;
        return k * h + ((d >>> 16 & 65535) * h + k * (f >>> 16 & 65535) << 16 >>> 0) | 0
    }
}, "es6", "es3");
$jscomp.polyfill("Math.clz32", function(d) {
    return d ? d : function(d) {
        d = Number(d) >>> 0;
        if (0 === d) return 32;
        var f = 0;
        0 === (d & 4294901760) && (d <<= 16, f += 16);
        0 === (d & 4278190080) && (d <<= 8, f += 8);
        0 === (d & 4026531840) && (d <<= 4, f += 4);
        0 === (d & 3221225472) && (d <<= 2, f += 2);
        0 === (d & 2147483648) && f++;
        return f
    }
}, "es6", "es3");
$jscomp.polyfill("Math.trunc", function(d) {
    return d ? d : function(d) {
        d = Number(d);
        if (isNaN(d) || Infinity === d || -Infinity === d || 0 === d) return d;
        var f = Math.floor(Math.abs(d));
        return 0 > d ? -f : f
    }
}, "es6", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
    $jscomp.initSymbol = function() {};
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
};
$jscomp.Symbol = function() {
    var d = 0;
    return function(k) {
        return $jscomp.SYMBOL_PREFIX + (k || "") + d++
    }
}();
$jscomp.initSymbolIterator = function() {
    $jscomp.initSymbol();
    var d = $jscomp.global.Symbol.iterator;
    d || (d = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
    "function" != typeof Array.prototype[d] && $jscomp.defineProperty(Array.prototype, d, {
        configurable: !0,
        writable: !0,
        value: function() {
            return $jscomp.arrayIterator(this)
        }
    });
    $jscomp.initSymbolIterator = function() {}
};
$jscomp.arrayIterator = function(d) {
    var k = 0;
    return $jscomp.iteratorPrototype(function() {
        return k < d.length ? {
            done: !1,
            value: d[k++]
        } : {
            done: !0
        }
    })
};
$jscomp.iteratorPrototype = function(d) {
    $jscomp.initSymbolIterator();
    d = {
        next: d
    };
    d[$jscomp.global.Symbol.iterator] = function() {
        return this
    };
    return d
};
$jscomp.makeIterator = function(d) {
    $jscomp.initSymbolIterator();
    var k = d[Symbol.iterator];
    return k ? k.call(d) : $jscomp.arrayIterator(d)
};
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill("Promise", function(d) {
    function k() {
        this.batch_ = null
    }

    function f(d) {
        return d instanceof h ? d : new h(function(r, f) {
            r(d)
        })
    }
    if (d && !$jscomp.FORCE_POLYFILL_PROMISE) return d;
    k.prototype.asyncExecute = function(d) {
        null == this.batch_ && (this.batch_ = [], this.asyncExecuteBatch_());
        this.batch_.push(d);
        return this
    };
    k.prototype.asyncExecuteBatch_ = function() {
        var d = this;
        this.asyncExecuteFunction(function() {
            d.executeBatch_()
        })
    };
    var v = $jscomp.global.setTimeout;
    k.prototype.asyncExecuteFunction = function(d) {
        v(d,
            0)
    };
    k.prototype.executeBatch_ = function() {
        for (; this.batch_ && this.batch_.length;) {
            var d = this.batch_;
            this.batch_ = [];
            for (var B = 0; B < d.length; ++B) {
                var f = d[B];
                delete d[B];
                try {
                    f()
                } catch (w) {
                    this.asyncThrow_(w)
                }
            }
        }
        this.batch_ = null
    };
    k.prototype.asyncThrow_ = function(d) {
        this.asyncExecuteFunction(function() {
            throw d;
        })
    };
    var h = function(d) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        var r = this.createResolveAndReject_();
        try {
            d(r.resolve, r.reject)
        } catch (Y) {
            r.reject(Y)
        }
    };
    h.prototype.createResolveAndReject_ =
        function() {
            function d(d) {
                return function(r) {
                    h || (h = !0, d.call(f, r))
                }
            }
            var f = this,
                h = !1;
            return {
                resolve: d(this.resolveTo_),
                reject: d(this.reject_)
            }
        };
    h.prototype.resolveTo_ = function(d) {
        if (d === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
        else if (d instanceof h) this.settleSameAsPromise_(d);
        else {
            a: switch (typeof d) {
                case "object":
                    var f = null != d;
                    break a;
                case "function":
                    f = !0;
                    break a;
                default:
                    f = !1
            }
            f ? this.resolveToNonPromiseObj_(d) : this.fulfill_(d)
        }
    };
    h.prototype.resolveToNonPromiseObj_ = function(d) {
        var f =
            void 0;
        try {
            f = d.then
        } catch (Y) {
            this.reject_(Y);
            return
        }
        "function" == typeof f ? this.settleSameAsThenable_(f, d) : this.fulfill_(d)
    };
    h.prototype.reject_ = function(d) {
        this.settle_(2, d)
    };
    h.prototype.fulfill_ = function(d) {
        this.settle_(1, d)
    };
    h.prototype.settle_ = function(d, f) {
        if (0 != this.state_) throw Error("Cannot settle(" + d + ", " + f | "): Promise already settled in state" + this.state_);
        this.state_ = d;
        this.result_ = f;
        this.executeOnSettledCallbacks_()
    };
    h.prototype.executeOnSettledCallbacks_ = function() {
        if (null != this.onSettledCallbacks_) {
            for (var d =
                    this.onSettledCallbacks_, f = 0; f < d.length; ++f) d[f].call(), d[f] = null;
            this.onSettledCallbacks_ = null
        }
    };
    var ha = new k;
    h.prototype.settleSameAsPromise_ = function(d) {
        var f = this.createResolveAndReject_();
        d.callWhenSettled_(f.resolve, f.reject)
    };
    h.prototype.settleSameAsThenable_ = function(d, f) {
        var h = this.createResolveAndReject_();
        try {
            d.call(f, h.resolve, h.reject)
        } catch (w) {
            h.reject(w)
        }
    };
    h.prototype.then = function(d, f) {
        function k(d, f) {
            return "function" == typeof d ? function(f) {
                try {
                    w(d(f))
                } catch (O) {
                    r(O)
                }
            } : f
        }
        var w, r, B = new h(function(d,
            f) {
            w = d;
            r = f
        });
        this.callWhenSettled_(k(d, w), k(f, r));
        return B
    };
    h.prototype.catch = function(d) {
        return this.then(void 0, d)
    };
    h.prototype.callWhenSettled_ = function(d, f) {
        function h() {
            switch (k.state_) {
                case 1:
                    d(k.result_);
                    break;
                case 2:
                    f(k.result_);
                    break;
                default:
                    throw Error("Unexpected state: " + k.state_);
            }
        }
        var k = this;
        null == this.onSettledCallbacks_ ? ha.asyncExecute(h) : this.onSettledCallbacks_.push(function() {
            ha.asyncExecute(h)
        })
    };
    h.resolve = f;
    h.reject = function(d) {
        return new h(function(f, h) {
            h(d)
        })
    };
    h.race = function(d) {
        return new h(function(h,
            k) {
            for (var w = $jscomp.makeIterator(d), r = w.next(); !r.done; r = w.next()) f(r.value).callWhenSettled_(h, k)
        })
    };
    h.all = function(d) {
        var k = $jscomp.makeIterator(d),
            r = k.next();
        return r.done ? f([]) : new h(function(d, h) {
            function w(f) {
                return function(h) {
                    v[f] = h;
                    B--;
                    0 == B && d(v)
                }
            }
            var v = [],
                B = 0;
            do v.push(void 0), B++, f(r.value).callWhenSettled_(w(v.length - 1), h), r = k.next(); while (!r.done)
        })
    };
    return h
}, "es6", "es3");
var DracoDecoderModule = function(d) {
    function k(a, b) {
        b || (b = 16);
        return Math.ceil(a / b) * b
    }

    function f(a, b) {
        a || O("Assertion failed: " + b)
    }

    function v(a, b) {
        if (0 === b || !a) return "";
        for (var c = 0, e, d = 0;;) {
            e = W[a + d >> 0];
            c |= e;
            if (0 == e && !b) break;
            d++;
            if (b && d == b) break
        }
        b || (b = d);
        e = "";
        if (128 > c) {
            for (; 0 < b;) c = String.fromCharCode.apply(String, W.subarray(a, a + Math.min(b, 1024))), e = e ? e + c : c, a += 1024, b -= 1024;
            return e
        }
        return h(W, a)
    }

    function h(a, b) {
        for (var c = b; a[c];) ++c;
        if (16 < c - b && a.subarray && Ia) return Ia.decode(a.subarray(b, c));
        for (c =
            "";;) {
            var e = a[b++];
            if (!e) return c;
            if (e & 128) {
                var d = a[b++] & 63;
                if (192 == (e & 224)) c += String.fromCharCode((e & 31) << 6 | d);
                else {
                    var f = a[b++] & 63;
                    if (224 == (e & 240)) e = (e & 15) << 12 | d << 6 | f;
                    else {
                        var g = a[b++] & 63;
                        if (240 == (e & 248)) e = (e & 7) << 18 | d << 12 | f << 6 | g;
                        else {
                            var h = a[b++] & 63;
                            if (248 == (e & 252)) e = (e & 3) << 24 | d << 18 | f << 12 | g << 6 | h;
                            else {
                                var k = a[b++] & 63;
                                e = (e & 1) << 30 | d << 24 | f << 18 | g << 12 | h << 6 | k
                            }
                        }
                    }
                    65536 > e ? c += String.fromCharCode(e) : (e -= 65536, c += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023))
                }
            } else c += String.fromCharCode(e)
        }
    }

    function ha(a, b) {
        0 <
            a % b && (a += b - a % b);
        return a
    }

    function r() {
        a.HEAP8 = ia = new Int8Array(D);
        a.HEAP16 = Ja = new Int16Array(D);
        a.HEAP32 = E = new Int32Array(D);
        a.HEAPU8 = W = new Uint8Array(D);
        a.HEAPU16 = new Uint16Array(D);
        a.HEAPU32 = new Uint32Array(D);
        a.HEAPF32 = new Float32Array(D);
        a.HEAPF64 = new Float64Array(D)
    }

    function B(e) {
        for (; 0 < e.length;) {
            var b = e.shift();
            if ("function" == typeof b) b();
            else {
                var c = b.func;
                "number" === typeof c ? void 0 === b.arg ? a.dynCall_v(c) : a.dynCall_vi(c, b.arg) : c(void 0 === b.arg ? null : b.arg)
            }
        }
    }

    function Y(a) {
        return String.prototype.startsWith ?
            a.startsWith("data:application/octet-stream;base64,") : 0 === a.indexOf("data:application/octet-stream;base64,")
    }

    function w() {
        return !!w.uncaught_exception
    }

    function la() {
        var e = y.last;
        if (!e) return (sa(0), 0) | 0;
        var b = y.infos[e],
            c = b.type;
        if (!c) return (sa(0), e) | 0;
        var p = Array.prototype.slice.call(arguments);
        a.___cxa_is_pointer_type(c);
        la.buffer || (la.buffer = Ka(4));
        E[la.buffer >> 2] = e;
        e = la.buffer;
        for (var d = 0; d < p.length; d++)
            if (p[d] && a.___cxa_can_catch(p[d], c, e)) return e = E[e >> 2], b.adjusted = e, (sa(p[d]), e) | 0;
        e = E[e >> 2];
        return (sa(c), e) | 0
    }

    function Z(e, b) {
        u.varargs = b;
        try {
            var c = u.get(),
                p = u.get(),
                d = u.get();
            e = 0;
            Z.buffers || (Z.buffers = [null, [],
                []
            ], Z.printChar = function(b, c) {
                var e = Z.buffers[b];
                f(e);
                0 === c || 10 === c ? ((1 === b ? a.print : a.printErr)(h(e, 0)), e.length = 0) : e.push(c)
            });
            for (b = 0; b < d; b++) {
                for (var g = E[p + 8 * b >> 2], k = E[p + (8 * b + 4) >> 2], l = 0; l < k; l++) Z.printChar(c, W[g + l]);
                e += k
            }
            return e
        } catch (ya) {
            return "undefined" !== typeof FS && ya instanceof FS.ErrnoError || O(ya), -ya.errno
        }
    }

    function ma(e, b) {
        ma.seen || (ma.seen = {});
        e in ma.seen || (a.dynCall_v(b),
            ma.seen[e] = 1)
    }

    function na(a) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + a + ")";
        this.status = a
    }

    function wa(e) {
        function b() {
            if (!a.calledRun && (a.calledRun = !0, !oa)) {
                La || (La = !0, B(Ma));
                B(Na);
                if (a.onRuntimeInitialized) a.onRuntimeInitialized();
                if (a.postRun)
                    for ("function" == typeof a.postRun && (a.postRun = [a.postRun]); a.postRun.length;) Oa.unshift(a.postRun.shift());
                B(Oa)
            }
        }
        if (!(0 < ea)) {
            if (a.preRun)
                for ("function" == typeof a.preRun && (a.preRun = [a.preRun]); a.preRun.length;) Pa.unshift(a.preRun.shift());
            B(Pa);
            0 < ea || a.calledRun || (a.setStatus ? (a.setStatus("Running..."), setTimeout(function() {
                setTimeout(function() {
                    a.setStatus("")
                }, 1);
                b()
            }, 1)) : b())
        }
    }

    function O(e) {
        if (a.onAbort) a.onAbort(e);
        void 0 !== e ? (a.print(e), a.printErr(e), e = JSON.stringify(e)) : e = "";
        oa = !0;
        throw "abort(" + e + "). Build with -s ASSERTIONS=1 for more info.";
    }

    function m() {}

    function t(a) {
        return (a || m).__cache__
    }

    function T(a, b) {
        var c = t(b),
            e = c[a];
        if (e) return e;
        e = Object.create((b || m).prototype);
        e.ptr = a;
        return c[a] = e
    }

    function U(a) {
        if ("string" === typeof a) {
            for (var b =
                    0, c = 0; c < a.length; ++c) {
                var e = a.charCodeAt(c);
                55296 <= e && 57343 >= e && (e = 65536 + ((e & 1023) << 10) | a.charCodeAt(++c) & 1023);
                127 >= e ? ++b : b = 2047 >= e ? b + 2 : 65535 >= e ? b + 3 : 2097151 >= e ? b + 4 : 67108863 >= e ? b + 5 : b + 6
            }
            b = Array(b + 1);
            c = 0;
            e = b.length;
            if (0 < e) {
                e = c + e - 1;
                for (var d = 0; d < a.length; ++d) {
                    var f = a.charCodeAt(d);
                    55296 <= f && 57343 >= f && (f = 65536 + ((f & 1023) << 10) | a.charCodeAt(++d) & 1023);
                    if (127 >= f) {
                        if (c >= e) break;
                        b[c++] = f
                    } else {
                        if (2047 >= f) {
                            if (c + 1 >= e) break;
                            b[c++] = 192 | f >> 6
                        } else {
                            if (65535 >= f) {
                                if (c + 2 >= e) break;
                                b[c++] = 224 | f >> 12
                            } else {
                                if (2097151 >= f) {
                                    if (c +
                                        3 >= e) break;
                                    b[c++] = 240 | f >> 18
                                } else {
                                    if (67108863 >= f) {
                                        if (c + 4 >= e) break;
                                        b[c++] = 248 | f >> 24
                                    } else {
                                        if (c + 5 >= e) break;
                                        b[c++] = 252 | f >> 30;
                                        b[c++] = 128 | f >> 24 & 63
                                    }
                                    b[c++] = 128 | f >> 18 & 63
                                }
                                b[c++] = 128 | f >> 12 & 63
                            }
                            b[c++] = 128 | f >> 6 & 63
                        }
                        b[c++] = 128 | f & 63
                    }
                }
                b[c] = 0
            }
            a = l.alloc(b, ia);
            l.copy(b, ia, a)
        }
        return a
    }

    function z() {
        throw "cannot construct a Status, no constructor in IDL";
    }

    function F() {
        this.ptr = Wa();
        t(F)[this.ptr] = this
    }

    function G() {
        this.ptr = Xa();
        t(G)[this.ptr] = this
    }

    function H() {
        this.ptr = Ya();
        t(H)[this.ptr] = this
    }

    function I() {
        this.ptr = Za();
        t(I)[this.ptr] = this
    }

    function J() {
        this.ptr = $a();
        t(J)[this.ptr] = this
    }

    function n() {
        this.ptr = ab();
        t(n)[this.ptr] = this
    }

    function P() {
        this.ptr = bb();
        t(P)[this.ptr] = this
    }

    function x() {
        this.ptr = cb();
        t(x)[this.ptr] = this
    }

    function K() {
        this.ptr = db();
        t(K)[this.ptr] = this
    }

    function q() {
        this.ptr = eb();
        t(q)[this.ptr] = this
    }

    function L() {
        this.ptr = fb();
        t(L)[this.ptr] = this
    }

    function M() {
        this.ptr = gb();
        t(M)[this.ptr] = this
    }

    function V() {
        this.ptr = hb();
        t(V)[this.ptr] = this
    }

    function Q() {
        this.ptr = ib();
        t(Q)[this.ptr] = this
    }

    function g() {
        this.ptr =
            jb();
        t(g)[this.ptr] = this
    }

    function C() {
        this.ptr = kb();
        t(C)[this.ptr] = this
    }

    function X() {
        throw "cannot construct a VoidPtr, no constructor in IDL";
    }

    function N() {
        this.ptr = lb();
        t(N)[this.ptr] = this
    }

    function R() {
        this.ptr = mb();
        t(R)[this.ptr] = this
    }
    d = d || {};
    var a = "undefined" !== typeof d ? d : {},
        Qa = !1,
        Ra = !1;
    a.onRuntimeInitialized = function() {
        Qa = !0;
        if (Ra && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a)
    };
    a.onModuleParsed = function() {
        Ra = !0;
        if (Qa && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a)
    };
    a.isVersionSupported =
        function(a) {
            if ("string" !== typeof a) return !1;
            a = a.split(".");
            return 2 > a.length || 3 < a.length ? !1 : 1 == a[0] && 0 <= a[1] && 3 >= a[1] ? !0 : 0 != a[0] || 10 < a[1] ? !1 : !0
        };
    var pa = {},
        aa;
    for (aa in a) a.hasOwnProperty(aa) && (pa[aa] = a[aa]);
    a.arguments = [];
    a.thisProgram = "./this.program";
    a.quit = function(a, b) {
        throw b;
    };
    a.preRun = [];
    a.postRun = [];
    var ja = !1,
        fa = !1,
        qa = !1,
        za = !1;
    if (a.ENVIRONMENT)
        if ("WEB" === a.ENVIRONMENT) ja = !0;
        else if ("WORKER" === a.ENVIRONMENT) fa = !0;
    else if ("NODE" === a.ENVIRONMENT) qa = !0;
    else if ("SHELL" === a.ENVIRONMENT) za = !0;
    else throw Error("Module['ENVIRONMENT'] value is not valid. must be one of: WEB|WORKER|NODE|SHELL.");
    else ja = "object" === typeof window, fa = "function" === typeof importScripts, qa = "object" === typeof process && "function" === typeof require && !ja && !fa, za = !ja && !qa && !fa;
    if (qa) {
        var Aa, Ba;
        a.read = function(a, b) {
            Aa || (Aa = require("fs"));
            Ba || (Ba = require("path"));
            a = Ba.normalize(a);
            a = Aa.readFileSync(a);
            return b ? a : a.toString()
        };
        a.readBinary = function(e) {
            e = a.read(e, !0);
            e.buffer || (e = new Uint8Array(e));
            f(e.buffer);
            return e
        };
        1 < process.argv.length && (a.thisProgram = process.argv[1].replace(/\\/g, "/"));
        a.arguments = process.argv.slice(2);
        process.on("uncaughtException", function(a) {
            if (!(a instanceof na)) throw a;
        });
        process.on("unhandledRejection", function(a, b) {
            process.exit(1)
        });
        a.inspect = function() {
            return "[Emscripten Module object]"
        }
    } else if (za) "undefined" != typeof read && (a.read = function(a) {
            return read(a)
        }), a.readBinary = function(a) {
            if ("function" === typeof readbuffer) return new Uint8Array(readbuffer(a));
            a = read(a, "binary");
            f("object" === typeof a);
            return a
        }, "undefined" != typeof scriptArgs ? a.arguments = scriptArgs : "undefined" != typeof arguments &&
        (a.arguments = arguments), "function" === typeof quit && (a.quit = function(a, b) {
            quit(a)
        });
    else if (ja || fa) a.read = function(a) {
        var b = new XMLHttpRequest;
        b.open("GET", a, !1);
        b.send(null);
        return b.responseText
    }, fa && (a.readBinary = function(a) {
        var b = new XMLHttpRequest;
        b.open("GET", a, !1);
        b.responseType = "arraybuffer";
        b.send(null);
        return new Uint8Array(b.response)
    }), a.readAsync = function(a, b, c) {
        var e = new XMLHttpRequest;
        e.open("GET", a, !0);
        e.responseType = "arraybuffer";
        e.onload = function() {
            200 == e.status || 0 == e.status && e.response ?
                b(e.response) : c()
        };
        e.onerror = c;
        e.send(null)
    }, a.setWindowTitle = function(a) {
        document.title = a
    };
    a.print = "undefined" !== typeof console ? console.log.bind(console) : "undefined" !== typeof print ? print : null;
    a.printErr = "undefined" !== typeof printErr ? printErr : "undefined" !== typeof console && console.warn.bind(console) || a.print;
    a.print = a.print;
    a.printErr = a.printErr;
    for (aa in pa) pa.hasOwnProperty(aa) && (a[aa] = pa[aa]);
    pa = void 0;
    var oa = 0,
        Ia = "undefined" !== typeof TextDecoder ? new TextDecoder("utf8") : void 0;
    "undefined" !== typeof TextDecoder &&
        new TextDecoder("utf-16le");
    var ia, W, Ja, E, ba, Ca, ta, ua, Da, ka;
    var Ea = ba = Ca = ta = ua = Da = ka = 0;
    var Sa = !1;
    a.reallocBuffer || (a.reallocBuffer = function(a) {
        try {
            if (ArrayBuffer.transfer) var b = ArrayBuffer.transfer(D, a);
            else {
                var c = ia;
                b = new ArrayBuffer(a);
                (new Int8Array(b)).set(c)
            }
        } catch (p) {
            return !1
        }
        return nb(b) ? b : !1
    });
    try {
        var Ta = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get);
        Ta(new ArrayBuffer(4))
    } catch (e) {
        Ta = function(a) {
            return a.byteLength
        }
    }
    var Fa = a.TOTAL_STACK ||
        5242880,
        A = a.TOTAL_MEMORY || 16777216;
    A < Fa && a.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + A + "! (TOTAL_STACK=" + Fa + ")");
    if (a.buffer) var D = a.buffer;
    else "object" === typeof WebAssembly && "function" === typeof WebAssembly.Memory ? (a.wasmMemory = new WebAssembly.Memory({
        initial: A / 65536
    }), D = a.wasmMemory.buffer) : D = new ArrayBuffer(A), a.buffer = D;
    r();
    E[0] = 1668509029;
    Ja[1] = 25459;
    if (115 !== W[2] || 99 !== W[3]) throw "Runtime error: expected the system to be little-endian!";
    var Pa = [],
        Ma = [],
        Na = [],
        ob = [],
        Oa = [],
        La = !1,
        pb = Math.floor,
        ea = 0,
        Ga = null,
        ra = null;
    a.preloadedImages = {};
    a.preloadedAudios = {};
    (function() {
        function e() {
            try {
                if (a.wasmBinary) return new Uint8Array(a.wasmBinary);
                if (a.readBinary) return a.readBinary(f);
                throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)";
            } catch (Va) {
                O(Va)
            }
        }

        function b() {
            return a.wasmBinary || !ja && !fa || "function" !== typeof fetch ? new Promise(function(a, b) {
                a(e())
            }) : fetch(f, {
                credentials: "same-origin"
            }).then(function(a) {
                if (!a.ok) throw "failed to load wasm binary file at '" +
                    f + "'";
                return a.arrayBuffer()
            }).catch(function() {
                return e()
            })
        }

        function c(c, e, d) {
            function p(b, c) {
                k = b.exports;
                k.memory && (b = k.memory, c = a.buffer, b.byteLength < c.byteLength && a.printErr("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here"), c = new Int8Array(c), (new Int8Array(b)).set(c), a.buffer = D = b, r());
                a.asm = k;
                a.usingWasm = !0;
                ea--;
                a.monitorRunDependencies && a.monitorRunDependencies(ea);
                0 == ea && (null !== Ga && (clearInterval(Ga), Ga = null), ra && (b = ra, ra = null, b()))
            }

            function g(a) {
                p(a.instance, a.module)
            }

            function S(c) {
                b().then(function(a) {
                    return WebAssembly.instantiate(a, h)
                }).then(c).catch(function(b) {
                    a.printErr("failed to asynchronously prepare wasm: " + b);
                    O(b)
                })
            }
            if ("object" !== typeof WebAssembly) return a.printErr("no native wasm support detected"), !1;
            if (!(a.wasmMemory instanceof WebAssembly.Memory)) return a.printErr("no native wasm Memory in use"), !1;
            e.memory = a.wasmMemory;
            h.global = {
                NaN: NaN,
                Infinity: Infinity
            };
            h["global.Math"] = Math;
            h.env = e;
            ea++;
            a.monitorRunDependencies &&
                a.monitorRunDependencies(ea);
            if (a.instantiateWasm) try {
                return a.instantiateWasm(h, p)
            } catch (qb) {
                return a.printErr("Module.instantiateWasm callback failed with error: " + qb), !1
            }
            a.wasmBinary || "function" !== typeof WebAssembly.instantiateStreaming || Y(f) || "function" !== typeof fetch ? S(g) : WebAssembly.instantiateStreaming(fetch(f, {
                credentials: "same-origin"
            }), h).then(g).catch(function(b) {
                a.printErr("wasm streaming compile failed: " + b);
                a.printErr("falling back to ArrayBuffer instantiation");
                S(g)
            });
            return {}
        }
        var d =
            "draco_decoder.wast",
            f = "draco_decoder.wasm",
            g = "draco_decoder.temp.asm.js";
        "function" === typeof a.locateFile && (Y(d) || (d = a.locateFile(d)), Y(f) || (f = a.locateFile(f)), Y(g) || (g = a.locateFile(g)));
        var h = {
                global: null,
                env: null,
                asm2wasm: {
                    "f64-rem": function(a, b) {
                        return a % b
                    },
                    "debugger": function() {
                        debugger
                    }
                },
                parent: a
            },
            k = null;
        a.asmPreload = a.asm;
        var l = a.reallocBuffer;
        a.reallocBuffer = function(b) {
            if ("asmjs" === m) var c = l(b);
            else a: {
                b = ha(b, a.usingWasm ? 65536 : 16777216);
                var e = a.buffer.byteLength;
                if (a.usingWasm) try {
                    c = -1 !==
                        a.wasmMemory.grow((b - e) / 65536) ? a.buffer = a.wasmMemory.buffer : null;
                    break a
                } catch (vd) {
                    c = null;
                    break a
                }
                c = void 0
            }
            return c
        };
        var m = "";
        a.asm = function(b, e, d) {
            if (!e.table) {
                var p = a.wasmTableSize;
                void 0 === p && (p = 1024);
                var f = a.wasmMaxTableSize;
                e.table = "object" === typeof WebAssembly && "function" === typeof WebAssembly.Table ? void 0 !== f ? new WebAssembly.Table({
                    initial: p,
                    maximum: f,
                    element: "anyfunc"
                }) : new WebAssembly.Table({
                    initial: p,
                    element: "anyfunc"
                }) : Array(p);
                a.wasmTable = e.table
            }
            e.memoryBase || (e.memoryBase = a.STATIC_BASE);
            e.tableBase || (e.tableBase = 0);
            (b = c(b, e, d)) || O("no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods");
            return b
        }
    })();
    Ea = 1024;
    ba = Ea + 19088;
    Ma.push();
    a.STATIC_BASE = Ea;
    a.STATIC_BUMP = 19088;
    var rb = ba;
    ba += 16;
    var y = {
            last: 0,
            caught: [],
            infos: {},
            deAdjust: function(a) {
                if (!a || y.infos[a]) return a;
                for (var b in y.infos)
                    if (y.infos[b].adjusted === a) return b;
                return a
            },
            addRef: function(a) {
                a && y.infos[a].refcount++
            },
            decRef: function(e) {
                if (e) {
                    var b = y.infos[e];
                    f(0 < b.refcount);
                    b.refcount--;
                    0 !== b.refcount || b.rethrown || (b.destructor && a.dynCall_vi(b.destructor, e), delete y.infos[e], ___cxa_free_exception(e))
                }
            },
            clearRef: function(a) {
                a && (y.infos[a].refcount = 0)
            }
        },
        u = {
            varargs: 0,
            get: function(a) {
                u.varargs += 4;
                return E[u.varargs - 4 >> 2]
            },
            getStr: function() {
                return v(u.get())
            },
            get64: function() {
                var a = u.get(),
                    b = u.get();
                0 <= a ? f(0 === b) : f(-1 === b);
                return a
            },
            getZero: function() {
                f(0 === u.get())
            }
        },
        va = {},
        Ha = 1;
    ka = function(a) {
        f(!Sa);
        var b = ba;
        ba = ba +
            a + 15 & -16;
        return b
    }(4);
    Ca = ta = k(ba);
    ua = Ca + Fa;
    Da = k(ua);
    E[ka >> 2] = Da;
    Sa = !0;
    a.wasmTableSize = 492;
    a.wasmMaxTableSize = 492;
    a.asmGlobalArg = {};
    a.asmLibraryArg = {
        abort: O,
        assert: f,
        enlargeMemory: function() {
            var e = a.usingWasm ? 65536 : 16777216,
                b = 2147483648 - e;
            if (E[ka >> 2] > b) return !1;
            var c = A;
            for (A = Math.max(A, 16777216); A < E[ka >> 2];) A = 536870912 >= A ? ha(2 * A, e) : Math.min(ha((3 * A + 2147483648) / 4, e), b);
            e = a.reallocBuffer(A);
            if (!e || e.byteLength != A) return A = c, !1;
            a.buffer = D = e;
            r();
            return !0
        },
        getTotalMemory: function() {
            return A
        },
        abortOnCannotGrowMemory: function() {
            O("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " +
                A + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")
        },
        invoke_ii: function(e, b) {
            try {
                return a.dynCall_ii(e, b)
            } catch (c) {
                if ("number" !== typeof c && "longjmp" !== c) throw c;
                a.setThrew(1, 0)
            }
        },
        invoke_iii: function(e, b, c) {
            try {
                return a.dynCall_iii(e, b, c)
            } catch (p) {
                if ("number" !== typeof p && "longjmp" !== p) throw p;
                a.setThrew(1, 0)
            }
        },
        invoke_iiii: function(e, b, c, d) {
            try {
                return a.dynCall_iiii(e,
                    b, c, d)
            } catch (S) {
                if ("number" !== typeof S && "longjmp" !== S) throw S;
                a.setThrew(1, 0)
            }
        },
        invoke_iiiiiii: function(e, b, c, d, f, g, h) {
            try {
                return a.dynCall_iiiiiii(e, b, c, d, f, g, h)
            } catch (da) {
                if ("number" !== typeof da && "longjmp" !== da) throw da;
                a.setThrew(1, 0)
            }
        },
        invoke_v: function(e) {
            try {
                a.dynCall_v(e)
            } catch (b) {
                if ("number" !== typeof b && "longjmp" !== b) throw b;
                a.setThrew(1, 0)
            }
        },
        invoke_vi: function(e, b) {
            try {
                a.dynCall_vi(e, b)
            } catch (c) {
                if ("number" !== typeof c && "longjmp" !== c) throw c;
                a.setThrew(1, 0)
            }
        },
        invoke_vii: function(e, b, c) {
            try {
                a.dynCall_vii(e,
                    b, c)
            } catch (p) {
                if ("number" !== typeof p && "longjmp" !== p) throw p;
                a.setThrew(1, 0)
            }
        },
        invoke_viii: function(e, b, c, d) {
            try {
                a.dynCall_viii(e, b, c, d)
            } catch (S) {
                if ("number" !== typeof S && "longjmp" !== S) throw S;
                a.setThrew(1, 0)
            }
        },
        invoke_viiii: function(e, b, c, d, f) {
            try {
                a.dynCall_viiii(e, b, c, d, f)
            } catch (xa) {
                if ("number" !== typeof xa && "longjmp" !== xa) throw xa;
                a.setThrew(1, 0)
            }
        },
        invoke_viiiii: function(e, b, c, d, f, g) {
            try {
                a.dynCall_viiiii(e, b, c, d, f, g)
            } catch (ca) {
                if ("number" !== typeof ca && "longjmp" !== ca) throw ca;
                a.setThrew(1, 0)
            }
        },
        invoke_viiiiii: function(e,
            b, c, d, f, g, h) {
            try {
                a.dynCall_viiiiii(e, b, c, d, f, g, h)
            } catch (da) {
                if ("number" !== typeof da && "longjmp" !== da) throw da;
                a.setThrew(1, 0)
            }
        },
        __ZSt18uncaught_exceptionv: w,
        ___cxa_allocate_exception: function(a) {
            return Ka(a)
        },
        ___cxa_begin_catch: function(a) {
            var b = y.infos[a];
            b && !b.caught && (b.caught = !0, w.uncaught_exception--);
            b && (b.rethrown = !1);
            y.caught.push(a);
            y.addRef(y.deAdjust(a));
            return a
        },
        ___cxa_find_matching_catch: la,
        ___cxa_pure_virtual: function() {
            oa = !0;
            throw "Pure virtual function called!";
        },
        ___cxa_throw: function(a,
            b, c) {
            y.infos[a] = {
                ptr: a,
                adjusted: a,
                type: b,
                destructor: c,
                refcount: 0,
                caught: !1,
                rethrown: !1
            };
            y.last = a;
            "uncaught_exception" in w ? w.uncaught_exception++ : w.uncaught_exception = 1;
            throw a + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
        },
        ___gxx_personality_v0: function() {},
        ___resumeException: function(a) {
            y.last || (y.last = a);
            throw a + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
        },
        ___setErrNo: function(d) {
            a.___errno_location && (E[a.___errno_location() >> 2] = d);
            return d
        },
        ___syscall140: function(a, b) {
            u.varargs = b;
            try {
                var c = u.getStreamFromFD();
                u.get();
                var d = u.get(),
                    e = u.get(),
                    f = u.get();
                FS.llseek(c, d, f);
                E[e >> 2] = c.position;
                c.getdents && 0 === d && 0 === f && (c.getdents = null);
                return 0
            } catch (ca) {
                return "undefined" !== typeof FS && ca instanceof FS.ErrnoError || O(ca), -ca.errno
            }
        },
        ___syscall146: Z,
        ___syscall54: function(a, b) {
            u.varargs = b;
            return 0
        },
        ___syscall6: function(a, b) {
            u.varargs = b;
            try {
                var c = u.getStreamFromFD();
                FS.close(c);
                return 0
            } catch (p) {
                return "undefined" !== typeof FS && p instanceof FS.ErrnoError || O(p), -p.errno
            }
        },
        _abort: function() {
            a.abort()
        },
        _emscripten_memcpy_big: function(a, b, c) {
            W.set(W.subarray(b, b + c), a);
            return a
        },
        _llvm_floor_f64: pb,
        _llvm_trap: function() {
            O("trap!")
        },
        _pthread_getspecific: function(a) {
            return va[a] || 0
        },
        _pthread_key_create: function(a, b) {
            if (0 == a) return 22;
            E[a >> 2] = Ha;
            va[Ha] = 0;
            Ha++;
            return 0
        },
        _pthread_once: ma,
        _pthread_setspecific: function(a, b) {
            if (!(a in va)) return 22;
            va[a] = b;
            return 0
        },
        flush_NO_FILESYSTEM: function() {
            var d =
                a._fflush;
            d && d(0);
            if (d = Z.printChar) {
                var b = Z.buffers;
                b[1].length && d(1, 10);
                b[2].length && d(2, 10)
            }
        },
        DYNAMICTOP_PTR: ka,
        tempDoublePtr: rb,
        ABORT: oa,
        STACKTOP: ta,
        STACK_MAX: ua
    };
    var Ua = a.asm(a.asmGlobalArg, a.asmLibraryArg, D);
    a.asm = Ua;
    a.___cxa_can_catch = function() {
        return a.asm.___cxa_can_catch.apply(null, arguments)
    };
    a.___cxa_is_pointer_type = function() {
        return a.asm.___cxa_is_pointer_type.apply(null, arguments)
    };
    var $a = a._emscripten_bind_AttributeOctahedronTransform_AttributeOctahedronTransform_0 = function() {
            return a.asm._emscripten_bind_AttributeOctahedronTransform_AttributeOctahedronTransform_0.apply(null,
                arguments)
        },
        sb = a._emscripten_bind_AttributeOctahedronTransform_InitFromAttribute_1 = function() {
            return a.asm._emscripten_bind_AttributeOctahedronTransform_InitFromAttribute_1.apply(null, arguments)
        },
        tb = a._emscripten_bind_AttributeOctahedronTransform___destroy___0 = function() {
            return a.asm._emscripten_bind_AttributeOctahedronTransform___destroy___0.apply(null, arguments)
        },
        ub = a._emscripten_bind_AttributeOctahedronTransform_quantization_bits_0 = function() {
            return a.asm._emscripten_bind_AttributeOctahedronTransform_quantization_bits_0.apply(null,
                arguments)
        },
        cb = a._emscripten_bind_AttributeQuantizationTransform_AttributeQuantizationTransform_0 = function() {
            return a.asm._emscripten_bind_AttributeQuantizationTransform_AttributeQuantizationTransform_0.apply(null, arguments)
        },
        vb = a._emscripten_bind_AttributeQuantizationTransform_InitFromAttribute_1 = function() {
            return a.asm._emscripten_bind_AttributeQuantizationTransform_InitFromAttribute_1.apply(null, arguments)
        },
        wb = a._emscripten_bind_AttributeQuantizationTransform___destroy___0 = function() {
            return a.asm._emscripten_bind_AttributeQuantizationTransform___destroy___0.apply(null,
                arguments)
        },
        xb = a._emscripten_bind_AttributeQuantizationTransform_min_value_1 = function() {
            return a.asm._emscripten_bind_AttributeQuantizationTransform_min_value_1.apply(null, arguments)
        },
        yb = a._emscripten_bind_AttributeQuantizationTransform_quantization_bits_0 = function() {
            return a.asm._emscripten_bind_AttributeQuantizationTransform_quantization_bits_0.apply(null, arguments)
        },
        zb = a._emscripten_bind_AttributeQuantizationTransform_range_0 = function() {
            return a.asm._emscripten_bind_AttributeQuantizationTransform_range_0.apply(null,
                arguments)
        },
        bb = a._emscripten_bind_AttributeTransformData_AttributeTransformData_0 = function() {
            return a.asm._emscripten_bind_AttributeTransformData_AttributeTransformData_0.apply(null, arguments)
        },
        Ab = a._emscripten_bind_AttributeTransformData___destroy___0 = function() {
            return a.asm._emscripten_bind_AttributeTransformData___destroy___0.apply(null, arguments)
        },
        Bb = a._emscripten_bind_AttributeTransformData_transform_type_0 = function() {
            return a.asm._emscripten_bind_AttributeTransformData_transform_type_0.apply(null,
                arguments)
        },
        ib = a._emscripten_bind_DecoderBuffer_DecoderBuffer_0 = function() {
            return a.asm._emscripten_bind_DecoderBuffer_DecoderBuffer_0.apply(null, arguments)
        },
        Cb = a._emscripten_bind_DecoderBuffer_Init_2 = function() {
            return a.asm._emscripten_bind_DecoderBuffer_Init_2.apply(null, arguments)
        },
        Db = a._emscripten_bind_DecoderBuffer___destroy___0 = function() {
            return a.asm._emscripten_bind_DecoderBuffer___destroy___0.apply(null, arguments)
        },
        Eb = a._emscripten_bind_Decoder_DecodeBufferToMesh_2 = function() {
            return a.asm._emscripten_bind_Decoder_DecodeBufferToMesh_2.apply(null,
                arguments)
        },
        Fb = a._emscripten_bind_Decoder_DecodeBufferToPointCloud_2 = function() {
            return a.asm._emscripten_bind_Decoder_DecodeBufferToPointCloud_2.apply(null, arguments)
        },
        jb = a._emscripten_bind_Decoder_Decoder_0 = function() {
            return a.asm._emscripten_bind_Decoder_Decoder_0.apply(null, arguments)
        },
        Gb = a._emscripten_bind_Decoder_GetAttributeByUniqueId_2 = function() {
            return a.asm._emscripten_bind_Decoder_GetAttributeByUniqueId_2.apply(null, arguments)
        },
        Hb = a._emscripten_bind_Decoder_GetAttributeFloatForAllPoints_3 =
        function() {
            return a.asm._emscripten_bind_Decoder_GetAttributeFloatForAllPoints_3.apply(null, arguments)
        },
        Ib = a._emscripten_bind_Decoder_GetAttributeFloat_3 = function() {
            return a.asm._emscripten_bind_Decoder_GetAttributeFloat_3.apply(null, arguments)
        },
        Jb = a._emscripten_bind_Decoder_GetAttributeIdByMetadataEntry_3 = function() {
            return a.asm._emscripten_bind_Decoder_GetAttributeIdByMetadataEntry_3.apply(null, arguments)
        },
        Kb = a._emscripten_bind_Decoder_GetAttributeIdByName_2 = function() {
            return a.asm._emscripten_bind_Decoder_GetAttributeIdByName_2.apply(null,
                arguments)
        },
        Lb = a._emscripten_bind_Decoder_GetAttributeId_2 = function() {
            return a.asm._emscripten_bind_Decoder_GetAttributeId_2.apply(null, arguments)
        },
        Mb = a._emscripten_bind_Decoder_GetAttributeInt16ForAllPoints_3 = function() {
            return a.asm._emscripten_bind_Decoder_GetAttributeInt16ForAllPoints_3.apply(null, arguments)
        },
        Nb = a._emscripten_bind_Decoder_GetAttributeInt32ForAllPoints_3 = function() {
            return a.asm._emscripten_bind_Decoder_GetAttributeInt32ForAllPoints_3.apply(null, arguments)
        },
        Ob = a._emscripten_bind_Decoder_GetAttributeInt8ForAllPoints_3 =
        function() {
            return a.asm._emscripten_bind_Decoder_GetAttributeInt8ForAllPoints_3.apply(null, arguments)
        },
        Pb = a._emscripten_bind_Decoder_GetAttributeIntForAllPoints_3 = function() {
            return a.asm._emscripten_bind_Decoder_GetAttributeIntForAllPoints_3.apply(null, arguments)
        },
        Qb = a._emscripten_bind_Decoder_GetAttributeMetadata_2 = function() {
            return a.asm._emscripten_bind_Decoder_GetAttributeMetadata_2.apply(null, arguments)
        },
        Rb = a._emscripten_bind_Decoder_GetAttributeUInt16ForAllPoints_3 = function() {
            return a.asm._emscripten_bind_Decoder_GetAttributeUInt16ForAllPoints_3.apply(null,
                arguments)
        },
        Sb = a._emscripten_bind_Decoder_GetAttributeUInt32ForAllPoints_3 = function() {
            return a.asm._emscripten_bind_Decoder_GetAttributeUInt32ForAllPoints_3.apply(null, arguments)
        },
        Tb = a._emscripten_bind_Decoder_GetAttributeUInt8ForAllPoints_3 = function() {
            return a.asm._emscripten_bind_Decoder_GetAttributeUInt8ForAllPoints_3.apply(null, arguments)
        },
        Ub = a._emscripten_bind_Decoder_GetAttribute_2 = function() {
            return a.asm._emscripten_bind_Decoder_GetAttribute_2.apply(null, arguments)
        },
        Vb = a._emscripten_bind_Decoder_GetEncodedGeometryType_1 =
        function() {
            return a.asm._emscripten_bind_Decoder_GetEncodedGeometryType_1.apply(null, arguments)
        },
        Wb = a._emscripten_bind_Decoder_GetFaceFromMesh_3 = function() {
            return a.asm._emscripten_bind_Decoder_GetFaceFromMesh_3.apply(null, arguments)
        },
        Xb = a._emscripten_bind_Decoder_GetMetadata_1 = function() {
            return a.asm._emscripten_bind_Decoder_GetMetadata_1.apply(null, arguments)
        },
        Yb = a._emscripten_bind_Decoder_GetTriangleStripsFromMesh_2 = function() {
            return a.asm._emscripten_bind_Decoder_GetTriangleStripsFromMesh_2.apply(null,
                arguments)
        },
        Zb = a._emscripten_bind_Decoder_SkipAttributeTransform_1 = function() {
            return a.asm._emscripten_bind_Decoder_SkipAttributeTransform_1.apply(null, arguments)
        },
        $b = a._emscripten_bind_Decoder___destroy___0 = function() {
            return a.asm._emscripten_bind_Decoder___destroy___0.apply(null, arguments)
        },
        gb = a._emscripten_bind_DracoFloat32Array_DracoFloat32Array_0 = function() {
            return a.asm._emscripten_bind_DracoFloat32Array_DracoFloat32Array_0.apply(null, arguments)
        },
        ac = a._emscripten_bind_DracoFloat32Array_GetValue_1 =
        function() {
            return a.asm._emscripten_bind_DracoFloat32Array_GetValue_1.apply(null, arguments)
        },
        bc = a._emscripten_bind_DracoFloat32Array___destroy___0 = function() {
            return a.asm._emscripten_bind_DracoFloat32Array___destroy___0.apply(null, arguments)
        },
        cc = a._emscripten_bind_DracoFloat32Array_size_0 = function() {
            return a.asm._emscripten_bind_DracoFloat32Array_size_0.apply(null, arguments)
        },
        fb = a._emscripten_bind_DracoInt16Array_DracoInt16Array_0 = function() {
            return a.asm._emscripten_bind_DracoInt16Array_DracoInt16Array_0.apply(null,
                arguments)
        },
        dc = a._emscripten_bind_DracoInt16Array_GetValue_1 = function() {
            return a.asm._emscripten_bind_DracoInt16Array_GetValue_1.apply(null, arguments)
        },
        ec = a._emscripten_bind_DracoInt16Array___destroy___0 = function() {
            return a.asm._emscripten_bind_DracoInt16Array___destroy___0.apply(null, arguments)
        },
        fc = a._emscripten_bind_DracoInt16Array_size_0 = function() {
            return a.asm._emscripten_bind_DracoInt16Array_size_0.apply(null, arguments)
        },
        lb = a._emscripten_bind_DracoInt32Array_DracoInt32Array_0 = function() {
            return a.asm._emscripten_bind_DracoInt32Array_DracoInt32Array_0.apply(null,
                arguments)
        },
        gc = a._emscripten_bind_DracoInt32Array_GetValue_1 = function() {
            return a.asm._emscripten_bind_DracoInt32Array_GetValue_1.apply(null, arguments)
        },
        hc = a._emscripten_bind_DracoInt32Array___destroy___0 = function() {
            return a.asm._emscripten_bind_DracoInt32Array___destroy___0.apply(null, arguments)
        },
        ic = a._emscripten_bind_DracoInt32Array_size_0 = function() {
            return a.asm._emscripten_bind_DracoInt32Array_size_0.apply(null, arguments)
        },
        db = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = function() {
            return a.asm._emscripten_bind_DracoInt8Array_DracoInt8Array_0.apply(null,
                arguments)
        },
        jc = a._emscripten_bind_DracoInt8Array_GetValue_1 = function() {
            return a.asm._emscripten_bind_DracoInt8Array_GetValue_1.apply(null, arguments)
        },
        kc = a._emscripten_bind_DracoInt8Array___destroy___0 = function() {
            return a.asm._emscripten_bind_DracoInt8Array___destroy___0.apply(null, arguments)
        },
        lc = a._emscripten_bind_DracoInt8Array_size_0 = function() {
            return a.asm._emscripten_bind_DracoInt8Array_size_0.apply(null, arguments)
        },
        Wa = a._emscripten_bind_DracoUInt16Array_DracoUInt16Array_0 = function() {
            return a.asm._emscripten_bind_DracoUInt16Array_DracoUInt16Array_0.apply(null,
                arguments)
        },
        mc = a._emscripten_bind_DracoUInt16Array_GetValue_1 = function() {
            return a.asm._emscripten_bind_DracoUInt16Array_GetValue_1.apply(null, arguments)
        },
        nc = a._emscripten_bind_DracoUInt16Array___destroy___0 = function() {
            return a.asm._emscripten_bind_DracoUInt16Array___destroy___0.apply(null, arguments)
        },
        oc = a._emscripten_bind_DracoUInt16Array_size_0 = function() {
            return a.asm._emscripten_bind_DracoUInt16Array_size_0.apply(null, arguments)
        },
        Za = a._emscripten_bind_DracoUInt32Array_DracoUInt32Array_0 = function() {
            return a.asm._emscripten_bind_DracoUInt32Array_DracoUInt32Array_0.apply(null,
                arguments)
        },
        pc = a._emscripten_bind_DracoUInt32Array_GetValue_1 = function() {
            return a.asm._emscripten_bind_DracoUInt32Array_GetValue_1.apply(null, arguments)
        },
        qc = a._emscripten_bind_DracoUInt32Array___destroy___0 = function() {
            return a.asm._emscripten_bind_DracoUInt32Array___destroy___0.apply(null, arguments)
        },
        rc = a._emscripten_bind_DracoUInt32Array_size_0 = function() {
            return a.asm._emscripten_bind_DracoUInt32Array_size_0.apply(null, arguments)
        },
        Ya = a._emscripten_bind_DracoUInt8Array_DracoUInt8Array_0 = function() {
            return a.asm._emscripten_bind_DracoUInt8Array_DracoUInt8Array_0.apply(null,
                arguments)
        },
        sc = a._emscripten_bind_DracoUInt8Array_GetValue_1 = function() {
            return a.asm._emscripten_bind_DracoUInt8Array_GetValue_1.apply(null, arguments)
        },
        tc = a._emscripten_bind_DracoUInt8Array___destroy___0 = function() {
            return a.asm._emscripten_bind_DracoUInt8Array___destroy___0.apply(null, arguments)
        },
        uc = a._emscripten_bind_DracoUInt8Array_size_0 = function() {
            return a.asm._emscripten_bind_DracoUInt8Array_size_0.apply(null, arguments)
        },
        hb = a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = function() {
            return a.asm._emscripten_bind_GeometryAttribute_GeometryAttribute_0.apply(null,
                arguments)
        },
        vc = a._emscripten_bind_GeometryAttribute___destroy___0 = function() {
            return a.asm._emscripten_bind_GeometryAttribute___destroy___0.apply(null, arguments)
        },
        kb = a._emscripten_bind_Mesh_Mesh_0 = function() {
            return a.asm._emscripten_bind_Mesh_Mesh_0.apply(null, arguments)
        },
        wc = a._emscripten_bind_Mesh___destroy___0 = function() {
            return a.asm._emscripten_bind_Mesh___destroy___0.apply(null, arguments)
        },
        xc = a._emscripten_bind_Mesh_num_attributes_0 = function() {
            return a.asm._emscripten_bind_Mesh_num_attributes_0.apply(null,
                arguments)
        },
        yc = a._emscripten_bind_Mesh_num_faces_0 = function() {
            return a.asm._emscripten_bind_Mesh_num_faces_0.apply(null, arguments)
        },
        zc = a._emscripten_bind_Mesh_num_points_0 = function() {
            return a.asm._emscripten_bind_Mesh_num_points_0.apply(null, arguments)
        },
        Ac = a._emscripten_bind_MetadataQuerier_GetDoubleEntry_2 = function() {
            return a.asm._emscripten_bind_MetadataQuerier_GetDoubleEntry_2.apply(null, arguments)
        },
        Bc = a._emscripten_bind_MetadataQuerier_GetEntryName_2 = function() {
            return a.asm._emscripten_bind_MetadataQuerier_GetEntryName_2.apply(null,
                arguments)
        },
        Cc = a._emscripten_bind_MetadataQuerier_GetIntEntry_2 = function() {
            return a.asm._emscripten_bind_MetadataQuerier_GetIntEntry_2.apply(null, arguments)
        },
        Dc = a._emscripten_bind_MetadataQuerier_GetStringEntry_2 = function() {
            return a.asm._emscripten_bind_MetadataQuerier_GetStringEntry_2.apply(null, arguments)
        },
        Ec = a._emscripten_bind_MetadataQuerier_HasDoubleEntry_2 = function() {
            return a.asm._emscripten_bind_MetadataQuerier_HasDoubleEntry_2.apply(null, arguments)
        },
        Fc = a._emscripten_bind_MetadataQuerier_HasEntry_2 =
        function() {
            return a.asm._emscripten_bind_MetadataQuerier_HasEntry_2.apply(null, arguments)
        },
        Gc = a._emscripten_bind_MetadataQuerier_HasIntEntry_2 = function() {
            return a.asm._emscripten_bind_MetadataQuerier_HasIntEntry_2.apply(null, arguments)
        },
        Hc = a._emscripten_bind_MetadataQuerier_HasStringEntry_2 = function() {
            return a.asm._emscripten_bind_MetadataQuerier_HasStringEntry_2.apply(null, arguments)
        },
        eb = a._emscripten_bind_MetadataQuerier_MetadataQuerier_0 = function() {
            return a.asm._emscripten_bind_MetadataQuerier_MetadataQuerier_0.apply(null,
                arguments)
        },
        Ic = a._emscripten_bind_MetadataQuerier_NumEntries_1 = function() {
            return a.asm._emscripten_bind_MetadataQuerier_NumEntries_1.apply(null, arguments)
        },
        Jc = a._emscripten_bind_MetadataQuerier___destroy___0 = function() {
            return a.asm._emscripten_bind_MetadataQuerier___destroy___0.apply(null, arguments)
        },
        mb = a._emscripten_bind_Metadata_Metadata_0 = function() {
            return a.asm._emscripten_bind_Metadata_Metadata_0.apply(null, arguments)
        },
        Kc = a._emscripten_bind_Metadata___destroy___0 = function() {
            return a.asm._emscripten_bind_Metadata___destroy___0.apply(null,
                arguments)
        },
        Lc = a._emscripten_bind_PointAttribute_GetAttributeTransformData_0 = function() {
            return a.asm._emscripten_bind_PointAttribute_GetAttributeTransformData_0.apply(null, arguments)
        },
        ab = a._emscripten_bind_PointAttribute_PointAttribute_0 = function() {
            return a.asm._emscripten_bind_PointAttribute_PointAttribute_0.apply(null, arguments)
        },
        Mc = a._emscripten_bind_PointAttribute___destroy___0 = function() {
            return a.asm._emscripten_bind_PointAttribute___destroy___0.apply(null, arguments)
        },
        Nc = a._emscripten_bind_PointAttribute_attribute_type_0 =
        function() {
            return a.asm._emscripten_bind_PointAttribute_attribute_type_0.apply(null, arguments)
        },
        Oc = a._emscripten_bind_PointAttribute_byte_offset_0 = function() {
            return a.asm._emscripten_bind_PointAttribute_byte_offset_0.apply(null, arguments)
        },
        Pc = a._emscripten_bind_PointAttribute_byte_stride_0 = function() {
            return a.asm._emscripten_bind_PointAttribute_byte_stride_0.apply(null, arguments)
        },
        Qc = a._emscripten_bind_PointAttribute_data_type_0 = function() {
            return a.asm._emscripten_bind_PointAttribute_data_type_0.apply(null,
                arguments)
        },
        Rc = a._emscripten_bind_PointAttribute_normalized_0 = function() {
            return a.asm._emscripten_bind_PointAttribute_normalized_0.apply(null, arguments)
        },
        Sc = a._emscripten_bind_PointAttribute_num_components_0 = function() {
            return a.asm._emscripten_bind_PointAttribute_num_components_0.apply(null, arguments)
        },
        Tc = a._emscripten_bind_PointAttribute_size_0 = function() {
            return a.asm._emscripten_bind_PointAttribute_size_0.apply(null, arguments)
        },
        Uc = a._emscripten_bind_PointAttribute_unique_id_0 = function() {
            return a.asm._emscripten_bind_PointAttribute_unique_id_0.apply(null,
                arguments)
        },
        Xa = a._emscripten_bind_PointCloud_PointCloud_0 = function() {
            return a.asm._emscripten_bind_PointCloud_PointCloud_0.apply(null, arguments)
        },
        Vc = a._emscripten_bind_PointCloud___destroy___0 = function() {
            return a.asm._emscripten_bind_PointCloud___destroy___0.apply(null, arguments)
        },
        Wc = a._emscripten_bind_PointCloud_num_attributes_0 = function() {
            return a.asm._emscripten_bind_PointCloud_num_attributes_0.apply(null, arguments)
        },
        Xc = a._emscripten_bind_PointCloud_num_points_0 = function() {
            return a.asm._emscripten_bind_PointCloud_num_points_0.apply(null,
                arguments)
        },
        Yc = a._emscripten_bind_Status___destroy___0 = function() {
            return a.asm._emscripten_bind_Status___destroy___0.apply(null, arguments)
        },
        Zc = a._emscripten_bind_Status_code_0 = function() {
            return a.asm._emscripten_bind_Status_code_0.apply(null, arguments)
        },
        $c = a._emscripten_bind_Status_error_msg_0 = function() {
            return a.asm._emscripten_bind_Status_error_msg_0.apply(null, arguments)
        },
        ad = a._emscripten_bind_Status_ok_0 = function() {
            return a.asm._emscripten_bind_Status_ok_0.apply(null, arguments)
        },
        bd = a._emscripten_bind_VoidPtr___destroy___0 =
        function() {
            return a.asm._emscripten_bind_VoidPtr___destroy___0.apply(null, arguments)
        },
        cd = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_INVALID_TRANSFORM = function() {
            return a.asm._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_INVALID_TRANSFORM.apply(null, arguments)
        },
        dd = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_NO_TRANSFORM = function() {
            return a.asm._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_NO_TRANSFORM.apply(null, arguments)
        },
        ed = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_OCTAHEDRON_TRANSFORM =
        function() {
            return a.asm._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_OCTAHEDRON_TRANSFORM.apply(null, arguments)
        },
        fd = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_QUANTIZATION_TRANSFORM = function() {
            return a.asm._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_QUANTIZATION_TRANSFORM.apply(null, arguments)
        },
        gd = a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = function() {
            return a.asm._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE.apply(null,
                arguments)
        },
        hd = a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = function() {
            return a.asm._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD.apply(null, arguments)
        },
        id = a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = function() {
            return a.asm._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH.apply(null, arguments)
        },
        jd = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = function() {
            return a.asm._emscripten_enum_draco_GeometryAttribute_Type_COLOR.apply(null, arguments)
        },
        kd =
        a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = function() {
            return a.asm._emscripten_enum_draco_GeometryAttribute_Type_GENERIC.apply(null, arguments)
        },
        ld = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = function() {
            return a.asm._emscripten_enum_draco_GeometryAttribute_Type_INVALID.apply(null, arguments)
        },
        md = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = function() {
            return a.asm._emscripten_enum_draco_GeometryAttribute_Type_NORMAL.apply(null, arguments)
        },
        nd = a._emscripten_enum_draco_GeometryAttribute_Type_POSITION =
        function() {
            return a.asm._emscripten_enum_draco_GeometryAttribute_Type_POSITION.apply(null, arguments)
        },
        od = a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = function() {
            return a.asm._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD.apply(null, arguments)
        },
        pd = a._emscripten_enum_draco_StatusCode_ERROR = function() {
            return a.asm._emscripten_enum_draco_StatusCode_ERROR.apply(null, arguments)
        },
        qd = a._emscripten_enum_draco_StatusCode_INVALID_PARAMETER = function() {
            return a.asm._emscripten_enum_draco_StatusCode_INVALID_PARAMETER.apply(null,
                arguments)
        },
        rd = a._emscripten_enum_draco_StatusCode_IO_ERROR = function() {
            return a.asm._emscripten_enum_draco_StatusCode_IO_ERROR.apply(null, arguments)
        },
        sd = a._emscripten_enum_draco_StatusCode_OK = function() {
            return a.asm._emscripten_enum_draco_StatusCode_OK.apply(null, arguments)
        },
        td = a._emscripten_enum_draco_StatusCode_UNKNOWN_VERSION = function() {
            return a.asm._emscripten_enum_draco_StatusCode_UNKNOWN_VERSION.apply(null, arguments)
        },
        ud = a._emscripten_enum_draco_StatusCode_UNSUPPORTED_VERSION = function() {
            return a.asm._emscripten_enum_draco_StatusCode_UNSUPPORTED_VERSION.apply(null,
                arguments)
        },
        nb = a._emscripten_replace_memory = function() {
            return a.asm._emscripten_replace_memory.apply(null, arguments)
        };
    a._free = function() {
        return a.asm._free.apply(null, arguments)
    };
    a._llvm_bswap_i32 = function() {
        return a.asm._llvm_bswap_i32.apply(null, arguments)
    };
    var Ka = a._malloc = function() {
        return a.asm._malloc.apply(null, arguments)
    };
    a._memcpy = function() {
        return a.asm._memcpy.apply(null, arguments)
    };
    a._memmove = function() {
        return a.asm._memmove.apply(null, arguments)
    };
    a._memset = function() {
        return a.asm._memset.apply(null,
            arguments)
    };
    a._sbrk = function() {
        return a.asm._sbrk.apply(null, arguments)
    };
    a.establishStackSpace = function() {
        return a.asm.establishStackSpace.apply(null, arguments)
    };
    a.getTempRet0 = function() {
        return a.asm.getTempRet0.apply(null, arguments)
    };
    a.runPostSets = function() {
        return a.asm.runPostSets.apply(null, arguments)
    };
    var sa = a.setTempRet0 = function() {
        return a.asm.setTempRet0.apply(null, arguments)
    };
    a.setThrew = function() {
        return a.asm.setThrew.apply(null, arguments)
    };
    a.stackAlloc = function() {
        return a.asm.stackAlloc.apply(null,
            arguments)
    };
    a.stackRestore = function() {
        return a.asm.stackRestore.apply(null, arguments)
    };
    a.stackSave = function() {
        return a.asm.stackSave.apply(null, arguments)
    };
    a.dynCall_ii = function() {
        return a.asm.dynCall_ii.apply(null, arguments)
    };
    a.dynCall_iii = function() {
        return a.asm.dynCall_iii.apply(null, arguments)
    };
    a.dynCall_iiii = function() {
        return a.asm.dynCall_iiii.apply(null, arguments)
    };
    a.dynCall_iiiiiii = function() {
        return a.asm.dynCall_iiiiiii.apply(null, arguments)
    };
    a.dynCall_v = function() {
        return a.asm.dynCall_v.apply(null,
            arguments)
    };
    a.dynCall_vi = function() {
        return a.asm.dynCall_vi.apply(null, arguments)
    };
    a.dynCall_vii = function() {
        return a.asm.dynCall_vii.apply(null, arguments)
    };
    a.dynCall_viii = function() {
        return a.asm.dynCall_viii.apply(null, arguments)
    };
    a.dynCall_viiii = function() {
        return a.asm.dynCall_viiii.apply(null, arguments)
    };
    a.dynCall_viiiii = function() {
        return a.asm.dynCall_viiiii.apply(null, arguments)
    };
    a.dynCall_viiiiii = function() {
        return a.asm.dynCall_viiiiii.apply(null, arguments)
    };
    a.asm = Ua;
    a.then = function(d) {
        if (a.calledRun) d(a);
        else {
            var b = a.onRuntimeInitialized;
            a.onRuntimeInitialized = function() {
                b && b();
                d(a)
            }
        }
        return a
    };
    na.prototype = Error();
    na.prototype.constructor = na;
    ra = function b() {
        a.calledRun || wa();
        a.calledRun || (ra = b)
    };
    a.run = wa;
    a.exit = function(b, c) {
        if (!c || !a.noExitRuntime || 0 !== b) {
            if (!a.noExitRuntime && (oa = !0, ta = void 0, B(ob), a.onExit)) a.onExit(b);
            qa && process.exit(b);
            a.quit(b, new na(b))
        }
    };
    a.abort = O;
    if (a.preInit)
        for ("function" == typeof a.preInit && (a.preInit = [a.preInit]); 0 < a.preInit.length;) a.preInit.pop()();
    a.noExitRuntime = !0;
    wa();
    m.prototype = Object.create(m.prototype);
    m.prototype.constructor = m;
    m.prototype.__class__ = m;
    m.__cache__ = {};
    a.WrapperObject = m;
    a.getCache = t;
    a.wrapPointer = T;
    a.castObject = function(a, c) {
        return T(a.ptr, c)
    };
    a.NULL = T(0);
    a.destroy = function(a) {
        if (!a.__destroy__) throw "Error: Cannot destroy object. (Did you create it yourself?)";
        a.__destroy__();
        delete t(a.__class__)[a.ptr]
    };
    a.compare = function(a, c) {
        return a.ptr === c.ptr
    };
    a.getPointer = function(a) {
        return a.ptr
    };
    a.getClass = function(a) {
        return a.__class__
    };
    var l = {
        buffer: 0,
        size: 0,
        pos: 0,
        temps: [],
        needed: 0,
        prepare: function() {
            if (l.needed) {
                for (var b = 0; b < l.temps.length; b++) a._free(l.temps[b]);
                l.temps.length = 0;
                a._free(l.buffer);
                l.buffer = 0;
                l.size += l.needed;
                l.needed = 0
            }
            l.buffer || (l.size += 128, l.buffer = a._malloc(l.size), f(l.buffer));
            l.pos = 0
        },
        alloc: function(b, c) {
            f(l.buffer);
            b = b.length * c.BYTES_PER_ELEMENT;
            b = b + 7 & -8;
            l.pos + b >= l.size ? (f(0 < b), l.needed += b, c = a._malloc(b), l.temps.push(c)) : (c = l.buffer + l.pos, l.pos += b);
            return c
        },
        copy: function(a, c, d) {
            switch (c.BYTES_PER_ELEMENT) {
                case 2:
                    d >>=
                        1;
                    break;
                case 4:
                    d >>= 2;
                    break;
                case 8:
                    d >>= 3
            }
            for (var b = 0; b < a.length; b++) c[d + b] = a[b]
        }
    };
    z.prototype = Object.create(m.prototype);
    z.prototype.constructor = z;
    z.prototype.__class__ = z;
    z.__cache__ = {};
    a.Status = z;
    z.prototype.code = z.prototype.code = function() {
        return Zc(this.ptr)
    };
    z.prototype.ok = z.prototype.ok = function() {
        return !!ad(this.ptr)
    };
    z.prototype.error_msg = z.prototype.error_msg = function() {
        return v($c(this.ptr))
    };
    z.prototype.__destroy__ = z.prototype.__destroy__ = function() {
        Yc(this.ptr)
    };
    F.prototype = Object.create(m.prototype);
    F.prototype.constructor = F;
    F.prototype.__class__ = F;
    F.__cache__ = {};
    a.DracoUInt16Array = F;
    F.prototype.GetValue = F.prototype.GetValue = function(a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return mc(b, a)
    };
    F.prototype.size = F.prototype.size = function() {
        return oc(this.ptr)
    };
    F.prototype.__destroy__ = F.prototype.__destroy__ = function() {
        nc(this.ptr)
    };
    G.prototype = Object.create(m.prototype);
    G.prototype.constructor = G;
    G.prototype.__class__ = G;
    G.__cache__ = {};
    a.PointCloud = G;
    G.prototype.num_attributes = G.prototype.num_attributes =
        function() {
            return Wc(this.ptr)
        };
    G.prototype.num_points = G.prototype.num_points = function() {
        return Xc(this.ptr)
    };
    G.prototype.__destroy__ = G.prototype.__destroy__ = function() {
        Vc(this.ptr)
    };
    H.prototype = Object.create(m.prototype);
    H.prototype.constructor = H;
    H.prototype.__class__ = H;
    H.__cache__ = {};
    a.DracoUInt8Array = H;
    H.prototype.GetValue = H.prototype.GetValue = function(a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return sc(b, a)
    };
    H.prototype.size = H.prototype.size = function() {
        return uc(this.ptr)
    };
    H.prototype.__destroy__ =
        H.prototype.__destroy__ = function() {
            tc(this.ptr)
        };
    I.prototype = Object.create(m.prototype);
    I.prototype.constructor = I;
    I.prototype.__class__ = I;
    I.__cache__ = {};
    a.DracoUInt32Array = I;
    I.prototype.GetValue = I.prototype.GetValue = function(a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return pc(b, a)
    };
    I.prototype.size = I.prototype.size = function() {
        return rc(this.ptr)
    };
    I.prototype.__destroy__ = I.prototype.__destroy__ = function() {
        qc(this.ptr)
    };
    J.prototype = Object.create(m.prototype);
    J.prototype.constructor = J;
    J.prototype.__class__ =
        J;
    J.__cache__ = {};
    a.AttributeOctahedronTransform = J;
    J.prototype.InitFromAttribute = J.prototype.InitFromAttribute = function(a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return !!sb(b, a)
    };
    J.prototype.quantization_bits = J.prototype.quantization_bits = function() {
        return ub(this.ptr)
    };
    J.prototype.__destroy__ = J.prototype.__destroy__ = function() {
        tb(this.ptr)
    };
    n.prototype = Object.create(m.prototype);
    n.prototype.constructor = n;
    n.prototype.__class__ = n;
    n.__cache__ = {};
    a.PointAttribute = n;
    n.prototype.size = n.prototype.size =
        function() {
            return Tc(this.ptr)
        };
    n.prototype.GetAttributeTransformData = n.prototype.GetAttributeTransformData = function() {
        return T(Lc(this.ptr), P)
    };
    n.prototype.attribute_type = n.prototype.attribute_type = function() {
        return Nc(this.ptr)
    };
    n.prototype.data_type = n.prototype.data_type = function() {
        return Qc(this.ptr)
    };
    n.prototype.num_components = n.prototype.num_components = function() {
        return Sc(this.ptr)
    };
    n.prototype.normalized = n.prototype.normalized = function() {
        return !!Rc(this.ptr)
    };
    n.prototype.byte_stride = n.prototype.byte_stride =
        function() {
            return Pc(this.ptr)
        };
    n.prototype.byte_offset = n.prototype.byte_offset = function() {
        return Oc(this.ptr)
    };
    n.prototype.unique_id = n.prototype.unique_id = function() {
        return Uc(this.ptr)
    };
    n.prototype.__destroy__ = n.prototype.__destroy__ = function() {
        Mc(this.ptr)
    };
    P.prototype = Object.create(m.prototype);
    P.prototype.constructor = P;
    P.prototype.__class__ = P;
    P.__cache__ = {};
    a.AttributeTransformData = P;
    P.prototype.transform_type = P.prototype.transform_type = function() {
        return Bb(this.ptr)
    };
    P.prototype.__destroy__ =
        P.prototype.__destroy__ = function() {
            Ab(this.ptr)
        };
    x.prototype = Object.create(m.prototype);
    x.prototype.constructor = x;
    x.prototype.__class__ = x;
    x.__cache__ = {};
    a.AttributeQuantizationTransform = x;
    x.prototype.InitFromAttribute = x.prototype.InitFromAttribute = function(a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return !!vb(b, a)
    };
    x.prototype.quantization_bits = x.prototype.quantization_bits = function() {
        return yb(this.ptr)
    };
    x.prototype.min_value = x.prototype.min_value = function(a) {
        var b = this.ptr;
        a && "object" ===
            typeof a && (a = a.ptr);
        return xb(b, a)
    };
    x.prototype.range = x.prototype.range = function() {
        return zb(this.ptr)
    };
    x.prototype.__destroy__ = x.prototype.__destroy__ = function() {
        wb(this.ptr)
    };
    K.prototype = Object.create(m.prototype);
    K.prototype.constructor = K;
    K.prototype.__class__ = K;
    K.__cache__ = {};
    a.DracoInt8Array = K;
    K.prototype.GetValue = K.prototype.GetValue = function(a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return jc(b, a)
    };
    K.prototype.size = K.prototype.size = function() {
        return lc(this.ptr)
    };
    K.prototype.__destroy__ =
        K.prototype.__destroy__ = function() {
            kc(this.ptr)
        };
    q.prototype = Object.create(m.prototype);
    q.prototype.constructor = q;
    q.prototype.__class__ = q;
    q.__cache__ = {};
    a.MetadataQuerier = q;
    q.prototype.HasEntry = q.prototype.HasEntry = function(a, c) {
        var b = this.ptr;
        l.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : U(c);
        return !!Fc(b, a, c)
    };
    q.prototype.HasIntEntry = q.prototype.HasIntEntry = function(a, c) {
        var b = this.ptr;
        l.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : U(c);
        return !!Gc(b, a, c)
    };
    q.prototype.GetIntEntry = q.prototype.GetIntEntry = function(a, c) {
        var b = this.ptr;
        l.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : U(c);
        return Cc(b, a, c)
    };
    q.prototype.HasDoubleEntry = q.prototype.HasDoubleEntry = function(a, c) {
        var b = this.ptr;
        l.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : U(c);
        return !!Ec(b, a, c)
    };
    q.prototype.GetDoubleEntry = q.prototype.GetDoubleEntry = function(a, c) {
        var b = this.ptr;
        l.prepare();
        a && "object" === typeof a && (a =
            a.ptr);
        c = c && "object" === typeof c ? c.ptr : U(c);
        return Ac(b, a, c)
    };
    q.prototype.HasStringEntry = q.prototype.HasStringEntry = function(a, c) {
        var b = this.ptr;
        l.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : U(c);
        return !!Hc(b, a, c)
    };
    q.prototype.GetStringEntry = q.prototype.GetStringEntry = function(a, c) {
        var b = this.ptr;
        l.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : U(c);
        return v(Dc(b, a, c))
    };
    q.prototype.NumEntries = q.prototype.NumEntries = function(a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return Ic(b, a)
    };
    q.prototype.GetEntryName = q.prototype.GetEntryName = function(a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return v(Bc(b, a, c))
    };
    q.prototype.__destroy__ = q.prototype.__destroy__ = function() {
        Jc(this.ptr)
    };
    L.prototype = Object.create(m.prototype);
    L.prototype.constructor = L;
    L.prototype.__class__ = L;
    L.__cache__ = {};
    a.DracoInt16Array = L;
    L.prototype.GetValue = L.prototype.GetValue = function(a) {
        var b = this.ptr;
        a && "object" === typeof a &&
            (a = a.ptr);
        return dc(b, a)
    };
    L.prototype.size = L.prototype.size = function() {
        return fc(this.ptr)
    };
    L.prototype.__destroy__ = L.prototype.__destroy__ = function() {
        ec(this.ptr)
    };
    M.prototype = Object.create(m.prototype);
    M.prototype.constructor = M;
    M.prototype.__class__ = M;
    M.__cache__ = {};
    a.DracoFloat32Array = M;
    M.prototype.GetValue = M.prototype.GetValue = function(a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return ac(b, a)
    };
    M.prototype.size = M.prototype.size = function() {
        return cc(this.ptr)
    };
    M.prototype.__destroy__ = M.prototype.__destroy__ =
        function() {
            bc(this.ptr)
        };
    V.prototype = Object.create(m.prototype);
    V.prototype.constructor = V;
    V.prototype.__class__ = V;
    V.__cache__ = {};
    a.GeometryAttribute = V;
    V.prototype.__destroy__ = V.prototype.__destroy__ = function() {
        vc(this.ptr)
    };
    Q.prototype = Object.create(m.prototype);
    Q.prototype.constructor = Q;
    Q.prototype.__class__ = Q;
    Q.__cache__ = {};
    a.DecoderBuffer = Q;
    Q.prototype.Init = Q.prototype.Init = function(a, c) {
        var b = this.ptr;
        l.prepare();
        if ("object" == typeof a && "object" === typeof a) {
            var d = l.alloc(a, ia);
            l.copy(a, ia, d);
            a =
                d
        }
        c && "object" === typeof c && (c = c.ptr);
        Cb(b, a, c)
    };
    Q.prototype.__destroy__ = Q.prototype.__destroy__ = function() {
        Db(this.ptr)
    };
    g.prototype = Object.create(m.prototype);
    g.prototype.constructor = g;
    g.prototype.__class__ = g;
    g.__cache__ = {};
    a.Decoder = g;
    g.prototype.GetEncodedGeometryType = g.prototype.GetEncodedGeometryType = function(a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return Vb(b, a)
    };
    g.prototype.DecodeBufferToPointCloud = g.prototype.DecodeBufferToPointCloud = function(a, c) {
        var b = this.ptr;
        a && "object" === typeof a &&
            (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return T(Fb(b, a, c), z)
    };
    g.prototype.DecodeBufferToMesh = g.prototype.DecodeBufferToMesh = function(a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return T(Eb(b, a, c), z)
    };
    g.prototype.GetAttributeId = g.prototype.GetAttributeId = function(a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return Lb(b, a, c)
    };
    g.prototype.GetAttributeIdByName = g.prototype.GetAttributeIdByName = function(a, c) {
        var b =
            this.ptr;
        l.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : U(c);
        return Kb(b, a, c)
    };
    g.prototype.GetAttributeIdByMetadataEntry = g.prototype.GetAttributeIdByMetadataEntry = function(a, c, d) {
        var b = this.ptr;
        l.prepare();
        a && "object" === typeof a && (a = a.ptr);
        c = c && "object" === typeof c ? c.ptr : U(c);
        d = d && "object" === typeof d ? d.ptr : U(d);
        return Jb(b, a, c, d)
    };
    g.prototype.GetAttribute = g.prototype.GetAttribute = function(a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c =
            c.ptr);
        return T(Ub(b, a, c), n)
    };
    g.prototype.GetAttributeByUniqueId = g.prototype.GetAttributeByUniqueId = function(a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return T(Gb(b, a, c), n)
    };
    g.prototype.GetMetadata = g.prototype.GetMetadata = function(a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        return T(Xb(b, a), R)
    };
    g.prototype.GetAttributeMetadata = g.prototype.GetAttributeMetadata = function(a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c &&
            (c = c.ptr);
        return T(Qb(b, a, c), R)
    };
    g.prototype.GetFaceFromMesh = g.prototype.GetFaceFromMesh = function(a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!Wb(b, a, c, d)
    };
    g.prototype.GetTriangleStripsFromMesh = g.prototype.GetTriangleStripsFromMesh = function(a, c) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        return Yb(b, a, c)
    };
    g.prototype.GetAttributeFloat = g.prototype.GetAttributeFloat = function(a,
        c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!Ib(b, a, c, d)
    };
    g.prototype.GetAttributeFloatForAllPoints = g.prototype.GetAttributeFloatForAllPoints = function(a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!Hb(b, a, c, d)
    };
    g.prototype.GetAttributeIntForAllPoints = g.prototype.GetAttributeIntForAllPoints = function(a, c, d) {
        var b = this.ptr;
        a && "object" ===
            typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!Pb(b, a, c, d)
    };
    g.prototype.GetAttributeInt8ForAllPoints = g.prototype.GetAttributeInt8ForAllPoints = function(a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!Ob(b, a, c, d)
    };
    g.prototype.GetAttributeUInt8ForAllPoints = g.prototype.GetAttributeUInt8ForAllPoints = function(a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" ===
            typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!Tb(b, a, c, d)
    };
    g.prototype.GetAttributeInt16ForAllPoints = g.prototype.GetAttributeInt16ForAllPoints = function(a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!Mb(b, a, c, d)
    };
    g.prototype.GetAttributeUInt16ForAllPoints = g.prototype.GetAttributeUInt16ForAllPoints = function(a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d &&
            "object" === typeof d && (d = d.ptr);
        return !!Rb(b, a, c, d)
    };
    g.prototype.GetAttributeInt32ForAllPoints = g.prototype.GetAttributeInt32ForAllPoints = function(a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d = d.ptr);
        return !!Nb(b, a, c, d)
    };
    g.prototype.GetAttributeUInt32ForAllPoints = g.prototype.GetAttributeUInt32ForAllPoints = function(a, c, d) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        c && "object" === typeof c && (c = c.ptr);
        d && "object" === typeof d && (d =
            d.ptr);
        return !!Sb(b, a, c, d)
    };
    g.prototype.SkipAttributeTransform = g.prototype.SkipAttributeTransform = function(a) {
        var b = this.ptr;
        a && "object" === typeof a && (a = a.ptr);
        Zb(b, a)
    };
    g.prototype.__destroy__ = g.prototype.__destroy__ = function() {
        $b(this.ptr)
    };
    C.prototype = Object.create(m.prototype);
    C.prototype.constructor = C;
    C.prototype.__class__ = C;
    C.__cache__ = {};
    a.Mesh = C;
    C.prototype.num_faces = C.prototype.num_faces = function() {
        return yc(this.ptr)
    };
    C.prototype.num_attributes = C.prototype.num_attributes = function() {
        return xc(this.ptr)
    };
    C.prototype.num_points = C.prototype.num_points = function() {
        return zc(this.ptr)
    };
    C.prototype.__destroy__ = C.prototype.__destroy__ = function() {
        wc(this.ptr)
    };
    X.prototype = Object.create(m.prototype);
    X.prototype.constructor = X;
    X.prototype.__class__ = X;
    X.__cache__ = {};
    a.VoidPtr = X;
    X.prototype.__destroy__ = X.prototype.__destroy__ = function() {
        bd(this.ptr)
    };
    N.prototype = Object.create(m.prototype);
    N.prototype.constructor = N;
    N.prototype.__class__ = N;
    N.__cache__ = {};
    a.DracoInt32Array = N;
    N.prototype.GetValue = N.prototype.GetValue =
        function(a) {
            var b = this.ptr;
            a && "object" === typeof a && (a = a.ptr);
            return gc(b, a)
        };
    N.prototype.size = N.prototype.size = function() {
        return ic(this.ptr)
    };
    N.prototype.__destroy__ = N.prototype.__destroy__ = function() {
        hc(this.ptr)
    };
    R.prototype = Object.create(m.prototype);
    R.prototype.constructor = R;
    R.prototype.__class__ = R;
    R.__cache__ = {};
    a.Metadata = R;
    R.prototype.__destroy__ = R.prototype.__destroy__ = function() {
        Kc(this.ptr)
    };
    (function() {
        function b() {
            a.OK = sd();
            a.ERROR = pd();
            a.IO_ERROR = rd();
            a.INVALID_PARAMETER = qd();
            a.UNSUPPORTED_VERSION =
                ud();
            a.UNKNOWN_VERSION = td();
            a.INVALID_GEOMETRY_TYPE = gd();
            a.POINT_CLOUD = hd();
            a.TRIANGULAR_MESH = id();
            a.ATTRIBUTE_INVALID_TRANSFORM = cd();
            a.ATTRIBUTE_NO_TRANSFORM = dd();
            a.ATTRIBUTE_QUANTIZATION_TRANSFORM = fd();
            a.ATTRIBUTE_OCTAHEDRON_TRANSFORM = ed();
            a.INVALID = ld();
            a.POSITION = nd();
            a.NORMAL = md();
            a.COLOR = jd();
            a.TEX_COORD = od();
            a.GENERIC = kd()
        }
        a.calledRun ? b() : Na.unshift(b)
    })();
    if ("function" === typeof a.onModuleParsed) a.onModuleParsed();
    return d
};
"object" === typeof exports && "object" === typeof module ? module.exports = DracoDecoderModule : "function" === typeof define && define.amd ? define([], function() {
    return DracoDecoderModule
}) : "object" === typeof exports && (exports.DracoDecoderModule = DracoDecoderModule);