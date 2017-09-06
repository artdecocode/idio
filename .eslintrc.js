module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2017
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "comma-dangle": [
            "error",
            "always-multiline"
        ],
        "quote-props": [
            "error",
            "as-needed"
        ],
        "padded-blocks": [
            "error",
            "never"
        ]
    }
};
