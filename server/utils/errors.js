const { GraphQLError } = require('graphql');

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  InvalidDataError: (type, name) => new GraphQLError(`Could not find data of name "${name}" in type "${type}".`,{
    extensions: {
      code: 'INVALIDDATA'
    }
  })
}