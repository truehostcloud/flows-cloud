/* eslint-disable */
export default async () => {
    const t = {
        ["./flows/flows.dto"]: await import("./flows/flows.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./events/events.dto"), { "CreateEventDto": { eventTime: { required: true, type: () => Date }, type: { required: true, type: () => String }, userHash: { required: false, type: () => String }, flowId: { required: true, type: () => String }, projectId: { required: true, type: () => String }, stepIndex: { required: false, type: () => String }, stepHash: { required: false, type: () => String }, flowHash: { required: true, type: () => String } } }], [import("./flows/flows.dto"), { "GetFlowsDto": { id: { required: true, type: () => String }, element: { required: false, type: () => String }, steps: { required: true, type: () => [Object] } } }]], "controllers": [[import("./app.controller"), { "AppController": { "getStatus": { type: Boolean } } }], [import("./events/events.controller"), { "EventsController": { "create": {} } }], [import("./flows/flows.controller"), { "FlowsController": { "getFlows": { type: [t["./flows/flows.dto"].GetFlowsDto] } } }]] } };
};