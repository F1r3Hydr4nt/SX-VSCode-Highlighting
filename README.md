# Bitcoin Script Extended (.sx)
Bitcoin's first general purpose programming language/bundler VSCode syntax highlighting

## Components:
### Tokeniser
- Preprocesses source code 
### Parser
- Builds Abstract Syntax Tree (AST)
- Applies necessary annotations✝
### Compiler
- Uses the parsed tokens to produce Bitcoin network ready transactional programs e.g. Ronseal™
### Simulator
- The "general purposer" enabling cross transactional looping and computation via simple json deployment files.
- Continuous-execution is solved by simple economics (much like the payments for the electricity computing everything else).

Effectively, SX is merely Bitcoin script with added macros/function & repeat blocks amongst the other following listed features.

## Nodes/Token Types
Bitcoin script is a set of extended assembly code (ASM) operations which direct computer processing units (CPUs).
All general purpose programming languages (like C, C++, Javascript etc) are transformed into ASM to be processed.


### Root
Every source file begins with a root node storing it's file name, and eventually the AST.
### Opcodes
SX uses a simple camelCase convention providing direct access to every [opcode](https://wiki.bitcoinsv.io/index.php/Opcodes_used_in_Bitcoin_Script). Dropping the `OP_` prefix the language allows the programmer draft their software quickly and neatly:

`true false notIf 2dup endIf tuck bin2num equalVerify 0notEqual hash256 cat` etc. 

### Comments
Support for standard C/C++ like `// comments` and even D like
```
/* nested 
/* in/multi-line */
comments */
```
are included.

### Arguments/Variables
Inline `.argument` (that is a variable 'argument' denoted with a prepended period '.') dictate named locations in a script where data is to be inserted (it is well known CPUs operate on binary data, that is to say ones and zeroes).

### Bigints
SX utilises Javascript like bigint syntax for numbers e.g. `-123n`. This makes the most sense given the unbounded nature of the protocol's integer system.

### Hex Data
Furthermore, much like the bitcoind ASM syntax, inline:
```
0xdeadbeef // hex values
babecafe // with or without '0x'
```
Are another method to introduce data into the program stack.
### Strings
Likewise
`"Double quoted" /* and */ 'single quoted'` strings can be used and are transformed by the compiler for use.

### Annotations ✝
Currently limited to the following two kinds:
- Stack labels: `@label:"Taggable stack values for debugging"` (also shorthand: `@l:noQuotesNeeded`) 
- Argument `@test:0xbabecafe` values (also shorthand: `@t:-123n`) handle all valid value types!
These are a crucial feature for development speed and usability, one cannot debug unknown variables for example so the `@test:'annotations'` are used often.

### Repeat
```
/* Want to reverse the endian of a hash?
You can do so as follows... */
4bb96075acadc3d80b5ac872874c3037a386f4f595fe99e687439aabd0219809 // Any *random* hash ;)
repeat 31n true split end
// Then recombining...
repeat 31n swap cat end
// Voila!
```
These blocks have a specific structure notably beginning with the keyword `repeat` followed by a bigint count (above `31n`) and must be completed with the `end` keyword.

### Functions/Macros
Initiated with a single:
```
#character 'Functions/macros' // Can contain
nop 1n drop // any other types
end
// And are simply called by their name following the '#' e.g:
character
```
As in, the script above would produce the following ASM (with the leading hex being the equivalent data of the "Functions/macros" string):
`46756e6374696f6e732f6d6163726f730a OP_NOP OP_TRUE OP_DROP`

### Import
Pre-compiled libraries like SX's own stdlib or locally related files can be imported to allow one use the defined macros or functions using:
`import 'stdlib.sx' // JS-like syntax`

And that's the description for now, there are references to string-templates in the code but frankly they'll mostly be used for stupid things like
```
`Recording ${.variables} into data pushes.'
```
And are not finished...