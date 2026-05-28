const constantOps = [
    {
        value: "OP_0",
        opcodeNum: 0,
        inputDesc: "Nothing",
        outputDesc: "(empty value)",
        description: "An empty array of bytes is pushed onto the stack."
    },
    {
        value: "OP_FALSE",
        opcodeNum: 0,
        inputDesc: "Nothing",
        outputDesc: "(empty value)",
        description: "An empty array of bytes is pushed onto the stack."
    },
    {
        value: "Pushdata Bytelength",
        opcodeNum: "1-75",
        inputDesc: "(special)",
        outputDesc: "data",
        description: "The next opcode bytes is data to be pushed onto the stack"
    },
    {
        value: "OP_PUSHDATA1",
        opcodeNum: 76,
        inputDesc: "(special)",
        outputDesc: "data",
        description: "The next byte contains the number of bytes to be pushed onto the stack."
    },
    {
        value: "OP_PUSHDATA2",
        opcodeNum: 77,
        inputDesc: "(special)",
        outputDesc: "data",
        description: "The next two bytes contain the number of bytes to be pushed onto the stack in little endian order."
    },
    {
        value: "OP_PUSHDATA4",
        opcodeNum: 78,
        inputDesc: "(special)",
        outputDesc: "data",
        description: "The next four bytes contain the number of bytes to be pushed onto the stack in little endian order."
    },
    {
        value: "OP_1NEGATE",
        opcodeNum: 79,
        inputDesc: "Nothing",
        outputDesc: "-1",
        description: "The number -1 is pushed onto the stack."
    },
    {
        value: "OP_TRUE",
        opcodeNum: 81,
        inputDesc: "Nothing",
        outputDesc: "1",
        description: "The number 1 is pushed onto the stack."
    },
    // Generating OP_1 through OP_16 operations
    ...Array.from({ length: 16 }, (v, i) => {
        return {
            value: `OP_${i + 1}`,
            opcodeNum: 80 + i + 1,
            inputDesc: "Nothing",
            outputDesc: `${i + 1}`,
            description: `The number  ${i + 1} is pushed onto the stack.`
        };
    })
]

const controlOps = [
    {
        value: "OP_NOP",
        opcodeNum: 97,
        inputDesc: "Nothing",
        outputDesc: "Nothing",
        description: "Does nothing."
    },
    {
        value: "OP_VER",
        opcodeNum: 98,
        inputDesc: "Nothing",
        outputDesc: "Protocol version",
        description: "Puts the version of the protocol under which this transaction will be evaluated onto the stack.",
        disabled: true
    },
    {
        value: "OP_IF",
        opcodeNum: 99,
        inputDesc: "[expression] IF\n\n[statement 1]\n\nENDIF\nOR\n[expression] IF\n\n[statement 1]\n\nELSE\n\n[statement 2]\n\nENDIF",
        outputDesc: "If the top stack value is TRUE, statement 1 is executed.\n\nIf the top stack value is FALSE and ELSE is used, statement 2 is executed. If ELSE is NOT used, the script jumps to ENDIF.\nThe top stack value is removed.",
        description: ""
    },
    {
        value: "OP_NOTIF",
        opcodeNum: 100,
        inputDesc: "[expression] NOTIF\n\n[statement 1]\n\nENDIF\nOR\n[expression] IF\n\n[statement 1]\n\nELSE\n\n[statement 2]\n\nENDIF",
        outputDesc: "If the top stack value is FALSE, statement 1 is executed.\n\nIf the top stack value is TRUE and ELSE is used, statement 2 is executed. If ELSE is NOT used, the script jumps to ENDIF.\nThe top stack value is removed.",
        description: ""
    },
    {
        value: "OP_VERIF",
        opcodeNum: 101,
        inputDesc: "",
        outputDesc: "",
        description: "",
        disabled: true
    },
    {
        value: "OP_VERNOTIF",
        opcodeNum: 102,
        inputDesc: "",
        outputDesc: "",
        description: "",
        disabled: true
    },
    {
        value: "OP_ELSE",
        opcodeNum: 103,
        inputDesc: "[expression] IF\n\n[statement 1]\n\nELSE\n\n[statement 2]\n\nENDIF",
        outputDesc: "If the preceding IF or NOTIF check was not valid then statement 2 is executed.",
        description: ""
    },
    {
        value: "OP_ENDIF",
        opcodeNum: 104,
        inputDesc: "[expression] IF\n\n[statements]\n\nELSE\n\n[statements]\n\nENDIF",
        outputDesc: "Ends an if/else block. All blocks must end, or the transaction is invalid. An OP_ENDIF without a prior matching OP_IF or OP_NOTIF is also invalid.",
        description: ""
    },
    {
        value: "OP_VERIFY",
        opcodeNum: 105,
        inputDesc: "True / false",
        outputDesc: "Nothing / fail",
        description: "Marks transaction as invalid if top stack value is not true. The top stack value is removed."
    },
    {
        value: "OP_RETURN",
        opcodeNum: 106,
        inputDesc: "Nothing",
        outputDesc: "Ends script with top value on stack as final result",
        description: "OP_RETURN can also be used to create 'False Return' outputs with a scriptPubKey consisting of OP_FALSE OP_RETURN followed by data. Such outputs are provably unspendable and should be given a value of zero Satoshis. These outputs can be pruned from storage in the UTXO set, reducing its size. Currently the BitcoinSV network supports multiple FALSE RETURN outputs in a given transaction with each one capable of holding up to 100kB of data. After the Genesis upgrade in 2020 miners will be free to mine transactions containing FALSE RETURN outputs of any size."
    }
]

const stackOps = [
    {
        value: "OP_TOALTSTACK",
        opcodeNum: 107,
        inputDesc: "x1",
        outputDesc: "(alt)x1",
        description: "Puts the input onto the top of the alt stack. Removes it from the main stack."
    },
    {
        value: "OP_FROMALTSTACK",
        opcodeNum: 108,
        inputDesc: "(alt)x1",
        outputDesc: "x1",
        description: "Puts the input onto the top of the main stack. Removes it from the alt stack."
    },
    {
        value: "OP_2DROP",
        opcodeNum: 109,
        inputDesc: "x1 x2",
        outputDesc: "Nothing",
        description: "Removes the top two stack items."
    },
    {
        value: "OP_2DUP",
        opcodeNum: 110,
        inputDesc: "x1 x2",
        outputDesc: "x1 x2 x1 x2",
        description: "Duplicates the top two stack items."
    },
    {
        value: "OP_3DUP",
        opcodeNum: 111,
        inputDesc: "x1 x2 x3",
        outputDesc: "x1 x2 x3 x1 x2 x3",
        description: "Duplicates the top three stack items."
    },
    {
        value: "OP_2OVER",
        opcodeNum: 112,
        inputDesc: "x1 x2 x3 x4",
        outputDesc: "x1 x2 x3 x4 x1 x2",
        description: "Copies the pair of items two spaces back in the stack to the front."
    },
    {
        value: "OP_2ROT",
        opcodeNum: 113,
        inputDesc: "x1 x2 x3 x4 x5 x6",
        outputDesc: "x3 x4 x5 x6 x1 x2",
        description: "The fifth and sixth items back are moved to the top of the stack."
    },
    {
        value: "OP_2SWAP",
        opcodeNum: 114,
        inputDesc: "x1 x2 x3 x4",
        outputDesc: "x3 x4 x1 x2",
        description: "Swaps the top two pairs of items."
    },
    {
        value: "OP_IFDUP",
        opcodeNum: 115,
        inputDesc: "x",
        outputDesc: "x / x x",
        description: "If the top stack value is not 0, duplicate it."
    },
    {
        value: "OP_DEPTH",
        opcodeNum: 116,
        inputDesc: "Nothing",
        outputDesc: "<Stack size>",
        description: "Counts the number of stack items onto the stack and places the value on the top"
    },
    {
        value: "OP_DROP",
        opcodeNum: 117,
        inputDesc: "x",
        outputDesc: "Nothing",
        description: "Removes the top stack item."
    },
    {
        value: "OP_DUP",
        opcodeNum: 118,
        inputDesc: "x",
        outputDesc: "x x",
        description: "Duplicates the top stack item."
    },
    {
        value: "OP_NIP",
        opcodeNum: 119,
        inputDesc: "x1 x2",
        outputDesc: "x2",
        description: "Removes the second-to-top stack item."
    },
    {
        value: "OP_OVER",
        opcodeNum: 120,
        inputDesc: "x1 x2",
        outputDesc: "x1 x2 x1",
        description: "Copies the second-to-top stack item to the top."
    },
    {
        value: "OP_PICK",
        opcodeNum: 121,
        inputDesc: "xn ... x2 x1 x0 <n>",
        outputDesc: "xn ... x2 x1 x0 xn",
        description: "The item n back in the stack is copied to the top."
    },
    {
        value: "OP_ROLL",
        opcodeNum: 122,
        inputDesc: "xn ... x2 x1 x0 <n>",
        outputDesc: "... x2 x1 x0 xn",
        description: "The item n back in the stack is moved to the top."
    },
    {
        value: "OP_ROT",
        opcodeNum: 123,
        inputDesc: "x1 x2 x3",
        outputDesc: "x2 x3 x1",
        description: "The top three items on the stack are rotated to the left."
    },
    {
        value: "OP_SWAP",
        opcodeNum: 124,
        inputDesc: "x1 x2",
        outputDesc: "x2 x1",
        description: "The top two items on the stack are swapped."
    },
    {
        value: "OP_TUCK",
        opcodeNum: 125,
        inputDesc: "x1 x2",
        outputDesc: "x2 x1 x2",
        description: "The item at the top of the stack is copied and inserted before the second-to-top item."
    }
]
const dataManipulationOps = [
    {
        value: "OP_CAT",
        opcodeNum: 126,
        inputDesc: "x1 x2",
        outputDesc: "out",
        description: "Concatenates two strings."
    },
    {
        value: "OP_SPLIT",
        opcodeNum: 127,
        inputDesc: "x n",
        outputDesc: "x1 x2",
        description: "Splits byte sequence x at position n."
    },
    {
        value: "OP_NUM2BIN",
        opcodeNum: 128,
        inputDesc: "a b",
        outputDesc: "out",
        description: "Converts numeric value a into byte sequence of length b."
    },
    {
        value: "OP_BIN2NUM",
        opcodeNum: 129,
        inputDesc: "x",
        outputDesc: "out",
        description: "Converts byte sequence x into a numeric value."
    },
    {
        value: "OP_SIZE",
        opcodeNum: 130,
        inputDesc: "in",
        outputDesc: "in size",
        description: "Pushes the string length of the top element of the stack (without popping it)."
    }
];
const bitwiseLogicOps = [
    {
        value: "OP_INVERT",
        opcodeNum: 131,
        inputDesc: "in",
        outputDesc: "out",
        description: "Flips all of the bits in the input."
    },
    {
        value: "OP_AND",
        opcodeNum: 132,
        inputDesc: "x1 x2",
        outputDesc: "out",
        description: "Boolean and between each bit in the inputs."
    },
    {
        value: "OP_OR",
        opcodeNum: 133,
        inputDesc: "x1 x2",
        outputDesc: "out",
        description: "Boolean or between each bit in the inputs."
    },
    {
        value: "OP_XOR",
        opcodeNum: 134,
        inputDesc: "x1 x2",
        outputDesc: "out",
        description: "Boolean exclusive or between each bit in the inputs."
    },
    {
        value: "OP_EQUAL",
        opcodeNum: 135,
        inputDesc: "x1 x2",
        outputDesc: "True / false",
        description: "Returns 1 if the inputs are exactly equal, 0 otherwise."
    },
    {
        value: "OP_EQUALVERIFY",
        opcodeNum: 136,
        inputDesc: "x1 x2",
        outputDesc: "Nothing / fail",
        description: "Same as OP_EQUAL, but runs OP_VERIFY afterward"
    }
]
const arithmeticOps = [
    {
        value: "OP_1ADD",
        opcodeNum: 139,
        inputDesc: "in",
        outputDesc: "out",
        description: "1 is added to the input."
    },
    {
        value: "OP_1SUB",
        opcodeNum: 140,
        inputDesc: "in",
        outputDesc: "out",
        description: "1 is subtracted from the input."
    },
    {
        value: "OP_2MUL",
        opcodeNum: 141,
        inputDesc: "in",
        outputDesc: "out",
        description: "The input is multiplied by 2."
    },
    {
        value: "OP_2DIV",
        opcodeNum: 142,
        inputDesc: "in",
        outputDesc: "out",
        description: "The input is divided by 2."
    },
    {
        value: "OP_NEGATE",
        opcodeNum: 143,
        inputDesc: "in",
        outputDesc: "out",
        description: "The sign of the input is flipped."
    }, {
        value: "OP_ABS",
        opcodeNum: 144,
        inputDesc: "in",
        outputDesc: "out",
        description: "The input is made positive."
    },
    {
        value: "OP_NOT",
        opcodeNum: 145,
        inputDesc: "in",
        outputDesc: "out",
        description: "If the input is 0 or 1, it is flipped. Otherwise the output will be 0."
    },
    {
        value: "OP_0NOTEQUAL",
        opcodeNum: 146,
        inputDesc: "in",
        outputDesc: "out",
        description: "Returns 0 if the input is 0. 1 otherwise."
    },
    {
        value: "OP_ADD",
        opcodeNum: 147,
        inputDesc: "a b",
        outputDesc: "out",
        description: "a is added to b."
    },
    {
        value: "OP_SUB",
        opcodeNum: 148,
        inputDesc: "a b",
        outputDesc: "out",
        description: "b is subtracted from a."
    },
    {
        value: "OP_MUL",
        opcodeNum: 149,
        inputDesc: "a b",
        outputDesc: "out",
        description: "a is multiplied by b."
    },
    {
        value: "OP_DIV",
        opcodeNum: 150,
        inputDesc: "a b",
        outputDesc: "out",
        description: "a is divided by b."
    },
    {
        value: "OP_MOD",
        opcodeNum: 151,
        inputDesc: "a b",
        outputDesc: "out",
        description: "Returns the remainder after dividing a by b."
    },
    {
        value: "OP_LSHIFT",
        opcodeNum: 152,
        inputDesc: "a b",
        outputDesc: "out",
        description: "Logical left shift b bits. Sign data is discarded"
    },
    {
        value: "OP_RSHIFT",
        opcodeNum: 153,
        inputDesc: "a b",
        outputDesc: "out",
        description: "Logical right shift b bits. Sign data is discarded"
    },
    {
        value: "OP_BOOLAND",
        opcodeNum: 154,
        inputDesc: "a b",
        outputDesc: "out",
        description: "If both a and b are not 0, the output is 1. Otherwise 0."
    },
    {
        value: "OP_BOOLOR",
        opcodeNum: 155,
        inputDesc: "a b",
        outputDesc: "out",
        description: "If a or b is not 0, the output is 1. Otherwise 0."
    },
    {
        value: "OP_NUMEQUAL",
        opcodeNum: 156,
        inputDesc: "a b",
        outputDesc: "out",
        description: "Returns 1 if the numbers are equal, 0 otherwise."
    },
    {
        value: "OP_NUMEQUALVERIFY",
        opcodeNum: 157,
        inputDesc: "a b",
        outputDesc: "Nothing / fail",
        description: "Same as OP_NUMEQUAL, but runs OP_VERIFY afterward."
    },
    {
        value: "OP_NUMNOTEQUAL",
        opcodeNum: 158,
        inputDesc: "a b",
        outputDesc: "out",
        description: "Returns 1 if the numbers are not equal, 0 otherwise."
    },
    {
        value: "OP_LESSTHAN",
        opcodeNum: 159,
        inputDesc: "a b",
        outputDesc: "out",
        description: "Returns 1 if a is less than b, 0 otherwise."
    },
    {
        value: "OP_GREATERTHAN",
        opcodeNum: 160,
        inputDesc: "a b",
        outputDesc: "out",
        description: "Returns 1 if a is greater than b, 0 otherwise."
    },
    {
        value: "OP_LESSTHANOREQUAL",
        opcodeNum: 161,
        inputDesc: "a b",
        outputDesc: "out",
        description: "Returns 1 if a is less than or equal to b, 0 otherwise."
    },
    {
        value: "OP_GREATERTHANOREQUAL",
        opcodeNum: 162,
        inputDesc: "a b",
        outputDesc: "out",
        description: "Returns 1 if a is greater than or equal to b, 0 otherwise."
    },
    {
        value: "OP_MIN",
        opcodeNum: 163,
        inputDesc: "a b",
        outputDesc: "out",
        description: "Returns the smaller of a and b."
    },
    {
        value: "OP_MAX",
        opcodeNum: 164,
        inputDesc: "a b",
        outputDesc: "out",
        description: "Returns the larger of a and b."
    },
    {
        value: "OP_WITHIN",
        opcodeNum: 165,
        inputDesc: "x min max",
        outputDesc: "out",
        description: "Returns 1 if x is within the specified range (left-inclusive), 0 otherwise."
    },
]
const cryptographyOps = [
    {
        value: "OP_RIPEMD160",
        opcodeNum: 166,
        inputDesc: "in",
        outputDesc: "hash",
        description: "The input is hashed using RIPEMD-160."
    },
    {
        value: "OP_SHA1",
        opcodeNum: 167,
        inputDesc: "in",
        outputDesc: "hash",
        description: "The input is hashed using SHA-1."
    },
    {
        value: "OP_SHA256",
        opcodeNum: 168,
        inputDesc: "in",
        outputDesc: "hash",
        description: "The input is hashed using SHA-256."
    },
    {
        value: "OP_HASH160",
        opcodeNum: 169,
        inputDesc: "in",
        outputDesc: "hash",
        description: "The input is hashed twice: first with SHA-256 and then with RIPEMD-160."
    },
    {
        value: "OP_HASH256",
        opcodeNum: 170,
        inputDesc: "in",
        outputDesc: "hash",
        description: "The input is hashed two times with SHA-256."
    },
    {
        value: "OP_CODESEPARATOR",
        opcodeNum: 171,
        inputDesc: "Nothing",
        outputDesc: "Nothing",
        description: "All of the signature checking words will only match signatures to the data after the most recently-executed OP_CODESEPARATOR."
    },
    {
        value: "OP_CHECKSIG",
        opcodeNum: 172,
        inputDesc: "sig pubkey",
        outputDesc: "True / false",
        description: "The entire transaction's outputs, inputs, and script (from the most recently-executed OP_CODESEPARATOR to the end) are hashed. The signature used by OP_CHECKSIG must be a valid signature for this hash and public key. If it is, 1 is returned, 0 otherwise."
    },
    {
        value: "OP_CHECKSIGVERIFY",
        opcodeNum: 173,
        inputDesc: "sig pubkey",
        outputDesc: "Nothing / fail",
        description: "Same as OP_CHECKSIG, but OP_VERIFY is executed afterward."
    },
    {
        value: "OP_CHECKMULTISIG",
        opcodeNum: 174,
        inputDesc: "x sig1 sig2 ... <number of signatures> pub1 pub2 <number of public keys>",
        outputDesc: "True / False",
        description: "Compares the first signature against each public key until it finds an ECDSA match. Starting with the subsequent public key, it compares the second signature against each remaining public key until it finds an ECDSA match. The process is repeated until all signatures have been checked or not enough public keys remain to produce a successful result. All signatures need to match a public key. Because public keys are not checked again if they fail any signature comparison, signatures must be placed in the scriptSig using the same order as their corresponding public keys were placed in the scriptPubKey or redeemScript. If all signatures are valid, 1 is returned, 0 otherwise. Due to a bug, an extra unused value (x) is removed from the stack. Script spenders must account for this by adding a junk value (typically zero) to the stack."
    },
    {
        value: "OP_CHECKMULTISIGVERIFY",
        opcodeNum: 175,
        inputDesc: "x sig1 sig2 ... <number of signatures> pub1 pub2 ... <number of public keys>",
        outputDesc: "Nothing / fail",
        description: "Same as OP_CHECKMULTISIG, but OP_VERIFY is executed afterward."
    }
]
const unusedOps = [
    {
        value: "OP_NOP2",
        opcodeNum: 177,
        inputDesc: "Nothing",
        outputDesc: "Nothing",
        description: "Previously OP_CHECKLOCKTIMEVERIFY. Evaluation process for UTXOs that pre-date genesis: Mark transaction as invalid if the top stack item is greater than the transaction's nLockTime field, otherwise script evaluation continues as though an OP_NOP was executed. Transaction is also invalid if 1. the stack is empty; or 2. the top stack item is negative; or 3. the top stack item is greater than or equal to 500000000 while the transaction's nLockTime field is less than 500000000, or vice versa; or 4. the input's nSequence field is equal to 0xffffffff. The precise semantics are described in BIP 0065."
    },
    {
        value: "OP_NOP3",
        opcodeNum: 178,
        inputDesc: "Nothing",
        outputDesc: "Nothing",
        description: "Previously OP_CHECKSEQUENCEVERIFY. Evaluation process for UTXOs that pre-date genesis: Mark transaction as invalid if the relative lock time of the input (enforced by BIP 0068 with nSequence) is not equal to or longer than the value of the top stack item. The precise semantics are described in BIP 0112."
    },
    {
        value: "OP_PUBKEYHASH",
        opcodeNum: 253,
        inputDesc: "Represents a public key",
        outputDesc: "Hashed with OP_HASH160",
        description: ""
    },
    {
        value: "OP_PUBKEY",
        opcodeNum: 254,
        inputDesc: "Represents a public key",
        outputDesc: "Compatible with OP_CHECKSIG",
        description: ""
    },
    {
        value: "OP_INVALIDOPCODE",
        opcodeNum: 255,
        inputDesc: "",
        outputDesc: "",
        description: "Matches any opcode that is not yet assigned."
    },
    {
        value: "OP_RESERVED",
        opcodeNum: 80,
        inputDesc: "",
        outputDesc: "",
        description: "Transaction is invalid unless occurring in an unexecuted OP_IF branch."
    },
    {
        value: "OP_RESERVED1",
        opcodeNum: 137,
        inputDesc: "",
        outputDesc: "",
        description: "Transaction is invalid unless occurring in an unexecuted OP_IF branch."
    },
    {
        value: "OP_RESERVED2",
        opcodeNum: 138,
        inputDesc: "",
        outputDesc: "",
        description: "Transaction is invalid unless occurring in an unexecuted OP_IF branch."
    },
    // Explicitly listing the NOP operations for clarity
    ...Array.from({ length: 10 }, (v, i) => {
        const opcode = i === 0 ? 176 : 178 + i;
        return {
            value: `OP_NOP${i + 1}`,
            opcodeNum: opcode,
            inputDesc: "",
            outputDesc: "",
            description: "The word is ignored. Does not mark transaction as invalid."
        };
    }).filter(op => op.opcodeNum >= 176 && op.opcodeNum <= 185)
]

const opcodes = [...constantOps,...controlOps,...stackOps,...dataManipulationOps,...bitwiseLogicOps,...arithmeticOps,...cryptographyOps]//,...unusedOps]

// shortOps: lowercase versions without OP_ prefix (mirrors sx/src/lib/utils.js)
const shortOps = opcodes.map(op => {
    const value = (op.value || "").replace(/^OP_/, "").toLowerCase();
    return { ...op, value };
});

module.exports = opcodes;
module.exports.opcodes = opcodes;
module.exports.shortOps = shortOps;
module.exports.default = opcodes;