---
title: Scala Map and FlatMap signature explained.
updated: 2017-01-09 23:05
category: SCALA
description: "Difference between Map and FlatMap in Scala monadic types"
keywords: "scala monad monads monadic map flatmap signature explaination"
comments: true
---

Hello there! Ready for great adventures in Scala? So Map and FlatMap, everybody knows what they do... right?
I know, I know.. it is not that clear after all. But it is not that difficult either. You should look at the signature, it tells all the story.

Before starting I want to point out that I had though times trying to understand how monads worked. However, once started playing around with Scala and, especially, completed the first two courses of the [Scala Specialization on Coursera] [1] I had an epiphany on the simplicity of the concept. At least how it is implemented in Scala. Please follow me, I will strive to let you understand a bit of this *magic*.

Let's start from the end-goal of a toy example. We have our Twitter-clone, ***Meower***. We have functions to find our user from the DB, get all her ***Meows*** and count how many ***Re-Meows*** she collected with her account. Let's suppose we have these model classes:

```scala
case class User(id: Long, username: String)
case class Meow(id: Long, text: String, reMeows: Int)
```

And these operations, will give only the signature:

```scala
def getUser(id: Long): User = ...
def getMeows(username: String): List[Meows] = ...
```


[1]: https://www.coursera.org/specializations/scala