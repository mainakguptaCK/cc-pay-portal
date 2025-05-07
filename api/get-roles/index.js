module.exports = async function (context, req) {
    const encoded = req.headers["x-ms-client-principal"];
  
    if (!encoded) {
      context.res = {
        status: 401,
        body: "Unauthorized"
      };
      return;
    }
  
    const decoded = Buffer.from(encoded, "base64").toString("ascii");
    const user = JSON.parse(decoded);
  
    // Default role
    const roles = ["authenticated"];
  
    // Example: assign 'admin' role to a specific email
    if (user.userDetails === "admin@example.com") {
      roles.push("admin");
    }
  
    context.res = {
      body: { roles }
    };
  };
  