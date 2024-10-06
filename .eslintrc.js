module.exports = {
    "extends": "eslint:recommended",
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": 2020,
      "sourceType": "module"
    },
    "plugins": [
      "@typescript-eslint"
    ],
    "rules":   
   {
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "double"],
      "semi": ["error",   
   "always"]
    }
  };