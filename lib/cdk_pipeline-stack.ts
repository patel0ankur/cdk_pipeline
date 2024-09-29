import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';

export class CdkPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const github_repo = 'patel0ankur/cdk_pipeline'

    const git_hub_commit = pipelines.CodePipelineSource.gitHub(github_repo, "main",
      {
        authentication: cdk.SecretValue.secretsManager('cdk_pipeline_github',
          { jsonField: 'github' })
      }
    )
  }
}
