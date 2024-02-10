export type MockOrganizationsService = ReturnType<typeof getMockOrganizationsService>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- needed for the inferred type
export const getMockOrganizationsService = () => ({
  getOrganizations: jest.fn(),
  getOrganizationDetail: jest.fn(),
  createOrganization: jest.fn(),
  updateOrganization: jest.fn(),
  deleteOrganization: jest.fn(),
  inviteUser: jest.fn(),
  removeUser: jest.fn(),
  getOrganizationMembers: jest.fn(),
});
