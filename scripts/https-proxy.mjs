/**
 * Local HTTPS front end for `next start`, so a phone on the same network can
 * reach the app in a secure context. Service workers, install prompts and web
 * push are unavailable over plain HTTP on a LAN IP, and `next start` has no
 * HTTPS flags of its own.
 *
 *   yarn build && yarn start           # Next on TARGET_PORT
 *   node scripts/https-proxy.mjs       # this, in a second terminal
 *
 * The plain-HTTP listener exists only to hand the mkcert root CA to the phone;
 * everything else it receives is redirected to HTTPS.
 */
import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const TARGET_PORT = Number(process.env.TARGET_PORT ?? 3000);
const HTTPS_PORT = Number(process.env.HTTPS_PORT ?? 3443);
const CA_PORT = Number(process.env.CA_PORT ?? 3080);
const CERT_DIR = process.env.CERT_DIR ?? "certificates";

const options = {
  key: fs.readFileSync(path.join(CERT_DIR, "local-net-key.pem")),
  cert: fs.readFileSync(path.join(CERT_DIR, "local-net.pem")),
};

function lanAddress() {
  const nets = Object.values(os.networkInterfaces()).flat();
  const hit = nets.find((n) => n && n.family === "IPv4" && !n.internal);
  return hit?.address ?? "localhost";
}

const host = lanAddress();

const proxy = https.createServer(options, (req, res) => {
  const headers = {
    ...req.headers,
    "x-forwarded-proto": "https",
    "x-forwarded-host": req.headers.host ?? `${host}:${HTTPS_PORT}`,
    "x-forwarded-for": req.socket.remoteAddress ?? "",
  };

  const upstream = http.request(
    {
      host: "127.0.0.1",
      port: TARGET_PORT,
      method: req.method,
      path: req.url,
      headers,
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode ?? 502, upstreamRes.headers);
      upstreamRes.pipe(res);
    },
  );

  upstream.on("error", (error) => {
    res.writeHead(502, { "content-type": "text/plain" });
    res.end(
      `Upstream not reachable on :${TARGET_PORT} — is \`yarn start\` running?\n${error.message}`,
    );
  });

  req.pipe(upstream);
});

proxy.on("upgrade", (_req, socket) => socket.destroy());

proxy.listen(HTTPS_PORT, "0.0.0.0", () => {
  console.log(
    `HTTPS   https://${host}:${HTTPS_PORT}  ->  http://127.0.0.1:${TARGET_PORT}`,
  );
});

// Serves the mkcert root CA so the phone can trust the certificate above.
const caRoot = execFileSync("mkcert", ["-CAROOT"], { encoding: "utf8" }).trim();
const caFile = path.join(caRoot, "rootCA.pem");

http
  .createServer((req, res) => {
    if (req.url === "/rootCA.pem") {
      res.writeHead(200, {
        "content-type": "application/x-x509-ca-cert",
        "content-disposition": 'attachment; filename="rootCA.pem"',
      });
      fs.createReadStream(caFile).pipe(res);
      return;
    }

    res.writeHead(302, { location: `https://${host}:${HTTPS_PORT}${req.url}` });
    res.end();
  })
  .listen(CA_PORT, "0.0.0.0", () => {
    console.log(
      `CA      http://${host}:${CA_PORT}/rootCA.pem  (install this on the phone first)`,
    );
  });
