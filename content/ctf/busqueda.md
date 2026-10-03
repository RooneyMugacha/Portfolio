---
id: ctf-busqueda
name: Busqueda
event: Hack The Box
type: machine
difficulty: easy
tags: ["code injection", "Python", "sudo", "Linux"]
writeupHref: "#"
order: 2
---
Abused a code-injection flaw in the Searchor CLI library, then pivoted to root via a misconfigured sudo rule that allowed running a custom script as any user.
