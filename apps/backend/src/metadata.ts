/* eslint-disable */
export default async () => {
    const t = {
        ["./sdk/sdk.dto"]: await import("./sdk/sdk.dto"),
        ["./flows/flows.dto"]: await import("./flows/flows.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./sdk/sdk.dto"), { "GetFlowsDto": { id: { required: true, type: () => String }, element: { required: false, type: () => String }, steps: { required: true, type: () => [Object] } }, "CreateEventDto": { eventTime: { required: true, type: () => Date }, type: { required: true, type: () => String }, userHash: { required: false, type: () => String }, flowId: { required: true, type: () => String }, projectId: { required: true, type: () => String }, stepIndex: { required: false, type: () => String }, stepHash: { required: false, type: () => String }, flowHash: { required: true, type: () => String } } }], [import("./flows/flows.dto"), { "GetFlowsDto": { id: { required: true, type: () => String }, human_id: { required: true, type: () => String }, human_id_alias: { required: true, type: () => String, nullable: true }, project_id: { required: true, type: () => String }, name: { required: true, type: () => String }, flow_type: { required: true, type: () => String }, description: { required: true, type: () => String }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date } } }]], "controllers": [[import("./app.controller"), { "AppController": { "getStatus": { type: Boolean } } }], [import("./flows/flows.controller"), { "FlowsControllers": { "getFlows": { type: [t["./flows/flows.dto"].GetFlowsDto] } } }], [import("./sdk/sdk.controller"), { "SdkController": { "getFlows": { type: [t["./sdk/sdk.dto"].GetFlowsDto] }, "createEvent": {} } }]] } };
};