# Enhanced CI/CD with CDK Pipelines

1) Create a new directory under the main directory of your CDK project to store CDK pipeline code:

```
mkdir cdk_pipeline && cd cdk_pipeline
```

2) Initialize the CDK app. 

```
sudo cdk init app --language typescript
```

3) Update the *bin/cdk_pipeline.ts* file to add the *account* and *region* details for *CdkPipelineStack* stack. 

```
new CdkPipelineStack(app, 'CdkPipelineStack', {  
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});
```

4) Prepare a GitHub repository: 
   
   a) Create a Personal Access [Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic) for your repository with the scopes:
      
    - repo
    - admin:repo_hook

   b) Use AWS Secrets Manager to store the Personal Access Token. Adding the Token to the secret-string parameter

   ```
   aws secretsmanager create-secret --name cdk_pipeline_github --description 'OAuth token for CDK Pipeline Github Repo.' --secret-string '{"github":"YOUR_TOKEN_HERE"}'
   ```

   c) Update the *lib/cdk_pipeline-stack.ts* file to get Git repository details. 

   ```
   const git_hub_commit = pipelines.CodePipelineSource.gitHub(github_repo, "main",
      { authentication: cdk.SecretValue.secretsManager('cdk_pipeline_github', 
        { jsonField: 'github' }) 
      }
    )
   ```

   d) Commit the change to your repository.

   ```
   git add .
   git commit -m "Added GitHub username to pipeline file."
   git push
   ```

5) Deploy the CdkPipelineStack stack:
   
   ```
   cdk deploy
   ```
6) Add CodePipeline Construct:
   
   Open *lib/cdk_pipeline-stack.ts* file and add the code below to the bottom of the file, make sure you saved the file:

   ```
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
   ```

   Here we're using previously created GitHub repository as code source (input parameter). Notice the build_image parameter which points to the latest available CodeBuild image as build environment (STANDARD_7_0).

7) Push code changes to GitHub Repo:
   
   ```
   git commit -am "Add CDK Pipeline"
   git push
   ```

8) Deploy the CdkPipelineStack stack:
   
   ```
   cdk deploy
   ```
   After the deployment is complete, navigate to AWS CodePipeline service and click on the CdkPipeline pipeline. It will look similar to the screenshot below. Notice that it has UpdatePipeline stage which is responsible for updating the pipeline itself (self-mutate). At this point an AWS EventBridge Rule has also been created, and it'll trigger the pipeline on any commit to the main branch, so we won't need to run cdk deploy command manually again. Please note that the pipeline is already running so make sure that you've pushed your code to AWS CodeCommit before you create the pipeline.

   ![pipeline](images/pipeline.png)








     



