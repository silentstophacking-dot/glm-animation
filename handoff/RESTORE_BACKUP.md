# Restore the complete Git backup

The separately downloadable `glm-animation-complete-backup.bundle` is a Git bundle, not a ZIP. The iPhone owner can save it in Files and attach it to a new Codex conversation if GitHub access is unavailable. The coding agent restores it; the owner does not need to extract it.

The bundle is created with `git bundle create ... --all` after the handover is committed. It preserves all local and fetched remote refs in the source repository, including older sibling branches, plus tracked code, skills, docs, review media and reference samples. It does not include ignored node_modules, the old execution workspace, full original uploaded videos, secrets or ChatGPT history. Original long-form source/history is preserved; expired external render artifacts cannot be recovered from a Git bundle.

For a full-ref restoration, the agent can run:

```bash
git bundle verify /path/to/glm-animation-complete-backup.bundle
git clone --mirror /path/to/glm-animation-complete-backup.bundle /workspace/glm-animation-backup.git
git --git-dir=/workspace/glm-animation-backup.git worktree add /workspace/glm-animation feature/project-handoff
```

The mirror keeps remote-only historical refs as well as local branches. Read `/workspace/glm-animation/CONTINUE_HERE.md`. Once the new session has authorized GitHub access, point origin at the original repository before pushing:

```bash
git -C /workspace/glm-animation remote set-url origin https://github.com/silentstophacking-dot/glm-animation.git
```

Install dependencies afresh. Do not infer that restoring a Git backup transferred a subscription, account connection, token, API credit or billing relationship.
