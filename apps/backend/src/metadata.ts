/* eslint-disable */
export default async () => {
    const t = {
        ["./sdk/sdk.dto"]: await import("./sdk/sdk.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./sdk/sdk.dto"), { "GetFlowsDto": { id: { required: true, type: () => String }, element: { required: false, type: () => String }, steps: { required: true, type: () => [Object] } }, "CreateEventDto": { eventTime: { required: true, type: () => Date }, type: { required: true, type: () => String }, userHash: { required: false, type: () => String }, flowId: { required: true, type: () => String }, projectId: { required: true, type: () => String }, stepIndex: { required: false, type: () => String }, stepHash: { required: false, type: () => String }, flowHash: { required: true, type: () => String } } }]], "controllers": [[import("./app.controller"), { "AppController": { "getStatus": { type: Boolean } } }], [import("./sdk/sdk.controller"), { "SdkController": { "getFlows": { type: [t["./sdk/sdk.dto"].GetFlowsDto] }, "create": {}, "createEvent": {} } }]] } };
};