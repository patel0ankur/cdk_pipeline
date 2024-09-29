import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import { CfnOutput } from 'aws-cdk-lib';

export class MyLambdaStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);

      const lambda_function = new Function(this, 'LambdaFunction', {
        runtime: Runtime.PYTHON_3_12,
        handler: 'index.handler',
        code: new InlineCode("def handler(event, context):\n    print('Hello from Lambda!')")
      })

      const function_name = new CfnOutput(this, 'LambdaArn', { value: lambda_function.functionName });

    }
}