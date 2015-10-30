import * as chai from "chai"
let expect = chai.expect

import whynomatch from "../src/whynomatch"

describe('whynomatch', function () {
  it('works for a single property, single query field', function () {
    let target = { a: 2 }
    let query = { a: 1 }

    let expected = { a: 1 }

    let result = whynomatch(target, query);
    expect(result).to.deep.equal(expected);
  });

  it('works for a multi property, single query field', function () {
    let target = { a: 2, b: 2 }
    let query = { a: 1 }

    let expected = { a: 1 }

    let result = whynomatch(target, query);
    expect(result).to.deep.equal(expected);
  });

  it('works for a multi property, multi query field', function () {
    let target = { a: 2, b: 2 }
    let query = { a: 1, b: 2 }
    let expected = { a: 1 }

    let result = whynomatch(target, query);
    expect(result).to.deep.equal(expected);
  });

  it('works when query queiries non existing fields', function () {
    let target = { a: 2, b: 2 }
    let query = { a: 1, c: 2 }

    let expected = { a: 1, c: 2 }

    let result = whynomatch(target, query);
    expect(result).to.deep.equal(expected);
  });

  it('works for a nested property', function () {
    let target = { a: { b: 3, c: 1} }
    let query = { a: { b: 3, c: 4 } }

    let expected = { a: { c: 4 } }

    let result = whynomatch(target, query);
    expect(result).to.deep.equal(expected);
  });

  describe('$eq operator', function () {
    it('find result when the target do not equals the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $eq: 2 } }

      let expected = { a: { $eq: 2 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the target does not equals the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $eq: 1 } }

      let expected = {}

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });
  });

  describe('$ne operator', function () {
    it('find result when the target equals the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $ne: 1 } }

      let expected = { a: { $ne: 1 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the target does not equals the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $ne: 2 } }

      let expected = {}

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });
  });

  describe('$lt operator', function () {
    it('find result when the target is larger than the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $lt: 0 }}

      let expected = { a: { $lt: 0 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result when the target is equal to the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $lt: 1 }}

      let expected = { a: { $lt: 1 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the target is lower than the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $lt: 2 }}

      let expected = {}

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });
  });

  describe('$lte operator', function () {
    it('find result when the target is larger to the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $lte: 0 }}

      let expected = { a: { $lte: 0 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('not find result when the target is lower than the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $lte: 2 }}

      let expected = {}

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('not find result when the target is equal to the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $lte: 1 }}

      let expected = {}

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });
  });

  describe('$gt operator', function () {
    it('find result when the target is lower than the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $gt: 2 }}

      let expected = { a: { $gt: 2 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result when the target is equal to the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $gt: 1 }}

      let expected = { a: { $gt: 1 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the target is larger than the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $gt: 0 }}

      let expected = {}

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });
  });

  describe('$gte operator', function () {
    it('find result when the target is lower than the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $gte: 2 }}

      let expected = { a: { $gte: 2 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the target is equal to the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $gte: 1 }}

      let expected = {}

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the target is larger than the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: { $gte: 0 }}

      let expected = {}

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });
  });

  describe('$in operator', function () {
    it('find result when target does not contained in elements from query', function () {
      let target = { a: 1 };
      let query = { a: { $in: [ 2, 3 ]}};

      let expected = { a: { $in: [ 2, 3 ] }};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when target contained in elements from query', function () {
      let target = { a: 1 };
      let query = { a: { $in: [ 1, 2, 3 ]}};

      let expected = {};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result when target is an array which does not intersects in elements from query', function () {
      let target = { a: [1, 4] };
      let query = { a: { $in: [ 2, 3 ]}};

      let expected = { a: { $in: [ 2, 3 ] }};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when target is an array which intersects in elements from query', function () {
      let target = { a: [1, 4] };
      let query = { a: { $in: [ 1, 2, 3 ]}};

      let expected = {};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });
  });

  describe('$nin operator', function () {
    it('do not find result when target does not contained in elements from query', function () {
      let target = { a: 1 };
      let query = { a: { $nin: [ 2, 3 ]}};

      let expected = {};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result when target contained in elements from query', function () {
      let target = { a: 1 };
      let query = { a: { $nin: [ 1, 2, 3 ]}};

      let expected = { a: { $nin: [ 1, 2, 3 ]}};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when target is an array which does not intersects in elements from query', function () {
      let target = { a: [1, 4] };
      let query = { a: { $nin: [ 2, 3 ]}};

      let expected = {};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result when target is an array which intersects in elements from query', function () {
      let target = { a: [1, 4] };
      let query = { a: { $nin: [ 1, 2, 3 ]}};

      let expected = { a: { $nin: [ 1, 2, 3 ]}};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });
  });
  
  describe('$not operator', function () {
    it('find result when the subquery matches the target', function () {
      let target = { a: 1, b: 2 };
      let query = { a: { $not: { $eq: 1 }}};

      let expected = { a: { $not: { $eq: 1 }}};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the subquery not matches the target', function () {
      let target = { a: 1, b: 2 };
      let query = { a: { $not: { $eq: 3 }}};

      let expected = {};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });
  });

  describe('$or operator', function () {
    it('find result when non of the sub queries match', function () {
      let target = { a: 1, b: 2 };
      let query = { $or: [{ a: 2 }, { b: 3 }]}

      let expected = { $or: [{ a: 2 }, { b: 3 }]};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when some of the sub queries match', function () {
      let target = { a: 1, b: 2 };
      let query = { $or: [{ a: 2 }, { b: 2 }]}

      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('throws an error when the value given is an empty array', function () {
      let target = { a: 1, b: 2 };
      let query = { $or: []};

      expect(function(){ whynomatch(target, query); }).to.throw();
    });

    it('throws an error when the value given is not an array', function () {
      let target = { a: 1, b: 2 };
      let query = { $or: 1};

      expect(function(){ whynomatch(target, query); }).to.throw();
    });
  });

  describe('$and operator', function () {
    it('find result when non of the sub queries match', function () {
      let target = { a: 1, b: 2 };
      let query = { $and: [{ a: 2 }, { b: 3 }]}

      let expected = { $and: [{ a: 2 }, { b: 3 }]};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result when some of the sub queries match', function () {
      let target = { a: 1, b: 2 };
      let query = { $and: [{ a: 2 }, { b: 2 }]}

      let expected = { $and: [{ a: 2 }]};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('throws an error when the value given is an empty array', function () {
      let target = { a: 1, b: 2 };
      let query = { $and: []};

      expect(function(){ whynomatch(target, query); }).to.throw();
    });

    it('throws an error when the value given is not an array', function () {
      let target = { a: 1, b: 2 };
      let query = { $and: 1};

      expect(function(){ whynomatch(target, query); }).to.throw();
    });
  });
});
