# GitHub Actions TypeScript Template

Welcome to the template to create GitHub Actions based on the GitHub Actions JavaScript ToolKit: https://github.com/actions/toolkit/.
When creating a new repository please select this template.

## Example

This repository contains an example action which needs two inputs as defined in `action.yml`:

- `github_token`
- `message`

When configured for instance like that:

```
name: Pull Request Messager

on:
  pull_request:
    types: [opened, edited, synchronize, reopened]

  workflow_dispatch:

jobs:
  check-title:
    runs-on: ubuntu-latest

    steps:
      - uses: WorkpathHQ/github_actions@main
        with:
          github_token: ${{ github.token }}
          message: "I'm a mighty pirate"
```

It will send a message: "I'm a mighty pirate - 5", with the number added for no obvious reasons apart to illustrate how to write unit tests.

Feel free to drop everything you don't need.

## Development

- Add product dependencies with `npm install --save-prod <dependency_name>`
- Write code in `src/index.js`

## Tests

- Put tests in same folder as source files and name them `*.test.ts`.
- Run `npm run test`

## Transpiling and Bundling

- Run `npm run build`
- Package will be built in `lib/index.js`

## Referencing this Github Action in Workflows

```
 - uses: WorkpathHQ/github_actions_my_action_name@main
```

Instead of `main` you can also use tags / releases.
