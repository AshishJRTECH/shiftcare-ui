module.exports = {
  extends: [
    "eslint:recommended",
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/eslint-recommended",
    // "plugin:@typescript-eslint/strict",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  plugins: ["@typescript-eslint", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
    commonjs: true
  },
  globals: {
    React: "readonly",
    PDFJSDev: "readonly"
  },
  rules: {
    // "@next/next/no-img-element": "off",
    // "prefer-rest-params": "off",
    // "@typescript-eslint/ban-ts-comment": "off",
    // "prettier/prettier": "error",
    // "@typescript-eslint/consistent-type-definitions": "off",
    // "@typescript-eslint/no-unnecessary-condition": "off",
    // "@typescript-eslint/no-restricted-imports": [
    //   "error",
    //   {
    //     name: "react-redux",
    //     importNames: ["useSelector", "useDispatch"],
    //     message:
    //       "Use typed hooks `useAppDispatch` and `useAppSelector` instead."
    //   }
    // ],
    // "@typescript-eslint/no-non-null-assertion": "off",
    // "@typescript-eslint/no-unused-vars": [
    //   "error",
    //   {
    //     argsIgnorePattern: "^_",
    //     varsIgnorePattern: "^_"
    //   }
    // ],
    // "@typescript-eslint/no-empty-interface": [
    //   "error",
    //   {
    //     allowSingleExtends: true
    //   }
    // ],
    // "@typescript-eslint/ban-types": [
    //   "error",
    //   {
    //     types: {
    //       "{}": false
    //     },
    //     extendDefaults: true
    //   }
    // ],
    // "@typescript-eslint/no-explicit-any": [
    //   "warn",
    //   {
    //     // fixToUnknown: true,
    //     ignoreRestArgs: true
    //   }
    // ],
    // camelcase: "error"

    "no-console": "warn",
    "mui-path-imports/mui-path-imports": "off",
    //no used vars
    "unused-imports/no-unused-imports": "off",
    "no-useless-escape": "error",
    "unused-imports/no-unused-vars": "off",
    "react-hooks/rules-of-hooks": "error",
    "import/order": "off",
    "import/newline-after-import": "error",
    // Variables -- start
    "init-declarations": "error",
    "no-restricted-globals": "error",
    "no-unused-vars": "warn",
    "no-use-before-define": "error",
    // Best Practices -- end
    "react/require-default-props": [
      "error",
      {
        ignoreFunctionalComponents: true
      }
    ],
    "sort-imports": [
      "error",
      {
        ignoreDeclarationSort: true
      }
    ],

    // Variables -- end
    camelcase: "off",
    "react-hooks/exhaustive-deps": "off",
    "import/named": "off",
    "no-undef": "off",
    "arrow-body-style": "off",
    "prettier/prettier": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-props-no-spreading": "off",
    "react/jsx-filename-extension": "off",
    "react/function-component-definition": "off",
    "import/prefer-default-export": "off",
    "no-underscore-dangle": "off",
    "import/extensions": "off",
    "spaced-comment": "off",
    "import/no-named-as-default": "off",
    "import/no-unresolved": "off",
    "no-undef-init": "off",
    "no-delete-var": "off",
    "no-label-var": "off",
    "no-shadow": "off",
    "no-shadow-restricted-names": "off",
    "no-undefined": "off",
    "accessor-pairs": "off",
    "array-callback-return": "off",
    "block-scoped-var": "off",
    "class-methods-use-this": "off",
    complexity: "off",
    "consistent-return": "off",
    curly: "off",
    "default-case": "off",
    "default-case-last": "off",
    "default-param-last": "off",
    "dot-location": "off",
    "dot-notation": "off",
    eqeqeq: "off",
    "grouped-accessor-pairs": "off",
    "guard-for-in": "off",
    "max-classes-per-file": "off",
    "no-alert": "off",
    "no-caller": "off",
    "no-case-declarations": "off",
    "no-constructor-return": "off",
    "no-div-regex": "off",
    "no-else-return": "off",
    "no-empty-function": "off",
    "no-empty-pattern": "off",
    "no-eq-null": "off",
    "no-eval": "off",
    "no-extend-native": "off",
    "no-extra-bind": "off",
    "no-extra-label": "off",
    "no-fallthrough": "off",
    "no-floating-decimal": "off",
    "no-global-assign": "off",
    "no-implicit-coercion": "off",
    "no-implicit-globals": "off",
    "no-implied-eval": "off",
    "no-invalid-this": "off",
    "no-iterator": "off",
    "no-labels": "off",
    "no-lone-blocks": "off",
    "no-loop-func": "off",
    "no-magic-numbers": "off",
    "no-multi-spaces": "off",
    "no-multi-str": "off",
    "no-new": "off",
    "no-new-func": "off",
    "no-new-wrappers": "off",
    "no-octal": "off",
    "no-octal-escape": "off",
    "no-param-reassign": "off",
    "no-proto": "off",
    "no-redeclare": "off",
    "no-restricted-properties": "off",
    "no-return-assign": "off",
    "no-return-await": "off",
    "no-script-url": "off",
    "no-self-assign": "off",
    "no-self-compare": "off",
    "no-sequences": "off",
    "no-throw-literal": "off",
    "no-unmodified-loop-condition": "off",
    "no-unused-expressions": "off",
    "no-unused-labels": "off",
    "no-useless-call": "off",
    "no-useless-catch": "off",
    "no-useless-concat": "off",
    "no-useless-return": "off",
    "no-void": "off",
    "no-warning-comments": "off",
    "no-with": "off",
    "prefer-named-capture-group": "off",
    "prefer-promise-reject-errors": "off",
    "prefer-regex-literals": "off",
    radix: "off",
    "require-await": "off",
    "require-unicode-regexp": "off",
    "vars-on-top": "off",
    "wrap-iife": "off",
    yoda: "off"
  },
  overrides: [
    {
      files: ["*.d.ts"],
      rules: {
        "no-unused-vars": "warn",
        "@typescript-eslint/no-unused-vars": "off"
      }
    }
  ]
};
