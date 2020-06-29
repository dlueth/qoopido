class DemandError extends Error {}
class AnonymousError extends DemandError {}
class LoadError extends DemandError {}
class ProvideError extends DemandError {}
class ResolveError extends DemandError {}

export { DemandError, AnonymousError, LoadError, ProvideError, ResolveError };
