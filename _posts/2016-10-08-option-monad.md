---
title: Option Monad
updated: 2016-10-08 17:12
category: SCALA
description: "The Option monad in Scala"
keywords: "scala, option, monad, monads, jvm, java, programming"
comments: true
---

Yo, monads! It's 2016 and you aren't using monads? Go find another job.

Null-value is for lumberjacks, the Option type is for scultpors.
An `Option[T]` can contain `Some` value of type `T` or `None`.
Cool thing about it, is that most of its operations safely apply only if the value is `Some` :


```scala
val none : Option[Int] = None
val some5 : Option[Int] = Some(5)
def inc(x : Int ) = x + 1

none.map( inc )  // --> None
some5.map( inc ) // --> Some(6)
```

Another funny story:

```scala
val optionList : List[Option[Int]] = List(None, Some(4), Some(1), None, None, Some(3))
optionList
  .map(inc) 	// --> List(None, Some(5), Some(2), None, None, Some(4))
  .flatten    	// --> List(Some(5), Some(2), Some(4))
 // or alternatively
 optionList.flatMap(inc)
```

Suppose to live in a null-value-free world, how would it be the operation of getting the first element of a possibly empty list?

```scala
case class User( firstName : String, lastName : String)

def printFirstUserFirstName( readers : List[User] ) = {
  readers
    .headOption        // this is a Option[User]
    .map(_.firstName)  // if Some, returns Some(firstName), if None...None
    .foreach(println)  // a bit misleading for a single value. Calls println only if it's Some
}
```

We all know that sometimes, at some point we are going to need to reduce to a non-Option value.
So `getOrElse` to the rescue!

```scala
val maybeFirstName = 
  readers
    .headOption
    .map( _.firstName )
  
  maybeFirstName.getOrElse("Not found") // the encapsulated value or "Not found"
  // in general it can be any expression. e.g. throw an exception.
  maybeFirstName.getOrElse( throw new IllegalStateException("Unable to find the first user") )
```
The last line of code needs and explaination by itself. Notice that `getOrElse`'s parameter 
is evaluated [by-name][1], that means it is only evalueted if actually used (i.e. maybeFirstName is None ).
If it was evaluated [by-value][2], the exception would be always thrown. 


Yo! Monads!

[1]: https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_name
[2]: https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_value
