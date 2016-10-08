---
title: Hello Scala
updated: 2016-10-07 22:42
---

Hello, in this blog I would like show some of the things I learnt or I am currently learning, trying to avoid long explainations in favour of code examples.

Given that I am currently learning Scala, here's how I greet the readers.

```scala
class User{
  firstName : String,
  lastName : String
}
val blogName = "Let the code speak"

def greetReaders( readers : List[User] ){ // return type is inferred by the compiler
  readers.foreach{ user : User =>		
    println(s"Hello ${user.firstName} happy to see you on $blogName")
    // s"[...]" is the default string interpolator and allows to mix
    // values ($valueName) or expressions (${expr}) in string literals
}
```