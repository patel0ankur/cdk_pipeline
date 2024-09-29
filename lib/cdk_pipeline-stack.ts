import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { LinuxBuildImage } from 'aws-cdk-lib/aws-codebuild';

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

    const pipeline = new pipelines.CodePipeline(this, 'CdkPipeline', {

      pipelineName: 'CdkPipeline',
      crossAccountKeys: true,       // <---- For Cross Account Deployment
      codeBuildDefaults: {
        buildEnvironment: {
          privileged: true,
          buildImage: LinuxBuildImage.STANDARD_7_0
        }
      },
      synth: new pipelines.ShellStep('Synth',
        {
          input: git_hub_commit,
          commands: [
            'npm ci',
            'npm run build',
            'npx cdk synth'
          ]
        }
      )
    })

  }
}
