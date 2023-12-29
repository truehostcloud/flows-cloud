export const t = {
  actions: {
    newOrg: "New organization",
    newProject: "New project",
    logout: "Sign out",
    save: "Save",
    remove: "Remove",
    close: "Close",
    delete: "Delete",
    copy: "Copy",
  },
  settings: {
    theme: "Theme",
  },
  toasts: {
    createOrgSuccess: "Organization created",
    deleteOrgSuccess: "Organization deleted",
    createProjectSuccess: "Project created",
    updateProjectSuccess: "Project updated",
    deleteProjectSuccess: "Project deleted",
    projectIdCopied: "Project ID copied",
    createFlowSuccess: "Flow created",
    updateFlowSuccess: "Flow updated",
    deleteFlowSuccess: "Flow deleted",
    saveTargetingSuccess: "Targeting updated",
    saveFrequencySuccess: "Frequency updated",
    saveLaunchSuccess: "Launch settings updated",
    inviteSent: "Invite sent",
    memberRemoved: "Member removed",
    publishFlowSuccess: "Flow published",
    enableFlowSuccess: "Flow enabled",
    disableFlowSuccess: "Flow disabled",

    createInviteFailed: "Failed to send invite",
    createProjectFailed: "Failed to create project",
    createOrgFailed: "Failed to create organization",
    acceptInviteFailed: "Failed to accept invite",
    saveStepsFailed: "Failed to update steps",
    saveFlowFailed: "Failed to update flow",
    saveTargetingFailed: "Failed to update targeting",
    saveFrequencyFailed: "Failed to update frequency",
    saveLaunchFailed: "Failed to update launch settings",
    deleteFlowFailed: "Failed to delete flow",
    publishFlowFailed: "Failed to publish flow",
    enableFlowFailed: "Failed to enable flow",
    disableFlowFailed: "Failed to disable flow",
    savePreviewUrlFailed: "Failed to save preview URL",
    saveProjectFailed: "Failed to update project",
    deleteProjectFailed: "Failed to delete project",
    createFlowFailed: "Failed to create flow",
    deleteOrgFailed: "Failed to delete organization",
    removeMemberFailed: "Failed to remove member",
  },
  targeting: {
    targeting: "Targeting",
    description:
      "Filter the users that should see this flow. Make sure the selected user properties are sent in your implementation.",
    localState: "Local flow targeting settings need to be changed in your codebase",
    addGroup: "Add filter group",
    addMatcher: "Add filter",
    group: "All users",
    value: "Value",
    or: "or",
    operator: {
      eq: "Equals",
      ne: "Does not equal",
      gt: "Greater than",
      gte: "Greater than or equal to",
      lt: "Less than",
      lte: "Less than or equal to",
      contains: "Contains",
      notContains: "Does not contain",
      regex: "Regular expression",
    },
    operatorExplanation: {
      eq: "is",
      ne: "is not",
      gt: "is greater than",
      gte: "is greater than or equal to",
      lt: "is less than",
      lte: "is less than or equal to",
      contains: "contains",
      notContains: "does not contain",
      regex: "matches a regular expression",
    },
  },
  frequency: {
    frequency: "Frequency",
    description: "How often should the flow be shown to your users.",
    localState: "Local flow frequency settings need to be changed in your codebase",
    once: "One time",
    "every-time": "Every time",
  },
  analytics: {
    starts: "Starts",
    finishes: "Finishes",
    finishRate: "Finish rate",
    exits: "Exits",
    users: "Unique users",
    values: {
      starts: "start",
      starts_plural: "starts",
      finishes: "finish",
      finishes_plural: "finishes",
      exits: "exit",
      exits_plural: "exits",
      users: "user",
      users_plural: "users",
    },
  },
  project: {
    domains: {
      domains: "Domains",
      description:
        "Add the domains where you want to access flows from this project. For local development, add localhost with port.",
      localState: "Local project domains need to be changed in your codebase",
      addDomain: "Add domain",
      domainPlaceholder: "example.com",
    },
    deleteDialog: {
      title: "Delete project",
      description:
        "Are you sure you want to delete this project? All flows and analytics data will be deleted as well.",
      confirm: "Delete project",
    },
  },
  organization: {
    members: {
      title: "Your team",
      description: "There is currently {{count}} member in your organization.",
      description_plural: "There are currently {{count}} members in your organization.",
      addDialog: {
        button: "Invite team member",
        title: "Invite team member",
        description:
          "Enter the email address of the person you want to invite to your organization. All team members have the same permissions (for now).",
        confirm: "Send invite",
      },
    },
    deleteDialog: {
      title: "Delete organization",
      description:
        "Are you sure you want to delete this organization? All projects and flows will be deleted as well.",
      confirm: "Delete organization",
    },
  },
};
