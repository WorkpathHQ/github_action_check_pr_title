// https://github.com/actions/toolkit
import * as core from '@actions/core';
import * as github from '@actions/github';

import { sum } from './util/sum';

async function run() {
  try {
    const githubToken = core.getInput('github_token', {
      required: true,
    });
    // Creates an Octokit instance, a helper to interact with
    // GitHub REST interface
    // https://octokit.github.io/rest.js
    const client = github.getOctokit(githubToken);
    const message = core.getInput('message');

    // There is no documentation of context content...
    // So best to console log it to get the content lol. Scroll further down in this doc
    // https://github.com/actions/toolkit/tree/main/packages/github
    // console.log('context', context);
    const context = github.context;
    const owner = context.issue.owner;
    const repo = context.issue.repo;
    const pullRequestNumber = context.issue.number;

    // Not necessary. Might be useful to safeguard when it's critical to ensure this
    // action only runs on specific events.
    // https://docs.github.com/en/actions/learn-github-actions/contexts#github-context
    if (github.context.eventName !== 'pull_request') {
      core.setFailed('Can only run on pull requests!');
      return;
    }

    await client.rest.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: pullRequestNumber,
      body: `${message} - ${sum(2, 3)}`,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      core.setFailed(error.message);
    } else {
      console.log('Unexpected error', error);
    }
  }
}

run();
