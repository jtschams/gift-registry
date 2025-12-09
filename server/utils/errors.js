const { GraphQLError } = require('graphql');

module.exports = {
  AuthenticationError: new GraphQLError('Authentication Error; Unable to authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  InvalidDataError: (type, name) => new GraphQLError(`${type[0].toUpperCase() + type.slice(1)} not Found; Unable to find "${name}" in type "${type}".`,{
    extensions: {
      code: 'INVALIDDATA'
    }
  }),
  InvalidActionError: (action, reason) => new GraphQLError(`Failed to ${action}; ${reason}`, {
    extensions: {
      code: 'INVALIDACTION'
    }
  }),
  IncompleteDataError: (type, data) => new GraphQLError(`Failed to create ${type}; Unable to create "${type}".  Missing data for "${data}".`,{
    extensions: {
      code: 'INCOMPLETEDATA'
    }
  })
}