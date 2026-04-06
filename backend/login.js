import { createUser, findUserByEmail } from "./repositories/userRepository.js";

function getSafeUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

export function validateLoginPayload(payload) {
  const name = payload?.name?.trim();
  const email = payload?.email?.trim();
  const password = payload?.password?.trim();

  if (!name || !email || !password) {
    return {
      ok: false,
      status: 400,
      message: "Name, email, and password are required.",
    };
  }

  return {
    ok: true,
    credentials: {
      name,
      email,
      password,
    },
  };
}

export function authenticateUser(credentials) {
  const user = findUserByEmail(credentials.email);

  if (!user) {
    const createdUser = createUser({
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
    });

    return {
      ok: true,
      status: 201,
      message: "Account created successfully.",
      user: getSafeUser(createdUser),
    };
  }

  if (user.password !== credentials.password) {
    return {
      ok: false,
      status: 401,
      message: "Invalid email or password.",
    };
  }

  return {
    ok: true,
    status: 200,
    message: "Login successful.",
    user: getSafeUser(user),
  };
}
