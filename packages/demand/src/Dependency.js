import Pledge from "@qoopido/pledge";
import { helper } from "@qoopido/utility";
import { isPositive } from "@qoopido/validator";
import settings from "./settings";
import { isRelative, matchBase, matchParameter } from "./regex";
import { MOCK_PREFIX } from "./constant";
import resolvePath from "./resolve/path";

class Dependency {
    constructor(uri, context, register) {
        var self      = this,
            parameter = uri.match(matchParameter) || placeholder;

        this.mock     = parameter[1] ? true : false;
        this.cache    = parameter[2] ? parameter[1] === '+' : null;
        this.type     = parameter[3] || settings.handler;
        this.version  = new ClassSemver(parameter[4] || settings.version);
        this.lifetime = (parameter[5] && parameter[5] * 1000) || settings.lifetime;
        this.path     = resolvePath(uri, context);
        this.id       = (this.mock ? MOCK_PREFIX : '' ) + this.type + '!' + this.path;
        this.uri      = (this.mock ? MOCK_PREFIX : '' ) + this.type + '@' + this.version + (isPositive(this.lifetime) && this.lifetime > 0 ? '#' + this.lifetime : '' ) + '!' + this.path;
        this.dfd      = Pledge.defer();
        this.pledge   = this.dfd.pledge;
        this.invalid  = false;

        this.pledge.then(function() {
            self.value = helper.toArray(arguments);
        });

        (register !== false) && registry.set(self.id, self);

        return self;
    }
}

var ClassDependency = (function() {
    var PREFIX_INTERNAL = 'internal!',
        registry        = new ClassRegistry(),
        matchInternal   = /^(?:mock:|internal!)/i,
        placeholder     = [];

    function setProperty(property, value) {
        this[property] = value;
    }

    function add(id) {
        if(!matchInternal.test(id)) {
            this.push(id);
        }
    }

    function addPending(id, dependency) {
        if(!matchInternal.test(id) && dependency.pledge.isPending()) {
            this.push(id);
        }
    }

    function addResolved(id, dependency) {
        if(!matchInternal.test(id) && dependency.pledge.isResolved()) {
            this.push(id);
        }
    }

    function addRejected(id, dependency) {
        if(!matchInternal.test(id) && dependency.pledge.isRejected()) {
            this.push(id);
        }
    }

    function list() {
        return functionIterate(registry.get(), add, []);
    }

    list.pending = function() {
        return functionIterate(registry.get(), addPending, []);
    };

    list.resolved = function() {
        return functionIterate(registry.get(), addResolved, []);
    };

    list.rejected = function() {
        return functionIterate(registry.get(), addRejected, []);
    };

    function ClassDependency(uri, context, register) {
        var self      = this,
            parameter = uri.match(regexMatchParameter) || placeholder;

        self.path     = functionResolvePath(uri, context);
        self.mock     = parameter[1] ? true : false;
        self.cache    = parameter[2] ? parameter[1] === '+' : null;
        self.type     = parameter[3] || settings.handler;
        self.version  = new ClassSemver(parameter[4] || settings.version);
        self.lifetime = (parameter[5] && parameter[5] * 1000) || settings.lifetime;
        self.id       = (self.mock ? MOCK_PREFIX : '' ) + self.type + '!' + self.path;
        self.uri      = (self.mock ? MOCK_PREFIX : '' ) + self.type + '@' + self.version + (validatorIsPositive(self.lifetime) && self.lifetime > 0 ? '#' + self.lifetime : '' ) + '!' + self.path;
        self.dfd      = ClassPledge.defer();
        self.pledge   = self.dfd.pledge;
        self.invalid  = false;

        self.pledge.then(function() {
            self.value = functionToArray(arguments);
        });

        (register !== false) && registry.set(self.id, self);

        return self;
    }

    ClassDependency.prototype = {
        enqueue: true // handled by handler
        /* only for reference
         path:     null,
         mock:     null,
        cache:    null,
        type:     null,
        version:  null,
        lifetime: null,
         id:       null,
         uri:      null,
        dfd:      null,
        pledge:   null,
        value:    null,
        handler:  null, // set by Dependency.resolve
         source:   null, // set by Cache or Loader
         url:      null, // optional, set by Loader
        */
    };

    ClassDependency.get = function(uri, context) {
        return registry.get(functionResolveId(uri, context));
    };

    ClassDependency.resolve = function(uri, context) {
        var isInternal = context && regexMatchInternal.test(uri),
            dependency = isInternal ? this.get(PREFIX_INTERNAL + context + '/' + uri) : this.get(uri, context),
            value;

        if(!dependency) {
            if(isInternal) {
                dependency = new ClassDependency(PREFIX_INTERNAL + context + '/' + uri);

                switch(uri) {
                    case DEMAND_ID:
                        value = (function() {
                            return functionIterate(demand, setProperty, demand.bind(context));
                        }());

                        break;
                    case PROVIDE_ID:
                        value = provide.bind(context);

                        break;
                    case PATH_ID:
                        value = context;

                        break;
                    case EXPORTS_ID:
                        value = {};

                        dependency.dfd.pledge
                            .then(this.get(context).dfd.resolve);

                        break;
                }

                dependency.dfd.resolve(value);
            } else {
                dependency = new ClassDependency(uri, context);

                demand(MODULE_PREFIX_HANDLER + dependency.type)
                    .then(
                        function(handler) {
                            dependency.handler = handler;

                            if(dependency.mock) {
                                dependency.dfd.resolve(handler);
                            } else {
                                singletonCache.resolve(dependency);
                            }
                        },
                        function() {
                            dependency.dfd.reject(new ClassFailure(ERROR_LOAD + ' (handler)', self.id));
                        }
                    )
            }
        }

        return dependency;
    };

    ClassDependency.remove = function(uri, context, cache) {
        var id   = functionResolveId(uri, context),
            node = document.querySelector('[' + DEMAND_ID + '-id="' + id + '"]');

        registry.remove(id);
        registry.remove(MOCK_PREFIX + id);

        node && node.parentNode.removeChild(node);

        (cache !== false) && singletonCache.clear(id);
    };

    ClassDependency.list = list;

    return ClassDependency;
}());
