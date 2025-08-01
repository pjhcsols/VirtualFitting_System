#!/usr/bin/env bash
set -euo pipefail

# ───────────────────────────────────────────
# 설정: 환경변수 없이 여기에 바로 입력하세요

# ───────────────────────────────────────────

echo "[`date +'%Y-%m-%d %H:%M:%S'`] Disabling PF..."
sudo pfctl -d

echo "[`date +'%Y-%m-%d %H:%M:%S'`] Renewing certificate (TLS‑ALPN‑01)…"
sudo certbot renew \
  --preferred-challenges tls-alpn-01 \
  --config-dir    "/etc/letsencrypt" \
  --work-dir      "/var/lib/letsencrypt" \
  --logs-dir      "/var/log/letsencrypt" \
  --pre-hook  "echo '[`date +'%Y-%m-%d %H:%M:%S'`] pre-hook: PF disabled'" \
  --post-hook "echo '[`date +'%Y-%m-%d %H:%M:%S'`] post-hook: reload PF'; sudo pfctl -f /etc/pf.conf; sudo pfctl -e" \
  --deploy-hook "echo '[`date +'%Y-%m-%d %H:%M:%S'`] deploy-hook: create PKCS12'; \
    sudo openssl pkcs12 -export \
      -in \"${LE_DIR}/fullchain.pem\" \
      -inkey \"${LE_DIR}/privkey.pem\" \
      -out \"${KEYSTORE_PATH}\" \
      -name basilium_springboot_b1 \
      -passout pass:${PASS} && \
    sudo chmod 600 \"${KEYSTORE_PATH}\"" \
  --email "${EMAIL}" --agree-tos --non-interactive --quiet

echo "[`date +'%Y-%m-%d %H:%M:%S'`] Renewal complete. Keystore at ${KEYSTORE_PATH}"
echo "→ 필요 시 Spring Boot 재시작만 해주세요."
