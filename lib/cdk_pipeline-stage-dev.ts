import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { MyLambdaStack } from './lambda_code/lambda-stack';


export class DeploymentStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);
        
        const lambdaStack = new MyLambdaStack(this, 'LambdaStack');
    }
}