import Semver from "./index";

describe("Semver()", () => {
    test("should create an instance of Semver for valid versions", () => {
        expect(new Semver("2.0.0") instanceof Semver).toBe(true);
        expect(new Semver("2.0.0-rc.1") instanceof Semver).toBe(true);
        expect(new Semver("1.0.0-beta") instanceof Semver).toBe(true);
        expect(new Semver("1.2.3-beta.1+build345") instanceof Semver).toBe(
            true
        );
    });

    test("should throw `TypeError` on invalid versions", () => {
        expect(() => {
            new Semver();
        }).toThrow(TypeError);
        expect(() => {
            new Semver("");
        }).toThrow(TypeError);
        expect(() => {
            new Semver({});
        }).toThrow(TypeError);
        expect(() => {
            new Semver(null);
        }).toThrow(TypeError);
        expect(() => {
            new Semver([]);
        }).toThrow(TypeError);
        expect(() => {
            new Semver("1.0.z");
        }).toThrow(TypeError);
        expect(() => {
            new Semver("12345");
        }).toThrow(TypeError);
        expect(() => {
            new Semver("abcde");
        }).toThrow(TypeError);
    });
});

describe("toString()", () => {
    test("should return the correct string representation", () => {
        expect(new Semver("2.0.0").toString()).toBe("2.0.0");
        expect(new Semver("2.0.0-rc.1").toString()).toBe("2.0.0-rc.1");
        expect(new Semver("1.0.0-beta").toString()).toBe("1.0.0-beta");
        expect(new Semver("1.2.3-beta.1+build345").toString()).toBe(
            "1.2.3-beta.1+build345"
        );
    });
});

describe("toJson()", () => {
    test("should return the correct string representation", () => {
        expect(new Semver("2.0.0").toJson()).toBe("2.0.0");
        expect(new Semver("2.0.0-rc.1").toJson()).toBe("2.0.0-rc.1");
        expect(new Semver("1.0.0-beta").toJson()).toBe("1.0.0-beta");
        expect(new Semver("1.2.3-beta.1+build345").toJson()).toBe(
            "1.2.3-beta.1+build345"
        );
    });
});

describe("compare()", () => {
    test("should throw `TypeError` on invalid versions", () => {
        const version = new Semver("1.0.0");

        expect(() => {
            version.compare();
        }).toThrow(TypeError);
        expect(() => {
            version.compare("");
        }).toThrow(TypeError);
        expect(() => {
            version.compare({});
        }).toThrow(TypeError);
        expect(() => {
            version.compare(null);
        }).toThrow(TypeError);
        expect(() => {
            version.compare([]);
        }).toThrow(TypeError);
        expect(() => {
            version.compare("1.0.z");
        }).toThrow(TypeError);
        expect(() => {
            version.compare("12345");
        }).toThrow(TypeError);
        expect(() => {
            version.compare("abcde");
        }).toThrow(TypeError);
    });

    test("should return the correct value", () => {
        expect(new Semver("2.0.0").compare(new Semver("1.9.9"))).toBe(1);
        expect(new Semver("2.0.0").compare(new Semver("2.0.1"))).toBe(-1);
        expect(new Semver("2.0.0").compare(new Semver("2.0.0-rc.1"))).toBe(1);
        expect(new Semver("2.0.0-rc.1").compare(new Semver("2.0.0"))).toBe(-1);
        expect(new Semver("2.0.0").compare(new Semver("2.0.0"))).toBe(0);
        expect(new Semver("2.0.0-rc.1").compare(new Semver("2.0.0-rc.2"))).toBe(
            -1
        );
        expect(new Semver("2.0.0-rc.2").compare(new Semver("2.0.0-rc.1"))).toBe(
            1
        );
        expect(
            new Semver("1.2.3-beta.1+build345").compare(
                new Semver("1.2.3-beta.1+build346")
            )
        ).toBe(-1);
        expect(
            new Semver("1.2.3-beta.1+build345").compare(
                new Semver("1.2.3-beta.1+build344")
            )
        ).toBe(1);
        expect(
            new Semver("1.2.3-beta.1+build345").compare(
                new Semver("1.2.3-beta.1+build345")
            )
        ).toBe(0);
        expect(
            new Semver("1.2.3-beta.1+build345").compare(
                new Semver("1.2.3-beta.2+build346")
            )
        ).toBe(-1);
        expect(
            new Semver("1.2.3-beta.2+build346").compare(
                new Semver("1.2.3-beta.1+build345")
            )
        ).toBe(1);
        expect(
            new Semver("1.2.3-beta").compare(new Semver("1.2.3-beta.1"))
        ).toBe(-1);
        expect(
            new Semver("1.2.3-beta.1").compare(new Semver("1.2.3-beta"))
        ).toBe(1);
        expect(new Semver("1.2.3-beta").compare(new Semver("1.2.3-1"))).toBe(1);
        expect(new Semver("1.2.3-1").compare(new Semver("1.2.3-beta"))).toBe(
            -1
        );
        expect(
            new Semver("1.2.3-beta.2").compare(new Semver("1.2.3-beta.1"))
        ).toBe(1);
        expect(
            new Semver("1.2.3-beta").compare(new Semver("1.2.3-alpha"))
        ).toBe(1);
        expect(
            new Semver("1.2.3-beta+build345").compare(
                new Semver("1.2.3-beta+build344")
            )
        ).toBe(1);
    });
});

describe("isGreaterThan()", () => {
    test("should return the correct value", () => {
        expect(new Semver("2.0.0").isGreaterThan(new Semver("1.9.9"))).toBe(
            true
        );
        expect(new Semver("2.0.0").isGreaterThan(new Semver("2.0.1"))).toBe(
            false
        );
        expect(
            new Semver("2.0.0").isGreaterThan(new Semver("2.0.0-rc.1"))
        ).toBe(true);
        expect(
            new Semver("2.0.0-rc.1").isGreaterThan(new Semver("2.0.0"))
        ).toBe(false);
        expect(new Semver("2.0.0").isGreaterThan(new Semver("2.0.0"))).toBe(
            false
        );
        expect(
            new Semver("2.0.0-rc.1").isGreaterThan(new Semver("2.0.0-rc.2"))
        ).toBe(false);
        expect(
            new Semver("2.0.0-rc.2").isGreaterThan(new Semver("2.0.0-rc.1"))
        ).toBe(true);
        expect(
            new Semver("1.2.3-beta.1+build345").isGreaterThan(
                new Semver("1.2.3-beta.1+build346")
            )
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta.1+build345").isGreaterThan(
                new Semver("1.2.3-beta.1+build344")
            )
        ).toBe(true);
        expect(
            new Semver("1.2.3-beta.1+build345").isGreaterThan(
                new Semver("1.2.3-beta.1+build345")
            )
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta.1+build345").isGreaterThan(
                new Semver("1.2.3-beta.2+build346")
            )
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta.2+build346").isGreaterThan(
                new Semver("1.2.3-beta.1+build345")
            )
        ).toBe(true);
        expect(
            new Semver("1.2.3-beta").isGreaterThan(new Semver("1.2.3-beta.1"))
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta.1").isGreaterThan(new Semver("1.2.3-beta"))
        ).toBe(true);
        expect(
            new Semver("1.2.3-beta").isGreaterThan(new Semver("1.2.3-1"))
        ).toBe(true);
        expect(
            new Semver("1.2.3-1").isGreaterThan(new Semver("1.2.3-beta"))
        ).toBe(false);
    });
});

describe("isSmallerThan()", () => {
    test("should return the correct value", () => {
        expect(new Semver("2.0.0").isSmallerThan(new Semver("1.9.9"))).toBe(
            false
        );
        expect(new Semver("2.0.0").isSmallerThan(new Semver("2.0.1"))).toBe(
            true
        );
        expect(
            new Semver("2.0.0").isSmallerThan(new Semver("2.0.0-rc.1"))
        ).toBe(false);
        expect(
            new Semver("2.0.0-rc.1").isSmallerThan(new Semver("2.0.0"))
        ).toBe(true);
        expect(new Semver("2.0.0").isSmallerThan(new Semver("2.0.0"))).toBe(
            false
        );
        expect(
            new Semver("2.0.0-rc.1").isSmallerThan(new Semver("2.0.0-rc.2"))
        ).toBe(true);
        expect(
            new Semver("2.0.0-rc.2").isSmallerThan(new Semver("2.0.0-rc.1"))
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta.1+build345").isSmallerThan(
                new Semver("1.2.3-beta.1+build346")
            )
        ).toBe(true);
        expect(
            new Semver("1.2.3-beta.1+build345").isSmallerThan(
                new Semver("1.2.3-beta.1+build344")
            )
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta.1+build345").isSmallerThan(
                new Semver("1.2.3-beta.1+build345")
            )
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta.1+build345").isSmallerThan(
                new Semver("1.2.3-beta.2+build346")
            )
        ).toBe(true);
        expect(
            new Semver("1.2.3-beta.2+build346").isSmallerThan(
                new Semver("1.2.3-beta.1+build345")
            )
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta").isSmallerThan(new Semver("1.2.3-beta.1"))
        ).toBe(true);
        expect(
            new Semver("1.2.3-beta.1").isSmallerThan(new Semver("1.2.3-beta"))
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta").isSmallerThan(new Semver("1.2.3-1"))
        ).toBe(false);
        expect(
            new Semver("1.2.3-1").isSmallerThan(new Semver("1.2.3-beta"))
        ).toBe(true);
    });
});

describe("isEqualTo()", () => {
    test("should return the correct value", () => {
        expect(new Semver("2.0.0").isEqualTo(new Semver("1.9.9"))).toBe(false);
        expect(new Semver("2.0.0").isEqualTo(new Semver("2.0.1"))).toBe(false);
        expect(new Semver("2.0.0").isEqualTo(new Semver("2.0.0-rc.1"))).toBe(
            false
        );
        expect(new Semver("2.0.0-rc.1").isEqualTo(new Semver("2.0.0"))).toBe(
            false
        );
        expect(new Semver("2.0.0").isEqualTo(new Semver("2.0.0"))).toBe(true);
        expect(
            new Semver("2.0.0-rc.1").isEqualTo(new Semver("2.0.0-rc.2"))
        ).toBe(false);
        expect(
            new Semver("2.0.0-rc.2").isEqualTo(new Semver("2.0.0-rc.1"))
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta.1+build345").isEqualTo(
                new Semver("1.2.3-beta.1+build346")
            )
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta.1+build345").isEqualTo(
                new Semver("1.2.3-beta.1+build344")
            )
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta.1+build345").isEqualTo(
                new Semver("1.2.3-beta.1+build345")
            )
        ).toBe(true);
        expect(
            new Semver("1.2.3-beta.1+build345").isEqualTo(
                new Semver("1.2.3-beta.2+build346")
            )
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta.2+build346").isEqualTo(
                new Semver("1.2.3-beta.1+build345")
            )
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta").isEqualTo(new Semver("1.2.3-beta.1"))
        ).toBe(false);
        expect(
            new Semver("1.2.3-beta.1").isEqualTo(new Semver("1.2.3-beta"))
        ).toBe(false);
        expect(new Semver("1.2.3-beta").isEqualTo(new Semver("1.2.3-1"))).toBe(
            false
        );
        expect(new Semver("1.2.3-1").isEqualTo(new Semver("1.2.3-beta"))).toBe(
            false
        );
    });
});
