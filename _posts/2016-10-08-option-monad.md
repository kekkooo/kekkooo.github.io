---
title: Option Monad
updated: 2016-10-08 17:12
category: SCALA
---

Yo, monads! It's 2016 and you aren't using monads? Go find another job.

Null-value is for lumberjacks, the Option type is for scultpors.
Cool thing about Option is :


```scala
val none : Option[Int] = None
val some5 : Option[Int] = Some(5)
def inc(x : Int ) = x + 1

none.map( inc ) // returns None
some5.map( inc ) // returns Some(6)
```

Another funny story:

```scala
val optionList : List[Option[Int]] = List( None, Some(4), Some(1), None, None, Some(3) )
optionList
  .map( inc ) // returns List( None, Some(5), Some(2), None, None, Some(4) )
  .flatten    // returns List( Some(5), Some(2), Some(4) )
 // that is the same of calling
 optionList.flatMap(inc)
```

How a world without null-value would be the operation of getting the first element of a possibly empty list.

```scala
case class User( firstName : String, lastName : String)

def printFirstUserFirstName( readers : List[User] ) = {
  readers
    .headOption        // this is a Option[User]
    .map(_.firstName)  // if Some, returns Some(firstName), if None...None
    .foreach(println)  // a bit strange for a single Option. applies only to Some
}
```

We all know that sometimes at some point we are going to need to obtain a non-Option value.
getOrElse to the rescue!

```scala
val maybeFirstName = 
  readers
    .headOption
    .map( _.firstName )
  
  maybeFirstName.getOrElse("Not found") // the encapsulated value or "Not found"
  // in general it can be any expression. hence if it ise the case to throw an exception.
  maybeFirstName.getOrElse( throw new IllegalStateException("Unable to find the first user") )
```
The last line of code needs and explaination by itself. Notice that getOrElse's parameter 
is evaluated by-name, that means it is only evalueted if actually used (i.e. maybeFirstName is None ).
If it was not the case, the exception would be always thrown. 


Yo! Monads!
