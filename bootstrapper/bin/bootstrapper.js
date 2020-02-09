#!/usr/bin/env node

// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const cdk = require("@aws-cdk/core");
const { Neo4jStack } = require("../lib/neo4j-stack");
const { NeptuneStack } = require("../lib/neptune-stack");
const { NetworkStack } = require("../lib/network-stack");
const { BucketStack } = require("../lib/bucket-stack");

const fs = require("fs");

const app = new cdk.App();
const defaultEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};
const networkStack = new NetworkStack(app, "NetworkStack", {
  env: defaultEnv
});
const bucketStack = new BucketStack(app, "BucketStack", {
  env: defaultEnv
});
const neptuneStack = new NeptuneStack(app, "NeptuneStack", {
  env: defaultEnv,
  networkStack: networkStack
});
new Neo4jStack(app, "Neo4jStack", {
  env: defaultEnv,
  neptuneStack: neptuneStack,
  bucketStack: bucketStack,
  networkStack: networkStack
});

fs.writeFile(
  "neptuneStack-shared.json",
  JSON.stringify({
    DBClusterIdentifier: neptuneStack.NeptuneDBClusterIdentifier,
    RoleArn: neptuneStack.NeptuneTrustedRoleArn
  }),
  (err, data) => {
    if (err) console.log("Error: ", err);
    // console.log(data);
  }
);
