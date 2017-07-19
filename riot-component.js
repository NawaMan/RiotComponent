/* RiotComponent v0.0.1, @license MIT */
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.riotComponent = factory(global.riot));
}(this, (function() {
    'use strict';

    var riotComponent = {
        'makeComponent': function(element) {
            riot.observable(element.root)

            element['_event'] = function(eventName, callback) {
                return function(params) {
                    element.root.trigger(eventName, params)
                    if (typeof(callback) === 'function') {
                        callback(params);
                    }
                }
            }
            element['_method'] = function(callName, callBody) {
                element.root[callName] = function() {
                    element.root.trigger(callName)
                }
                element.root.on(callName, callBody)

                element[callName] = element.root[callName]
                element.on(callName, callBody)
            }
            element['_property'] = function(name, setCallBack) {
                Object.defineProperty(element.root, name, {
                    get: function() { return element[name] },
                    set: setCallBack
                })
            }
            return element
        }
    }

    return riotComponent;

})));