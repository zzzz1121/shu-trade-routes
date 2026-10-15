#!/bin/sh
set -eu
if command -v node >/dev/null 2>&1; then exec node scripts/serve.js; fi
BUNDLED_NODE="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
if [ -x "$BUNDLED_NODE" ]; then exec "$BUNDLED_NODE" scripts/serve.js; fi
echo '请安装 Node.js 18 或更高版本后重试。' >&2
exit 1
