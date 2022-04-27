import { assert } from "chai";
import { TokenPayment } from "./tokenPayment";

describe("denomination 4,4", () => {
  const numbers: { [key: string]: string } = {
    "9999999999999999999999990000": "999,999,999,999,999,999,999,999",
    "0": "0", // 🚫 expected '0.0000' to equal '0' --> 0.0 nu e nevoie sa mai fie scris
  };
  const denomination = 4;
  const decimals = 4;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      assert.equal(
        TokenPayment.fungibleFromBigInteger(
          "",
          input,
          denomination
        ).toPrettyString({ decimalPlaces: decimals, tokenTicker: "" }),
        output
      );
    });
  }
});

describe("denomination 8,4", () => {
  const numbers: { [key: string]: string } = {
    "9999999999999999999899996000": "99,999,999,999,999,999,998.9999", // ✅
    "10000": "0.0001", // ✅
  };
  const denomination = 8;
  const decimals = 4;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      assert.equal(
        TokenPayment.fungibleFromBigInteger(
          "",
          input,
          denomination
        ).toPrettyString({ decimalPlaces: decimals, tokenTicker: "" }),
        output
      );
    });
  }
});

describe("denomination 0,0", () => {
  const numbers: { [key: string]: string } = {
    "350": "350", // ✅
  };
  const denomination = 0;
  const decimals = 0;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      assert.equal(
        TokenPayment.fungibleFromBigInteger(
          "",
          input,
          denomination
        ).toPrettyString({ decimalPlaces: decimals, tokenTicker: "" }),
        output
      );
    });
  }
});

describe("denomination 4,8,true", () => {
  const numbers: { [key: string]: string } = {
    // ✅ daca vrem sa vedem toate zecimalele, punem la decimalPlaces denomination
    // ar fi interesant daca lipseste decimalPlaces, sa ia automat setarea asta
    "12345678901234567890123": "123,456,789,012,345.67890123",
  };
  const denomination = 8;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      assert.equal(
        TokenPayment.fungibleFromBigInteger(
          "",
          input,
          denomination
        ).toPrettyString({ decimalPlaces: denomination, tokenTicker: "" }),
        output
      );
    });
  }
});

describe("denomination 18, 0 decimals,show last nonZero true", () => {
  const numbers: { [key: string]: string } = {
    // 🚫 uneori nu vrei sa arati zecimale, dar daca sunt, sa se arate pana la ultima
    // in acest caz nu merge hack-ul cu `decimalPlaces: denomination`
    "102000000000000000": "0.102", // 🚫 expected '0.102000000000000000' to equal '0.102'
    "100000000000000000": "0.1", // 🚫 expected '0.100000000000000000' to equal '0.1'
    "1000000000000000000": "1", // 🚫 expected '1.000000000000000000' to equal '1'
  };
  const denomination = 18;
  const decimals = 0;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      assert.equal(
        TokenPayment.fungibleFromBigInteger(
          "",
          input,
          denomination
        ).toPrettyString({ decimalPlaces: decimals, tokenTicker: "" }),
        output
      );
    });
  }
});

describe("denomination float throws error", () => {
  const numbers: { [key: string]: string } = {
    "0.015": "Throws error", // ✅ intelege ca e eroare
    "01000000000000000000": "Throws error", // 🚫 ar fi trebuit sa crape ca nu e un numar valid (10% discutabil)
  };
  const denomination = 18;
  const decimals = 4;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      assert.throws(() => {
        TokenPayment.fungibleFromBigInteger(
          "",
          input,
          denomination
        ).toPrettyString({ decimalPlaces: decimals, tokenTicker: "" });
      }, /^Invalid argument: bad amountAsBigInteger: 0.015$/);
    });
  }
});

describe("denomination negative", () => {
  const numbers: { [key: string]: string } = {
    // 🚫 crapa la numere negative. ar trebui sa treaca? (de discutat)
    "-922506751086064008": "-0.922506751086064008",
    "-578345000000000000000": "-578.3450",
    "-1578345000000000000000": "-1,578.3450",
    "-3456000000000000000": "-3.4560",
  };
  const denomination = 18;
  const decimals = 4;
  for (let i = 0; i < Object.keys(numbers).length; i++) {
    const input = Object.keys(numbers)[i];
    const output = numbers[input];
    it(`denominate ${input} -> ${output}`, () => {
      assert.equal(
        TokenPayment.fungibleFromBigInteger(
          "",
          input,
          denomination
        ).toPrettyString({ decimalPlaces: decimals, tokenTicker: "" }),
        output
      );
    });
  }
});

describe("denomination single tests", () => {
  it.only("should show less than if decimal amount is too low", () => {
    // 🚫 optiunea de a arata <0.01
    assert.equal(
      TokenPayment.fungibleFromBigInteger(
        "",
        (100_000_000_000_000).toString(),
        18
      ).toPrettyString({ decimalPlaces: 2, tokenTicker: "" }),
      "<0.01"
    );
  });
  it.only("should show zero decimals for integers with decimal amount too low", () => {
    // 🚫 optiunea de a ascunde virgule
    assert.equal(
      TokenPayment.fungibleFromBigInteger(
        "",
        ["1", "000", "000", "001", "000", "000", "000", "000"].join(""),
        18
      ).toPrettyString({ decimalPlaces: 2, tokenTicker: "" }),
      "1000.00"
    );
  });
  it.only("should show a valid number if showLastNonZeroDecimal is set", () => {
    // 🚫 showLastNonZeroDecimal
    assert.equal(
      TokenPayment.fungibleFromBigInteger(
        "",
        (1_000_000_000).toString(),
        18
      ).toPrettyString({ decimalPlaces: 4, tokenTicker: "" }),
      "0.000000001"
    );
  });

  it.only("should show remove decimals and not add commas", () => {
    // 🚫 addCommas false
    assert.equal(
      TokenPayment.fungibleFromBigInteger(
        "",
        "369884288127092846270928",
        18
      ).toPrettyString({ decimalPlaces: 4, tokenTicker: "" }),
      "369884.2881"
    );
  });

  it.only("should not add . at the end for 0 decimals", () => {
    // 🚫 zero decimals no commas
    assert.equal(
      TokenPayment.fungibleFromBigInteger(
        "",
        "369884288127092846270928",
        18
      ).toPrettyString({ decimalPlaces: 0, tokenTicker: "" }),
      "369884"
    );
  });
});

describe("test token payment", () => {
  it("should work with EGLD", () => {
    assert.equal(
      TokenPayment.egldFromAmount("1").toString(),
      "1000000000000000000"
    );
    assert.equal(
      TokenPayment.egldFromAmount("10").toString(),
      "10000000000000000000"
    );
    assert.equal(
      TokenPayment.egldFromAmount("100").toString(),
      "100000000000000000000"
    );
    assert.equal(
      TokenPayment.egldFromAmount("1000").toString(),
      "1000000000000000000000"
    );
    assert.equal(
      TokenPayment.egldFromAmount("0.1").toString(),
      "100000000000000000"
    );
    assert.equal(
      TokenPayment.egldFromAmount("0.123456789").toString(),
      "123456789000000000"
    );
    assert.equal(
      TokenPayment.egldFromAmount("0.123456789123456789").toString(),
      "123456789123456789"
    );
    assert.equal(
      TokenPayment.egldFromAmount("0.123456789123456789777").toString(),
      "123456789123456789"
    );
    assert.equal(
      TokenPayment.egldFromAmount(
        "0.123456789123456789777777888888"
      ).toString(),
      "123456789123456789"
    );

    assert.equal(
      TokenPayment.egldFromAmount(0.1).toPrettyString(),
      "0.100000000000000000 EGLD"
    );
    assert.equal(
      TokenPayment.egldFromAmount(1).toPrettyString(),
      "1.000000000000000000 EGLD"
    );
    assert.equal(
      TokenPayment.egldFromAmount(10).toPrettyString(),
      "10.000000000000000000 EGLD"
    );
    assert.equal(
      TokenPayment.egldFromAmount(100).toPrettyString(),
      "100.000000000000000000 EGLD"
    );
    assert.equal(
      TokenPayment.egldFromAmount(1000).toPrettyString(),
      "1000.000000000000000000 EGLD"
    );
    assert.equal(
      TokenPayment.egldFromAmount("0.123456789").toPrettyString(),
      "0.123456789000000000 EGLD"
    );
    assert.equal(
      TokenPayment.egldFromAmount(
        "0.123456789123456789777777888888"
      ).toPrettyString(),
      "0.123456789123456789 EGLD"
    );

    assert.equal(TokenPayment.egldFromBigInteger("1").toString(), "1");
    assert.equal(
      TokenPayment.egldFromBigInteger("1").toPrettyString(),
      "0.000000000000000001 EGLD"
    );
    assert.isTrue(TokenPayment.egldFromAmount("1").isEgld());
  });

  it("should work with USDC", () => {
    let identifier = "USDC-c76f1f";
    let numDecimals = 6;

    assert.equal(
      TokenPayment.fungibleFromAmount(identifier, "1", numDecimals).toString(),
      "1000000"
    );
    assert.equal(
      TokenPayment.fungibleFromAmount(
        identifier,
        "0.1",
        numDecimals
      ).toString(),
      "100000"
    );
    assert.equal(
      TokenPayment.fungibleFromAmount(
        identifier,
        "0.123456789",
        numDecimals
      ).toString(),
      "123456"
    );
    assert.equal(
      TokenPayment.fungibleFromBigInteger(
        identifier,
        "1000000",
        numDecimals
      ).toString(),
      "1000000"
    );
    assert.equal(
      TokenPayment.fungibleFromBigInteger(
        identifier,
        "1000000",
        numDecimals
      ).toPrettyString(),
      "1.000000 USDC-c76f1f"
    );
  });

  it("should work with MetaESDT", () => {
    let identifier = "MEXFARML-28d646";
    let numDecimals = 18;
    let nonce = 12345678;

    let tokenPayment = TokenPayment.metaEsdtFromAmount(
      identifier,
      nonce,
      "0.1",
      numDecimals
    );
    assert.equal(tokenPayment.tokenIdentifier, identifier);
    assert.equal(tokenPayment.nonce, nonce);
    assert.equal(tokenPayment.toString(), "100000000000000000");
  });

  it("should work with NFTs", () => {
    let identifier = "ERDJS-38f249";
    let nonce = 1;

    let tokenPayment = TokenPayment.nonFungible(identifier, nonce);
    assert.equal(tokenPayment.tokenIdentifier, identifier);
    assert.equal(tokenPayment.nonce, nonce);
    assert.equal(tokenPayment.toPrettyString(), "1 ERDJS-38f249");
  });

  it("should format a pretty string", () => {
    assert.equal(
      TokenPayment.egldFromAmount(0.1).toPrettyString({ decimalPlaces: 2 }),
      "0.10 EGLD"
    );
    assert.equal(
      TokenPayment.egldFromAmount(1).toPrettyString({ decimalPlaces: 2 }),
      "1.00 EGLD"
    );
    assert.equal(
      TokenPayment.egldFromAmount(10).toPrettyString({ decimalPlaces: 2 }),
      "10.00 EGLD"
    );
    assert.equal(
      TokenPayment.egldFromAmount(100).toPrettyString({ decimalPlaces: 2 }),
      "100.00 EGLD"
    );
    assert.equal(
      TokenPayment.egldFromAmount(1000).toPrettyString({ decimalPlaces: 2 }),
      "1,000.00 EGLD"
    );
    assert.equal(
      TokenPayment.egldFromAmount("0.123456789").toPrettyString({
        decimalPlaces: 4,
      }),
      "0.1234 EGLD"
    );
    assert.equal(
      TokenPayment.fungibleFromBigInteger(
        "USDC-c76f1f",
        "1000000",
        6
      ).toPrettyString({ decimalPlaces: 2, tokenTicker: "USDC" }),
      "1.00 USDC"
    );
    assert.equal(
      TokenPayment.fungibleFromBigInteger(
        "FOOBAR-123456",
        "1000000",
        3
      ).toPrettyString({ decimalPlaces: 4, tokenTicker: "FOO" }),
      "1,000.0000 FOO"
    );
    assert.equal(
      TokenPayment.nonFungible("ERDJS-38f249", 7).toPrettyString(),
      "1 ERDJS-38f249"
    );
  });
});
