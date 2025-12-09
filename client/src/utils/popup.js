export function getErrorMessage(errorMessage) {
  // Splits ApolloError messages
  let [title, message] = errorMessage.split('; ');

  // Handle Other Specific Errors
  if (!message) {
    message = title;
    title = "An Error Occurred"
    switch (message) {
      case "Failed to fetch":
        message = "There was an error contacting the server.";
        break;
    }
  }

  return [title, message];
}
