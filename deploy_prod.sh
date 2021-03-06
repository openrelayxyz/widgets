#!/bin/bash

CWD=$(realpath $(dirname $0))


cd $CWD/packages/bundle

yarn install


export TAG=$(git describe HEAD --tags)
BRANCH=$(git branch | grep \* | cut -d ' ' -f2 | sed s/master/latest/g)

yarn run update-docs

cd $CWD/docs/
echo "baseurl: /$BRANCH" > _branch_config.yml
jekyll build --config _config.yml,_branch_config.yml
cd $CWD/docs/_site
aws s3 sync . s3://widgets-site-prodbucket-2oa9hm9fb3ly/$BRANCH --acl=public-read

cd $CWD/docs/
echo "baseurl: /$TAG" > _tag_config.yml
jekyll build --config _config.yml,_tag_config.yml
cd $CWD/docs/_site
aws s3 sync . s3://widgets-site-prodbucket-2oa9hm9fb3ly/$TAG --acl=public-read

aws cloudfront create-invalidation --distribution-id=E37CAQG708XEJ7 --paths '/*'
