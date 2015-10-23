import * as chai from "chai"
let expect = chai.expect

import whynomatch from "../src/whynomatch"

describe('whynomatch', function () {
  it('works for a single property, single query field', function () {
    let target = { a: 2 }
    let query = { a: 1 }

    let expected = [{ a: 1 }]

    let result = whynomatch(target, query);
    expect(expected).to.deep.equal(result);
  });

  it('works for a multi property, single query field', function () {
    let target = { a: 2, b: 2 }
    let query = { a: 1 }

    let expected = [{ a: 1 }]

    let result = whynomatch(target, query);
    expect(expected).to.deep.equal(result);
  });

  it('works for a multi property, multi query field', function () {
    let target = { a: 2, b: 2 }
    let query = { a: 1, b: 2 }

    let expected = [{ a: 1 }]

    let result = whynomatch(target, query);
    expect(expected).to.deep.equal(result);
  });

  it('works when query queiries non existing fields', function () {
    let target = { a: 2, b: 2 }
    let query = { a: 1, c: 2 }

    let expected = [{ a: 1 }, { c: 2}]

    let result = whynomatch(target, query);
    expect(expected).to.deep.equal(result);
  });

  it('works for a nested property', function () {
    let target = { a: { b: 3, c: 1} }
    let query = { a: { b: 3, c: 4 } }

    let expected = [{ a: { c: 4 } }]

    let result = whynomatch(target, query);
    expect(expected).to.deep.equal(result);
  });
});
