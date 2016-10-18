---
title: Hello Scala
updated: 2016-10-07 22:42
category: [SCALA]
---

Hello, in this blog I would like show some of the things I learnt or I am currently learning. I will try to avoid long explainations in favour of code snippets.

Given that I am currently working in Scala, here's how I greet the readers.

```scala
case class User( firstName : String, lastName : String)

val blogName = "Let the code speak"

def greetReaders( readers : List[User] ){ // return type is inferred by the compiler
  readers.foreach{ user : User =>		
    println(s"Hello ${user.firstName} happy to see you on $blogName")
    // s"[...]" is the default string interpolator and allows to mix
    // values ($valueName) or expressions (${expr}) in string literals
}
```
