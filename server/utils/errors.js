const { GraphQLError } = require('graphql');

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  InvalidDataError: (type, name) => new GraphQLError(`Could not find data for "${name}" in type "${type}".`,{
    extensions: {
      code: 'INVALIDDATA'
    }
  }),
  InvalidActionError: (action, reason) => new GraphQLError(`Action "${action}" could not be completed due to error: ${reason}`, {
    extensions: {
      code: 'INVALIDACTION'
    }
  }),
  IncompleteDataError: (type) => new GraphQLError(`Insufficient data to find or create object of type "${type}".`,{
    extensions: {
      code: 'INCOMPLETEDATA'
    }
  })
}