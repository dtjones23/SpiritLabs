const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const secret = "shhhhhhspiritsecret";
const expiration = "2h";

module.exports = {
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),
  authMiddleware({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      console.error(err);
      console.log("Invalid token");
    }

    return req;
  },
  signToken: function ({ userName, email, _id }) {
    const payload = { userName, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
