/* RiotComponent v0.1.2, @license MIT */
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.riotComponent = factory(global.riot));
}(this, (function() {
    'use strict';

    var _propsVarName = '_propsValues'

    var riotComponent = {
        'makeComponent': function(tag) {
            riot.observable(tag.root)

            tag['_event'] = function(eventName, callback) {
                return function() {
                    var callBackArgs = Array.prototype.slice.call(arguments);
                    var triggerArgs = Array.prototype.slice.call(arguments);
                    triggerArgs.unshift(eventName)

                    var elm = tag.root
                    elm.trigger.apply(tag, triggerArgs)
                    tag.trigger.apply(tag, triggerArgs)
                    if (typeof(callback) === 'function') {
                        callback.apply(tag, callBackArgs);
                    }
                }
            }
            tag['_method'] = function(callName, callBody) {
                var methodDef = function() {
                    var args = Array.prototype.slice.call(arguments);
                    return callBody.apply(tag, args)
                }

                var elm = tag.root
                
                elm[callName] = methodDef
                tag[callName] = methodDef
            }
            tag['_property'] = function(name, setCallBack, getCallBack) {
                if (!(_propsVarName in tag))
                    tag[_propsVarName] = {}
                
                tag[_propsVarName][name] = tag[name]

                var getFunc = function() {
                    const underlineValue = tag[_propsVarName][name]
                    if (getCallBack)
                        return getCallBack.apply(tag, [underlineValue])

                    return underlineValue
                }
                var setFunc = function(newValue) {
                        setCallBack(newValue, function(_newValue) {
                            tag[_propsVarName][name] = _newValue || newValue
                        })
                }
                var propDef = {
                    get: getFunc,
                    set: setFunc
                }

                var elm = tag.root
                Object.defineProperty(tag, name, propDef)
                Object.defineProperty(elm, name, propDef)
            }
            return tag
        }
    }

    return riotComponent;
})));