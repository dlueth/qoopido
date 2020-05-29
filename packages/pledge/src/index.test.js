const Pledge = require("../dist/index");
const constant = require("../temp/constant");

const _error = console.error;

beforeEach(() => {
    /*
     * this is necessary to suppress the `unhandled pledge rejection`
     * for rejected pledges without any `onReject` callbacks
     */
    console.error = () => {};
});

afterEach(() => {
    console.error = _error;
});

describe("Pledge()", () => {
    test("should throw `TypeError` on invalid executor", () => {
        expect(() => {
            new Pledge();
        }).toThrow(TypeError);
        expect(() => {
            new Pledge();
        }).toThrow(constant.ERROR_EXECUTOR_NO_FUNCTION);
    });

    test("should successfully return a new instance", () => {
        expect(new Pledge(function () {}) instanceof Pledge).toBe(true);
    });

    test("executor should always receive `resolve` and `reject` functions as argument", () => {
        new Pledge((resolve, reject) => {
            expect(typeof resolve === "function").toBe(true);
            expect(typeof reject === "function").toBe(true);
        });
    });

    test("should console.error on unhandled pledge rejection (executor)", () => {
        return new Promise((resolve, reject) => {
            const error = new Error("error-" + performance.now());
            const callback = jest.fn();

            console.error = callback;

            new Pledge(() => {
                throw error;
            });

            setTimeout(() => {
                try {
                    expect(callback.mock.calls[0].length).toBe(2);
                    expect(callback.mock.calls[0][0]).toBe(
                        constant.MSG_UNHANDLED_REJECTION
                    );
                    expect(callback.mock.calls[0][1]).toBe(error);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 60);
        });
    });

    test("should console.error on unhandled pledge rejection (nested)", () => {
        return new Promise((resolve, reject) => {
            const error = new Error("error-" + performance.now());
            const callback = jest.fn();

            console.error = callback;

            Pledge.resolve().then(() => {
                return Pledge.reject(error);
            });

            setTimeout(() => {
                try {
                    expect(callback.mock.calls[0].length).toBe(2);
                    expect(callback.mock.calls[0][0]).toBe(
                        constant.MSG_UNHANDLED_REJECTION
                    );
                    expect(callback.mock.calls[0][1]).toBe(error);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 60);
        });
    });

    test("should console.error on unhandled pledge rejection (nested, no error)", () => {
        return new Promise((resolve, reject) => {
            const value = "value-" + performance.now();
            const callback = jest.fn();

            console.error = callback;

            Pledge.resolve().then(() => {
                return Pledge.reject(value);
            });

            setTimeout(() => {
                try {
                    expect(callback.mock.calls[0].length).toBe(2);
                    expect(callback.mock.calls[0][0]).toBe(
                        constant.MSG_UNHANDLED_REJECTION
                    );
                    expect(callback.mock.calls[0][1]).toBe(value);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 60);
        });
    });
});

describe("get isSettled()", () => {
    test("should return `false` for unsettled pledges", () => {
        const pledge = new Pledge(() => {});

        expect(pledge.isSettled).toBe(false);
    });

    test("should return `true` for resolved pledges", () => {
        return new Promise((resolve, reject) => {
            const pledge = new Pledge((resolve) => {
                resolve();
            });

            setTimeout(() => {
                try {
                    expect(pledge.isSettled).toBe(true);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("should return `true` for rejected pledges", () => {
        return new Promise((resolve, reject) => {
            const pledge = new Pledge((resolve, reject) => {
                reject();
            });

            setTimeout(() => {
                try {
                    expect(pledge.isSettled).toBe(true);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });
});

describe("get isPending()", () => {
    test("should return `true` for pending pledges", () => {
        const pledge = new Pledge(() => {});

        expect(pledge.isPending).toBe(true);
    });

    test("should return `false` for resolved pledges", () => {
        return new Promise((resolve, reject) => {
            const pledge = new Pledge((resolve) => {
                resolve();
            });

            setTimeout(() => {
                try {
                    expect(pledge.isPending).toBe(false);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("should return `false` for rejected pledges", () => {
        return new Promise((resolve, reject) => {
            const pledge = new Pledge((resolve, reject) => {
                reject();
            });

            setTimeout(() => {
                try {
                    expect(pledge.isPending).toBe(false);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });
});

describe("get isResolved()", () => {
    test("should return `true` for resolved pledges", () => {
        return new Promise((resolve, reject) => {
            const pledge = new Pledge((resolve) => {
                resolve();
            });

            setTimeout(() => {
                try {
                    expect(pledge.isResolved).toBe(true);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("should return `false` for pending pledges", () => {
        const pledge = new Pledge(() => {});

        expect(pledge.isResolved).toBe(false);
    });

    test("should return `false` for rejected pledges", () => {
        return new Promise((resolve, reject) => {
            const pledge = new Pledge((resolve, reject) => {
                reject();
            });

            setTimeout(() => {
                try {
                    expect(pledge.isResolved).toBe(false);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });
});

describe("get isRejected()", () => {
    test("should return `true` for rejected pledges", () => {
        return new Promise((resolve, reject) => {
            const pledge = new Pledge((resolve, reject) => {
                reject();
            });

            setTimeout(() => {
                try {
                    expect(pledge.isRejected).toBe(true);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("should return `false` for pending pledges", () => {
        const pledge = new Pledge(() => {});

        expect(pledge.isRejected).toBe(false);
    });

    test("should return `false` for resolved pledges", () => {
        return new Promise((resolve, reject) => {
            const pledge = new Pledge((resolve) => {
                resolve();
            });

            setTimeout(() => {
                try {
                    expect(pledge.isRejected).toBe(false);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });
});

describe("then()", () => {
    test("onFulfill callback should be called when pledge is resolved (single value)", () => {
        return new Promise((resolve, reject) => {
            const value = performance.now();
            const callback = jest.fn();

            new Pledge((resolve) => {
                resolve(value);
            }).then(callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);
                    expect(callback.mock.calls[0].length).toBe(1);
                    expect(callback.mock.calls[0][0]).toBe(value);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("onFulfill callback should be called when registered after settlement", () => {
        return new Promise((resolve, reject) => {
            const callback = jest.fn();
            const pledge = new Pledge((resolve) => {
                resolve();
            });

            setTimeout(() => {
                pledge.then(callback);
            }, 20);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 40);
        });
    });

    test("onFulfill callback should be called when pledge is resolved (multiple values)", () => {
        return new Promise((resolve, reject) => {
            const first = "first-" + performance.now();
            const second = "second-" + performance.now();
            const callback = jest.fn();

            new Pledge((resolve) => {
                resolve(first, second);
            }).then(callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);
                    expect(callback.mock.calls[0].length).toBe(2);
                    expect(callback.mock.calls[0][0]).toBe(first);
                    expect(callback.mock.calls[0][1]).toBe(second);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("onReject callback should be called when pledge is rejected (single value)", () => {
        return new Promise((resolve, reject) => {
            const value = performance.now();
            const callback = jest.fn();

            new Pledge((resolve, reject) => {
                reject(value);
            }).then(null, callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);
                    expect(callback.mock.calls[0].length).toBe(1);
                    expect(callback.mock.calls[0][0]).toBe(value);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("onReject callback should be called when pledge is rejected (multiple values)", () => {
        return new Promise((resolve, reject) => {
            const first = "first-" + performance.now();
            const second = "second-" + performance.now();
            const callback = jest.fn();

            new Pledge((resolve, reject) => {
                reject(first, second);
            }).then(null, callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);
                    expect(callback.mock.calls[0].length).toBe(2);
                    expect(callback.mock.calls[0][0]).toBe(first);
                    expect(callback.mock.calls[0][1]).toBe(second);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("onReject callback should be called when registered after settlement", () => {
        return new Promise((resolve, reject) => {
            const callback = jest.fn();
            const pledge = new Pledge((resolve, reject) => {
                reject();
            });

            setTimeout(() => {
                pledge.then(null, callback);
            }, 20);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 40);
        });
    });

    test("onReject callback should be called when any previous onFulfill or onReject throws", () => {
        return new Promise((resolve, reject) => {
            const callback = jest.fn();
            const error = new Error("error-" + performance.now());

            Pledge.resolve()
                .then(() => {
                    throw error;
                })
                .catch(callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);
                    expect(callback.mock.calls[0].length).toBe(1);
                    expect(callback.mock.calls[0][0]).toBe(error);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });
});

describe("always()", () => {
    test("callback should be called when pledge is resolved", () => {
        return new Promise((resolve, reject) => {
            const callback = jest.fn();

            new Pledge((resolve) => {
                resolve();
            }).always(callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("callback should be called when pledge is rejected", () => {
        return new Promise((resolve, reject) => {
            const callback = jest.fn();

            new Pledge((resolve, reject) => {
                reject();
            }).always(callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });
});

describe("finally()", () => {
    test("callback should be called when pledge is resolved", () => {
        return new Promise((resolve, reject) => {
            const callback = jest.fn();

            new Pledge((resolve) => {
                resolve();
            }).finally(callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("callback should be called when pledge is rejected", () => {
        return new Promise((resolve, reject) => {
            const callback = jest.fn();

            new Pledge((resolve, reject) => {
                reject();
            }).finally(callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });
});

describe("catch()", () => {
    test("callback should be called when pledge is rejected", () => {
        return new Promise((resolve, reject) => {
            const callback = jest.fn();

            new Pledge((resolve, reject) => {
                reject();
            }).catch(callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("callback should not be called when pledge is resolved", () => {
        return new Promise((resolve, reject) => {
            const callback = jest.fn();

            new Pledge((resolve) => {
                resolve();
            }).catch(callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(0);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });
});

describe("Pledge.all()", () => {
    test("should return a pledge", () => {
        expect(Pledge.all([]) instanceof Pledge).toBe(true);
    });

    test("should throw `TypeError` on invalid pledges", () => {
        expect(() => {
            Pledge.all();
        }).toThrow(TypeError);
        expect(() => {
            Pledge.all();
        }).toThrow(constant.ERROR_PLEDGES_NO_ARRAY);

        expect(() => {
            Pledge.all({});
        }).toThrow(TypeError);
        expect(() => {
            Pledge.all({});
        }).toThrow(constant.ERROR_PLEDGES_NO_ARRAY);

        expect(() => {
            Pledge.all("test");
        }).toThrow(TypeError);
        expect(() => {
            Pledge.all("test");
        }).toThrow(constant.ERROR_PLEDGES_NO_ARRAY);
    });

    test("should resolve when all pledges did resolve", () => {
        return new Promise((resolve, reject) => {
            const callback = jest.fn();
            const pledge = Pledge.all([
                Pledge.resolve(1, 2),
                new Pledge((resolve) => {
                    setTimeout(() => {
                        resolve(3, 4);
                    });
                }),
            ]).then(callback);

            setTimeout(() => {
                try {
                    expect(pledge.isResolved).toBe(true);
                    expect(callback.mock.calls.length).toBe(1);
                    expect(callback.mock.calls[0].length).toBe(2);
                    expect(callback.mock.calls[0][0]).toEqual([1, 2]);
                    expect(callback.mock.calls[0][1]).toEqual([3, 4]);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("should reject when any pledge gets rejected", () => {
        return new Promise((resolve, reject) => {
            const callback = jest.fn(() => {
                return Pledge.reject();
            });
            const pledge = Pledge.all([
                Pledge.resolve(),
                new Pledge((resolve, reject) => {
                    setTimeout(() => {
                        reject(1, 2);
                    }, 10);
                }),
                new Pledge((resolve, reject) => {
                    setTimeout(() => {
                        reject(3, 4);
                    });
                }),
            ]).catch(callback);

            setTimeout(() => {
                try {
                    expect(pledge.isRejected).toBe(true);
                    expect(callback.mock.calls.length).toBe(1);
                    expect(callback.mock.calls[0].length).toBe(2);
                    expect(callback.mock.calls[0][0]).toEqual([3, 4]);
                    expect(callback.mock.calls[0][1]).toEqual([1, 2]);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });
});

describe("Pledge.race()", () => {
    test("should return a pledge", () => {
        expect(Pledge.race([]) instanceof Pledge).toBe(true);
    });

    test("should throw `TypeError` on invalid pledges", () => {
        expect(() => {
            Pledge.race();
        }).toThrow(TypeError);
        expect(() => {
            Pledge.race();
        }).toThrow(constant.ERROR_PLEDGES_NO_ARRAY);

        expect(() => {
            Pledge.race({});
        }).toThrow(TypeError);
        expect(() => {
            Pledge.race({});
        }).toThrow(constant.ERROR_PLEDGES_NO_ARRAY);

        expect(() => {
            Pledge.race("test");
        }).toThrow(TypeError);
        expect(() => {
            Pledge.race("test");
        }).toThrow(constant.ERROR_PLEDGES_NO_ARRAY);
    });

    test("should resolve when any one pledge did resolve", () => {
        return new Promise((resolve, reject) => {
            const callback = jest.fn();
            const pledge = Pledge.race([
                new Pledge((resolve) => {
                    setTimeout(() => {
                        resolve(1, 2);
                    });
                }),
                Pledge.resolve(3, 4),
            ]).then(callback);

            setTimeout(() => {
                try {
                    expect(pledge.isResolved).toBe(true);
                    expect(callback.mock.calls.length).toBe(1);
                    expect(callback.mock.calls[0].length).toBe(2);
                    expect(callback.mock.calls[0][0]).toEqual(3);
                    expect(callback.mock.calls[0][1]).toEqual(4);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("should reject when any one pledge gets rejected", () => {
        return new Promise((resolve, reject) => {
            const callback = jest.fn(() => {
                return Pledge.reject();
            });
            const pledge = Pledge.race([
                new Pledge((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 5);
                }),
                new Pledge((resolve, reject) => {
                    setTimeout(() => {
                        reject(1, 2);
                    }, 10);
                }),
                new Pledge((resolve, reject) => {
                    setTimeout(() => {
                        reject(3, 4);
                    });
                }),
            ]).catch(callback);

            setTimeout(() => {
                try {
                    expect(pledge.isRejected).toBe(true);
                    expect(callback.mock.calls.length).toBe(1);
                    expect(callback.mock.calls[0].length).toBe(2);
                    expect(callback.mock.calls[0][0]).toBe(3);
                    expect(callback.mock.calls[0][1]).toBe(4);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });
});

describe("static get STATE_PENDING()", () => {
    test("should correctly return the value of `STATE_PENDING`", () => {
        expect(Pledge.STATE_PENDING).toBe(constant.STATE_PENDING);
    });
});

describe("static get STATE_RESOLVED()", () => {
    test("should correctly return the value of `STATE_RESOLVED`", () => {
        expect(Pledge.STATE_RESOLVED).toBe(constant.STATE_RESOLVED);
    });
});

describe("static get STATE_REJECTED()", () => {
    test("should correctly return the value of `STATE_REJECTED`", () => {
        expect(Pledge.STATE_REJECTED).toBe(constant.STATE_REJECTED);
    });
});
