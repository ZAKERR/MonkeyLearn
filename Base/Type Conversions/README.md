# 在JS中类型转换是自动完成的吗

是的，
Most of the time, operators and functions automatically convert the values given to them to the right type.
栗子：alert converts any value to a string to show it

## String Conversion
String(value)

## Numeric Conversion

### eg1:
division / is applied to non-numbers:
alert( "6" / "2" );

### eg2:
Number(value)
ParseFloat(value)
if the string is not a valid number,the result of such a conversion is NaN

The conversion follows the rules:

Value	Becomes…
undefined	NaN
null	0
true / false	1 / 0
string	The string is read “as is”, whitespaces (includes spaces, tabs \t, newlines \n etc.) from both sides are ignored. An empty string becomes 0. An error gives NaN.


## Boolean Conversion
The conversion rule:

Values that are intuitively “empty”, like 0, an empty string, null, undefined, and NaN, become false.
Other values become true.

alert( Boolean("hello") ); // true
alert( Boolean("") ); // false

**Warn**
alert( Boolean("0") ); // true
alert( Boolean(" ") ); // spaces, also true (any non-empty string is true)

----

# Code Structure

## Statements
Statements are syntax constructs and commands that perform actions

## Semicolons
A semicolon may be omitted in most cases when a line break exists.
like:
alert('Hello')


In most cases, a newline implies a semicolon. But “in most cases” does not mean “always”!
like:
alert(3 +
1
+ 2);

**example of an error**
```
alert("Hello")

[1, 2].forEach(alert);
```
That’s because JavaScript does not assume a semicolon before square brackets [...]. So, the code in the last example is treated as a single statement.


## Comment
One-line comments start with two forward slash characters //.


Multiline comments start with a forward slash and an asterisk /* and end with an asterisk and a forward slash */.

Nested comments are not supported! Like

```
/*
  /* nested comment ?!? */
*/
```


---

# Basic operators, maths


Exponentiation **
alert( 2 ** 2 ); // 2² = 4


alert( '6' / '2' ); // 3, converts both operands to numbers

## unary
**-**

x= -x

**+**
```
// Converts non-numbers
alert( +true ); // 1
alert( +"" );   // 0

let apples = "2";
let oranges = "3";

// both values converted to numbers before the binary plus
alert( +apples + +oranges ); // 5
```

## binary
**String concatenation with binary +**
```
alert( '1' + 2 ); // "12"
alert( 2 + '1' ); // "21"
```