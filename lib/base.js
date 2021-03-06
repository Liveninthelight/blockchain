// Generated by IcedCoffeeScript 1.7.1-g
(function() {
  var Blockchain, armor, btcjs, bufeq_secure, get_hash_from_triple, iced, make_esc, merkle, streq_secure, __iced_k, __iced_k_noop, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  iced = require('iced-runtime');
  __iced_k = __iced_k_noop = function() {};

  make_esc = require('iced-error').make_esc;

  btcjs = require('keybase-bitcoinjs-lib');

  merkle = require('merkle-tree');

  armor = require('pgp-utils').armor;

  _ref = require('iced-utils').util, bufeq_secure = _ref.bufeq_secure, streq_secure = _ref.streq_secure;

  get_hash_from_triple = function(user_triple) {
    switch (user_triple[0]) {
      case 1:
        return user_triple[1];
      case 2:
        return user_triple[1][1];
      default:
        return "<unknown leaf version>";
    }
  };

  exports.Blockchain = Blockchain = (function(_super) {
    __extends(Blockchain, _super);

    function Blockchain(_arg) {
      this.req = _arg.req, this.username = _arg.username, this.address = _arg.address, this.log = _arg.log;
      this.address || (this.address = "1HUCBSJeHnkhzrVKVjaVmWg2QtZS1mdfaz");
      Blockchain.__super__.constructor.call(this, {});
    }

    Blockchain.prototype.blockr_req = function(_arg, cb) {
      var endpoint, err, json, qs, res, s, url, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      endpoint = _arg.endpoint, qs = _arg.qs;
      url = "https://btc.blockr.io/api/v1/" + endpoint;
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/blockchain/src/base.iced",
            funcname: "Blockchain.blockr_req"
          });
          _this.req({
            url: url,
            qs: qs
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                res = arguments[1];
                return json = arguments[2];
              };
            })(),
            lineno: 28
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          if (typeof err !== "undefined" && err !== null) {

          } else if ((s = json.status) !== "success") {
            err = new Error("Bad status code: " + s);
          }
          return cb(err, json);
        };
      })(this));
    };

    Blockchain.prototype.lookup_last_tx_from_addr_blockr_io = function(cb) {
      var a, b, endpoint, err, json, tx, v, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      endpoint = "address/txs/" + this.address;
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/blockchain/src/base.iced",
            funcname: "Blockchain.lookup_last_tx_from_addr_blockr_io"
          });
          _this.blockr_req({
            endpoint: endpoint
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return json = arguments[1];
              };
            })(),
            lineno: 37
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          err = (function() {
            var _i, _len, _ref1, _ref2;
            if (err != null) {
              return err;
            } else if ((a = typeof json !== "undefined" && json !== null ? (_ref1 = json.data) != null ? _ref1.address : void 0 : void 0) !== (b = this.address)) {
              return new Error("Got wrong address: " + a + " != " + b);
            } else if ((v = json.data.txs) == null) {
              return new Error("No transactions found");
            } else {
              for (_i = 0, _len = v.length; _i < _len; _i++) {
                tx = v[_i];
                if (!(tx.amount < 0)) {
                  continue;
                }
                this.txid = tx.tx;
                break;
              }
              if (!this.txid) {
                return new Error("No transaction found from " + this.address + "; something is up!");
              } else {
                if ((_ref2 = this.log) != null) {
                  _ref2.info("Most recent TX from " + this.address + " is " + this.txid);
                }
                return null;
              }
            }
          }).call(_this);
          return cb(err);
        };
      })(this));
    };

    Blockchain.prototype.lookup_tx_blockr_io = function(cb) {
      var endpoint, err, json, t, v, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      endpoint = "tx/info/" + this.txid;
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/blockchain/src/base.iced",
            funcname: "Blockchain.lookup_tx_blockr_io"
          });
          _this.blockr_req({
            endpoint: endpoint
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                return json = arguments[1];
              };
            })(),
            lineno: 58
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          var _ref1, _ref2;
          err = err != null ? err : (t = typeof json !== "undefined" && json !== null ? (_ref1 = json.data) != null ? _ref1.tx : void 0 : void 0) !== _this.txid ? new Error("Got wrong transaction: " + t + " != " + _this.txid) : ((v = json.data.vouts) == null) || (v.length !== 1) ? new Error("Got a weird transaction back from blockr.io") : (_this.to_addr = v[0].address, (_ref2 = _this.log) != null ? _ref2.info("Got BTC to address: " + _this.to_addr) : void 0, null);
          return cb(err);
        };
      })(this));
    };

    Blockchain.prototype.lookup_btc_blockr_io = function(cb) {
      var esc, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      esc = make_esc(cb, "Blockchain::lookup_btc_blockr");
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/blockchain/src/base.iced",
            funcname: "Blockchain.lookup_btc_blockr_io"
          });
          _this.lookup_last_tx_from_addr_blockr_io(esc(__iced_deferrals.defer({
            lineno: 74
          })));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/max/src/keybase/blockchain/src/base.iced",
              funcname: "Blockchain.lookup_btc_blockr_io"
            });
            _this.lookup_tx_blockr_io(esc(__iced_deferrals.defer({
              lineno: 75
            })));
            __iced_deferrals._fulfill();
          })(function() {
            return cb(null);
          });
        };
      })(this));
    };

    Blockchain.prototype.lookup_btc_blockchain_info = function(cb) {
      var err, json, res, tx, url, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      url = "https://blockchain.info/address/" + this.address;
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/blockchain/src/base.iced",
            funcname: "Blockchain.lookup_btc_blockchain_info"
          });
          _this.req({
            url: url,
            qs: {
              format: 'json',
              cors: 'true'
            }
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                res = arguments[1];
                return json = arguments[2];
              };
            })(),
            lineno: 82
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          var _i, _len, _ref1, _ref2, _ref3, _ref4;
          if (typeof err === "undefined" || err === null) {
            _ref1 = json.txs;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              tx = _ref1[_i];
              if (!(((_ref2 = tx.inputs[0]) != null ? (_ref3 = _ref2.prev_out) != null ? _ref3.addr : void 0 : void 0) === _this.address)) {
                continue;
              }
              _this.to_addr = tx.out[0].addr;
              break;
            }
            if (_this.to_addr != null) {
              if ((_ref4 = _this.log) != null) {
                _ref4.info("Got BTC to address: " + _this.to_addr);
              }
            } else {
              err = new Error("Didn't find any announcements from " + _this.address + "; something is up!");
            }
          }
          return cb(err);
        };
      })(this));
    };

    Blockchain.prototype.translate_address = function(cb) {
      var e, err, hash, version, _ref1, _ref2;
      err = null;
      try {
        _ref1 = btcjs.Address.fromBase58Check(this.to_addr), hash = _ref1.hash, version = _ref1.version;
        if (version !== btcjs.networks.bitcoin.pubKeyHash) {
          err = new Error("Bad address " + this.to_addr + "; wasn't BTC");
        } else {
          this.to_addr_hash = hash;
          if ((_ref2 = this.log) != null) {
            _ref2.info(" to hash -> " + (hash.toString('hex')));
          }
        }
      } catch (_error) {
        e = _error;
        err = new Error("Bad address " + this.to_addr + ": " + e.message);
      }
      return cb(err);
    };

    Blockchain.prototype.kburl = function(e) {
      return "https://keybase.io/_/api/1.0/" + e + ".json";
    };

    Blockchain.prototype.lookup_verify_merkle_root = function(cb) {
      var body, e, err, esc, h2, hash160, js, m, res, sig, url, x, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      esc = make_esc(cb, "Blockchain::lookup_verify_merkle_root");
      url = this.kburl("merkle/root");
      hash160 = this.to_addr_hash.toString('hex');
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/blockchain/src/base.iced",
            funcname: "Blockchain.lookup_verify_merkle_root"
          });
          _this.req({
            url: url,
            qs: {
              hash160: hash160
            }
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                res = arguments[1];
                return body = arguments[2];
              };
            })(),
            lineno: 121
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          var _ref1, _ref2;
          if (typeof err !== "undefined" && err !== null) {

          } else if ((sig = body.sig) == null) {
            err = new Error("No 'sig' field found in keybase root");
          } else {
            _ref1 = armor.decode(sig), err = _ref1[0], m = _ref1[1];
            if (err == null) {
              h2 = btcjs.crypto.hash160(m.body);
              if (!bufeq_secure(h2, _this.to_addr_hash)) {
                err = new Error('hash mismatch at root');
              } else if (!(x = m.body.toString('utf8').match(/(\{"body":.*?"signature"\})/))) {
                err = new Error("Can't scrape a JSON body out of the PGP signature");
              } else {
                try {
                  js = JSON.parse(x[1]);
                  if ((_this.root_hash = (_ref2 = js.body) != null ? _ref2.root : void 0) == null) {
                    err = new Error("Didn't find a root hash");
                  }
                } catch (_error) {
                  e = _error;
                  err = new Error("Can't JSON parse payload: " + e.message);
                }
              }
            }
          }
          return cb(err);
        };
      })(this));
    };

    Blockchain.prototype.hash_fn = function(s) {
      return btcjs.crypto.sha512(s).toString('hex');
    };

    Blockchain.prototype.lookup_root = function(cb) {
      return cb(null, this.root_hash);
    };

    Blockchain.prototype.lookup_node = function(_arg, cb) {
      var err, json, key, n, node, res, url, ___iced_passed_deferral, __iced_deferrals, __iced_k, _ref1;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      key = _arg.key;
      if ((_ref1 = this.log) != null) {
        _ref1.info("Lookup merkle node " + key);
      }
      url = this.kburl("merkle/block");
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/blockchain/src/base.iced",
            funcname: "Blockchain.lookup_node"
          });
          _this.req({
            url: url,
            qs: {
              hash: key
            }
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                res = arguments[1];
                return json = arguments[2];
              };
            })(),
            lineno: 157
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          if (typeof err !== "undefined" && err !== null) {

          } else if ((n = json.status.name) !== 'OK') {
            err = new Error("API error: " + n);
          } else if ((node = json.value) == null) {
            err = new Error("bad block returned: " + key);
          }
          return cb(err, node);
        };
      })(this));
    };

    Blockchain.prototype.lookup_userid = function(cb) {
      var err, json, n, res, url, ___iced_passed_deferral, __iced_deferrals, __iced_k, _ref1;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      if ((_ref1 = this.log) != null) {
        _ref1.debug("+ lookup userid " + this.username);
      }
      url = this.kburl("user/lookup");
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/blockchain/src/base.iced",
            funcname: "Blockchain.lookup_userid"
          });
          _this.req({
            url: url,
            qs: {
              username: _this.username
            }
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                res = arguments[1];
                return json = arguments[2];
              };
            })(),
            lineno: 168
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          var _ref2, _ref3;
          err = err != null ? err : (n = json.status.name) !== 'OK' ? new Error("API error: " + n) : (_this.uid = json.them.id) == null ? new Error("bad user object; no UID") : null;
          if ((_ref2 = _this.log) != null) {
            _ref2.info("Map: " + _this.username + " -> " + _this.uid);
          }
          if ((_ref3 = _this.log) != null) {
            _ref3.debug("- lookup userid");
          }
          return cb(err);
        };
      })(this));
    };

    Blockchain.prototype.find_in_keybase_merkle_tree = function(cb) {
      var err, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/blockchain/src/base.iced",
            funcname: "Blockchain.find_in_keybase_merkle_tree"
          });
          _this.find({
            key: _this.uid
          }, __iced_deferrals.defer({
            assign_fn: (function(__slot_1) {
              return function() {
                err = arguments[0];
                return __slot_1.user_triple = arguments[1];
              };
            })(_this),
            lineno: 180
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          return cb(err);
        };
      })(this));
    };

    Blockchain.prototype.lookup_user = function(cb) {
      var a, b, err, json, last, n, res, url, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      url = this.kburl("sig/get");
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/blockchain/src/base.iced",
            funcname: "Blockchain.lookup_user"
          });
          _this.req({
            url: url,
            qs: {
              uid: _this.uid
            }
          }, __iced_deferrals.defer({
            assign_fn: (function() {
              return function() {
                err = arguments[0];
                res = arguments[1];
                return json = arguments[2];
              };
            })(),
            lineno: 187
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          var _ref1, _ref2;
          err = err != null ? err : (n = json.status.name) !== 'OK' ? new Error("API error: " + n) : (_this.chain = json.sigs) == null ? new Error("no signatures found") : (last = (_ref1 = _this.chain.slice(-1)) != null ? _ref1[0] : void 0) == null ? new Error("no last signature") : (a = last.payload_hash) !== (b = get_hash_from_triple(_this.user_triple)) ? new Error("Bad hash: " + a + " != " + b) : ((_ref2 = _this.log) != null ? _ref2.info("User triple: " + (JSON.stringify(_this.user_triple))) : void 0, null);
          return cb(err);
        };
      })(this));
    };

    Blockchain.prototype.check_chain = function(cb) {
      var e, err, i, link, _i, _len, _ref1, _ref2;
      err = null;
      _ref1 = this.chain;
      for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
        link = _ref1[i];
        if (!streq_secure(btcjs.crypto.sha256(link.payload_json).toString('hex'), link.payload_hash)) {
          err = new Error("hash mismatch at link " + i);
        }
        try {
          link.payload = JSON.parse(link.payload_json);
          if (i > 0 && !streq_secure(link.payload.prev, this.chain[i - 1].payload_hash)) {
            err = new Error("bad previous hash at link " + i);
          }
        } catch (_error) {
          e = _error;
          err = new Error("failed to parse link " + i + ": " + e.message);
        }
        if (err) {
          break;
        }
      }
      if (err == null) {
        if ((_ref2 = this.log) != null) {
          _ref2.info("Chain checked out");
        }
      }
      return cb(err);
    };

    Blockchain.prototype.run = function(cb) {
      var esc, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      esc = make_esc(cb, "Blockchain::run");
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/keybase/blockchain/src/base.iced",
            funcname: "Blockchain.run"
          });
          _this.lookup_btc_blockr_io(esc(__iced_deferrals.defer({
            lineno: 220
          })));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              filename: "/Users/max/src/keybase/blockchain/src/base.iced",
              funcname: "Blockchain.run"
            });
            _this.translate_address(esc(__iced_deferrals.defer({
              lineno: 221
            })));
            __iced_deferrals._fulfill();
          })(function() {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/Users/max/src/keybase/blockchain/src/base.iced",
                funcname: "Blockchain.run"
              });
              _this.lookup_verify_merkle_root(esc(__iced_deferrals.defer({
                lineno: 222
              })));
              __iced_deferrals._fulfill();
            })(function() {
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/Users/max/src/keybase/blockchain/src/base.iced",
                  funcname: "Blockchain.run"
                });
                _this.lookup_userid(esc(__iced_deferrals.defer({
                  lineno: 223
                })));
                __iced_deferrals._fulfill();
              })(function() {
                (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral,
                    filename: "/Users/max/src/keybase/blockchain/src/base.iced",
                    funcname: "Blockchain.run"
                  });
                  _this.find_in_keybase_merkle_tree(esc(__iced_deferrals.defer({
                    lineno: 224
                  })));
                  __iced_deferrals._fulfill();
                })(function() {
                  (function(__iced_k) {
                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                      parent: ___iced_passed_deferral,
                      filename: "/Users/max/src/keybase/blockchain/src/base.iced",
                      funcname: "Blockchain.run"
                    });
                    _this.lookup_user(esc(__iced_deferrals.defer({
                      lineno: 225
                    })));
                    __iced_deferrals._fulfill();
                  })(function() {
                    (function(__iced_k) {
                      __iced_deferrals = new iced.Deferrals(__iced_k, {
                        parent: ___iced_passed_deferral,
                        filename: "/Users/max/src/keybase/blockchain/src/base.iced",
                        funcname: "Blockchain.run"
                      });
                      _this.check_chain(esc(__iced_deferrals.defer({
                        lineno: 226
                      })));
                      __iced_deferrals._fulfill();
                    })(function() {
                      return cb(null, _this.chain);
                    });
                  });
                });
              });
            });
          });
        };
      })(this));
    };

    return Blockchain;

  })(merkle.Base);

}).call(this);
