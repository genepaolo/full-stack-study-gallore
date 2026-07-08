// Cross-platform: free the dev ports by killing whatever is listening on them.
// Only touches processes bound to the given ports (default 5173 + 5000) — never a blanket
// "kill all node", so it won't disturb your editor's language servers.
//
// Usage: node scripts/kill-dev.mjs [port ...]
import { execSync } from 'node:child_process'

const ports = process.argv.slice(2).map(Number).filter(Boolean)
if (ports.length === 0) ports.push(5173, 5000)

const isWin = process.platform === 'win32'

function pidsOnPort(port) {
  const pids = new Set()
  try {
    if (isWin) {
      // NOTE: plain `netstat -ano` (no `-p tcp`) so IPv6 listeners like [::1]:5173 are included —
      // Vite binds IPv6 loopback by default, and `-p tcp` would hide it.
      const out = execSync('netstat -ano', { encoding: 'utf8' })
      for (const line of out.split('\n')) {
        const t = line.trim().split(/\s+/)
        // TCP  <local>  <foreign>  <state>  <pid>   (works for IPv4 and [::1] IPv6 rows)
        if (t[0] === 'TCP' && t[1]?.endsWith(`:${port}`) && /LISTENING/i.test(t[3] || '')) {
          if (t[4] && t[4] !== '0') pids.add(t[4])
        }
      }
    } else {
      const out = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN 2>/dev/null || true`, { encoding: 'utf8' })
      for (const pid of out.split('\n')) if (pid.trim()) pids.add(pid.trim())
    }
  } catch {
    /* nothing listening — fine */
  }
  return [...pids]
}

function kill(pid) {
  try {
    if (isWin) execSync(`taskkill /PID ${pid} /F /T`, { stdio: 'ignore' })
    else execSync(`kill -9 ${pid}`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

let killed = 0
for (const port of ports) {
  for (const pid of pidsOnPort(port)) {
    if (kill(pid)) {
      killed++
      console.log(`  freed port ${port} (pid ${pid})`)
    }
  }
}
console.log(killed ? `✔ cleared ${killed} stale dev process(es).` : '✔ dev ports already free.')
