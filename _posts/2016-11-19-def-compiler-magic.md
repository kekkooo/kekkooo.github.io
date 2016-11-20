---
title: On def and compiler magic.
updated: 2016-21-08 20:30
category: SCALA
description: "How to get the function from a def. How to use map with functions with N parameters"
keywords: "scala, jvm, java, def, compiler, magic, tupled, programming"
---

Avada Kedavra! Vingardium Leviosa! *myFunction _*!

A great thing aboout `map`, `flatMap` and others is that they are [higher-order-functions][1] (i.e. functions that take other functions as parameters or return functions) allowing us to modularize our code and avoid the ... ehm ... ***function-as-parameter-hell™*** (named after [_callback-hell_][2]).

```scala
List(1, 2, 3, 4).map{ number =>
	// ...
	// complex,
	// multiline and
	// useful elsewhere code
	// that manipulates each number
}

// can be rewritten extrapolating the function passed to map
def usefulFunction(number: Int) = ... // our complex function
List(1, 2, 3).map(usefulFunction)
```

But there is a catch, what if we wanted to use the same approach with a list of tuples? What could possibly go wrong?

```scala
def add(x: Int, y: Int) = x + y
val pairRange = (6 to 10) zip (4 to 8) // create a two numbers sequence and zip them
pairRange.map(add)

// error: type mismatch;
//  found   : (Int, Int) => Int
//  required: ((Int, Int)) => ?
//        pairRange.map(add)
```

What happened? There's a small but substantial difference in place. `Add` takes two arguments while each item of pairRange is a pair. It's clear now ... right?

Not that mutch, but let's take a look to the error. `(Int, Int) => Int` found, but `((Int, Int)) => ?` required. The extra parenthesis tells us exactly where the problem is. It expects a function which takes ***only one parameter*** that is a pair, while our `add` function takes ***two parameters***.

### Quite a deep explaination. Jump to next section if you get bored.

One thing to keep in mind with Scala is that it is built on top of Java and the JVM that are not that *functional-programming* friendly. In contrast, let's see two function declarations in OCaml (the same should apply to F#).

```ocaml
let add a b = a + b   // int -> int -> int
let sub(a,b) = a - b  // (int, int) -> int
```

In OCaml, by default, you define functions in the form of our `add`, that is a function ***f*** that takes a parameter (a) and returns another function ***f'*** that takes a parameter (b) and returns a value. This is a powerful mechanism that allows you to play with cool things like partial application (note to self, write a post about it). Alternatively you can define functions, like `sub`, which take N parametrs as a tuple and return a value.

In Scala you usually define functions of the second type. Moreover, in Scala unlike OCaml, F#, Haskell, etc.. functions, under the JVM hood, are not first-class citizens. Hence each function is compiled to an object with an `apply` method which takes exactly the required parameters. So the error we've seen in the previous section.

### How to handle the case

The [Function][3] type in Scala has a method called `tupled` that allows you to transform a function that takes ***N*** parameters in a function that takes as single argument a tuple with ***N*** elements. E.g. it means it converts a function in the form `(Int, Int) => Int` to one in the form `((Int, Int)) => Int`.
So it is likely to think that the solution to be:

```scala
pairRange.map(add.tupled)
// error: missing arguments for method add;
```
Damn it Scala!! What do you want more from me? Thing is, Scala runs on the JVM. In Java everything is an object. Hence each function we define with `def` must be a method of some object, but a method is not a function. We need a way to *extract* from a method its corresponding function. That is:

```scala
val addFunction = (add _) // it will have type (Int, Int) => Int = <function2>
pairRange.map(addFunction.tupled)
// or shorter
pairRange.map((add _).tupled)
```

Be aware that this is not a part of the api but a language feature or ... compiler magic.

Bye!

[1]: https://en.wikipedia.org/wiki/Higher-order_function
[2]: http://callbackhell.com/
[3]: http://www.scala-lang.org/api/current/scala/Function$.html