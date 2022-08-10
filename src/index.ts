// https://github.com/actions/toolkit
import * as core from '@actions/core';
import * as github from '@actions/github';

const validEvent = ['pull_request'];

async function run() {
  try {
    const githubToken = core.getInput('github_token', { required: true });
    // Creates an Octokit instance, a helper to interact with
    // GitHub REST interface
    // https://octokit.github.io/rest.js
    const client = github.getOctokit(githubToken);
    const context = github.context;
    const owner = context.issue.owner;
    const repo = context.issue.repo;
    const pullRequestNumber = context.issue.number;

    // The pull request info on the context isn't up to date when
    // user updates title and re-runs the workflow.
    // Therefore fetch the pull request via REST API
    // to ensure we use the current title.
    const { data: pullRequest } = await client.rest.pulls.get({
      owner,
      repo,
      pull_number: pullRequestNumber,
    });
    const title = pullRequest.title;

    core.info(`Pull Request title: "${title}"`);

    // Check if title pass regex
    let _regex;
    const regex = core.getInput('regex');
    const regexFlags = core.getInput('regex_flags');
    if (regexFlags) {
      _regex = new RegExp(regex, regexFlags);
    } else {
      _regex = new RegExp(regex);
    }

    if (!_regex.test(title)) {
      const failureMessage = `Pull Request title "${title}" failed to pass match regex - ${regex}`;

      // if not set failure exit code with failureMessage
      // https://docs.github.com/en/actions/creating-actions/setting-exit-codes-for-actions
      core.setFailed(failureMessage);

      // and also display comment
      await client.rest.issues.createComment({
        owner: owner,
        repo: repo,
        issue_number: pullRequestNumber,
        body: failureMessage,
      });

      return;
    }
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
