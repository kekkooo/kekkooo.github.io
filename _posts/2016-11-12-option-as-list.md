---
title: Option[T] as a one-item List[T]
updated: 2016-21-08 20:30
category: SCALA
description: "How to use an Option as a one item List."
keywords: "scala, list, monad, monads, jvm, java, programming"
comments: true
---

Hello there, sorry to have missed the weekly appointment with a blog post, but I was striving to complete the course *Parallel Programming in Scala* on [Coursera][1], hence time has slipped away quite fast.

Back on track! During the last few days at work, it happened to me multpile times to prefer working with optional types as if they were lists. Or better, one-item lists. A really great thing about the Scala library is that its API is super consistent and similar operations on different types are treated and named alike. Please refer to my old post about the [Option][2] and [List][3] types and operations for an introductive reading.

For example: when you have a `Option[T]`, sometimes (read: a lot of times) you want to check if the **possibly** contained value is equal to some specific value you are looking 

```scala
val maybeFive = None
if(maybeFive == Some(5)) println("Ehi, I got five on this") 
else println("There's not 5 in here. Duh!")
```

This becomes cumbersome when you have to deal with values that are no one-digit numbers, but nested attributes of some complex object 

```scala
val maybeUserName = Some("Carlos")
if(maybeUserName == Some(session.user.complex.data.username)) println("I got you baby") 
else println("The user is Carlos! Buuuuh")
```

A nice solution is to treat the optional value as a list, like this:

```scala
if(maybeUserName.contains(session.user.complex.data.username)) println("I got you baby") 
else println("The user is Carlos! Buuuuh")
```

it does not shorten the code nor makes the check more explicit, but it lets you avoid creating new object and consider the option for what it is, a container for values, just like a list is.

Lately I needed to perform an action with the value contained in the Option, only when it is a `Some`. 

```scala
// I ended up writing something like
val maybeNumber = Some(63)
if(maybeNumber.isDefined) println(s"The square root is ${Math.sqrt(maybeNumber.get)}")
```

The previous code is bad in an incredible number of ways, mostly for the use of `get`. It is safe to use in this case due to the `if` condition. However the code will change through time, and it can lead to a dangerous unguarded use of `get`. We could have used `getOrElse`, but we would have needed to provide the `else` part, cluttering the code even more. A nice solution is again consider our Option as a List:

```scala
val maybeNumber = Some(63)
maybeNumber.foreach(num => println(s"The square root is ${Math.sqrt(num)}"))
```

As you can see I am a big fan of this approach. I think that overall it simplifies both the code and the thinking behind it, allowing you to use always way of doing things. Let's see some more code:

```scala
// pop quiz! what will be printed if maybeNumber is None? or Some(121.0)? or Some(99.0)?
// Hint for maybeNumber = Some(49) it would print -> Result is 8
maybeNumber
  .map(Math.sqrt)
  .filter(x => x < 10.0)
  .map(_ + 1)
  .foreach(x => println(s"Result is $x")) 


// the Option allows you also to check for predicates
maybeNumber.exists(x => x % 2 == 0)
maybeNumber.forall(x => x * 2 > 55)

// flatMap
Some(Nil).flatMap(list => list.headOption) // --> None, and not Some(None)

// you can even fold!
Some(5).fold(0)(x => x * 2) // --> 10
None.fold(0)(x => x * 2)    // --> 0. Equivalent to None.map(x => x * 2).getOrElse(0)

// or transform it to a List
Some(6).toList // --> List(6)
None.toList    // --> Nil
```
Hope you enjoied and start profiting of this different way of thinking.

Have a great time.

Cheers

[1]: https://www.coursera.org/learn/parprog1
[2]: option-monad
[3]: lists-part-1