# whynomatch - Why does an object not match a mongodb query?

**Website** - http://alexpusch.github.io/whynomatch/

whynomatch is a tool for debugging mongodb queries. Its purpose is to quickly understand why a query does not match
an object.

##API:

### whynomatch(target, query);
#### arguments
* target: object to check query against
* query: mongodb query

#### return value
* query sub object that does not match the target object

##Examples:
```javascript
obj = { 
  name: "Alex",
  age: 28,
  job: "Programmer",
  abilities: {
    programming: ["js", "ruby", "C#"],
  }
}

// Lets look for all programmers with social abilities
query = { job: "Programmer", "abilities.social": { $exists: 1 }}
whynomatch(obj, query) == { "abilities.social": { $exists: 1 }} // Whoops, No social abilities :(

// Lets look for all js or css programmers that are older that 30
query = { abilities: { programming: { $in: ["js", "css"]}}, age: { $gt: 30 }}
whynomatch(obj, query) == { age: {$gt: 30} } // too young

// All Alexes that are younger that 30
query = { name: "Alex", age: {$lt: 30}}
whynomatch(obj, query) == {} // full match
```