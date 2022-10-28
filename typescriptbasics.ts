// Variables are used to store info that can be used or updated at a later time

// Data Types

// Number

var age = 20
var age2 = 35
var ageSum = age + age2

console.log(age)
console.log(ageSum)

// Operators: + - /

// String (Text)

var sentence = "Hello World"
var sentence2 = "Zdrawej svyat"

console.log(sentence)
console.log(sentence + ". " + sentence2)

// Boolean - True / False

var fruit1 = "apple"
var fruit2 = "banana"
var fruit3 = "apple"

console.log(fruit1 == fruit2)
console.log(fruit1 == fruit3)

// undefined

var a
console.log(a)

a = 'Give it a value'
console.log(a)

// null

var x = null
console.log(x)

// object 

var names = {
    name1: "Aleko",
    name2: "Konstantinov"
}

console.log(names)
console.log(names.name1)
console.log(names["name2"])

// Array

console.log("Array example:")

var planets = ["Earth", "Jupiter", "Pluto"]

console.log(planets)
console.log(planets[0])
console.log(planets[3])

console.log(typeof planets)

// Symbol - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol

console.log("Equal and not equal examples:")

// == equal value

var o = 10
var p = 5
var q = "10"

console.log(o==p) // false
// console.log(o==q) This condition will always return 'false' since the types 'number' and 'string' have no overlap.ts(2367)

// === equal value and equal type

console.log(o===p)
// console.log(o===q) This condition will always return 'false' since the types 'number' and 'string' have no overlap.ts(2367)

// != not equal value

console.log(o!=p)
// console.log(o!=q) This condition will always return 'true' since the types 'number' and 'string' have no overlap.ts(2367)

// !== not equal value and not equal type

console.log(o!==p)
// console.log(o!==q) This condition will always return 'true' since the types 'number' and 'string' have no overlap.ts(2367)

console.log("Greater / less examples:")

// greater  than

console.log(25 > 10)
console.log(10 > 25)

// greater than or equal to

console.log(25 >= 10)
console.log(25 >= 25)

console.log("Logical and ternary operators:")

// Logical operators are used to determine the logic between variables or values

var z = 10
var y = 20

console.log(z > 5 && y < 30)
console.log(z > 5 && y > 30)

console.log(z > 5 || y < 30)

// true and false = false
// false and true = false

// false or true = true
// true or false = true

// Ternary (conditional) operator

// varname = (condition) ? value1 : value2

var age = 17
var allowedToDrive = age > 18 ? "You can drive" : "You can not drive"
console.log(allowedToDrive)



