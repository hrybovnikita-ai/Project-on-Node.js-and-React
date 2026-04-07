import http from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getDatabaseInfo, initDatabase } from "./database.js";
import { authenticateUser, validateLoginPayload } from "./login.js";
import { countProjects, listProjects } from "./repositories/projectRepository.js";
import { countUsers, listUsers } from "./repositories/userRepository.js";

const PORT = process.env.PORT || 3001;
const currentDir = dirname(fileURLToPath(import.meta.url));
const publicDir = join(currentDir, "public");

initDatabase();

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, body, contentType) {
  response.writeHead(statusCode, {
    "Content-Type": contentType,
  });
  response.end(body);
}

async function sendStaticFile(response, fileName, contentType) {
  try {
    const filePath = join(publicDir, fileName);
    const fileContents = await readFile(filePath, "utf8");
    sendText(response, 200, fileContents, contentType);
  } catch {
    sendJson(response, 404, {
      message: "Static file not found.",
    });
  }
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1e6) {
        reject(new Error("Request body is too large."));
        request.destroy();
      }
    });

    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON payload."));
      }
    });

    request.on("error", reject);
  });
}

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  if (method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (method === "GET" && url === "/") {
    await sendStaticFile(response, "index.html", "text/html; charset=utf-8");
    return;
  }

  if (method === "GET" && url === "/styles.css") {
    await sendStaticFile(response, "styles.css", "text/css; charset=utf-8");
    return;
  }

  if (method === "GET" && url === "/api/status") {
    const databaseInfo = getDatabaseInfo();

    sendJson(response, 200, {
      message: "Backend server is running",
      timestamp: new Date().toISOString(),
      database: {
        type: databaseInfo.client,
        users: countUsers(),
        projects: countProjects(),
      },
    });
    return;
  }

  if (method === "GET" && url === "/api/users") {
    sendJson(response, 200, {
      users: listUsers(),
    });
    return;
  }

  if (method === "GET" && url === "/api/projects") {
    sendJson(response, 200, {
      projects: listProjects(),
    });
    return;
  }

  if (method === "POST" && url === "/api/login") {
    try {
      const payload = await readJsonBody(request);
      const validation = validateLoginPayload(payload);

      if (!validation.ok) {
        sendJson(response, validation.status, {
          message: validation.message,
        });
        return;
      }

      const result = authenticateUser(validation.credentials);
      sendJson(response, result.status, {
        message: result.message,
        user: result.user || null,
      });
    } catch (error) {
      sendJson(response, 400, {
        message: error.message || "Unable to process request.",
      });
    }

    return;
  }

  sendJson(response, 404, {
    message: "Route not found.",
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
