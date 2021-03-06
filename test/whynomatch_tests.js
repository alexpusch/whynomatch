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
 
  describe('embeded query', function () {
    it('find result for a non exact match', function () {
      let target = { a: { b: 3, c: 1} }
      let query = { a: { b: 3, c: 4 } }

      let expected = { a: { b: 3, c: 4 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result for a query that is a sub object of target', function () {
      let target = { a: { b: 3, c: 1, d: 5} }
      let query = { a: { b: 3, c: 1 } }

      let expected = { a: { b: 3, c: 1 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result for an exact match', function () {
      let target = { a: { b: 3, c: 1}};
      let query = { a: { b: 3, c: 1 }};

      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });
  });

  describe('nested syntax', function () {   
    it('find result for a failed short syntax nested query', function () {
      let target = { a: { b: 3, c: 1}};
      let query = { "a.c": 4 };

      let expected = { "a.c": 4 };

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result for a successfull short syntax query', function () {
      let target = { a: { b: 3, c: 1}};
      let query = { "a.c": 1 };

      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result for a failed short syntax nested query with operators', function () {
      let target = { a: { b: 3, c: 1}};
      let query = { "a.c": { $exists: 0 }};

      let expected = { "a.c": { $exists: 0 }};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result for a successfull short syntax query with operators', function () {
      let target = { a: { b: 3, c: 1}};
      let query = { "a.c": { $lte: 1 }};

      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });
  });

  describe('simple equality operator', function () {
    it('find result when the target do not equals the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: 2 }

      let expected = { a: 2 }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the target does not equals the query', function () {
      let target = { a: 1, b: 2 }
      let query = { a: 1 }

      let expected = {}

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result when the query is does not contained in the target, when it is an array', function () {
      let target = { a: [1, 2] , b: 2 };
      let query = { a: 3 };

      let expected = { a: 3 };

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the query is contained in the target, when it is an array', function () {
      let target = { a: [1, 2] , b: 2 };
      let query = { a: 2 };

      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result when the query is a non matching regex', function () {
      let target = { a: "shalom world" };
      let query = { a: /hello/ };

      let expected = { a: /hello/ };

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the query is a matching regex', function () {
      let target = { a: "hello world" };
      let query = { a: /hello/ };

      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the query is a matching regex and target is an array', function () {
      let target = { a: ["hello world", "shalom world"] };
      let query = { a: /hello/ };

      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });
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

    it('find result when the query is does not contained in the target, when it is an array', function () {
      let target = { a: [1, 2] , b: 2 };
      let query = { a: { $eq: 3 } };

      let expected = { a: { $eq: 3 } };

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the query is contained in the target, when it is an array', function () {
      let target = { a: [1, 2] , b: 2 };
      let query = { a: { $eq: 2 }};

      let expected = {};

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

    // TODO: fix this
    xit('find result when the target contains an element not equal to the query', function () {
      let target = { a: [1, 2], b: 2 }
      let query = { a: { $ne: 1 } }

      let expected = { a: { $ne: 1 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    xit('do not find result when the target array does not contain the query', function () {
      let target = { a: [1, 3], b: 2 }
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

    it('find result when the target array does not have an element that is lower than the query', function () {
      let target = { a: [1, 2], b: 2 }
      let query = { a: { $lt: 0 }}

      let expected = { a: { $lt: 0 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the target array have an element that is lower than the query', function () {
      let target = { a: [1, 5], b: 2 }
      let query = { a: { $lt: 2 }}

      let expected = {}

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    xit('throws when used as first level operator', function () {
      let target = { a: 1, b: 2 };
      let query = { $lt: 1};

      expect(function(){ whynomatch(target, query); }).to.throw();
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

    it('find result when the target array does not have an element that is equal or lower than the query', function () {
      let target = { a: [1, 2], b: 2 }
      let query = { a: { $lte: 0 }}

      let expected = { a: { $lte: 0 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the target array have an element that is equal or lower than the query', function () {
      let target = { a: [1, 5], b: 2 }
      let query = { a: { $lte: 2 }}

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

    it('find result when the target array does not have an element that is larger than the query', function () {
      let target = { a: [1, 2], b: 2 }
      let query = { a: { $gt: 3 }}

      let expected = { a: { $gt: 3 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the target array have an element that is larger than the query', function () {
      let target = { a: [1, 5], b: 2 }
      let query = { a: { $gt: 2 }}

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

    it('find result when the target array does not have an element that is equal or larger than the query', function () {
      let target = { a: [1, 2], b: 2 }
      let query = { a: { $gte: 3 }}

      let expected = { a: { $gte: 3 } }

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when the target array have an element that is equal or larger than the query', function () {
      let target = { a: [1, 5], b: 2 }
      let query = { a: { $gte: 2 }}

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

    it('find result when target does not contained in elements from regex query', function () {
      let target = { a: "hello world" };
      let query = { a: { $in: [ /s.+?m/, 3 ]}};

      let expected = { a: { $in: [ /s.+?m/, 3 ]}};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when target contained in elements from regex query', function () {
      let target = { a: "hello world" };
      let query = { a: { $in: [ /h.+?o/, 3 ]}};

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

    it('throws an error when the value given is not an array', function () {
      let target = { a: 1, b: 2 };
      let query = { a: {$in: 1}};

      expect(function(){ whynomatch(target, query); }).to.throw();
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

    it('find result when target contained in elements from regex query', function () {
      let target = { a: "hello world" };
      let query = { a: { $nin: [ /s.+?m/, 3 ]}};

      let expected = {};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when target contained in elements from regex query', function () {
      let target = { a: "hello world" };
      let query = { a: { $nin: [ /h.+?o/, 3 ]}};

      let expected = { a: { $nin: [ /h.+?o/, 3 ]}};
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('throws an error when the value given is not an array', function () {
      let target = { a: 1, b: 2 };
      let query = { a: { $nin: 1 }};

      expect(function(){ whynomatch(target, query); }).to.throw();
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
  
  describe('$nor operator', function () {
    it('do not find result when non of the sub queries match', function () {
      let target = { a: 1, b: 2 };
      let query = { $nor: [{ a: 2 }, { b: 3 }]}

      let expected = { };
      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result when some of the sub queries match', function () {
      let target = { a: 1, b: 2 };
      let query = { $nor: [{ a: 2 }, { b: 2 }]}

      let expected = { $nor: [{ a: 2 }, { b: 2 }]};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result when all of the sub queries match', function () {
      let target = { a: 1, b: 2 };
      let query = { $nor: [{ a: 1 }, { b: 2 }]};

      let expected = { $nor: [{ a: 1 }, { b: 2 }]};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('throws an error when the value given is an empty array', function () {
      let target = { a: 1, b: 2 };
      let query = { $nor: []};

      expect(function(){ whynomatch(target, query); }).to.throw();
    });

    it('throws an error when the value given is not an array', function () {
      let target = { a: 1, b: 2 };
      let query = { $nor: 1};

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

  describe('$exists', function () {
    describe('true', function () {
      it('find a result when the query field does not exists in target', function () {
        let target = { a: 1, b: 2 };
        let query = { c: { $exists: 1 }};

        let expected = { c: { $exists: 1 }};

        let result = whynomatch(target, query);
        expect(result).to.deep.equal(expected);
      });

      it('do not find a result when the query field exists in target', function () {
        let target = { a: 1, b: 2 };
        let query = { a: { $exists: 1 }};

        let expected = {};

        let result = whynomatch(target, query);
        expect(result).to.deep.equal(expected);
      });
    });

    describe('false', function () {
      it('do not find a result when the query field does not exists in target', function () {
        let target = { a: 1, b: 2 };
        let query = { c: { $exists: 0 }};

        let expected = {};

        let result = whynomatch(target, query);
        expect(result).to.deep.equal(expected);
      });

      it('find a result when the query field exists in target', function () {
        let target = { a: 1, b: 2 };
        let query = { a: { $exists: 0 }};

        let expected = { a: { $exists: 0 }};

        let result = whynomatch(target, query);
        expect(result).to.deep.equal(expected);
      });
    });
  });

  describe('$mod', function () {
    it('find a result when query matchs the target', function () {
      let target = { a: 1, b: 21 };
      let query = { b: { $mod: [7, 1] }};

      let expected = { b: { $mod: [7, 1] }};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find a result when query matchs the target', function () {
      let target = { a: 1, b: 22 };
      let query = { b: { $mod: [7, 1] }};

      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find a result when query matchs the target array', function () {
      let target = { a: 1, b: [21, 23] };
      let query = { b: { $mod: [7, 1] }};

      let expected = { b: { $mod: [7, 1] }};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find a result when query matchs the target array', function () {
      let target = { a: 1, b: [21, 22] };
      let query = { b: { $mod: [7, 1] }};

      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('throws an error when the query is not an array', function () {
      let target = { a: 1, b: 22 };
      let query = { b: { $mod: 2 }};

      expect(function(){ whynomatch(target, query); }).to.throw();
    });

    it('throws an error when the query an array not of size 2', function () {
      let target = { a: 1, b: 22 };
      let query = { b: { $mod: [1, 3, 4] }};

      expect(function(){ whynomatch(target, query); }).to.throw();
    });
  });

  describe('$regex', function () {
    it('find result it the query does not match the target', function () {
      let target = { a: 'hello world', b: 2 };
      let query = { a: {$regex: /^goodbay.*/ }};

      let expected = { a: {$regex: /^goodbay.*/ }};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result it the query does not match the target', function () {
      let target = { a: 'hello world', b: 2 };
      let query = { a: {$regex: /^hello.*/ }};

      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result it the query does not match the target', function () {
      let target = { a: 'hello world', b: 2 };
      let query = { a: {$regex: '^goodbay.*' }};

      let expected = { a: {$regex: '^goodbay.*' }};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result it the query does not match the target', function () {
      let target = { a: 'hello world', b: 2 };
      let query = { a: {$regex: '^hello.*' }};

      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result it the query does not match the target array', function () {
      let target = { a: ['hello world', 'shalom world'], b: 2 };
      let query = { a: {$regex: /^goodbay.*/ }};

      let expected = { a: {$regex: /^goodbay.*/ }};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result it the query does not match the target array', function () {
      let target = { a: ['hello world', 'shalom world'], b: 2 };
      let query = { a: {$regex: /^hello.*/ }};

      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('throws an error when the query is not a string or a regex', function () {
      let target = { a: 'hello world', b: 2 };
      let query = { a: {$regex: 7 }};

      expect(function(){ whynomatch(target, query); }).to.throw();
    });
  });

  describe('$where', function () {
    describe('function is js function', function () {
      it('find a result if the query function return false for the target', function () {
        let target = { a: 1, b: 2 };

        let whereFn = function(){ return this.a > 2 };
        let query = { $where: whereFn, b: 2 };
        let expected = { $where: whereFn };

        let result = whynomatch(target, query);
        expect(result).to.deep.equal(expected);
      });

      it('do not find a result if the query function return true for the target', function () {
        let target = { a: 1, b: 2 };

        let whereFn = function(){ return this.a > 0 };
        let query = { $where: whereFn, b: 2 };
        let expected = {};

        let result = whynomatch(target, query);
        expect(result).to.deep.equal(expected);
      });

      // TODO: fix this
      xit('do not find a result if the query function uses obj as this and return true for the target', function () {
        let target = { a: 1, b: 2 };

        let whereFn = function(){ return obj.a > 0 };
        let query = { $where: whereFn, b: 2 };
        let expected = {};

        let result = whynomatch(target, query);
        expect(result).to.deep.equal(expected);
      });
    });

    describe('function is string function', function () {
      it('find a result if the query function return false for the target', function () {
        let target = { a: 1, b: 2 };

        let whereFn = "this.a > 2";
        let query = { $where: whereFn, b: 2 };
        let expected = { $where: whereFn };

        let result = whynomatch(target, query);
        expect(result).to.deep.equal(expected);
      });

      it('do not find a result if the query function return true for the target', function () {
        let target = { a: 1, b: 2 };

        let whereFn = "this.a > 0";
        let query = { $where: whereFn, b: 2 };
        let expected = {};

        let result = whynomatch(target, query);
        expect(result).to.deep.equal(expected);
      });

      it('do not find a result if the query function uses obj as this and return true for the target', function () {
        let target = { a: 1, b: 2 };

        let whereFn = "obj.a > 0";
        let query = { $where: whereFn, b: 2 };
        let expected = {};

        let result = whynomatch(target, query);
        expect(result).to.deep.equal(expected);
      });
    });

    it('throws an error when the query is not a string or a fucntion', function () {
      let target = { a: 'hello world', b: 2 };
      let query = { $where: 7 };

      expect(function(){ whynomatch(target, query); }).to.throw();
    });
  });

  describe('$all operator', function () {
    it('find result if the target does not contains all the values in the query', function() {
      let target = { a: [1, 3] , b: 2 };

      let query = { a: { $all: [1, 3, 4]}};
      let expected = { a: { $all: [1, 3, 4]}};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result if the target contains all the values in the query', function() {
      let target = { a: [1, 3, 4] , b: 2 };

      let query = { a: { $all: [1, 3]}};
      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result if the non array target is contained in values of the query', function() {
      let target = { a: 1 , b: 2 };

      let query = { a: { $all: [1]}};
      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('throws an error when the query is not a array', function () {
      let target = { a: 1 , b: 2 };
      let query = { a: { $all: 1}};

      expect(function(){ whynomatch(target, query); }).to.throw();
    });
  });

  describe('$elemMatch', function () {
    it('find result when none of the target array matches the query', function () {
      let target = { a: [{a: 1}, {a: 2}, {a: 3}] , b: 2 };

      let query = { a: { $elemMatch: { a: { $gt: 5 }}}};
      let expected = { a: { $elemMatch: { a: { $gt: 5 }}}};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when one of the target array matches the query', function () {
      let target = { a: [{a: 1}, {a: 2}, {a: 3}] , b: 2 };

      let query = { a: { $elemMatch: { a: { $gt: 2 }}}};
      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result when none of the target array matches the query, and target is an array of non objects', function () {
      let target = { a: [1, 2, 3] , b: 2 };

      let query = { a: { $elemMatch: { $gt: 5 }}};
      let expected = { a: { $elemMatch: { $gt: 5 }}};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when one of the target array matches the query, and target is an array of non objects', function () {
      let target = { a: [1, 2, 3] , b: 2 };

      let query = { a: { $elemMatch: { $gt: 2 }}};
      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('find result when target is not an array', function () {
      let target = { a: 1 , b: 2 };

      let query = { a: { $elemMatch: { a: { $gt: 5 }}}};
      let expected = { a: { $elemMatch: { a: { $gt: 5 }}}};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('throws an error when the query is not an object', function () {
      let target = { a: [1, 2, 3], b: 2 };
      let query = { a: { $elemMatch: 1}};

      expect(function(){ whynomatch(target, query); }).to.throw();
    });

    it('throws an error when the query contains $where', function () {
      let target = { a: [1, 2, 3] , b: 2 };
      let query = { a: { $elemMatch: { $where: "this.a > 2" }}};

      expect(function(){ whynomatch(target, query); }).to.throw();
    });
  });

  describe('$size', function () {
    it('find result when target length does not equal to query', function () {
      let target = { a: [1, 3, 4] , b: 2 };

      let query = { a: { $size: 5 }};
      let expected = { a: { $size: 5 }};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when target length equals to query', function () {
      let target = { a: [1, 3, 4] , b: 2 };

      let query = { a: { $size: 3 }};
      let expected = {};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('do not find result when target is not an array', function () {
      let target = { a: 1 , b: 2 };

      let query = { a: { $size: 3 }};
      let expected = { a: { $size: 3 }};

      let result = whynomatch(target, query);
      expect(result).to.deep.equal(expected);
    });

    it('throws an error when the query is not an number', function () {
      let target = { a: 1 , b: 2 };
      let query = { a: { $elemMatch: [1, 3]}};

      expect(function(){ whynomatch(target, query); }).to.throw();
    });
  });

  describe('errors', function () {
    it('throws for unsupported operators', function () {
      let target = { a: 1 , b: 2 };
      let query = { a: { $shmop: [1, 3]}};

      expect(function(){ whynomatch(target, query); }).to.throw();
    });

    it('throws for low level operator at top level query', function () {
      let target = { a: 1 , b: 2 };
      let query = { $lt: 3 };

      expect(function(){ whynomatch(target, query); }).to.throw();
    });

    it('throws for top level operator at low level query', function () {
      let target = { a: 1 , b: 2 };
      let query = { a: { $or: { $lt: 10 }}};

      expect(function(){ whynomatch(target, query); }).to.throw();
    });
  });
});
