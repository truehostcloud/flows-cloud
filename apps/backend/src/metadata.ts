/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [[import("./events/events.dto"), { "CreateEventDto": { eventTime: { required: true, type: () => Date }, type: { required: true, type: () => String }, userHash: { required: false, type: () => String }, flowId: { required: true, type: () => String }, projectId: { required: true, type: () => String }, stepIndex: { required: false, type: () => String }, stepHash: { required: false, type: () => String }, flowHash: { required: true, type: () => String } } }]], "controllers": [[import("./app.controller"), { "AppController": { "getStatus": { type: Boolean } } }], [import("./events/events.controller"), { "EventsController": { "create": {} } }]] } };
};