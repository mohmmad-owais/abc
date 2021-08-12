import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as VirtualLollyBackend from '../lib/virtual_lolly-backend-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new VirtualLollyBackend.VirtualLollyBackendStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
