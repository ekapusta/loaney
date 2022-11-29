#!/bin/bash

# major/minor/patch
# example 1.10.5
#  1 - major
# 10 - minor
#  5 - patch
RELEASE_VERSION=$1

echo -e "Release creation started"

# Read and create a new package version
PACKAGE_VERSION=$(ts-node ./scripts/release.ts "$RELEASE_VERSION")

echo -e $PACKAGE_VERSION

if [ "$PACKAGE_VERSION" == "ERROR" ]; then
  echo -e "\e[1;31m Error creating release version \e[0m"
else
  echo -e "\e[1;32m Release version $PACKAGE_VERSION created \e[0m"
  echo -e " Preparation of the release branch has begun "

  # Create a release branch
  RELEASE_BRANCH="release/v$PACKAGE_VERSION"

  git checkout -b "$RELEASE_BRANCH"

  # Create a commit with the new version
  COMMIT_MESSAGE="version up v$PACKAGE_VERSION"

  git add release.json
  git commit -m "$COMMIT_MESSAGE"

  # Merge the release branch on develop
  git checkout develop
  git merge "$RELEASE_BRANCH"

  # Delete the local release branch
  git branch --delete "$RELEASE_BRANCH"

  # Rebase the main branch onto develop
  git checkout main
  git rebase develop

  # Delivering a release branch to a remote repository
  git push -u origin main develop

  echo -e "Release finished"
fi
