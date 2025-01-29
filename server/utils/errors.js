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
  IncompleteDataError: (type) => new GraphQLError(`Insufficient data to find of create object of type "${type}".`,{
    extensions: {
      code: 'INCOMPLETEDATA'
    }
  })
}