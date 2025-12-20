#!/usr/bin/env python3
"""
Blog generation pipeline (Python)

Replicates scripts/blog-automation/generate-blog.js logic using Python and
Codex CLI. Generates a new English post with minimal YAML frontmatter,
translates to all locales from next.config.mjs, writes post files to
src/translations/<locale>/_posts/post<N>.md, and creates shared per-post
metadata in src/blog-meta/post<N>.json (date, author, authorBioKey, etc.).

Usage (arguments override env):
  python scripts/blog-automation/generate_blog.py \\
    [--engine codex|gemini] [--dry-run] [--no-stream] [--codex-cmd codex] [--gemini-cmd gemini] [--temperature 0.7] [--author-bio "..."]

Env vars (optional fallbacks):
- DRY_RUN=1                  Do not write files (log only)
- AI_ENGINE=codex|gemini      Select which CLI to use (default: codex)
- CODEX_CMD=codex            Codex CLI executable name/path (optional)
- GEMINI_CMD=gemini          Gemini CLI executable name/path (optional)
- GEMINI_MODEL=...           Optional Gemini model id (e.g. gemini-2.5-flash)
- TEMPERATURE=0.7            Optional temperature hint to include in prompt
- CODEX_STREAM=1             Stream model output (0 to disable)
- GEMINI_STREAM=1            Stream model output (0 to disable)
- TITLE_WEB_SEARCH_PROBABILITY=0.5  Chance to enable web search when proposing the title

Run (PowerShell):
  python scripts/blog-automation/generate_blog.py --dry-run
  python scripts/blog-automation/generate_blog.py --no-stream
"""

import os
import re
import io
import json  # used for reading recent post metadata
import sys
from datetime import datetime
import subprocess
import threading
import time
from pathlib import Path
import argparse
import random
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

# Title generation in regrad to selected persona.

ROOT = Path.cwd()
TRANSLATIONS_DIR = ROOT / 'src' / 'translations'
BLOG_META_DIR = ROOT / 'src' / 'blog-meta'
RESOURCES_DIR = Path(__file__).resolve().parent / 'resources'
# Persist per-post generation settings here
GEN_SETTINGS_PATH = RESOURCES_DIR / 'generation-settings.json'
WEB_RESEARCH_PROMPT_PATH = RESOURCES_DIR / 'web-research-addition.txt'
DEFAULT_WEB_RESEARCH_PROMPT = 'TODO Web Addition'

# Default/fallback author fields; will be overridden by persona selection
DEFAULT_AUTHOR_BIO = "I'm developing the best money management app."

# Persona resources directory
PERSONAS_DIR = RESOURCES_DIR / 'personas'

# Supported personas (name shown on blog, image path used in author box, key used for translations)
PERSONAS: list[dict] = [
    {
        'key': 'lina',
        'name': 'Lina',
        'image': '/assets/lina.webp',
        'prompt_file': PERSONAS_DIR / 'lina' / 'standard-prompt.txt',
    },
    {
        'key': 'maya_and_tom',
        'name': 'Maya & Tom',
        'image': '/assets/maya_and_tom.webp',
        'prompt_file': PERSONAS_DIR / 'maya_and_tom' / 'standard-prompt.txt',
    },
    {
        'key': 'jules',
        'name': 'Jules',
        'image': '/assets/jules.webp',
        'prompt_file': PERSONAS_DIR / 'jules' / 'standard-prompt.txt',
    },
    {
        'key': 'elena',
        'name': 'Elena',
        'image': '/assets/elena.webp',
        'prompt_file': PERSONAS_DIR / 'elena' / 'standard-prompt.txt',
    },
    {
        'key': 'marco',
        'name': 'Marco',
        'image': '/assets/marco.webp',
        'prompt_file': PERSONAS_DIR / 'marco' / 'standard-prompt.txt',
    },
    {
        'key': 'nadia',
        'name': 'Nadia',
        'image': '/assets/nadia.webp',
        'prompt_file': PERSONAS_DIR / 'nadia' / 'standard-prompt.txt',
    },
    {
        'key': 'rafael',
        'name': 'Rafael',
        'image': '/assets/rafael.webp',
        'prompt_file': PERSONAS_DIR / 'rafael' / 'standard-prompt.txt',
    },
    {
        'key': 'ashia',
        'name': 'Aisha',
        'image': '/assets/ashia.webp',
        'prompt_file': PERSONAS_DIR / 'ashia' / 'standard-prompt.txt',
    },
    {
        'key': 'bao',
        'name': 'Bao',
        'image': '/assets/bao.webp',
        'prompt_file': PERSONAS_DIR / 'bao' / 'standard-prompt.txt',
    },
    {
        'key': 'zoe',
        'name': 'Zoe',
        'image': '/assets/zoe.webp',
        'prompt_file': PERSONAS_DIR / 'zoe' / 'standard-prompt.txt',
    },
]

# Centralize model configuration knobs so they can be reused and tracked.
# Easily expand by adding more variables here and recording them below.
MODEL_REASONING_EFFORT = os.getenv('MODEL_REASONING_EFFORT', 'low')
# Allowed reasoning effort levels for per-call overrides
REASONING_EFFORT_CHOICES = ['high', 'low', 'medium', 'xhigh'] # 'minimal', , 

# Available Codex execution models. Expand as new variants become available.
EFFECTIVE_MODEL_CHOICES: tuple[str, ...] = ('gpt-5.2', 'gpt-5.2') # -codex
URL_SANITIZE_PATTERN = re.compile(r'https?://[^\s)>\]]+')
AI_ENGINE_CHOICES: tuple[str, ...] = ('codex', 'gemini')


def get_ai_engine() -> str:
    raw = (os.getenv('AI_ENGINE') or 'codex').strip().lower()
    return raw if raw in AI_ENGINE_CHOICES else 'codex'


def _load_web_research_probability(default: float = 0.5, env_var: str = 'WEB_RESEARCH_PROBABILITY') -> float:
    """Parse a probability env var and clamp into [0.0, 1.0]."""
    raw = os.getenv(env_var)
    if raw is None:
        return default
    try:
        value = float(raw)
    except ValueError:
        return default
    if value <= 0.0:
        return 0.0
    if value >= 1.0:
        return 1.0
    return value


WEB_RESEARCH_PROBABILITY = _load_web_research_probability()
TITLE_WEB_SEARCH_PROBABILITY = _load_web_research_probability(env_var='TITLE_WEB_SEARCH_PROBABILITY')

def _select_effective_model() -> str:
    """Choose which Codex model to run for this execution."""
    override = os.getenv('CODEX_MODEL', '').strip()
    if override:
        return override
    return random.choice(EFFECTIVE_MODEL_CHOICES)

SELECTED_EFFECTIVE_MODEL = _select_effective_model()


def _ensure_utf8_stdio():
    """Force UTF-8 capable stdout/stderr to avoid Windows charmap errors."""
    try:
        # Python 3.7+
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        if hasattr(sys.stderr, 'reconfigure'):
            sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        try:
            sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
            sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
        except Exception:
            pass


_ensure_utf8_stdio()


def log(step: str, msg: str) -> None:
    sys.stdout.write(f"[{step}] {msg}\n")
    sys.stdout.flush()


def fail(e: BaseException) -> None:
    sys.stderr.write(f"Error: {getattr(e, 'message', None) or str(e)}\n")
    sys.stderr.flush()


def read_text_safe(p: Path) -> str:
    try:
        return p.read_text(encoding='utf-8')
    except Exception:
        return ''


def load_web_research_prompt() -> str:
    """Return optional web research instructions appended to persona prompt."""
    text = read_text_safe(WEB_RESEARCH_PROMPT_PATH).strip()
    return text or DEFAULT_WEB_RESEARCH_PROMPT


def _strip_utm_source_openai(url: str) -> str:
    """Remove utm_source=openai query parameter from a URL."""
    try:
        parts = urlsplit(url)
    except Exception:
        return url
    original_query = parts.query
    if not original_query:
        return url
    query_pairs = parse_qsl(original_query, keep_blank_values=True)
    filtered_pairs = [
        (k, v)
        for k, v in query_pairs
        if not (k.lower() == 'utm_source' and v.lower() == 'openai')
    ]
    if len(filtered_pairs) == len(query_pairs):
        return url
    new_query = urlencode(filtered_pairs, doseq=True)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, new_query, parts.fragment))


def sanitize_web_research_notes(notes: str) -> str:
    """Strip Codex-added tracking params from research output before reuse."""
    if not notes:
        return notes

    def _replace(match: re.Match) -> str:
        url = match.group(0)
        cleaned = _strip_utm_source_openai(url)
        return cleaned

    return URL_SANITIZE_PATTERN.sub(_replace, notes)


def ensure_dir(p: Path) -> None:
    p.mkdir(parents=True, exist_ok=True)


def write_text_safe(p: Path, content: str) -> None:
    ensure_dir(p.parent)
    p.write_text(content, encoding='utf-8')


def write_json_safe(p: Path, obj: dict) -> None:
    ensure_dir(p.parent)
    p.write_text(
        json.dumps(obj, ensure_ascii=False, indent=2, sort_keys=False) + "\n",
        encoding='utf-8'
    )


def read_json_safe(p: Path) -> dict:
    """Read a JSON file, returning {} if missing or malformed."""
    try:
        if not p.exists():
            return {}
        return json.loads(p.read_text(encoding='utf-8'))
    except Exception:
        return {}


def update_generation_settings(post_id: str, settings: dict, store_path: Path = GEN_SETTINGS_PATH) -> None:
    """Persist settings used for a given post id into a simple JSON store.

    Store format:
    {
      "post12": { "input_prompt": "...", "model_reasoning_effort": "low" },
      ...
    }
    """
    data = read_json_safe(store_path)
    data[post_id] = {**data.get(post_id, {}), **settings}
    write_json_safe(store_path, data)


def parse_frontmatter(md: str):
    """Very small frontmatter parser for simple key: value pairs.
    Returns (data_dict, body_str).
    """
    lines = md.splitlines()
    if not lines:
        return {}, md
    if lines[0].strip() != '---':
        return {}, md
    # Find closing '---'
    close = None
    for i in range(1, len(lines)):
        if lines[i].strip() == '---':
            close = i
            break
    if close is None:
        return {}, md
    header_lines = lines[1:close]
    body = '\n'.join(lines[close + 1:])
    data = {}
    for ln in header_lines:
        if not ln.strip():
            continue
        if ':' not in ln:
            continue
        k, v = ln.split(':', 1)
        k = k.strip()
        v = v.strip()
        if ((v.startswith('"') and v.endswith('"')) or
                (v.startswith("'") and v.endswith("'"))):
            v = v[1:-1]
        data[k] = v
    return data, body


def render_frontmatter(data: dict, body: str, order: list[str]) -> str:
    """Render a simple YAML frontmatter (quoted values) followed by the body."""
    out = ['---']
    for k in order:
        if k in data and data[k] is not None and str(data[k]).strip() != '':
            v = str(data[k]).strip()
            vq = v.replace('"', '\\"')
            out.append(f'{k}: "{vq}"')
    out.append('---')
    header = '\n'.join(out)
    body = (body or '').lstrip('\n')
    return f"{header}\n{body}" if body else f"{header}\n"


def first_post_author_bio(locale: str) -> str | None:
    p = TRANSLATIONS_DIR / locale / '_posts' / 'post1.md'
    if not p.exists():
        return None
    data, _ = parse_frontmatter(read_text_safe(p))
    bio = (data or {}).get('authorBio')
    return bio.strip() if isinstance(bio, str) and bio.strip() else None


def canonical_author_bios(locales: list[str]) -> dict[str, str]:
    """Resolve a static author bio per locale.

    Logic:
    - Prefer the first post's authorBio in that locale.
    - Fallback to English authorBio if the locale-specific one is missing.
    - Fallback to the first available non-empty authorBio in any locale.
    - Finally, fallback to DEFAULT_AUTHOR_BIO.
    """
    result: dict[str, str] = {}

    # Determine global fallbacks once
    en_bio = first_post_author_bio('en')
    any_bio = None
    if not en_bio:
        for loc in locales:
            b = first_post_author_bio(loc)
            if b:
                any_bio = b
                break
    fallback_bio = en_bio or any_bio or DEFAULT_AUTHOR_BIO

    for loc in locales:
        loc_bio = first_post_author_bio(loc) or fallback_bio
        result[loc] = loc_bio
    return result


def load_frontmatters(locale: str = 'en'):
    dirp = TRANSLATIONS_DIR / locale / '_posts'
    if not dirp.exists():
        return []
    out = []
    for f in sorted(dirp.glob('*.md')):
        raw = read_text_safe(f)
        data, content = parse_frontmatter(raw)
        out.append({
            'file': f.name,
            'data': data,
            'content': content,
        })
    return out


def extract_english_titles():
    items = load_frontmatters('en')
    titles = []
    for it in items:
        t = it.get('data', {}).get('title')
        if t:
            titles.append(str(t).strip().strip('"').strip("'"))
    return titles


def next_english_post_index() -> int:
    dirp = TRANSLATIONS_DIR / 'en' / '_posts'
    if not dirp.exists():
        return 1
    maxn = 0
    for f in dirp.glob('post*.md'):
        m = re.match(r'^post(\d+)\.md$', f.name)
        if m:
            n = int(m.group(1))
            if n > maxn:
                maxn = n
    return maxn + 1


def get_locales_from_next_config() -> list:
    raw = read_text_safe(ROOT / 'next.config.mjs')
    m = re.search(r"locales\s*:\s*\[([^\]]+)\]", raw)
    if not m:
        return ['en']
    inside = m.group(1)
    parts = [p.strip().strip('"').strip("'") for p in inside.split(',')]
    parts = [p for p in parts if p]
    # unique order preserving
    seen = set()
    out = []
    for p in parts:
        if p not in seen:
            seen.add(p)
            out.append(p)
    return out or ['en']


def get_blog_enabled_locales() -> list:
    """Return locales where the blog is enabled as per siteConfig."""
    raw = read_text_safe(ROOT / 'src' / 'lib' / 'siteConfig.js')
    m = re.search(r"blog_enabled_locales\s*:\s*\[([^\]]+)\]", raw)
    if not m:
        return []
    inside = m.group(1)
    parts = [p.strip().strip('"').strip("'") for p in inside.split(',')]
    parts = [p for p in parts if p]
    seen = set()
    out = []
    for p in parts:
        if p not in seen:
            seen.add(p)
            out.append(p)
    return out


def today_iso() -> str:
    d = datetime.now()
    return f"{d.year:04d}-{d.month:02d}-{d.day:02d}"


def recent_post_indices(limit: int = 2) -> list[int]:
    """Return the highest post indices present in blog-meta, newest first."""
    if not BLOG_META_DIR.exists():
        return []
    items: list[tuple[int, Path]] = []
    for f in BLOG_META_DIR.glob('post*.json'):
        m = re.match(r'^post(\d+)\.json$', f.name)
        if not m:
            continue
        try:
            n = int(m.group(1))
            items.append((n, f))
        except Exception:
            continue
    items.sort(key=lambda t: t[0], reverse=True)
    return [n for n, _ in items[:max(0, limit)]]


def recent_authors(limit: int = 7) -> list[str]:
    """Read authors from the most recent post<N>.json files, newest first."""
    authors: list[str] = []
    if not BLOG_META_DIR.exists():
        return authors
    idxs = recent_post_indices(limit)
    for n in idxs:
        p = BLOG_META_DIR / f'post{n}.json'
        try:
            data = json.loads(read_text_safe(p)) if p.exists() else {}
            a = data.get('author')
            if isinstance(a, str) and a.strip():
                authors.append(a.strip())
        except Exception:
            # Ignore malformed JSON
            continue
    return authors


def _message_content_text(content) -> str:
    """Normalize message.content to a single string."""
    if content is None:
        return ''
    if isinstance(content, str):
        return content
    if isinstance(content, (list, tuple)):
        return '\n'.join([str(x) for x in content])
    return str(content)


def codex_cli_chat(messages: list, reasoning_effort: str | None = None, web_search_request: bool = False) -> str:
    """Calls local Codex CLI by piping a concatenated prompt to stdin.
    Follows the same message formatting used by the Node client.
    """
    cmd = os.getenv('CODEX_CMD', 'codex')
    # Build prompt: ROLE in upper-case, then content, separated by blanks
    text = '\n\n'.join([
        f"{m.get('role','user').upper()}:\n{_message_content_text(m.get('content',''))}"
        for m in messages
    ]) + '\n'

    def _run(args, shell=False):
        try:
            # Build codex exec command; pass prompt via stdin using '-' to avoid Windows arg length limits
            cmdline = []
            if isinstance(args, str) and not shell:
                cmdline = [args]
            else:
                cmdline = args if isinstance(args, list) else [args]

            # Assemble non-interactive options
            # --full-auto
            # --sandbox read-only --ask-for-approval never
            # Determine reasoning effort for this call
            effort = (reasoning_effort or MODEL_REASONING_EFFORT or 'low').strip().lower()
            exec_args = [
                cmdline[0], 'exec',
                '--config', f'model_reasoning_effort="{effort}"',
                '--full-auto', '--skip-git-repo-check', '--cd', str(ROOT)
            ]
            if web_search_request:
                exec_args += ['--enable', 'web_search_request']
            # Model flag if provided
            effective_model = SELECTED_EFFECTIVE_MODEL
            if effective_model:
                exec_args += ['-m', effective_model]

            # Use output-last-message to capture clean assistant output (avoid banners)
            import tempfile
            out_file = tempfile.NamedTemporaryFile(delete=False, suffix='.out')
            out_path = Path(out_file.name)
            out_file.close()
            exec_args += ['--output-last-message', str(out_path), '-' ]

            p = subprocess.Popen(
                exec_args,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                shell=shell,
                text=True,
                encoding='utf-8',
                errors='replace',
                bufsize=1,  # line-buffered
            )

            # Write prompt to stdin in a separate thread and close
            def _writer():
                try:
                    if p.stdin:
                        p.stdin.write(text)
                        p.stdin.flush()
                except Exception:
                    pass
                finally:
                    try:
                        if p.stdin:
                            p.stdin.close()
                    except Exception:
                        pass

            writer_t = threading.Thread(target=_writer, daemon=True)
            writer_t.start()

            stream_output = str(os.getenv('CODEX_STREAM', '1')).lower() in ('1', 'true', 'yes')
            out_parts: list[str] = []
            err_parts: list[str] = []

            def _reader(stream, parts, prefix=None):
                try:
                    while True:
                        chunk = stream.read(1)
                        if not chunk:
                            break
                        parts.append(chunk)
                        if stream_output and prefix is None:
                            # Print raw model output as it arrives
                            sys.stdout.write(chunk)
                            sys.stdout.flush()
                        elif stream_output and prefix is not None:
                            # Prefix stderr chunks
                            sys.stdout.write(chunk)
                            sys.stdout.flush()
                except Exception:
                    pass

            t_out = threading.Thread(target=_reader, args=(p.stdout, out_parts, None), daemon=True)
            t_err = threading.Thread(target=_reader, args=(p.stderr, err_parts, 'ERR'), daemon=True)
            t_out.start()
            t_err.start()

            # Wait for process to complete without enforcing a timeout
            p.wait()

            # Join reader threads
            try:
                t_out.join()
                t_err.join()
                writer_t.join()
            except Exception:
                pass

            out = ''.join(out_parts).strip()
            err = ''.join(err_parts).strip()

            # Prefer the clean final message if available
            try:
                if out_path.exists():
                    final_text = out_path.read_text(encoding='utf-8', errors='replace').strip()
                else:
                    final_text = ''
            except Exception:
                final_text = ''

            if p.returncode == 0:
                if final_text:
                    return final_text
                if out:
                    return out
                raise RuntimeError('Codex CLI returned empty output')
            raise RuntimeError(f'Codex CLI exited with code {p.returncode}: {err or out}')
        except FileNotFoundError as e:
            raise e

    # Try direct process first
    try:
        return _run(cmd)
    except FileNotFoundError:
        pass
    # Fallback to shell lookup (e.g., Windows PATH resolution)
    try:
        return _run(cmd, shell=True)
    except Exception as e:
        raise e


def gemini_cli_chat(messages: list, reasoning_effort: str | None = None, web_search_request: bool = False) -> str:
    """Calls local Gemini CLI in headless mode, passing the prompt via stdin.

    Uses the Gemini CLI headless interface:
    - Stdin input for long prompts (avoids Windows arg length limits)
    - JSON output for clean parsing (or stream-json when streaming is enabled)
    """
    _ = reasoning_effort  # Gemini CLI does not expose an exact equivalent knob
    cmd = os.getenv('GEMINI_CMD', 'gemini')
    model = os.getenv('GEMINI_MODEL', '').strip()

    stream_output = str(os.getenv('GEMINI_STREAM', os.getenv('CODEX_STREAM', '1'))).lower() in ('1', 'true', 'yes')
    output_format = 'stream-json' if stream_output else 'json'

    approval_mode = os.getenv('GEMINI_APPROVAL_MODE', '').strip()
    yolo = str(os.getenv('GEMINI_YOLO', '1')).lower() in ('1', 'true', 'yes')

    # Build prompt: ROLE in upper-case, then content, separated by blanks
    base_text = '\n\n'.join([
        f"{m.get('role','user').upper()}:\n{_message_content_text(m.get('content',''))}"
        for m in messages
    ]) + '\n'

    if web_search_request:
        tool_hint = (
            "You may use the `google_web_search(query=\"...\")` tool to fetch timely, credible information from the web.\n"
            "Use it when needed and prefer authoritative sources.\n"
        )
        text = f"SYSTEM:\n{tool_hint}\n\n{base_text}"
    else:
        text = base_text

    def _extract_json_object(raw: str) -> dict:
        raw = (raw or '').strip()
        if not raw:
            return {}
        try:
            return json.loads(raw)
        except Exception:
            # Try to salvage if the CLI printed extra lines around the JSON
            start = raw.find('{')
            end = raw.rfind('}')
            if start != -1 and end != -1 and end > start:
                try:
                    return json.loads(raw[start:end + 1])
                except Exception:
                    return {}
            return {}

    def _run(shell: bool = False) -> str:
        exec_args: list[str] = [cmd, '--output-format', output_format]
        if model:
            exec_args += ['-m', model]
        if approval_mode:
            exec_args += ['--approval-mode', approval_mode]
        elif yolo:
            exec_args += ['--yolo']

        p = subprocess.Popen(
            exec_args,
            cwd=str(ROOT),
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=shell,
            text=True,
            encoding='utf-8',
            errors='replace',
            bufsize=1,
        )

        # Write prompt to stdin and close
        def _writer():
            try:
                if p.stdin:
                    p.stdin.write(text)
                    p.stdin.flush()
            except Exception:
                pass
            finally:
                try:
                    if p.stdin:
                        p.stdin.close()
                except Exception:
                    pass

        writer_t = threading.Thread(target=_writer, daemon=True)
        writer_t.start()

        err_parts: list[str] = []

        def _stderr_reader():
            try:
                if not p.stderr:
                    return
                while True:
                    chunk = p.stderr.read(1)
                    if not chunk:
                        break
                    err_parts.append(chunk)
                    # Keep stderr visible when streaming
                    if stream_output:
                        sys.stdout.write(chunk)
                        sys.stdout.flush()
            except Exception:
                pass

        t_err = threading.Thread(target=_stderr_reader, daemon=True)
        t_err.start()

        if stream_output:
            # stream-json: parse JSONL and stream assistant deltas only
            assistant_chunks: list[str] = []
            full_assistant_message: str | None = None
            try:
                if p.stdout:
                    for line in p.stdout:
                        line = (line or '').strip()
                        if not line:
                            continue
                        try:
                            evt = json.loads(line)
                        except Exception:
                            continue
                        if not isinstance(evt, dict):
                            continue
                        if evt.get('type') == 'message' and evt.get('role') == 'assistant':
                            content = evt.get('content')
                            if isinstance(content, str) and content:
                                if evt.get('delta') is True:
                                    assistant_chunks.append(content)
                                    sys.stdout.write(content)
                                    sys.stdout.flush()
                                else:
                                    # Some versions may emit full assistant messages
                                    full_assistant_message = content
            except Exception:
                pass
            finally:
                p.wait()
                try:
                    t_err.join()
                    writer_t.join()
                except Exception:
                    pass

            err = ''.join(err_parts).strip()
            if p.returncode != 0:
                raise RuntimeError(f'Gemini CLI exited with code {p.returncode}: {err}')
            if full_assistant_message is not None:
                return full_assistant_message.strip()
            combined = ''.join(assistant_chunks).strip()
            if combined:
                return combined
            raise RuntimeError('Gemini CLI returned empty output')

        # Non-streaming JSON output
        out = ''
        try:
            if p.stdout:
                out = p.stdout.read()
        except Exception:
            out = ''
        p.wait()
        try:
            t_err.join()
            writer_t.join()
        except Exception:
            pass

        err = ''.join(err_parts).strip()
        if p.returncode != 0:
            payload = _extract_json_object(out) or _extract_json_object(err)
            if isinstance(payload, dict):
                perr = payload.get('error')
                if isinstance(perr, dict):
                    msg = perr.get('message')
                    if isinstance(msg, str) and msg.strip():
                        raise RuntimeError(msg.strip())
            raise RuntimeError(f'Gemini CLI exited with code {p.returncode}: {err or out}')

        payload = _extract_json_object(out)
        resp = payload.get('response')
        if isinstance(resp, str) and resp.strip():
            return resp.strip()
        # Fall back to raw stdout if JSON didn't parse as expected
        cleaned = (out or '').strip()
        if cleaned:
            return cleaned
        raise RuntimeError('Gemini CLI returned empty output')

    try:
        return _run(shell=False)
    except FileNotFoundError:
        pass
    return _run(shell=True)


def ai_cli_chat(messages: list, reasoning_effort: str | None = None, web_search_request: bool = False) -> str:
    """Dispatch to the selected CLI engine (Codex or Gemini)."""
    engine = get_ai_engine()
    if engine == 'gemini':
        return gemini_cli_chat(messages, reasoning_effort=reasoning_effort, web_search_request=web_search_request)
    return codex_cli_chat(messages, reasoning_effort=reasoning_effort, web_search_request=web_search_request)


def should_run_web_research() -> bool:
    return True
    """Randomly decide whether to trigger web research based on configured probability."""
    if WEB_RESEARCH_PROBABILITY <= 0.0:
        return False
    if WEB_RESEARCH_PROBABILITY >= 1.0:
        return True
    return random.random() < WEB_RESEARCH_PROBABILITY


def should_run_title_web_search() -> bool:
    return True
    """Randomly decide whether to allow web search during title generation."""
    if TITLE_WEB_SEARCH_PROBABILITY <= 0.0:
        return False
    if TITLE_WEB_SEARCH_PROBABILITY >= 1.0:
        return True
    return random.random() < TITLE_WEB_SEARCH_PROBABILITY


def perform_web_research(title: str, features_md: str, persona_name: str | None = None) -> str:
    """Collect supporting research via Codex CLI before drafting the English post."""
    sysmsg = [
        'You are a proactive research analyst with access to web browsing tools.',
        'Gather timely, credible insights to support a budgeting and personal finance blog post.'
    ]

    user_parts: list[str] = [
        '# Objective',
        f'- Conduct detailed, web-based research to gather recent, credible, and actionable resources and expert insights related to the blog topic, "{title}".',
        '# Instructions',
        'Research brief:',
        '- **Checklist:**',
        '1. Identify the blog topic and relevant keywords.',
        '2. Research and select at least 10 credible and authoritative sources (last 3 years).'
        '3. Emphasize actionable insights or clearly state their absence.'
        '4. Synthesize core trends and recommendations for the Expert Summary.',
        '- **Source Summaries:**',
        '- Provide structured, concise summaries',
        '- **Expert Focus:**',
        '- Write an expert summary (4–8 sentences) synthesizing the main trends and recommendations found across the sources.'
    ]

    user_parts += [
        '',
        'Return ONLY the bullet list.',
    ]
    return ai_cli_chat([
        { 'role': 'system', 'content': sysmsg },
        { 'role': 'user', 'content': '\n'.join(user_parts) },
    ], reasoning_effort='high', web_search_request=True)


def propose_title(features_md: str, existing_titles: list, temperature: float | None = None, persona_first_line: str | None = None, web_search: bool = False) -> str:
    # Incorporate the selected author's voice using the first line of their standard prompt
    persona_hint = (persona_first_line or '').strip()
    sysmsg_parts = [
        'You are a senior creative content strategist for a budgeting app.'
    ]
    if persona_hint:
        sysmsg_parts.append(persona_hint)
    sysmsg = '\n'.join(sysmsg_parts)

    user_parts = [
        'Existing English blog post titles (avoid duplicates and near-duplicates):',
        *[f'- {t}' for t in existing_titles],
        '',
        'Task:',
        '- Propose exactly ONE new English blog post title that is unique, relevant to Monee features, and/or appealing to our audience.',
        '- Try to answer specific user questions.', # Testing
        '- The title should address a relevant budgeting or personal finance topic without directly mentioning Monee.', # Testing
        '- Return only the title, with no quotes and no extra text.',
        '',
        'Audience:',
        '- Individuals and couples managing daily expenses.',
        '- Families coordinating household spending.',
        '- Roommates sharing costs.',
        '- Anyone who wants simple budget control without financial products.'
        '',
        'Features of Monee:', # Testing
        features_md or ''
    ]
    if web_search:
        user_parts += [
            '',
            'Search in Web for latest trend to find suitable topics.',
        ]
    user = '\n'.join(user_parts)
    # Include hints about model/temperature in the system preface if desired
    # Always use high reasoning for title generation
    out = ai_cli_chat([
        { 'role': 'system', 'content': sysmsg },
        { 'role': 'user', 'content': user },
    ], reasoning_effort='high', web_search_request=web_search)
    # Sanitize single-line title
    title = (out.split('\n')[0] or out).strip()
    if (title.startswith('"') and title.endswith('"')) or (title.startswith("'") and title.endswith("'")):
        title = title[1:-1].strip()
    return title


def write_english_post(features_md: str, standard_prompt: str, title: str, temperature: float | None = None, reasoning_effort: str | None = None, web_research: str | None = None) -> str:
    sysmsg = 'You are a senior content writer. Write helpful, clear, SEO-friendly posts.'
    user_parts = [
        standard_prompt or '',
        '',
        'Write a complete English blog post in Markdown with YAML frontmatter.',
        "Frontmatter MUST be the very first block, delimited by '---' lines.",
        'Frontmatter MUST include ONLY: title, excerpt, keywords.',
        'Constraints:',
        f'- Use this exact title: {title}',
        '- DO not introduce yourself. ', # Testing
        '- Do NOT write about how Monee works as a app. No examples like "How to add X in Monee"', #Testing
        '- Do NOT include date or author fields in frontmatter (handled separately)',
        '- excerpt: ~25-35 words summary',
        '- keywords: comma-separated relevant terms',
        '',
        'Features of Monee:',
        features_md or '',
        #'',
        #'Markdown body:',
        #'- Clear intro, 2-4 sections with descriptive headings, short paragraphs, and a practical takeaway.',
    ]
    if web_research:
        user_parts += [
            '',
            'SOURCES:',
            web_research,
        ]
    user_parts += [
        '',
        'Return ONLY the full Markdown document including frontmatter.',
    ]
    user = '\n'.join(user_parts)
    md = ai_cli_chat([
        { 'role': 'system', 'content': sysmsg },
        { 'role': 'user', 'content': user },
    ], reasoning_effort=reasoning_effort)

    # Validate frontmatter
    data, body = parse_frontmatter(md)
    required = ['title', 'excerpt', 'keywords']
    missing = [k for k in required if not data.get(k)]
    if not missing:
        # Keep only minimal frontmatter keys
        ordered = ['title', 'excerpt', 'keywords']
        return render_frontmatter(data, body, ordered).strip()

    log('FIX', f"English draft missing frontmatter keys: {', '.join(missing)}. Attempting repair...")

    sysfix = 'You are a meticulous Markdown formatter who fixes structure issues.'
    userfix = '\n'.join([
        'The following content is supposed to be a full blog post, but it is missing a proper YAML frontmatter block.',
        "Rewrite it into a valid Markdown document with YAML frontmatter at the very top, delimited by '---' lines.",
        'Requirements:',
        '- Include ONLY these frontmatter keys: title, excerpt, keywords',
        f'- Use this exact title: {title}',
        '- Write a ~25-35 word excerpt.',
        '- Provide comma-separated keywords.',
        '- Keep the original content intent and structure in the body.',
        '',
        'Return ONLY the corrected Markdown (frontmatter first).',
        '',
        '--- BEGIN ORIGINAL CONTENT ---',
        md,
        '--- END ORIGINAL CONTENT ---',
    ])
    fixed = ai_cli_chat([
        { 'role': 'system', 'content': sysfix },
        { 'role': 'user', 'content': userfix },
    ], reasoning_effort=reasoning_effort)
    rdata, rbody = parse_frontmatter(fixed or '')
    rmissing = [k for k in required if not rdata.get(k)]
    if rmissing:
        raise RuntimeError(f"Generated English post is missing frontmatter: {', '.join(rmissing)}")
    # Keep only minimal frontmatter keys after repair
    ordered = ['title', 'excerpt', 'keywords']
    return render_frontmatter(rdata, rbody, ordered).strip()


def translate_post(english_markdown: str, target_lang: str, reasoning_effort: str | None = None) -> str:
    sysmsg = 'You are a precise technical translator for Markdown content and YAML frontmatter.'
    user = '\n'.join([
        'Translate the following Markdown (including YAML frontmatter) into the target language.',
        'Rules:',
        f'- Target language code: {target_lang}',
        '- Preserve YAML frontmatter keys exactly.',
        '- Translate values for: title, excerpt, keywords, and all Markdown body content.',
        '- Do NOT add date or author fields to frontmatter.',
        '- Keep Markdown structure, headings, emphasis, links, and lists intact.',
        '',
        'Return ONLY the translated Markdown including the frontmatter.',
        '',
        '--- BEGIN ENGLISH MARKDOWN ---',
        english_markdown,
        '--- END ENGLISH MARKDOWN ---',
    ])
    md = ai_cli_chat([
        { 'role': 'system', 'content': sysmsg },
        { 'role': 'user', 'content': user },
    ], reasoning_effort=reasoning_effort)
    # Ensure only minimal frontmatter keys are present in final output
    data, body = parse_frontmatter(md)
    if not isinstance(data, dict):
        data = {}
    ordered = ['title', 'excerpt', 'keywords']
    # Drop any unexpected keys that model might have added
    data = {k: v for k, v in data.items() if k in set(ordered)}
    return render_frontmatter(data, body, ordered).strip()


def truthy_env(name: str) -> bool:
    v = os.getenv(name)
    if v is None:
        return False
    return str(v).strip().lower() not in ('', '0', 'false', 'none')


def random_word_count_range() -> tuple[int, int, str]:
    """Pick a reasonable word count range for a blog post.

    Returns (min_words, max_words, formatted_range) where formatted_range uses an en dash.
    Examples: (800, 1200, '800–1200')
    """
    # Choose a lower bound around typical blog lengths
    min_choices = [800, 900, 1000, 1300, 1600, 1900] # 700 Testing
    min_w = random.choice(min_choices)
    # Range width between 300 and 500 words
    width = random.choice([300, 350, 400, 450, 500])
    max_w = min_w + width
    # Use en dash (U+2013) to match existing templates
    range_str = f"{min_w}\u2013{max_w}"
    return min_w, max_w, range_str


def main() -> None:
    engine = get_ai_engine()
    log('INIT', f'Starting blog generation pipeline (Python, {engine} CLI)')

    # CLI args (override env when provided)
    parser = argparse.ArgumentParser(description='Generate and translate a blog post via Codex CLI or Gemini CLI')
    parser.add_argument('--engine', choices=list(AI_ENGINE_CHOICES), help='AI CLI backend to use (default from AI_ENGINE or "codex")')
    parser.add_argument('--dry-run', dest='dry_run', action='store_true', help='Do not write files (log only)')
    parser.add_argument('--no-dry-run', dest='dry_run', action='store_false', help='Write files (default unless DRY_RUN=1)')
    parser.set_defaults(dry_run=None)
    parser.add_argument('--codex-cmd', dest='codex_cmd', help='Codex CLI executable name/path (default from CODEX_CMD or "codex")')
    parser.add_argument('--gemini-cmd', dest='gemini_cmd', help='Gemini CLI executable name/path (default from GEMINI_CMD or "gemini")')
    parser.add_argument('--gemini-model', dest='gemini_model', help='Gemini model id (default from GEMINI_MODEL)')
    parser.add_argument('--temperature', type=float, dest='temperature', help='Sampling temperature (default from TEMPERATURE or 0.7)')
    parser.add_argument('--stream', dest='stream', action='store_true', help='Stream model output (default)')
    parser.add_argument('--no-stream', dest='stream', action='store_false', help='Do not stream model output')
    parser.set_defaults(stream=None)
    parser.add_argument('--author-bio', dest='author_bio', help='[Deprecated] No longer used in frontmatter (bio now via translations)')
    args = parser.parse_args()

    # Apply overrides into process env so existing helpers read them uniformly
    if args.engine:
        os.environ['AI_ENGINE'] = args.engine
    if args.dry_run is not None:
        os.environ['DRY_RUN'] = '1' if args.dry_run else ''
    if args.codex_cmd:
        os.environ['CODEX_CMD'] = args.codex_cmd
    if args.gemini_cmd:
        os.environ['GEMINI_CMD'] = args.gemini_cmd
    if args.gemini_model:
        os.environ['GEMINI_MODEL'] = args.gemini_model
    if args.temperature is not None:
        os.environ['TEMPERATURE'] = str(args.temperature)
    if args.stream is not None:
        stream_val = '1' if args.stream else '0'
        os.environ['CODEX_STREAM'] = stream_val
        os.environ['GEMINI_STREAM'] = stream_val
    dry_run = truthy_env('DRY_RUN')
    temperature = float(os.getenv('TEMPERATURE', '0.7'))
    title_web_search = should_run_title_web_search()
    engine = get_ai_engine()
    effective_model_label = SELECTED_EFFECTIVE_MODEL if engine == 'codex' else (os.getenv('GEMINI_MODEL', '').strip() or '(default)')
    if engine == 'gemini':
        log('MODEL', f"Using Gemini model: {effective_model_label}")
    else:
        log('MODEL', f"Using Codex model: {effective_model_label}")
    if title_web_search:
        log('TITLE', 'Web search enabled for title proposal')
    # CODEX_CMD and CODEX_STREAM are read by codex_cli_chat dynamically

    # Load resources
    features_md = read_text_safe(RESOURCES_DIR / 'money-features.md')

    # Pick a persona, avoiding authors used in the last two posts
    excluded_authors = recent_authors()
    candidates = [p for p in PERSONAS if p.get('name') not in set(excluded_authors)] or PERSONAS
    if excluded_authors:
        log('EXCLUDE', f"Recent authors skipped: {', '.join(excluded_authors)}")
    persona = random.choice(candidates)
    persona_prompt = read_text_safe(persona['prompt_file'])
    if not persona_prompt.strip():
        # Fallback to global standard prompt for robustness
        persona_prompt = read_text_safe(RESOURCES_DIR / 'standard-prompt.txt')
        log('PERSONA', f"{persona['name']} (fallback prompt)")
    else:
        log('PERSONA', f"{persona['name']}")

    # 1) Discover locales (limit translations to locales with blog support)
    all_locales = get_locales_from_next_config()
    blog_enabled = set(get_blog_enabled_locales())
    if not blog_enabled:
        blog_enabled = set(all_locales)

    locales = []
    for lang in all_locales:
        if lang == 'en' or lang in blog_enabled:
            locales.append(lang)

    skipped_locales = [lang for lang in all_locales if lang not in locales]
    if skipped_locales:
        log('LOCALES', f"Found locales: {', '.join(locales)} (blog disabled: {', '.join(skipped_locales)})")
    else:
        log('LOCALES', f"Found locales: {', '.join(locales)}")

    # 2) Existing EN titles
    existing_titles = extract_english_titles()
    log('TITLES', f"Found {len(existing_titles)} EN titles")

    # 3) Propose unique title
    # Include the selected author by passing the first line from their standard prompt
    try:
        persona_first_line = (persona_prompt.splitlines()[0] or '').strip()
    except Exception:
        persona_first_line = ''
    title = propose_title(features_md, existing_titles, temperature, persona_first_line, web_search=title_web_search)
    log('TITLE', f"Proposed: {title}")
    if not title.strip():
        raise RuntimeError(f'No title returned by {engine} CLI. Ensure the CLI is installed and on PATH, or set the appropriate *_CMD env var.')
    if title.lower() in [t.lower() for t in existing_titles]:
        raise RuntimeError('Model proposed an existing title. Retry for a unique one.')

    # Determine date and index
    date = today_iso()
    index = next_english_post_index()
    file_name = f'post{index}.md'
    log('INDEX', f"Will use index {index} -> {file_name}")

    # Author bios are no longer embedded in frontmatter; shared via translations/metadata

    # 4) Generate English post
    web_research_notes: str | None = None
    web_research_used = False
    if should_run_web_research():
        log('WEB', 'Triggering web research command...')
        try:
            candidate_notes = perform_web_research(title, features_md, persona.get('name') if persona else None)
            candidate_notes = (candidate_notes or '').strip()
            if candidate_notes:
                candidate_notes = sanitize_web_research_notes(candidate_notes)
                web_research_notes = candidate_notes
                web_research_used = True
                research_lines = web_research_notes.splitlines()
                if research_lines:
                    first_line = research_lines[0]
                    preview = first_line[:120] + ('...' if len(first_line) > 120 else '')
                    log('WEB', f'Captured research notes. Preview: {preview}')
                else:
                    log('WEB', 'Captured research notes.')
            else:
                log('WEB', 'Web research returned empty response; continuing without it.')
        except Exception as err:
            log('WEB', f'Web research failed ({err}); continuing without it.')
    else:
        log('WEB', 'Skipping web research (random choice).')

    # Pick reasoning effort for content generation/translation (random from allowed choices)
    text_reasoning_effort = random.choice(REASONING_EFFORT_CHOICES)
    title_reasoning_effort = 'high'
    # Compute a random target word count range and inject into the persona prompt
    wc_min, wc_max, wc_range_str = random_word_count_range()
    std_with_topic = (persona_prompt or '').replace('[TOPIC]', title)
    std_with_topic = std_with_topic.replace('[TARGET_WORD_RANGE]', wc_range_str)
    if web_research_used:
        web_prompt_addition = load_web_research_prompt()
        std_with_topic = f"{std_with_topic}\n\n{web_prompt_addition}"
    english_md = write_english_post(
        features_md,
        std_with_topic,
        title,
        temperature,
        reasoning_effort=text_reasoning_effort,
        web_research=web_research_notes if web_research_used else None,
    )
    if dry_run:
        log('DRY_RUN', '[EN] Would write file (skipped)')
    else:
        en_path = TRANSLATIONS_DIR / 'en' / '_posts' / file_name
        write_text_safe(en_path, english_md + '\n')
        log('WRITE', f"Wrote EN -> {en_path.relative_to(ROOT)}")

    # 4.5) Create shared per-post metadata JSON
    meta = {
        'date': date,
        'author': persona['name'],
        'authorImage': persona['image'],
        'authorBioKey': f"authors.{persona['key']}.bio",
    }
    meta_path = BLOG_META_DIR / f'post{index}.json'
    if dry_run:
        log('DRY_RUN', f"Would write META -> {meta_path.relative_to(ROOT)}: {meta}")
    else:
        write_json_safe(meta_path, meta)
        log('WRITE', f"Wrote META -> {meta_path.relative_to(ROOT)}")

    # 4.6) Record generation settings per post (easily extendable)
    post_id = f'post{index}'
    gen_settings = {
        'input_prompt': std_with_topic,
        # Track reasoning effort used for both phases
        'title_reasoning_effort': title_reasoning_effort,
        'title_web_search': title_web_search,
        'model_reasoning_effort': text_reasoning_effort,
        'engine': engine,
        'effective_model': effective_model_label,
        'target_word_range': wc_range_str,
        'web_research_used': web_research_used,
    }
    if web_research_used and web_research_notes:
        gen_settings['web_research_notes'] = web_research_notes[:600]
    if dry_run:
        log('DRY_RUN', f"Would update SETTINGS -> {GEN_SETTINGS_PATH.relative_to(ROOT)} for {post_id}")
    else:
        update_generation_settings(post_id, gen_settings)
        log('SETTINGS', f"Recorded settings for {post_id} -> {GEN_SETTINGS_PATH.relative_to(ROOT)}")

    # 5) Translate to other locales
    for lang in locales:
        if lang == 'en':
            continue
        log('TRANSLATE', f"-> {lang}")
        translated = translate_post(english_md, lang, reasoning_effort=text_reasoning_effort)
        if dry_run:
            log('DRY_RUN', f"[{lang}] Would write file (skipped)")
        else:
            p = TRANSLATIONS_DIR / lang / '_posts' / file_name
            write_text_safe(p, translated + '\n')
            log('WRITE', f"Wrote {lang} -> {p.relative_to(ROOT)}")

    log('DONE', 'Generation complete. Rebuild the site to render new posts.')


if __name__ == '__main__':
    _start_ts = time.perf_counter()
    _ok = True
    _exit_code = 0
    try:
        main()
    except SystemExit as e:
        # Allow argparse --help/-h and similar clean exits without logging an error.
        raise e
    except BaseException as e:
        fail(e)
        _ok = False
        _exit_code = 1
    finally:
        _elapsed = time.perf_counter() - _start_ts
        try:
            log('TIME', f'Total runtime: {_elapsed:.2f}s')
        except Exception:
            # As a last resort, print directly
            sys.stdout.write(f"[TIME] Total runtime: {_elapsed:.2f}s\n")
            sys.stdout.flush()
    sys.exit(0 if _ok else _exit_code)
